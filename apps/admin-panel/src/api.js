const TOKEN_KEY = "rezaei-cms-token";
const USER_KEY = "rezaei-cms-user";

function baseUrl() {
  const configured = String(import.meta.env.VITE_CMS_API_URL || "").trim();
  if (!configured || configured === "__SAME_ORIGIN__") return window.location.origin;
  return configured.replace(/\/+$/, "");
}

function authToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

function headers(options = {}) {
  const token = authToken();
  const output = {
    Accept: "application/json",
    ...options,
  };

  if (token) {
    output.Authorization = `Token ${token}`;
  }

  return output;
}

async function parseResponse(response) {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await response.json() : await response.text();

  if (!response.ok) {
    const message = typeof data === "string" ? data : data.detail || JSON.stringify(data);
    throw new Error(message || `Request failed with ${response.status}`);
  }

  return data;
}

async function request(path, options = {}) {
  const apiBase = baseUrl();
  if (!apiBase) {
    throw new Error("VITE_CMS_API_URL is not configured.");
  }

  const response = await fetch(`${apiBase}${path}`, {
    ...options,
    headers: headers(options.headers),
  });

  return parseResponse(response);
}

function body(data) {
  return {
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  };
}

export function storedAuth() {
  const token = sessionStorage.getItem(TOKEN_KEY);
  const user = sessionStorage.getItem(USER_KEY);

  if (!token || !user) {
    return null;
  }

  try {
    return { token, user: JSON.parse(user) };
  } catch {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    return null;
  }
}

export async function login(credentials) {
  const data = await request("/api/auth/login/", {
    method: "POST",
    ...body(credentials),
  });
  sessionStorage.setItem(TOKEN_KEY, data.token);
  sessionStorage.setItem(USER_KEY, JSON.stringify(data.user));
  return data.user;
}

export async function logout() {
  try {
    await request("/api/auth/logout/", { method: "POST" });
  } finally {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  }
}

export async function me() {
  return request("/api/auth/me/");
}

export async function listSites() {
  const data = await request("/api/admin/sites/");
  return Array.isArray(data) ? data : data.results || [];
}

export async function listInquiries(filters = {}) {
  const params = new URLSearchParams();
  if (filters.site) params.set("site", filters.site);
  if (filters.status) params.set("status", filters.status);
  if (filters.search) params.set("search", filters.search);
  const query = params.toString() ? `?${params.toString()}` : "";
  const data = await request(`/api/admin/inquiries/${query}`);
  return Array.isArray(data) ? data : data.results || [];
}

export async function updateInquiry(inquiryId, data) {
  return request(`/api/admin/inquiries/${inquiryId}/`, {
    method: "PATCH",
    ...body(data),
  });
}

export async function listPages(siteKey, locale = "en") {
  const params = new URLSearchParams();
  if (siteKey) params.set("site", siteKey);
  if (locale) params.set("locale", locale);
  const query = params.toString() ? `?${params.toString()}` : "";
  const data = await request(`/api/admin/pages/${query}`);
  return Array.isArray(data) ? data : data.results || [];
}

export async function cloneSiteLocale(siteId, locale) {
  return request(`/api/admin/sites/${siteId}/locales/${encodeURIComponent(locale)}/clone-from-default/`, { method: "POST" });
}

export async function syncPageFromEnglish(pageId) {
  return request(`/api/admin/pages/${pageId}/sync-from-english/`, { method: "POST" });
}

export async function createPage(data) {
  return request("/api/admin/pages/", {
    method: "POST",
    ...body(data),
  });
}

export async function updatePage(pageId, data) {
  return request(`/api/admin/pages/${pageId}/`, {
    method: "PATCH",
    ...body(data),
  });
}

export async function publishPage(pageId) {
  return request(`/api/admin/pages/${pageId}/publish/`, { method: "POST" });
}

