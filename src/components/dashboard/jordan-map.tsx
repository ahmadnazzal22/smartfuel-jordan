"use client";
import { useState, useMemo, useRef, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { Truck, MapPin, Ship, Navigation, Activity, Thermometer } from "lucide-react";

/* ── GeoJSON data (amCharts worldLow.js, 21pt Polygon, WGS84) ── */
const jordanCoords: [number, number][] = [
  [39.1455, 32.1247], [38.9622, 31.9951], [36.9584, 31.4917],
  [37.9803, 30.5],    [37.6336, 30.3132], [37.4694, 29.9949],
  [36.7551, 29.8662], [36.4759, 29.4951], [36.0156, 29.1906],
  [34.9507, 29.3535], [34.9734, 29.555],  [35.174,  30.524],
  [35.4394, 31.1326], [35.4505, 31.4793], [35.5589, 31.7656],
  [35.5513, 32.3955], [35.7875, 32.735],  [36.3721, 32.387],
  [36.8182, 32.3173], [38.7735, 33.372],
];
const CEN_LON = 37.0481, CEN_LAT = 31.2813, S = 1.4;
const toW = (lon: number, lat: number) => ({
  x: (lon - CEN_LON) * S,
  z: (lat - CEN_LAT) * S,
});

/* ── Cities ── */
interface City {
  name: string; x: number; z: number;
  risk?: "critical" | "warning" | "stable";
  trucks?: number; fuel: number; population?: string; zone: string;
}
const cities: City[] = [
  { name:"Irbid",   ...toW(35.85,32.52), risk:"warning", trucks:8,  fuel:67, population:"1.9M", zone:"NORTH" },
  { name:"Jerash",  ...toW(35.90,32.27), risk:"stable",  trucks:3,  fuel:82, population:"237K", zone:"NORTH" },
  { name:"Ajloun",  ...toW(35.75,32.33), risk:"stable",  trucks:2,  fuel:79, population:"176K", zone:"NORTH" },
  { name:"Mafraq",  ...toW(36.25,32.35), risk:"warning", trucks:5,  fuel:58, population:"517K", zone:"EAST" },
  { name:"Zarqa",   ...toW(36.10,32.08), risk:"warning", trucks:12, fuel:61, population:"1.4M", zone:"CENTRAL" },
  { name:"Amman",   ...toW(35.93,31.95), risk:"stable",  trucks:24, fuel:84, population:"4.0M", zone:"CENTRAL" },
  { name:"Madaba",  ...toW(35.79,31.72), risk:"stable",  trucks:4,  fuel:76, population:"190K", zone:"CENTRAL" },
  { name:"Salt",    ...toW(35.73,32.04), risk:"stable",  trucks:3,  fuel:73, population:"491K", zone:"CENTRAL" },
  { name:"Karak",   ...toW(35.70,31.18), risk:"warning", trucks:6,  fuel:54, population:"316K", zone:"SOUTH" },
  { name:"Tafilah", ...toW(35.60,30.84), risk:"stable",  trucks:2,  fuel:71, population:"89K",  zone:"SOUTH" },
  { name:"Ma'an",   ...toW(35.73,30.19), risk:"stable",  trucks:4,  fuel:78, population:"144K", zone:"SOUTH" },
  { name:"Aqaba",   ...toW(35.01,29.53), risk:"stable",  trucks:10, fuel:92, population:"188K", zone:"PORT" },
];

const routes: [string, string, boolean][] = [
  ["Aqaba","Amman",true], ["Amman","Irbid",true], ["Amman","Zarqa",true],
  ["Zarqa","Mafraq",false], ["Amman","Karak",true], ["Aqaba","Ma'an",true],
  ["Amman","Salt",true], ["Amman","Madaba",true],
];
const getCity = (n: string) => cities.find(c => c.name === n);

/* ── 3D Scene ── */
function Scene({ hovered, setHovered }: {
  hovered: string | null;
  setHovered: (n: string | null) => void;
}) {
  const { camera } = useThree();

  /* Jordan outline shape */
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    jordanCoords.forEach(([lon, lat], i) => {
      const { x, z } = toW(lon, lat);
      i === 0 ? s.moveTo(x, z) : s.lineTo(x, z);
    });
    return s;
  }, []);

  return (
    <group>
      {/* Ambient */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} color="#10b981" />
      <directionalLight position={[-3, 5, -2]} intensity={0.4} color="#6ee7b7" />
      <pointLight position={[0, 3, 0]} intensity={0.3} color="#10b981" />


{/* Jordan extruded outline */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <extrudeGeometry args={[shape, { depth: 0.08, bevelEnabled: true, bevelSize: 0.01, bevelThickness: 0.01, bevelSegments: 2 }]} />
        <meshStandardMaterial
          color="#10b981"
          transparent
          opacity={0.08}
          emissive="#10b981"
          emissiveIntensity={0.05}
          roughness={0.6}
          metalness={0.3}
        />
      </mesh>

      {/* Jordan outline glow ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <shapeGeometry args={[shape]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.15} side={THREE.DoubleSide} wireframe={false} />
      </mesh>

      {/* Route lines */}
      {routes.map(([from, to, active]) => {
        const f = getCity(from), t = getCity(to);
        if (!f || !t) return null;
        const mid = [(f.x + t.x) / 2, 0.02, (f.z + t.z) / 2] as const;
        return (
          <group key={`r-${from}-${to}`}>
            <line>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  args={[new Float32Array([f.x, 0.01, f.z, t.x, 0.01, t.z]), 3]}
                />
              </bufferGeometry>
              <lineBasicMaterial color={active ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.03)"} />
            </line>
            {active && (
              <mesh position={mid}>
                <sphereGeometry args={[0.03, 8, 8]} />
                <meshBasicMaterial color="#10b981" transparent opacity={0.3} />
              </mesh>
            )}
          </group>
        );
      })}

      {/* City markers */}
      {cities.map((city) => {
        const isHovered = hovered === city.name;
        const clr = city.risk === "critical" ? "#ef4444" : city.risk === "warning" ? "#f59e0b" : "#10b981";
        return (
          <group key={city.name}>
            {/* Pulse ring */}
            <mesh position={[city.x, 0, city.z]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.08, 0.1, 24]} />
              <meshBasicMaterial color={clr} transparent opacity={0.4} />
            </mesh>
            {/* Glow */}
            <pointLight position={[city.x, 0.3, city.z]} intensity={0.2} color={clr} distance={0.8} />
            {/* Dot */}
            <mesh
              position={[city.x, 0.04, city.z]}
              onPointerOver={() => setHovered(city.name)}
              onPointerOut={() => setHovered(null)}
            >
              <sphereGeometry args={[isHovered ? 0.08 : 0.05, 16, 16]} />
              <meshStandardMaterial
                color={clr}
                emissive={clr}
                emissiveIntensity={isHovered ? 0.8 : 0.3}
                roughness={0.2}
                metalness={0.1}
              />
              {/* Hover ring */}
              {isHovered && (
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                  <ringGeometry args={[0.1, 0.14, 24]} />
                  <meshBasicMaterial color={clr} transparent opacity={0.3} />
                </mesh>
              )}
            </mesh>
            {/* Label */}
            <sprite position={[city.x, 0.2, city.z]} scale={[0.25, 0.06, 1]}>
              <spriteMaterial>
                <canvasTexture attach="map" image={createLabel(city.name, isHovered)} />
              </spriteMaterial>
            </sprite>

            {/* Tooltip */}
            {isHovered && (
              <Html position={[city.x, 0.3, city.z]} center distanceFactor={6}>
                <div className="bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/40 rounded-lg px-3 py-2 shadow-2xl whitespace-nowrap" style={{ pointerEvents: "none" }}>
                  <div className="flex items-center justify-between gap-3 mb-1.5">
                    <span className="text-[9px] font-bold text-zinc-200 uppercase tracking-wider">{city.name}</span>
                    <span className={`text-[7px] font-mono font-bold px-1 py-0.5 rounded ${city.risk === "critical" ? "bg-rose-500/20 text-rose-400" : city.risk === "warning" ? "bg-amber-500/15 text-amber-400" : "bg-emerald-500/15 text-emerald-400"}`}>{city.risk?.toUpperCase() || "STABLE"}</span>
                  </div>
                  <div className="space-y-0.5 text-[8px]">
                    <div className="flex items-center justify-between"><span className="text-zinc-500">Fuel</span><span className={`font-mono font-bold ${city.fuel < 60 ? "text-rose-400" : city.fuel < 75 ? "text-amber-400" : "text-emerald-400"}`}>{city.fuel}%</span></div>
                    <div className="flex items-center justify-between"><span className="text-zinc-500">Trucks</span><span className="font-mono text-zinc-300">{city.trucks}</span></div>
                    <div className="flex items-center justify-between"><span className="text-zinc-500">Zone</span><span className="font-mono text-zinc-400">{city.zone}</span></div>
                  </div>
                  <div className="mt-1.5 h-1 rounded-full bg-zinc-800 overflow-hidden" style={{ width: 80 }}>
                    <div className={`h-full rounded-full ${city.fuel < 60 ? "bg-rose-500" : city.fuel < 75 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${city.fuel}%` }} />
                  </div>
                </div>
              </Html>
            )}
          </group>
        );
      })}

      {/* Aqaba port beacon */}
      <group position={[toW(35.01, 29.53).x, 0.02, toW(35.01, 29.53).z]}>
        <mesh>
          <cylinderGeometry args={[0.01, 0.04, 0.2, 8]} />
          <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.5} />
        </mesh>
        <pointLight intensity={0.3} color="#10b981" distance={1.5} />
      </group>

      {/* Auto-rotate camera */}
      <CameraController />

      <OrbitControls
        enableZoom
        enablePan={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 2.2}
        autoRotate
        autoRotateSpeed={0.3}
      />
    </group>
  );
}

