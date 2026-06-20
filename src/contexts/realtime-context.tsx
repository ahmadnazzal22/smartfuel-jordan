"use client";
import { createContext, useContext, useEffect, useState, useRef, type ReactNode } from "react";
import { io, type Socket } from "socket.io-client";

interface RealtimeState {
  kpi: any;
  alerts: any[];
  trucks: any[];
  lastUpdate: Date | null;
}

const initialState: RealtimeState = { kpi: null, alerts: [], trucks: [], lastUpdate: null };

interface RealtimeContextType extends RealtimeState {
  connected: boolean;
}

const RealtimeContext = createContext<RealtimeContextType>({ ...initialState, connected: false });

export function RealtimeProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<RealtimeState>(initialState);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io("http://localhost:3001", { transports: ["websocket", "polling"] });
    socketRef.current = socket;

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    socket.on("dashboard:snapshot", (data: any) => {
      setState({ kpi: data.kpi, alerts: data.alerts || [], trucks: data.trucks || [], lastUpdate: new Date() });
    });

    socket.on("alert:new", (alert: any) => {
      setState((prev) => ({ ...prev, alerts: [alert, ...prev.alerts].slice(0, 10), lastUpdate: new Date() }));
    });

    socket.on("truck:gps", (data: any) => {
      setState((prev) => ({
        ...prev,
        trucks: prev.trucks.map((t: any) => t.id === data.truckId ? { ...t, latitude: data.latitude, longitude: data.longitude, lastGpsUpdate: new Date() } : t),
        lastUpdate: new Date(),
      }));
    });

    return () => { socket.disconnect(); socketRef.current = null; };
  }, []);

  return (
    <RealtimeContext.Provider value={{ ...state, connected }}>
      {children}
    </RealtimeContext.Provider>
  );
}

export function useRealtime() {
  const ctx = useContext(RealtimeContext);
  if (!ctx) throw new Error("useRealtime must be used within RealtimeProvider");
  return ctx;
}
