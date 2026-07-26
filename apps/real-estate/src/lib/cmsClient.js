const SITE_KEY = "real-estate";
const DEFAULT_TIMEOUT_MS = 2500;
const SUPPORTED_LOCALES = new Set(["en", "fa", "ar", "tr"]);

function normalizeBaseUrl(value) {
  const configured = String(value || "").trim();
  if (!configured || configured === "__SAME_ORIGIN__") return window.location.origin;
  return configured.replace(/\/+$/, "");
}

function normalizePathname(pathname) {
  const normalized = String(pathname || "/").replace(/\/+$/, "");
  return normalized || "/";
}

function currentLocale(localeOverride) {
  const params = new URLSearchParams(window.location.search);
  const requested = (localeOverride || params.get("locale") || window.localStorage.getItem("rezaei-locale") || "en").toLowerCase();
  return SUPPORTED_LOCALES.has(requested) ? requested : "en";
}

function endpointForPath(pathname, localeOverride) {
  const path = normalizePathname(pathname);
  const locale = encodeURIComponent(currentLocale(localeOverride));

  if (path === "/") {
    return `/api/public/sites/${SITE_KEY}/homepage/?locale=${locale}`;
  }

  const slug = path
    .replace(/^\/+/, "")
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");

  return `/api/public/sites/${SITE_KEY}/pages/${slug}/?locale=${locale}`;
}

async function fetchJsonWithTimeout(url, timeoutMs = DEFAULT_TIMEOUT_MS, options = {}) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        Accept: "application/json",
        ...(options.headers || {}),
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`CMS returned ${response.status}`);
    }

    const data = await response.json();
    if (!data || typeof data !== "object") {
      throw new Error("CMS returned malformed JSON");
    }

    return data;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export async function fetchCmsPage(pathname, locale) {
  const baseUrl = normalizeBaseUrl(import.meta.env.VITE_CMS_API_URL);

  if (!baseUrl) {
    throw new Error("VITE_CMS_API_URL is not configured");
  }

  return fetchJsonWithTimeout(`${baseUrl}${endpointForPath(pathname, locale)}`);
}

export async function submitInquiry(payload) {
  const baseUrl = normalizeBaseUrl(import.meta.env.VITE_CMS_API_URL);

  if (!baseUrl) {
    throw new Error("VITE_CMS_API_URL is not configured");
  }

  return fetchJsonWithTimeout(`${baseUrl}/api/public/inquiries/`, DEFAULT_TIMEOUT_MS, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
}
