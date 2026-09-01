const BASE_URL = import.meta.env.VITE_API_URL || "/api";

const getToken = () => localStorage.getItem("token");

async function request(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    headers,
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }
  return data;
}

export const getEvents = (params = "") =>
  request(`/events${params}`);

export const getLocations = () => request("/events/locations");

export const getFeaturedEvents = (params = "") =>
  request(`/events/featured${params}`);
export const getTrendingEvents = () => request("/events/trending");
export const getLiveEvents = () => request("/events/live");
export const getEvent = (slug) => request(`/events/${slug}`);
export const getCategories = () => request("/categories");
export const getFeaturedCategories = () => request("/categories?featured=true");
export const getContent = (key) => request(`/content/${key}`);
export const registerUser = (payload) => request("/auth/register", {
  method: "POST",
  body: JSON.stringify(payload),
});
export const loginUser = (payload) => request("/auth/login", {
  method: "POST",
  body: JSON.stringify(payload),
});
export const forgotPassword = (email) => request("/auth/forgot-password", {
  method: "POST",
  body: JSON.stringify({ email }),
});
export const resetPassword = (token, password) => request("/auth/reset-password", {
  method: "POST",
  body: JSON.stringify({ token, password }),
});
export const subscribeNewsletter = (email) => request("/content/newsletter", {
  method: "POST",
  body: JSON.stringify({ email }),
});

export const getMe = () => request("/auth/me");

export const getNearbyEvents = (lat, lng, radius = 30) =>
  request(`/events/near?lat=${lat}&lng=${lng}&radius=${radius}`);

export const getSavedEvents = () => request("/saved");
export const getSavedIds = () => request("/saved/ids");
export const saveEvent = (id) => request(`/saved/${id}`, { method: "POST" });
export const unsaveEvent = (id) => request(`/saved/${id}`, { method: "DELETE" });

export const getRegistrations = () => request("/registrations");
export const getRegistrationStatus = (slug) => request(`/events/${slug}/register-status`);

// Register for an event. For paid events the backend initiates a Khalti
// KPG-2 payment and returns { pending, pidx, paymentUrl }.
export const registerForEvent = (slug) =>
  request(`/events/${slug}/register`, { method: "POST" });

// Verify a Khalti payment by pidx after the user returns from Khalti.
export const confirmKhaltiPayment = (pidx) =>
  request(`/registrations/khalti/confirm`, {
    method: "POST",
    body: JSON.stringify({ pidx }),
  });

export const unregisterEvent = (slug) => request(`/events/${slug}/register`, { method: "DELETE" });

export const getNotifications = () => request("/notifications");
export const markAllNotificationsRead = () => request("/notifications/read-all", { method: "POST" });
export const markNotificationRead = (id) => request(`/notifications/${id}/read`, { method: "POST" });

export const adminGetStats = () => request("/admin/stats");
export const adminGetUsers = () => request("/admin/users");
export const adminGetNotifications = () => request("/admin/notifications");
export const adminSendNotification = (payload) => request("/admin/notifications", {
  method: "POST",
  body: JSON.stringify(payload),
});
export const adminGetSubscribers = () => request("/admin/subscribers");
export const adminGetContent = () => request("/admin/content");

export const adminCreateEvent = (payload) => request("/events", {
  method: "POST",
  body: JSON.stringify(payload),
});
export const adminUpdateEvent = (id, payload) => request(`/events/${id}`, {
  method: "PUT",
  body: JSON.stringify(payload),
});
export const adminDeleteEvent = (id) => request(`/events/${id}`, { method: "DELETE" });

export const adminCreateCategory = (payload) => request("/categories", {
  method: "POST",
  body: JSON.stringify(payload),
});
export const adminUpdateCategory = (id, payload) => request(`/categories/${id}`, {
  method: "PUT",
  body: JSON.stringify(payload),
});
export const adminDeleteCategory = (id) => request(`/categories/${id}`, { method: "DELETE" });

export const adminUpdateUserRole = (id, role) => request(`/admin/users/${id}/role`, {
  method: "PUT",
  body: JSON.stringify({ role }),
});
export const adminUpdateUser = (id, payload) => request(`/admin/users/${id}`, {
  method: "PUT",
  body: JSON.stringify(payload),
});
export const adminDeleteUser = (id) => request(`/admin/users/${id}`, { method: "DELETE" });