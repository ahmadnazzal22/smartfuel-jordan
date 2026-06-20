const API_BASE = "/api/v1";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: { message: res.statusText } }));
    throw new Error(err.error?.message || "Request failed");
  }
  return res.json();
}

export const api = {
  auth: {
    login: (body: { email: string; password: string }) =>
      request<{ token: string; user: any }>("/auth/login", { method: "POST", body: JSON.stringify(body) }),
    logout: () => request<void>("/auth/logout", { method: "POST" }),
    refresh: (refreshToken: string) =>
      request<{ token: string }>("/auth/refresh", { method: "POST", body: JSON.stringify({ refreshToken }) }),
  },
  dashboard: {
    get: () => request<any>("/dashboard"),
  },
  stations: {
    list: (params?: Record<string, string>) =>
      request<any>(`/stations?${new URLSearchParams(params)}`),
    get: (id: string) => request<any>(`/stations/${id}`),
  },
  predictions: {
    list: (params?: Record<string, string>) =>
      request<any>(`/predictions?${new URLSearchParams(params)}`),
    get: (id: string) => request<any>(`/predictions/${id}`),
  },
  trucks: {
    list: (params?: Record<string, string>) =>
      request<any>(`/trucks?${new URLSearchParams(params)}`),
    get: (id: string) => request<any>(`/trucks/${id}`),
  },
  notifications: {
    list: () => request<{ data: any[] }>("/notifications"),
    markRead: (id: string) => request<void>("/notifications", { method: "PATCH", body: JSON.stringify({ id }) }),
  },
  kpi: {
    history: () => request<{ data: any[] }>("/kpi/history"),
  },
  regions: {
    list: () => request<{ data: any[] }>("/regions"),
  },
};