export async function unpublishPage(pageId) {
  return request(`/api/admin/pages/${pageId}/unpublish/`, { method: "POST" });
}

export async function createSection(pageId, data) {
  return request(`/api/admin/pages/${pageId}/sections/`, {
    method: "POST",
    ...body(data),
  });
}

export async function updateSection(sectionId, data) {
  return request(`/api/admin/sections/${sectionId}/`, {
    method: "PATCH",
    ...body(data),
  });
}

export async function deleteSection(sectionId) {
  return request(`/api/admin/sections/${sectionId}/`, {
    method: "DELETE",
  });
}

export async function reorderSections(pageId, ids) {
  return request(`/api/admin/pages/${pageId}/sections/reorder/`, {
    method: "POST",
    ...body({ ids }),
  });
}

export async function createBlock(sectionId, data) {
  return request(`/api/admin/sections/${sectionId}/blocks/`, {
    method: "POST",
    ...body(data),
  });
}

export async function updateBlock(blockId, data) {
  return request(`/api/admin/blocks/${blockId}/`, {
    method: "PATCH",
    ...body(data),
  });
}

export async function deleteBlock(blockId) {
  return request(`/api/admin/blocks/${blockId}/`, {
    method: "DELETE",
  });
}

export async function reorderBlocks(sectionId, ids) {
  return request(`/api/admin/sections/${sectionId}/blocks/reorder/`, {
    method: "POST",
    ...body({ ids }),
  });
}

export async function listNavigation(siteId, locale = "en") {
  const data = await request(`/api/admin/sites/${siteId}/navigation/?locale=${encodeURIComponent(locale)}`);
  return Array.isArray(data) ? data : data.results || [];
}

export async function createNavigationItem(siteId, data) {
  return request(`/api/admin/sites/${siteId}/navigation/`, {
    method: "POST",
    ...body(data),
  });
}

export async function updateNavigationItem(itemId, data) {
  return request(`/api/admin/navigation/${itemId}/`, {
    method: "PATCH",
    ...body(data),
  });
}

export async function deleteNavigationItem(itemId) {
  return request(`/api/admin/navigation/${itemId}/`, {
    method: "DELETE",
  });
}

export async function reorderNavigationItems(siteId, ids) {
  return request(`/api/admin/sites/${siteId}/navigation/reorder/`, {
    method: "POST",
    ...body({ ids }),
  });
}

export async function getSiteSettings(siteId) {
  return request(`/api/admin/sites/${siteId}/settings/`);
}

export async function updateSiteSettings(siteId, data) {
  return request(`/api/admin/sites/${siteId}/settings/`, {
    method: "PATCH",
    ...body(data),
  });
}

export async function deletePage(pageId) {
  return request(`/api/admin/pages/${pageId}/`, {
    method: "DELETE",
  });
}

export async function listMediaAssets() {
  const data = await request("/api/admin/media-assets/");
  return Array.isArray(data) ? data : data.results || [];
}

export async function uploadMediaAsset({ file, title = "", alt_text = "", external_url = "" }) {
  const form = new FormData();
  if (file) form.append("file", file);
  if (title) form.append("title", title);
  if (alt_text) form.append("alt_text", alt_text);
  if (external_url) form.append("external_url", external_url);
  if (file?.type) form.append("mime_type", file.type);

  const apiBase = baseUrl();
  if (!apiBase) {
    throw new Error("VITE_CMS_API_URL is not configured.");
  }

  const response = await fetch(`${apiBase}/api/admin/media-assets/`, {
    method: "POST",
    body: form,
    headers: headers(),
  });
  return parseResponse(response);
}

export async function updateMediaAsset(assetId, data) {
  return request(`/api/admin/media-assets/${assetId}/`, {
    method: "PATCH",
    ...body(data),
  });
}

export async function deleteMediaAsset(assetId) {
  return request(`/api/admin/media-assets/${assetId}/`, {
    method: "DELETE",
  });
}
