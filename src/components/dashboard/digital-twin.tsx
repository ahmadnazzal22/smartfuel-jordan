"use client";
import { useRef, useMemo, useState, Fragment } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Line } from "@react-three/drei";
import * as THREE from "three";

interface City3D {
  name: string;
  x: number;
  y: number;
  z: number;
  risk: "critical" | "warning" | "stable";
  fuel: number;
  trucks: number;
  population: string;
}

const cities3D: City3D[] = [
  { name: "Irbid", x: -0.6, y: 0.0, z: 2.8, risk: "warning", fuel: 67, trucks: 8, population: "1.9M" },
  { name: "Jerash", x: -0.3, y: 0.0, z: 2.0, risk: "stable", fuel: 82, trucks: 3, population: "237K" },
  { name: "Ajloun", x: -1.1, y: 0.0, z: 2.2, risk: "stable", fuel: 79, trucks: 2, population: "176K" },
  { name: "Mafraq", x: 1.5, y: 0.0, z: 2.3, risk: "warning", fuel: 58, trucks: 5, population: "517K" },
  { name: "Zarqa", x: 0.9, y: 0.0, z: 1.2, risk: "warning", fuel: 61, trucks: 12, population: "1.4M" },
  { name: "Amman", x: 0.0, y: 0.0, z: 0.8, risk: "stable", fuel: 84, trucks: 24, population: "4.0M" },
  { name: "Madaba", x: -0.9, y: 0.0, z: -0.2, risk: "stable", fuel: 76, trucks: 4, population: "190K" },
  { name: "Salt", x: -0.3, y: 0.0, z: 0.3, risk: "stable", fuel: 73, trucks: 3, population: "491K" },
  { name: "Karak", x: -0.7, y: 0.0, z: -1.5, risk: "warning", fuel: 54, trucks: 6, population: "316K" },
  { name: "Tafilah", x: -1.0, y: 0.0, z: -2.5, risk: "stable", fuel: 71, trucks: 2, population: "89K" },
  { name: "Ma'an", x: 0.6, y: 0.0, z: -3.2, risk: "stable", fuel: 78, trucks: 4, population: "144K" },
  { name: "Aqaba", x: 0.0, y: 0.0, z: -5.5, risk: "stable", fuel: 92, trucks: 10, population: "188K" },
];

const routes = [
  ["Aqaba", "Amman"], ["Amman", "Irbid"], ["Amman", "Zarqa"],
  ["Zarqa", "Mafraq"], ["Amman", "Karak"], ["Aqaba", "Ma'an"],
  ["Amman", "Madaba"], ["Amman", "Salt"], ["Karak", "Tafilah"],
  ["Irbid", "Ajloun"], ["Irbid", "Jerash"],
];

function getCity(name: string) {
  return cities3D.find((c) => c.name === name);
}

function riskColor(risk: string) {
  if (risk === "critical") return "#ef4444";
  if (risk === "warning") return "#f59e0b";
  return "#10b981";
}