function CameraController() {
  const { camera } = useThree();
  useMemo(() => {
    camera.position.set(0, 2.5, 4.5);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  return null;
}

function createLabel(text: string, highlight: boolean): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = 256; c.height = 64;
  const ctx = c.getContext("2d")!;
  ctx.clearRect(0, 0, 256, 64);
  ctx.fillStyle = highlight ? "#e4e4e7" : "rgba(255,255,255,0.5)";
  ctx.font = "bold 26px monospace";
  ctx.textAlign = "center";
  ctx.fillText(text.toUpperCase(), 128, 42);
  return c;
}

/* ── Map Loading Skeleton ── */
function MapSkeleton() {
  return (
    <div className="flex items-center justify-center w-full h-full bg-zinc-900/50 rounded-2xl" style={{ aspectRatio: "16/10" }}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin" />
        <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">Loading 3D Map</span>
      </div>
    </div>
  );
}

/* ── Main Export ── */
export function JordanMap() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="relative w-full bg-gradient-to-b from-zinc-900/70 to-zinc-950/90 border border-zinc-700/40 rounded-2xl overflow-hidden touch-pan-y select-none" style={{ aspectRatio: "16/10" }}>
      {/* Terrain glow overlay */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none z-[1]"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 34% 35%, rgba(16,185,129,0.12) 0%, transparent 45%),
            radial-gradient(ellipse at 22% 89%, rgba(16,185,129,0.08) 0%, transparent 25%)
          `,
        }}
      />
      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/[0.04] pointer-events-none z-[1]" />

      {/* Three.js Canvas */}
      <Suspense fallback={<MapSkeleton />}>
        <Canvas
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        >
          <Scene hovered={hovered} setHovered={setHovered} />
        </Canvas>
      </Suspense>

      {/* Port badge */}
      <div className="absolute z-[3]" style={{ left: "17%", top: "83%" }}>
        <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/15 rounded-md px-1.5 py-0.5 shadow-lg backdrop-blur-sm">
          <Ship className="h-3 w-3 text-emerald-400" />
          <span className="text-[7px] text-emerald-400/80 font-mono font-bold tracking-wider">PORT AQABA</span>
          <span className="w-1 h-1 rounded-full bg-emerald-400 animate-live-pulse" />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-3 left-3 right-3 z-[5] flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3 bg-zinc-900/80 backdrop-blur-md border border-zinc-700/30 rounded-lg px-2.5 py-1.5 shadow-xl">
          <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /><span className="text-[7px] text-zinc-500 font-medium uppercase tracking-wider">Stable</span></div>
          <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" /><span className="text-[7px] text-zinc-500 font-medium uppercase tracking-wider">Watch</span></div>
          <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping-soft" /><span className="text-[7px] text-zinc-500 font-medium uppercase tracking-wider">Critical</span></div>
          <div className="w-px h-3 bg-zinc-700/30" />
          <div className="flex items-center gap-1"><Navigation className="h-2 w-2 text-emerald-400/60" /><span className="text-[7px] text-zinc-500 font-medium uppercase tracking-wider">Supply Route</span></div>
        </div>
        <div className="flex items-center gap-2 bg-zinc-900/80 backdrop-blur-md border border-zinc-700/30 rounded-lg px-2 py-1 shadow-xl">
          <MapPin className="h-2.5 w-2.5 text-zinc-600" />
          <span className="text-[7px] text-zinc-500 font-mono tracking-tight">31.24°N 36.51°E</span>
          <div className="w-px h-3 bg-zinc-700/30" />
          <Activity className="h-2.5 w-2.5 text-emerald-400/60" />
          <span className="text-[7px] text-emerald-400/60 font-mono font-bold">{cities.filter(c => c.risk === "stable").length}/{cities.length} ONLINE</span>
        </div>
      </div>

      {/* Top badges */}
      <div className="absolute top-3 left-3 z-[5] flex items-center gap-2 pointer-events-none">
        <div className="flex items-center gap-1.5 bg-zinc-900/80 backdrop-blur-md border border-zinc-700/30 rounded-md px-1.5 py-0.5 shadow-lg">
          <span className="w-1 h-1 rounded-full bg-emerald-400 animate-live-pulse" />
          <span className="text-[7px] text-zinc-400 font-medium uppercase tracking-wider">Satellite Link</span>
        </div>
        <div className="flex items-center gap-1.5 bg-zinc-900/80 backdrop-blur-md border border-zinc-700/30 rounded-md px-1.5 py-0.5 shadow-lg">
          <Thermometer className="h-2 w-2 text-emerald-400/60" />
          <span className="text-[7px] text-zinc-400 font-mono font-bold">12 Cities</span>
        </div>
      </div>

      {/* Network status */}
      <div className="absolute top-3 right-3 z-[5] bg-zinc-900/80 backdrop-blur-md border border-zinc-700/30 rounded-md px-2 py-1 shadow-lg pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="text-[6px] text-zinc-600 font-mono uppercase tracking-wider font-bold">Network</span>
          <span className="text-[7px] font-mono font-bold text-emerald-400">{Math.round(cities.reduce((a, c) => a + c.fuel, 0) / cities.length)}%</span>
        </div>
      </div>
    </div>
  );
}
