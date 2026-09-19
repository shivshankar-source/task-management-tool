const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://task-management-api-rl1t.onrender.com/api";

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("authToken");

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}