function AnimatedRing({ city, index }: { city: City3D; index: number }) {
  const ringRef = useRef<THREE.Mesh>(null);
  const startTime = useRef(Math.random() * 10);

  useFrame(({ clock }) => {
    if (!ringRef.current) return;
    const t = clock.elapsedTime + startTime.current + index * 1.5;
    const scale = 1 + (Math.sin(t * 0.4) * 0.5 + 0.5) * 0.8;
    ringRef.current.scale.setScalar(scale);
    const mat = ringRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = Math.max(0, 0.4 - (scale - 1) * 0.3);
  });

  return (
    <mesh
      ref={ringRef}
      position={[0, 0.02, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <ringGeometry args={[0.18, 0.22, 32]} />
      <meshBasicMaterial color={riskColor(city.risk)} transparent opacity={0.3} side={THREE.DoubleSide} />
    </mesh>
  );
}

function CityMarkers() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <>
      {cities3D.map((city, i) => (
        <group key={city.name} position={[city.x, city.y + 0.05, city.z]}>
          <AnimatedRing city={city} index={i} />
          <mesh
            onPointerOver={() => setHovered(city.name)}
            onPointerOut={() => setHovered(null)}
          >
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial
              color={riskColor(city.risk)}
              emissive={riskColor(city.risk)}
              emissiveIntensity={hovered === city.name ? 0.8 : 0.3}
            />
          </mesh>
          {/* Glow halo */}
          <mesh>
            <sphereGeometry args={[0.18, 12, 12]} />
            <meshBasicMaterial
              color={riskColor(city.risk)}
              transparent
              opacity={hovered === city.name ? 0.2 : 0.08}
            />
          </mesh>
          <pointLight
            color={riskColor(city.risk)}
            intensity={hovered === city.name ? 0.6 : 0.25}
            distance={1.5}
          />
          <Html
            position={[0, hovered === city.name ? 0.45 : 0.3, 0]}
            center
            style={{
              color: "#e4e4e7",
              fontSize: hovered === city.name ? "10px" : "8px",
              fontFamily: "monospace",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              whiteSpace: "nowrap",
              textShadow: "0 0 12px rgba(0,0,0,0.9), 0 0 4px rgba(0,0,0,0.8)",
              pointerEvents: "none",
              userSelect: "none",
              transition: "all 0.2s",
              background: hovered === city.name ? "rgba(9,9,11,0.7)" : "transparent",
              padding: hovered === city.name ? "2px 6px" : "0",
              borderRadius: "4px",
              border: hovered === city.name ? "1px solid rgba(255,255,255,0.1)" : "none",
            }}
          >
            {hovered === city.name ? `${city.name} · ${city.fuel}% fuel · ${city.trucks} trucks` : city.name}
          </Html>
          {hovered === city.name && (
            <Html
              position={[0, 0.6, 0]}
              center
              style={{
                pointerEvents: "none",
                userSelect: "none",
              }}
            >
              <div style={{
                background: "rgba(9,9,11,0.85)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "6px",
                padding: "4px 8px",
                fontSize: "9px",
                color: "#a1a1aa",
                fontFamily: "monospace",
                lineHeight: 1.4,
                backdropFilter: "blur(8px)",
              }}>
                <div style={{ color: "#e4e4e7", fontWeight: 600 }}>{city.population}</div>
                <div style={{ color: riskColor(city.risk) }}>{city.risk.toUpperCase()}</div>
              </div>
            </Html>
          )}
        </group>
      ))}
    </>
  );
}

function PortBeacon() {
  const beaconRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!beaconRef.current) return;
    const t = clock.elapsedTime;
    const s = 1 + Math.sin(t * 2) * 0.15;
    beaconRef.current.scale.setScalar(s);
    const mat = beaconRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.15 + Math.sin(t * 2) * 0.08;
  });

  const aqaba = getCity("Aqaba");
  if (!aqaba) return null;

  return (
    <group position={[aqaba.x, aqaba.y + 0.02, aqaba.z]}>
      <mesh ref={beaconRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.25, 0.35, 32]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function GlowingRouteLine({ from, to }: { from: City3D; to: City3D }) {
  const points = useMemo(() => [
    new THREE.Vector3(from.x, from.y + 0.02, from.z),
    new THREE.Vector3(to.x, to.y + 0.02, to.z),
  ], [from, to]);

  return (
    <Line
      points={points}
      color="#10b981"
      lineWidth={1}
      transparent
      opacity={0.12}
    />
  );
}

function AnimatedRouteGlow({ from, to, delay }: { from: City3D; to: City3D; delay: number }) {
  const glowRef = useRef<THREE.Mesh>(null);
  const dir = useMemo(() => new THREE.Vector3(to.x - from.x, 0, to.z - from.z).normalize(), [from, to]);
  const length = useMemo(() => Math.sqrt((to.x - from.x) ** 2 + (to.z - from.z) ** 2), [from, to]);
  const mid = useMemo(() => new THREE.Vector3((from.x + to.x) / 2, from.y + 0.02, (from.z + to.z) / 2), [from, to]);

  useFrame(({ clock }) => {
    if (!glowRef.current) return;
    const t = (clock.elapsedTime * 0.3 + delay) % 1;
    const p = t * length - length / 2;
    const basePos = new THREE.Vector3(mid.x + dir.x * p, mid.y + 0.01, mid.z + dir.z * p);
    glowRef.current.position.copy(basePos);
    const mat = glowRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.25 * (1 - Math.abs(t * 2 - 1));
  });

  return (
    <mesh ref={glowRef}>
      <planeGeometry args={[0.06, 0.06]} />
      <meshBasicMaterial color="#10b981" transparent opacity={0} />
    </mesh>
  );
}

function RouteLines() {
  const pairs = useMemo(() => {
    return routes.map(([from, to]) => {
      const f = getCity(from);
      const t = getCity(to);
      return f && t ? { from: f, to: t } : null;
    }).filter(Boolean) as { from: City3D; to: City3D }[];
  }, []);

  return (
    <>
      {pairs.map((p, i) => (
        <Fragment key={i}>
          <GlowingRouteLine from={p.from} to={p.to} />
          <AnimatedRouteGlow from={p.from} to={p.to} delay={i * 0.15} />
        </Fragment>
      ))}
    </>
  );
}

interface Particle {
  routeIndex: number;
  progress: number;
  speed: number;
  offset: number;
  size: number;
}

function FlowParticles() {
  const count = 60;
  const particles = useMemo(() => {
    const validRoutes = routes.map(([from, to]) => {
      const f = getCity(from);
      const t = getCity(to);
      return f && t ? { from: f, to: t } : null;
    }).filter(Boolean) as { from: City3D; to: City3D }[];

    const ps: Particle[] = [];
    for (let i = 0; i < count; i++) {
      ps.push({
        routeIndex: i % validRoutes.length,
        progress: Math.random(),
        speed: 0.1 + Math.random() * 0.35,
        offset: Math.random() * 0.4,
        size: 0.02 + Math.random() * 0.03,
      });
    }
    return { ps, routes: validRoutes };
  }, []);

  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const countRef = useRef(count);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    for (let i = 0; i < countRef.current; i++) {
      const p = particles.ps[i];
      p.progress += p.speed * delta * 0.5;
      if (p.progress > 1) p.progress -= 1;

      const route = particles.routes[p.routeIndex];
      if (!route) continue;

      const pos = new THREE.Vector3().lerpVectors(
        new THREE.Vector3(route.from.x, route.from.y + 0.04 + p.offset * 0.02, route.from.z),
        new THREE.Vector3(route.to.x, route.to.y + 0.04 + p.offset * 0.02, route.to.z),
        p.progress
      );
      dummy.position.copy(pos);
      dummy.scale.setScalar(p.size);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#10b981" transparent opacity={0.8} />
    </instancedMesh>
  );
}

function GridGround() {
  const gridRef = useRef<THREE.GridHelper>(null);
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.06, 0]}>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial
          color="#09090b"
          transparent
          opacity={0.6}
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
      <gridHelper
        ref={gridRef}
        args={[14, 20, "#1a1a2e", "#18181b"]}
        position={[0, -0.05, 0]}
      />
      {/* Outer ring glow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0]}>
        <ringGeometry args={[4.5, 5, 64]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.03} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0]}>
        <ringGeometry args={[3, 3.2, 48]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.02} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Scene() {
  return (
    <group>
      <GridGround />
      <RouteLines />
      <CityMarkers />
      <PortBeacon />
      <FlowParticles />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={0.2} />
      <directionalLight position={[-3, 5, -3]} intensity={0.1} color="#10b981" />
      <pointLight position={[-2, 3, -4]} color="#10b981" intensity={0.12} />
      <pointLight position={[0, -3, 2]} color="#10b981" intensity={0.08} />
      <spotLight position={[0, 8, 0]} angle={0.8} penumbra={0.5} intensity={0.15} color="#10b981" />
    </group>
  );
}

export function DigitalTwin() {
  return (
    <div className="glass-panel p-0 overflow-hidden rounded-2xl relative" style={{ height: "600px" }}>
      <Canvas
        camera={{ position: [0, 6, 8], fov: 38 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
        style={{ background: "transparent" }}
      >
        <fog attach="fog" args={["#09090b", 8, 16]} />
        <Scene />
        <OrbitControls
          enablePan={false}
          minDistance={5}
          maxDistance={16}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2}
          autoRotate
          autoRotateSpeed={0.8}
        />
      </Canvas>
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-zinc-900/70 backdrop-blur-md border border-zinc-700/30 rounded-lg px-2.5 py-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-live-pulse" />
        <span className="text-[9px] text-zinc-300 font-medium tracking-wider">3D DIGITAL TWIN</span>
      </div>
      <div className="absolute bottom-3 left-3 z-10 flex items-center gap-3 bg-zinc-900/70 backdrop-blur-md border border-zinc-700/30 rounded-lg px-2.5 py-1.5">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-[7px] text-zinc-500 font-medium uppercase tracking-wider">Stable</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span className="text-[7px] text-zinc-500 font-medium uppercase tracking-wider">Watch</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
          <span className="text-[7px] text-zinc-500 font-medium uppercase tracking-wider">Critical</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[7px] text-zinc-500 font-medium uppercase tracking-wider">Fuel Flow</span>
        </div>
      </div>
      <div className="absolute top-3 right-3 z-10 bg-zinc-900/70 backdrop-blur-md border border-zinc-700/30 rounded-lg px-2.5 py-1.5">
        <span className="text-[7px] text-zinc-600 font-mono">Hover cities · Drag to rotate · Scroll to zoom</span>
      </div>
    </div>
  );
}
