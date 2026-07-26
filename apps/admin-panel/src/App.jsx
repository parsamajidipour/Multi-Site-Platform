import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Copy,
  ExternalLink,
  FileText,
  Globe2,
  Home,
  Image as ImageIcon,
  Inbox,
  Languages,
  LogOut,
  Mail,
  Menu,
  MessageSquare,
  Pencil,
  Phone,
  PlusSquare,
  RefreshCw,
  Save,
  Search,
  Settings,
  Shield,
  Trash2,
  Upload,
  Video,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  cloneSiteLocale,
  syncPageFromEnglish,
  createBlock,
  createNavigationItem,
  createPage,
  createSection,
  deleteBlock,
  deleteMediaAsset,
  deleteNavigationItem,
  deletePage,
  deleteSection,
  getSiteSettings,
  listInquiries,
  listMediaAssets,
  listNavigation,
  listPages,
  listSites,
  login,
  logout,
  me,
  publishPage,
  reorderBlocks,
  reorderNavigationItems,
  reorderSections,
  storedAuth,
  unpublishPage,
  updateBlock,
  updateInquiry,
  updateMediaAsset,
  updateNavigationItem,
  updatePage,
  updateSection,
  updateSiteSettings,
  uploadMediaAsset,
} from "./api";

const emptyNotice = { type: "", text: "" };
const inquiryStatuses = [
  { value: "new", label: "New" },
  { value: "in_progress", label: "In progress" },
  { value: "contacted", label: "Contacted" },
  { value: "closed", label: "Closed" },
];
const languages = [
  { code: "en", label: "English", note: "Default and fallback language" },
  { code: "fa", label: "Persian", note: "Uses English if a translated page is missing" },
  { code: "ar", label: "Arabic", note: "Uses English if a translated page is missing" },
  { code: "tr", label: "Turkish", note: "Uses English if a translated page is missing" },
];
const sectionTypes = [
  { value: "hero", label: "Hero" },
  { value: "cards", label: "Cards" },
  { value: "services", label: "Services" },
  { value: "process", label: "Process" },
  { value: "contact", label: "Contact" },
  { value: "cta", label: "Call to Action" },
  { value: "rich_text", label: "Rich Text" },
  { value: "links", label: "Links" },
];
const blockTypes = [
  { value: "card", label: "Card" },
  { value: "service_item", label: "Service Item" },
  { value: "process_step", label: "Process Step" },
  { value: "stat", label: "Stat" },
  { value: "link", label: "Link" },
  { value: "contact_row", label: "Contact Row" },
  { value: "button", label: "Button" },
];
const websiteLabels = {
  "main-site": "REZAEI GLOBAL LLC",
  "real-estate": "Real Estate",
  finance: "Finance & Trade",
  visa: "Residency, Visa & Translation",
};
const websiteUrls = {
  "main-site": import.meta.env.VITE_MAIN_SITE_URL || "https://example.com",
  "real-estate": import.meta.env.VITE_REAL_ESTATE_URL || "https://real-estate.example.com",
  finance: import.meta.env.VITE_FINANCE_URL || "https://finance.example.com",
  visa: import.meta.env.VITE_VISA_URL || "https://visa.example.com",
};

// section.subtitle = the eyebrow text (small uppercase label shown above the title in the frontend)
// Each entry lists which text fields to show and how to label them
const SECTION_FIELD_CONFIG = {
  hero: {
    subtitle: "Eyebrow",
    title: "Main headline",
    summary: "Supporting text",
  },
  cards: {
    subtitle: "Eyebrow",
    title: "Section title",
    summary: "Description",
  },
  services: {
    subtitle: "Eyebrow",
    title: "Section title",
    summary: "Description",
  },
  process: {
    subtitle: "Eyebrow",
    title: "Section title",
    summary: "Description",
  },
  contact: {
    subtitle: "Eyebrow",
    title: "Section title",
    summary: "Description",
    body: "Additional text",
  },
  cta: {
    subtitle: "Eyebrow",
    title: "CTA headline",
    summary: "Description",
  },
  rich_text: {
    subtitle: "Eyebrow",
    title: "Section title",
    summary: "Short description",
    body: "Main content",
  },
  links: {
    subtitle: "Eyebrow",
    title: "Section title",
  },
};

// Fields shown in the block editor for each block type
const BLOCK_FIELD_CONFIG = {
  card: {
    label: "Card",
    layout: [
      { field: "title", label: "Card title", rows: null },
      { field: "subtitle", label: "Subtitle (optional)", rows: null },
      { field: "body", label: "Description (one item per line for list-style cards)", rows: 4 },
      { field: "href", label: "Link (optional)", rows: null },
      { field: "image_url", label: "Image URL (optional)", rows: null, mediaKind: "image" },
      { field: "video_url", label: "Video URL (optional)", rows: null, mediaKind: "video" },
    ],
  },
  service_item: {
    label: "Service",
    layout: [
      { field: "title", label: "Service name", rows: null },
      { field: "subtitle", label: "Scope / tag (optional)", rows: null },
      { field: "body", label: "Description (add --- on new line, then bullet points on next lines)", rows: 6 },
      { field: "href", label: "Link (optional)", rows: null },
      { field: "image_url", label: "Image URL (optional)", rows: null, mediaKind: "image" },
    ],
  },
  process_step: {
    label: "Step",
    layout: [
      { field: "icon", label: "Icon (optional)", rows: null },
      { field: "title", label: "Step title", rows: null },
      { field: "body", label: "Description", rows: 4 },
      { field: "image_url", label: "Image URL (optional)", rows: null, mediaKind: "image" },
    ],
  },
  contact_row: {
    label: "Contact detail",
    layout: [
      { field: "icon", label: "Icon", rows: null },
      { field: "title", label: "Label (e.g. Phone)", rows: null },
      { field: "body", label: "Value (e.g. +968 50 000 0000)", rows: null },
      { field: "href", label: "Link (optional, e.g. tel:+9680000)", rows: null },
    ],
  },
  button: {
    label: "Button",
    layout: [
      { field: "title", label: "Button label", rows: null },
      { field: "href", label: "Link", rows: null },
    ],
  },
  link: {
    label: "Link",
    layout: [
      { field: "title", label: "Link text", rows: null },
      { field: "href", label: "URL", rows: null },
      { field: "body", label: "Description (optional)", rows: 3 },
    ],
  },
  stat: {
    label: "Stat",
    layout: [
      { field: "title", label: "Label", rows: null },
      { field: "subtitle", label: "Value", rows: null },
      { field: "body", label: "Description (optional)", rows: 3 },
    ],
  },
};

// Default block type to create when adding to a section
const SECTION_DEFAULT_BLOCK = {
  hero: "card",
  cards: "card",
  services: "service_item",
  process: "process_step",
  contact: "contact_row",
  cta: "button",
  rich_text: "card",
  links: "link",
};

function sectionBlockTypes(sectionType) {
  const map = {
    cards: [
      { value: "card", label: "Card" },
      { value: "button", label: "Button" },
      { value: "link", label: "Link" },
    ],
    services: [{ value: "service_item", label: "Service" }],
    process: [{ value: "process_step", label: "Step" }],
    contact: [{ value: "contact_row", label: "Contact detail" }],
    cta: [{ value: "button", label: "Button" }],
    links: [
      { value: "link", label: "Link" },
      { value: "card", label: "Card" },
    ],
    hero: [
      { value: "card", label: "Card" },
      { value: "link", label: "Link" },
      { value: "button", label: "Button" },
      { value: "stat", label: "Stat" },
    ],
  };
  return map[sectionType] || blockTypes;
}

function sectionBlocksLabel(sectionType, section) {
  if (isTeamMemberSection(section)) return "Team members";
  const labels = {
    cards: "Cards",
    services: "Services",
    process: "Steps",
    contact: "Contact details",
    cta: "Buttons",
    links: "Links",
    hero: "Items",
    rich_text: "Content blocks",
  };
  return labels[sectionType] || "Items";
}

const TEAM_SECTION_KEYS = new Set(["team", "roster"]);

function isTeamMemberSection(section) {
  return TEAM_SECTION_KEYS.has(section?.section_key);
}

function blockFieldConfig(blockType, section) {
  if (isTeamMemberSection(section) && blockType === "card") {
    return {
      label: "Team member",
      layout: [
        { field: "title", label: "Full name", rows: null },
        { field: "subtitle", label: "Job title / role", rows: null },
        { field: "body", label: "Short bio (optional)", rows: 3 },
        { field: "image_url", label: "Photo URL", rows: null, mediaKind: "image" },
      ],
    };
  }
  return BLOCK_FIELD_CONFIG[blockType] || BLOCK_FIELD_CONFIG.card;
}

const BRAND_SETTING_FIELDS = [
  { key: "brand_logo_wide", label: "Logo (wide / header)", mediaKind: "image" },
  { key: "brand_logo_stacked", label: "Logo (stacked / footer)", mediaKind: "image" },
  { key: "favicon_url", label: "Favicon", mediaKind: "image" },
  { key: "brand_color", label: "Primary brand color (e.g. #00357f)", type: "color-text" },
  { key: "accent_color", label: "Accent color (e.g. #f97316)", type: "color-text" },
];

const HERO_SETTING_FIELDS = [
  { key: "hero_video", label: "Default hero video URL", mediaKind: "video" },
  { key: "hero_poster", label: "Default hero poster image URL", mediaKind: "image" },
];

const GROUP_SITE_KEYS = [
  { key: "mainSite", label: "Holding / Main site" },
  { key: "realEstate", label: "Real Estate" },
  { key: "finance", label: "Finance & Trade" },
  { key: "visa", label: "Residency, Visa & Translation" },
];

// Common UI strings stored in SiteSetting.settings.ui_strings.<key>.<locale>
const UI_STRING_KEYS = [
  { key: "inquiry_success", label: "Inquiry success toast", rows: 2 },
  { key: "inquiry_error", label: "Inquiry error toast", rows: 2 },
  { key: "footer_meta", label: "Footer meta line", rows: 2 },
  { key: "footer_bottom_note", label: "Footer bottom note", rows: 2 },
  { key: "footer_tagline", label: "Footer tagline", rows: 2 },
  { key: "form_full_name", label: "Form: Full name label" },
  { key: "form_full_name_placeholder", label: "Form: Full name placeholder" },
  { key: "form_email", label: "Form: Email label" },
  { key: "form_email_placeholder", label: "Form: Email placeholder" },
  { key: "form_phone", label: "Form: Phone label" },
  { key: "form_phone_placeholder", label: "Form: Phone placeholder" },
  { key: "form_service_interest", label: "Form: Service interest label" },
  { key: "form_select_service", label: "Form: Select service placeholder" },
  { key: "form_country", label: "Form: Country label" },
  { key: "form_country_placeholder", label: "Form: Country placeholder" },
  { key: "form_message", label: "Form: Message label" },
  { key: "form_message_placeholder", label: "Form: Message placeholder", rows: 3 },
  { key: "form_send", label: "Form: Send button label" },
  { key: "form_corporate_group", label: "Form: Corporate group eyebrow" },
  { key: "form_visit_unit", label: "Form: Visit unit label" },
  { key: "nav_home", label: "Nav fallback: Home" },
  { key: "nav_back_home", label: "Nav fallback: Back to home" },
  { key: "cta_contact", label: "CTA: Contact us" },
  { key: "cta_visit_website", label: "CTA: Visit website" },
];

const SECTION_SETTING_PRESETS = {
  hero: [
    { key: "video", label: "Hero video URL (overrides site default)", mediaKind: "video" },
    { key: "poster_url", label: "Hero poster image URL", mediaKind: "image" },
    { key: "background_image", label: "Background image URL", mediaKind: "image" },
  ],
  cards: [
    { key: "background_image", label: "Background image URL", mediaKind: "image" },
  ],
  services: [
    { key: "background_image", label: "Background image URL", mediaKind: "image" },
  ],
  process: [
    { key: "background_image", label: "Background image URL", mediaKind: "image" },
  ],
  contact: [
    { key: "background_image", label: "Background image URL", mediaKind: "image" },
  ],
  cta: [
    { key: "background_image", label: "Background image URL", mediaKind: "image" },
  ],
  rich_text: [
    { key: "background_image", label: "Background image URL", mediaKind: "image" },
  ],
  links: [
    { key: "background_image", label: "Background image URL", mediaKind: "image" },
  ],
};

function sectionFieldConfig(section) {
  if (isTeamMemberSection(section)) {
    return {
      subtitle: "Section eyebrow (e.g. Leadership Team)",
      title: "Section headline",
      summary: "Intro paragraph under the headline",
      body: "Testimonial quote (optional, shown below the carousel on /team)",
    };
  }
  return SECTION_FIELD_CONFIG[section.type] || {
    subtitle: "Eyebrow",
    title: "Title",
    summary: "Description",
    body: "Content",
  };
}

function displaySite(site) {
  return websiteLabels[site?.key] || site?.name || "Website";
}

function siteUrl(site, page) {
  const base = websiteUrls[site?.key] || "/";
  if (!page || page.slug === "home") return base;
  return `${base.replace(/\/+$/, "")}/${page.slug}`;
}

function statusLabel(status) {
  return inquiryStatuses.find((item) => item.value === status)?.label || status || "Draft";
}

function statusClass(status) {
  if (status === "published") return "badge badgePublished";
  if (status === "new") return "badge badgeNew";
  if (status === "closed") return "badge badgeClosed";
  return "badge badgeDraft";
}

function labelFromKey(value, fallback = "Content") {
  return String(value || fallback)
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}


function pageAddressLabel(slug) {
  if (!slug || slug === "home") return "Homepage";
  return `/${slug}`;
}

function normalizeSlug(slug) {
  if (!slug || slug === "home") return "/";
  const trimmed = String(slug).trim().replace(/^\/+|\/+$/g, "");
  return trimmed ? `/${trimmed}` : "/";
}

function pageMenuLabel(page) {
  const slug = String(page?.slug || "").replace(/^\/+|\/+$/g, "");
  if (!slug || slug === "home") return "Home";
  return labelFromKey(slug.split("/").pop(), page?.title || "Page");
}

function pageStatusText(status) {
  return status === "published" ? "Live on website" : "Saved as draft";
}

function tabFromPath() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  if (path === "/messages") return "messages";
  if (path === "/settings") return "settings";
  if (path === "/media") return "media";
  if (path.startsWith("/websites")) return "websites";
  return "dashboard";
}

function pathForView(view) {
  if (view === "messages") return "/messages";
  if (view === "settings") return "/settings";
  if (view === "media") return "/media";
  if (view === "websites") return "/websites";
  return "/";
}

function App() {
  const [auth, setAuth] = useState(() => storedAuth());
  const [sites, setSites] = useState([]);
  const [selectedSiteId, setSelectedSiteId] = useState("");
  const [pages, setPages] = useState([]);
  const [selectedPageId, setSelectedPageId] = useState("");
  const [selectedSlug, setSelectedSlug] = useState(null);
  const [activeLocale, setActiveLocale] = useState("en");
  const [view, setView] = useState(tabFromPath);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState(emptyNotice);
  const [showNewPage, setShowNewPage] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const selectedSite = useMemo(
    () => sites.find((site) => String(site.id) === String(selectedSiteId)) || null,
    [selectedSiteId, sites],
  );
  const selectedPage = useMemo(
    () => pages.find((page) => String(page.id) === String(selectedPageId)) || null,
    [pages, selectedPageId],
  );

  useEffect(() => {
    if (!auth?.token) return;
    me()
      .then((user) => setAuth((current) => ({ ...current, user })))
      .catch(() => {
        setAuth(null);
        sessionStorage.clear();
      });
  }, [auth?.token]);

  useEffect(() => {
    if (!auth?.token) return;
    refreshSites();
  }, [auth?.token]);

  useEffect(() => {
    if (!selectedSite?.key) return;
    refreshPages(selectedSite.key, activeLocale, selectedSlug ?? selectedPage?.slug);
  }, [selectedSite?.key]);

  useEffect(() => {
    function handlePopState() {
      setView(tabFromPath());
    }
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  function switchView(nextView) {
    setView(nextView);
    setSidebarOpen(false);
    const nextPath = pathForView(nextView);
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, "", nextPath);
    }
  }

  async function refreshSites() {
    setLoading(true);
    setNotice(emptyNotice);
    try {
      const data = await listSites();
      setSites(data);
      setSelectedSiteId((current) => current || data[0]?.id || "");
    } catch (error) {
      setNotice({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  }

  async function refreshPages(siteKey = selectedSite?.key, locale = activeLocale, preferredSlug) {
    if (!siteKey) return;
    const slugToMatch = preferredSlug ?? selectedSlug ?? selectedPage?.slug;
    setLoading(true);
    setNotice(emptyNotice);
    try {
      const data = await listPages(siteKey, locale);
      setPages(data);
      const slugMatch = slugToMatch
        ? data.find((page) => normalizeSlug(page.slug) === normalizeSlug(slugToMatch))
        : null;
      setSelectedPageId((current) => {
        if (slugMatch) return slugMatch.id;
        if (data.some((page) => String(page.id) === String(current))) return current;
        return data[0]?.id || "";
      });
      if (slugMatch) {
        setSelectedSlug(slugMatch.slug);
      } else if (data[0]) {
        setSelectedSlug(data[0].slug);
      }
    } catch (error) {
      setNotice({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  }

  function changeActiveLocale(locale) {
    setActiveLocale(locale);
    if (selectedSite?.key) {
      refreshPages(selectedSite.key, locale, selectedSlug ?? selectedPage?.slug);
    }
  }

  async function handleLogout() {
    await logout();
    setAuth(null);
    setSites([]);
    setPages([]);
  }

  function chooseWebsite(site) {
    setSelectedSiteId(site.id);
    setActiveLocale(site.default_locale || "en");
    setSelectedPageId("");
    setSelectedSlug(null);
    setShowNewPage(false);
    switchView("websites");
  }

  function chooseWebsiteById(siteId) {
    const site = sites.find((item) => String(item.id) === String(siteId));
    if (site) chooseWebsite(site);
  }

  function openSidebarPage(page) {
    setShowNewPage(false);
    setSelectedPageId(page.id);
    setSelectedSlug(page.slug);
    setSidebarOpen(false);
    switchView("websites");
  }

  function openNewPage() {
    setSelectedPageId("");
    setSelectedSlug(null);
    setShowNewPage(true);
    setSidebarOpen(false);
    switchView("websites");
  }

  if (!auth?.token) {
    return <LoginScreen onLogin={(user) => setAuth({ token: true, user })} />;
  }

  return (
    <div className={`appShell${sidebarOpen ? " sidebarOpen" : ""}`}>
      {sidebarOpen && <div className="sidebarBackdrop" onClick={() => setSidebarOpen(false)} aria-hidden="true" />}
      <aside className="sidebar" aria-label="Sidebar navigation">
        <div className="sidebarTop">
          <div className="brandBlock">
            <span className="brandMark"><Shield size={22} aria-hidden="true" /></span>
            <span>
              <strong>Website Manager</strong>
              <small>REZAEI Global</small>
            </span>
          </div>
          <button className="sidebarCloseBtn" type="button" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <nav className="mainNav" aria-label="Admin navigation">
          <button className={view === "dashboard" ? "navItem active" : "navItem"} type="button" onClick={() => switchView("dashboard")}>
            <Home size={18} aria-hidden="true" /> Dashboard
          </button>
          <button className={view === "media" ? "navItem active" : "navItem"} type="button" onClick={() => switchView("media")}>
            <ImageIcon size={18} aria-hidden="true" /> Media library
          </button>
          <label className="sidebarSiteSelect">
            <span>Website</span>
            <select value={selectedSiteId} onChange={(event) => chooseWebsiteById(event.target.value)}>
              {sites.map((site) => (
                <option key={site.id} value={site.id}>{displaySite(site)}</option>
              ))}
            </select>
          </label>
          {selectedSite && (
            <div className="siteMenuGroup">
              <div className="navGroupLabel">{displaySite(selectedSite)}</div>
              <div className="siteToolLinks">
                <button className={view === "messages" ? "navItem compactLink active" : "navItem compactLink"} type="button" onClick={() => switchView("messages")}>
                  <Inbox size={15} aria-hidden="true" /> <span>Messages</span>
                </button>
                <button className={view === "settings" ? "navItem compactLink active" : "navItem compactLink"} type="button" onClick={() => switchView("settings")}>
                  <Settings size={15} aria-hidden="true" /> <span>Settings</span>
                </button>
                <a className="navItem compactLink" href={siteUrl(selectedSite)} target="_blank" rel="noreferrer">
                  <ExternalLink size={15} aria-hidden="true" /> <span>Open</span>
                </a>
                <button className="navItem compactLink" type="button" onClick={handleLogout}>
                  <LogOut size={15} aria-hidden="true" /> <span>Logout</span>
                </button>
              </div>
              <div className="navGroupLabel">Pages</div>
              {view === "websites" && (
                <LanguagePicker activeLocale={activeLocale} setActiveLocale={changeActiveLocale} />
              )}
              <button className={showNewPage ? "navItem pageLink newPageLink active" : "navItem pageLink newPageLink"} type="button" onClick={openNewPage}>
                <PlusSquare size={15} aria-hidden="true" />
                <span>New Page</span>
              </button>
              <div className="sitePageLinks">
                {pages.map((page) => (
                  <button
                    className={view === "websites" && String(page.id) === String(selectedPageId) ? "navItem pageLink active" : "navItem pageLink"}
                    key={page.id}
                    type="button"
                    onClick={() => openSidebarPage(page)}
                  >
                    <FileText size={15} aria-hidden="true" />
                    <span>{pageMenuLabel(page)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </nav>

      </aside>

      <main className="workspace">
        {view === "websites" && (
          <div className="mobileBar">
            <button className="hamburger" type="button" onClick={() => setSidebarOpen(true)} aria-label="Open navigation">
              <Menu size={22} aria-hidden="true" />
            </button>
            <span className="mobileBarTitle">{selectedSite ? selectedSite.name : "Pages"}</span>
            {selectedSite && (
              <LanguagePicker activeLocale={activeLocale} setActiveLocale={changeActiveLocale} />
            )}
          </div>
        )}
        {view !== "websites" && (
          <header className="topBar">
            <div>
              <p className="eyebrow">Signed in as {auth.user?.username || "admin"}</p>
              <h1>{titleForView(view)}</h1>
            </div>
            <div className="topActions">
              <button className="hamburger topBarHamburger" type="button" onClick={() => setSidebarOpen(true)} aria-label="Open navigation">
                <Menu size={22} aria-hidden="true" />
              </button>
              <button className="secondaryButton" type="button" onClick={() => selectedSite && refreshPages(selectedSite.key, activeLocale, selectedSlug ?? selectedPage?.slug)}>
                <RefreshCw size={16} aria-hidden="true" /> Refresh
              </button>
            </div>
          </header>
        )}

        {notice.text && <Notice notice={notice} />}
        {loading && <div className="inlineLoading">Loading website content...</div>}

        {view === "dashboard" && (
          <DashboardScreen chooseWebsite={chooseWebsite} sites={sites} setNotice={setNotice} />
        )}
        {view === "websites" && selectedSite && (
          <WebsiteScreen
            activeLocale={activeLocale}
            loading={loading}
            onLocaleChange={changeActiveLocale}
            onRefresh={(slug, localeOverride) =>
              refreshPages(selectedSite.key, localeOverride ?? activeLocale, slug ?? selectedSlug)
            }
            pages={pages}
            selectedPage={selectedPage}
            selectedSite={selectedSite}
            selectedSlug={selectedSlug}
            setNotice={setNotice}
            showNewPage={showNewPage}
          />
        )}
        {view === "messages" && <MessagesScreen setNotice={setNotice} sites={sites} />}
        {view === "media" && <MediaLibraryScreen setNotice={setNotice} />}
        {view === "settings" && (
          <GlobalSettingsScreen
            activeLocale={activeLocale}
            onLocaleChange={changeActiveLocale}
            selectedSite={selectedSite}
            setNotice={setNotice}
            sites={sites}
          />
        )}
      </main>
    </div>
  );
}

function titleForView(view) {
  if (view === "messages") return "Messages";
  if (view === "settings") return "Settings";
  if (view === "media") return "Media library";
  return "Dashboard";
}

function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState(emptyNotice);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setNotice(emptyNotice);
    try {
      const user = await login({ username, password });
      onLogin(user);
    } catch (error) {
      setNotice({ type: "error", text: error.message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="loginPage">
      <form className="loginCard" onSubmit={handleSubmit}>
        <span className="brandMark"><Shield size={26} aria-hidden="true" /></span>
        <p className="eyebrow">REZAEI Global</p>
        <h1>Website Manager</h1>
        <p className="muted">Sign in to edit website content, publish pages, and review visitor messages.</p>
        {notice.text && <Notice notice={notice} />}
        <TextField label="Username" value={username} onChange={setUsername} autoComplete="username" required />
        <TextField label="Password" type="password" value={password} onChange={setPassword} autoComplete="current-password" required />
        <button className="primaryButton" disabled={submitting} type="submit">
          {submitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}

function LanguagePicker({ activeLocale, setActiveLocale }) {
  const activeLanguage = languages.find((language) => language.code === activeLocale) || languages[0];

  return (
    <label className="languagePicker" title={activeLanguage.note}>
      <Languages size={16} aria-hidden="true" />
      <span>Edit language</span>
      <select value={activeLocale} onChange={(event) => setActiveLocale(event.target.value)}>
        {languages.map((language) => (
          <option key={language.code} value={language.code}>
            {language.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function DashboardScreen({ chooseWebsite, sites, setNotice }) {
  const [stats, setStats] = useState({ pages: 0, published: 0, inquiries: 0, newInquiries: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      setNotice(emptyNotice);
      try {
        const pageGroups = await Promise.all(sites.map((site) => listPages(site.key, "en").catch(() => [])));
        const allPages = pageGroups.flat();
        const inquiries = await listInquiries().catch(() => []);
        setStats({
          pages: allPages.length,
          published: allPages.filter((page) => page.status === "published").length,
          inquiries: inquiries.length,
          newInquiries: inquiries.filter((item) => item.status === "new").length,
        });
        setRecent(inquiries.slice(0, 5));
      } catch (error) {
        setNotice({ type: "error", text: error.message });
      } finally {
        setLoading(false);
      }
    }
    if (sites.length) loadDashboard();
  }, [sites, setNotice]);

  return (
    <section className="screenStack">
      <div className="heroPanel">
        <div>
          <p className="eyebrow">Welcome back</p>
          <h2>Manage all website content from one simple place.</h2>
          <p>Choose a website, open a page, edit the text, then save or publish when ready.</p>
        </div>
      </div>

      <div className="statsGrid">
        <StatCard icon={FileText} label="Total pages" value={stats.pages} />
        <StatCard icon={CheckCircle2} label="Published pages" value={stats.published} />
        <StatCard icon={Inbox} label="Total messages" value={stats.inquiries} />
        <StatCard icon={MessageSquare} label="New messages" value={stats.newInquiries} />
      </div>

      <div className="twoColumn">
        <section className="panelCard">
          <PanelHeader title="Quick links to websites" subtitle="Open or manage each public website." />
          <div className="websiteCards">
            {sites.map((site) => (
              <article className="websiteCard" key={site.id}>
                <Globe2 size={22} aria-hidden="true" />
                <div>
                  <strong>{displaySite(site)}</strong>
                  <span>{siteUrl(site)}</span>
                </div>
                <button className="secondaryButton" type="button" onClick={() => chooseWebsite(site)}>
                  Manage <ChevronRight size={16} aria-hidden="true" />
                </button>
                <a className="iconLink" href={siteUrl(site)} target="_blank" rel="noreferrer" aria-label={`Open ${displaySite(site)}`}>
                  <ExternalLink size={17} aria-hidden="true" />
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="panelCard">
          <PanelHeader title="Recent activity" subtitle={loading ? "Loading latest messages..." : "Latest visitor messages."} />
          <div className="activityList">
            {recent.length ? recent.map((inquiry) => (
              <article key={inquiry.id}>
                <span className={statusClass(inquiry.status)}>{statusLabel(inquiry.status)}</span>
                <strong>{inquiry.name}</strong>
                <small>{inquiry.site_name || inquiry.site_key} · {new Date(inquiry.created_at).toLocaleDateString()}</small>
              </article>
            )) : <EmptyState title="No recent messages yet." />}
          </div>
        </section>
      </div>
    </section>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <article className="statCard">
      <Icon size={22} aria-hidden="true" />
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function WebsiteScreen({
  activeLocale,
  loading,
  onLocaleChange,
  onRefresh,
  pages,
  selectedPage,
  selectedSite,
  selectedSlug,
  setNotice,
  showNewPage,
}) {
  const activeLanguage = languages.find((language) => language.code === activeLocale) || languages[0];
  const editorPage =
    selectedPage?.locale === activeLocale
      ? selectedPage
      : pages.find(
          (page) => page.locale === activeLocale && normalizeSlug(page.slug) === normalizeSlug(selectedSlug),
        ) || null;
  const waitingForLocale = Boolean(
    selectedSlug && !editorPage && (loading || selectedPage?.locale !== activeLocale),
  );

  return (
    <section className="screenStack">
      <div className="editorLayout editorLayoutSingle">
        <section className="editorPanel">
          {showNewPage ? (
            <CreatePagePanel activeLocale={activeLocale} onRefresh={onRefresh} selectedSite={selectedSite} setNotice={setNotice} startOpen />
          ) : editorPage ? (
            <PageEditor
              key={`${editorPage.id}-${activeLocale}`}
              activeLocale={activeLocale}
              onLocaleChange={onLocaleChange}
              onRefresh={onRefresh}
              page={editorPage}
              selectedSite={selectedSite}
              setNotice={setNotice}
            />
          ) : waitingForLocale ? (
            <div className="inlineLoading">Loading {activeLanguage.label} content...</div>
          ) : (
            <EmptyState title="Choose a page to start editing." text="Select a page from the main sidebar to edit its content, search preview, and publishing status." />
          )}
          {activeLocale !== "en" && !pages.length && (
            <CloneLanguageButton activeLocale={activeLocale} onRefresh={onRefresh} selectedSite={selectedSite} setNotice={setNotice} />
          )}
        </section>
      </div>
    </section>
  );
}

function CreatePagePanel({ activeLocale, onRefresh, selectedSite, setNotice, startOpen = false }) {
  const [open, setOpen] = useState(startOpen);
  const [draft, setDraft] = useState({
    title: "",
    slug: "",
    page_type: "standard",
    status: "draft",
  });
  const [saving, setSaving] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setNotice(emptyNotice);
    try {
      await createPage({
        site: selectedSite.id,
        locale: activeLocale,
        title: draft.title,
        slug: draft.slug || draft.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
        page_type: draft.page_type,
        status: draft.status,
      });
      setDraft({ title: "", slug: "", page_type: "standard", status: "draft" });
      setOpen(false);
      await onRefresh();
      setNotice({ type: "success", text: "Page created. Add sections and publish when ready." });
    } catch (error) {
      setNotice({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="panelCard pageDesigner">
      {!startOpen && (
        <button className="secondaryButton fullWidth" type="button" onClick={() => setOpen((value) => !value)}>
          <PlusSquare size={16} aria-hidden="true" /> New page
        </button>
      )}
      {open && (
        <>
          <PanelHeader title="Create a new page" subtitle="Add the page first, then build its sections, cards, buttons, and steps." />
          <form className="createForm pageForm" onSubmit={submit}>
            <div className="formGrid two">
              <TextField label="Page title" required value={draft.title} onChange={(value) => setDraft((current) => ({ ...current, title: value }))} />
              <TextField label="Address" help="Example: services/import-export. Use home for homepage." value={draft.slug} onChange={(value) => setDraft((current) => ({ ...current, slug: value }))} />
            </div>
            <div className="formGrid two">
          <label>
            Page type
            <select value={draft.page_type} onChange={(event) => setDraft((current) => ({ ...current, page_type: event.target.value }))}>
              <option value="standard">Standard</option>
              <option value="homepage">Homepage</option>
              <option value="contact">Contact</option>
              <option value="legal">Legal</option>
              <option value="blog">Blog index</option>
              <option value="blog_post">Blog post</option>
            </select>
          </label>
          <label>
            Status
            <select value={draft.status} onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value }))}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>
            </div>
            <div className="formActions">
              <button className="primaryButton" disabled={saving} type="submit">
                <PlusSquare size={16} aria-hidden="true" /> Create page
              </button>
            </div>
          </form>
        </>
      )}
    </section>
  );
}

function CloneLanguageButton({ activeLocale, onRefresh, selectedSite, setNotice }) {
  const [cloning, setCloning] = useState(false);
  const language = languages.find((item) => item.code === activeLocale) || languages[0];

  async function cloneLocale() {
    setCloning(true);
    setNotice(emptyNotice);
    try {
      const result = await cloneSiteLocale(selectedSite.id, activeLocale);
      await onRefresh();
      setNotice({ type: "success", text: `Created ${result.created_pages} translated page(s) from English.` });
    } catch (error) {
      setNotice({ type: "error", text: error.message });
    } finally {
      setCloning(false);
    }
  }

  return (
    <button className="primaryButton fullWidth" disabled={cloning} type="button" onClick={cloneLocale}>
      {cloning ? "Creating..." : `Create ${language.label} pages from English`}
    </button>
  );
}

function SyncFromEnglishBanner({ page, activeLocale, onRefresh, setNotice }) {
  const [syncing, setSyncing] = useState(false);
  const [result, setResult] = useState(null);
  const language = languages.find((item) => item.code === activeLocale) || languages[0];

  async function handleSync() {
    setSyncing(true);
    setResult(null);
    setNotice(emptyNotice);
    try {
      const data = await syncPageFromEnglish(page.id);
      setResult(data);
      await onRefresh(page.slug);
      if (data.added_sections === 0 && data.added_blocks === 0) {
        setNotice({ type: "success", text: `${language.label} page already matches English structure.` });
      } else {
        setNotice({
          type: "success",
          text: `Synced from English: added ${data.added_sections} section(s) and ${data.added_blocks} block(s). Translate the new content below.`,
        });
      }
    } catch (error) {
      setNotice({ type: "error", text: error.message });
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="syncBanner">
      <div className="syncBannerInfo">
        <Languages size={18} aria-hidden="true" />
        <div>
          <strong>Editing {language.label} version</strong>
          <span>
            {result
              ? result.added_sections === 0 && result.added_blocks === 0
                ? `Structure matches English (${result.source_sections} sections).`
                : `Added ${result.added_sections} section(s) and ${result.added_blocks} block(s) from English.`
              : `This page has ${page.sections.length} section(s). Sync to get any new sections added to the English version.`}
          </span>
        </div>
      </div>
      <button className="secondaryButton" disabled={syncing} type="button" onClick={handleSync}>
        <Languages size={15} aria-hidden="true" />
        {syncing ? "Syncing…" : "Sync structure from English"}
      </button>
    </div>
  );
}

function PageEditor({ activeLocale, onLocaleChange, onRefresh, page, selectedSite, setNotice }) {
  const [editorTab, setEditorTab] = useState("content");
  const [draft, setDraft] = useState(() => ({
    title: page.title || "",
    slug: page.slug || "",
    seo_title: page.seo_title || "",
    seo_description: page.seo_description || "",
    seo_keywords: page.seo_keywords || "",
    og_image_url: page.og_image_url || "",
  }));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDraft({
      title: page.title || "",
      slug: page.slug || "",
      seo_title: page.seo_title || "",
      seo_description: page.seo_description || "",
      seo_keywords: page.seo_keywords || "",
      og_image_url: page.og_image_url || "",
    });
  }, [page.id, page.updated_at, page.locale]);

  async function savePage(status = page.status) {
    setSaving(true);
    setNotice(emptyNotice);
    try {
      const payload = {
        title: draft.title,
        slug: draft.slug,
        status,
        seo_title: draft.seo_title,
        seo_description: draft.seo_description,
        seo_keywords: draft.seo_keywords,
      };
      if (draft.og_image_url !== page.og_image_url || !String(draft.og_image_url || "").startsWith("/")) {
        payload.og_image_url = draft.og_image_url;
      }
      await updatePage(page.id, payload);
      await onRefresh(payload.slug);
      setNotice({ type: "success", text: status === "published" ? "Page saved and published." : "Draft saved." });
    } catch (error) {
      setNotice({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  }

  async function togglePublish() {
    setSaving(true);
    setNotice(emptyNotice);
    try {
      if (page.status === "published") {
        await unpublishPage(page.id);
        setNotice({ type: "success", text: "Page unpublished. It is now a draft." });
      } else {
        await publishPage(page.id);
        setNotice({ type: "success", text: "Page published." });
      }
      await onRefresh();
    } catch (error) {
      setNotice({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  }

  async function removePage() {
    if (!window.confirm(`Delete page "${page.title || page.slug}"? This cannot be undone.`)) return;
    setSaving(true);
    setNotice(emptyNotice);
    try {
      await deletePage(page.id);
      await onRefresh();
      setNotice({ type: "success", text: "Page deleted." });
    } catch (error) {
      setNotice({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  }

  function changeEditorLocale(locale) {
    onLocaleChange(locale);
  }

  async function moveSection(sectionId, direction) {
    const ids = page.sections.map((section) => section.id);
    const index = ids.indexOf(sectionId);
    const targetIndex = index + direction;
    if (index < 0 || targetIndex < 0 || targetIndex >= ids.length) return;
    [ids[index], ids[targetIndex]] = [ids[targetIndex], ids[index]];
    setNotice(emptyNotice);
    try {
      await reorderSections(page.id, ids);
      await onRefresh(page.slug);
      setNotice({ type: "success", text: "Section order updated." });
    } catch (error) {
      setNotice({ type: "error", text: error.message });
    }
  }

  return (
    <div className="documentEditor">
      <div className="pageControlBar">
        <div className="editorHeader">
          <div className="pageIdentity">
            <p className="eyebrow">{displaySite(selectedSite)}</p>
            <div className="metaRow">
              <span className={statusClass(page.status)}>{pageStatusText(page.status)}</span>
              <span className="badge">{pageAddressLabel(page.slug)}</span>
              <span className="badge">{languages.find((item) => item.code === activeLocale)?.label || activeLocale}</span>
            </div>
          </div>
          <div className="buttonRow">
            <a className="secondaryButton" href={siteUrl(selectedSite, page)} target="_blank" rel="noreferrer">
              <ExternalLink size={16} aria-hidden="true" /> Open website
            </a>
            <button className="secondaryButton" disabled={saving} type="button" onClick={() => savePage("draft")}>
              <Save size={16} aria-hidden="true" /> Save draft
            </button>
            <button className="primaryButton" disabled={saving} type="button" onClick={() => savePage("published")}>
              Publish
            </button>
          </div>
        </div>
        <div className="pageControlRow">
          <div className="languageTabs" role="tablist" aria-label="Page language">
            {languages.map((language) => (
              <button
                aria-selected={language.code === activeLocale}
                className={language.code === activeLocale ? "languageTab active" : "languageTab"}
                key={language.code}
                onClick={() => changeEditorLocale(language.code)}
                role="tab"
                type="button"
              >
                <span>{language.code.toUpperCase()}</span>
                {language.label}
              </button>
            ))}
          </div>
          <div className="editorTabs" role="tablist" aria-label="Page editing">
            <button className={editorTab === "content" ? "subNavItem active" : "subNavItem"} type="button" onClick={() => setEditorTab("content")}>
              <FileText size={15} aria-hidden="true" /> Content
            </button>
            <button className={editorTab === "seo" ? "subNavItem active" : "subNavItem"} type="button" onClick={() => setEditorTab("seo")}>
              <Search size={15} aria-hidden="true" /> SEO
            </button>
            <button className={editorTab === "publish" ? "subNavItem active" : "subNavItem"} type="button" onClick={() => setEditorTab("publish")}>
              <CheckCircle2 size={15} aria-hidden="true" /> Publish
            </button>
          </div>
        </div>
      </div>

      {editorTab === "content" && (
        <div className="editorCanvas">
          <section className="panelCard pageDesigner pageSetupCard">
            <div className="builderHeader inline">
              <div>
                <p className="eyebrow">Page setup</p>
                <h3>Title and address</h3>
                <span>These fields control the page name and public URL for the selected language.</span>
              </div>
              <button className="secondaryButton" disabled={saving} type="button" onClick={() => savePage("draft")}>
                <Save size={16} aria-hidden="true" /> Save setup
              </button>
            </div>
            <div className="formGrid two relaxedFields">
              <TextField label="Page title" value={draft.title} onChange={(value) => setDraft((current) => ({ ...current, title: value }))} />
              <TextField label="Public page address" help="Example: contact, services, or countries/uae. Use home for the homepage." value={draft.slug} onChange={(value) => setDraft((current) => ({ ...current, slug: value }))} />
            </div>
          </section>

          {activeLocale !== "en" && (
            <SyncFromEnglishBanner
              page={page}
              activeLocale={activeLocale}
              onRefresh={onRefresh}
              setNotice={setNotice}
            />
          )}

          <section className="sectionBuilderPanel">
            <div className="builderHeader">
              <div>
                <p className="eyebrow">Content builder</p>
                <h3>Page sections</h3>
                <span>Add, edit, hide, or remove the sections and their cards, buttons, links, and steps.</span>
              </div>
              <div className="builderActions">
                <span className="badge">{page.sections.length} section{page.sections.length === 1 ? "" : "s"}</span>
                <CreateSectionPanel onRefresh={onRefresh} page={page} setNotice={setNotice} compact />
              </div>
            </div>
            <div className="sectionList">
              {page.sections.length ? page.sections.map((section, index) => (
                <ContentAreaEditor
                  canMoveDown={index < page.sections.length - 1}
                  canMoveUp={index > 0}
                  key={section.id}
                  onMoveDown={() => moveSection(section.id, 1)}
                  onMoveUp={() => moveSection(section.id, -1)}
                  onRefresh={onRefresh}
                  section={section}
                  setNotice={setNotice}
                />
              )) : (
                <EmptyState title="This page has no editable content yet." text="Add a section, then add cards, buttons, links, or process steps inside it." />
              )}
            </div>
          </section>
        </div>
      )}

      {editorTab === "seo" && (
        <section className="panelCard">
          <PanelHeader title="Search engine preview" subtitle="These fields help search engines and social previews understand the page." />
          <div className="formGrid">
            <TextField label="Search title" value={draft.seo_title} onChange={(value) => setDraft((current) => ({ ...current, seo_title: value }))} />
            <TextArea label="Search description" rows={4} value={draft.seo_description} onChange={(value) => setDraft((current) => ({ ...current, seo_description: value }))} />
            <TextArea label="Search keywords" rows={3} value={draft.seo_keywords} onChange={(value) => setDraft((current) => ({ ...current, seo_keywords: value }))} />
            <MediaField label="Social preview image" mediaKind="image" value={draft.og_image_url} onChange={(value) => setDraft((current) => ({ ...current, og_image_url: value }))} />
          </div>
        </section>
      )}

      {editorTab === "publish" && (
        <section className="panelCard publishPanel">
          <PanelHeader title="Publishing" subtitle="Draft pages are saved in the manager. Published pages are allowed to appear on the public website." />
          <div className={page.status === "published" ? "publishState live" : "publishState draft"}>
            <CheckCircle2 size={20} aria-hidden="true" />
            <div>
              <strong>{page.status === "published" ? "This page is live." : "This page is not live yet."}</strong>
              <span>{page.status === "published" ? "Visitors can see this page if it is linked from the website." : "Save changes safely, then publish when it is ready for visitors."}</span>
            </div>
          </div>
          <div className="publishActions">
            <span className={statusClass(page.status)}>{pageStatusText(page.status)}</span>
            <button className="secondaryButton" disabled={saving} type="button" onClick={togglePublish}>
              {page.status === "published" ? "Unpublish page" : "Publish page"}
            </button>
            <button className="primaryButton" disabled={saving} type="button" onClick={() => savePage("published")}>
              Save and publish
            </button>
          </div>
          <div className="publishActions" style={{ marginTop: 18 }}>
            <button className="dangerButton" disabled={saving} type="button" onClick={removePage}>
              <Trash2 size={16} aria-hidden="true" /> Delete page
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

function CreateSectionPanel({ compact = false, onRefresh, page, setNotice }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({
    section_key: "",
    type: "cards",
    title: "",
    subtitle: "",
    summary: "",
    body: "",
  });
  const [saving, setSaving] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setNotice(emptyNotice);
    try {
      await createSection(page.id, {
        ...draft,
        section_key: draft.section_key || draft.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
        order: page.sections.length,
        is_visible: true,
        settings: {},
      });
      setDraft({ section_key: "", type: "cards", title: "", subtitle: "", summary: "", body: "" });
      setOpen(false);
      await onRefresh();
      setNotice({ type: "success", text: "Content section added." });
    } catch (error) {
      setNotice({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className={compact ? "sectionCreatePanel compactSectionCreate" : "panelCard sectionCreatePanel"}>
      {!compact && (
        <div className="sectionCreateHeader">
          <PanelHeader title="Add content section" subtitle="Create a new editable area for this page." />
          <button className="secondaryButton compactButton" type="button" onClick={() => setOpen((value) => !value)}>
            <PlusSquare size={16} aria-hidden="true" /> {open ? "Close" : "Section"}
          </button>
        </div>
      )}
      {compact && (
        <button className="secondaryButton compactButton" type="button" onClick={() => setOpen((value) => !value)}>
          <PlusSquare size={16} aria-hidden="true" /> {open ? "Close" : "Add section"}
        </button>
      )}
      {open && (
        <form className={compact ? "createForm wide compactItemForm" : "createForm wide"} onSubmit={submit}>
          <div className="formGrid two">
            <TextField label="Section key" help="Example: hero, services, process, contact." value={draft.section_key} onChange={(value) => setDraft((current) => ({ ...current, section_key: value }))} />
            <label>
              Section type
              <select value={draft.type} onChange={(event) => setDraft((current) => ({ ...current, type: event.target.value }))}>
                {sectionTypes.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
              </select>
            </label>
            <TextField label="Title" required value={draft.title} onChange={(value) => setDraft((current) => ({ ...current, title: value }))} />
            <TextField label="Small label" value={draft.subtitle} onChange={(value) => setDraft((current) => ({ ...current, subtitle: value }))} />
          </div>
          <TextArea label="Short description" rows={3} value={draft.summary} onChange={(value) => setDraft((current) => ({ ...current, summary: value }))} />
          <TextArea label="Main text" rows={4} value={draft.body} onChange={(value) => setDraft((current) => ({ ...current, body: value }))} />
          <div className="formActions">
            <button className="primaryButton" disabled={saving} type="submit">
              <PlusSquare size={16} aria-hidden="true" /> Add section
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

function ContentAreaEditor({ canMoveDown, canMoveUp, onMoveDown, onMoveUp, onRefresh, section, setNotice }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(() => ({
    title: section.title || "",
    subtitle: section.subtitle || "",
    summary: section.summary || "",
    body: section.body || "",
    is_visible: Boolean(section.is_visible),
  }));
  const [sectionSettings, setSectionSettings] = useState(() => section.settings || {});
  const [settingsJson, setSettingsJson] = useState(() => JSON.stringify(section.settings || {}, null, 2));
  const [settingsExpanded, setSettingsExpanded] = useState(false);
  const [saving, setSaving] = useState(false);

  const fieldConfig = sectionFieldConfig(section);
  const presetFields = SECTION_SETTING_PRESETS[section.type] || [];

  useEffect(() => {
    setDraft({
      title: section.title || "",
      subtitle: section.subtitle || "",
      summary: section.summary || "",
      body: section.body || "",
      is_visible: Boolean(section.is_visible),
    });
    setSectionSettings(section.settings || {});
    setSettingsJson(JSON.stringify(section.settings || {}, null, 2));
  }, [section.id, section.updated_at]);

  function updatePresetSetting(key, value) {
    const next = { ...sectionSettings, [key]: value };
    if (!value) delete next[key];
    setSectionSettings(next);
    setSettingsJson(JSON.stringify(next, null, 2));
  }

  async function saveSectionSettings(nextSettings) {
    setSaving(true);
    setNotice(emptyNotice);
    try {
      await updateSection(section.id, { settings: nextSettings });
      await onRefresh();
      setNotice({ type: "success", text: "Section settings saved." });
    } catch (error) {
      setNotice({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  }

  async function savePresetSettings() {
    await saveSectionSettings(sectionSettings);
  }

  async function saveRawSettings() {
    let parsed;
    try {
      parsed = settingsJson.trim() ? JSON.parse(settingsJson) : {};
    } catch (err) {
      setNotice({ type: "error", text: `Settings must be valid JSON: ${err.message}` });
      return;
    }
    setSectionSettings(parsed);
    await saveSectionSettings(parsed);
  }

  async function saveSection() {
    setSaving(true);
    setNotice(emptyNotice);
    try {
      await updateSection(section.id, {
        title: draft.title,
        subtitle: draft.subtitle,
        summary: draft.summary,
        body: draft.body,
        is_visible: draft.is_visible,
      });
      await onRefresh();
      setNotice({ type: "success", text: "Section saved." });
    } catch (error) {
      setNotice({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  }

  async function removeSection() {
    if (section.type === "hero") {
      setNotice({ type: "error", text: "The hero section cannot be removed. You can hide it instead." });
      return;
    }
    if (!window.confirm("Remove this section from the page? This cannot be undone.")) return;
    setSaving(true);
    setNotice(emptyNotice);
    try {
      await deleteSection(section.id);
      await onRefresh();
      setNotice({ type: "success", text: "Section removed." });
    } catch (error) {
      setNotice({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  }

  async function moveBlock(blockId, direction) {
    const ids = section.blocks.map((block) => block.id);
    const index = ids.indexOf(blockId);
    const targetIndex = index + direction;
    if (index < 0 || targetIndex < 0 || targetIndex >= ids.length) return;
    [ids[index], ids[targetIndex]] = [ids[targetIndex], ids[index]];
    setNotice(emptyNotice);
    try {
      await reorderBlocks(section.id, ids);
      await onRefresh();
    } catch (error) {
      setNotice({ type: "error", text: error.message });
    }
  }

  // eyebrow = section.subtitle (the small uppercase label shown above the title in the frontend)
  const eyebrow = section.subtitle || "";
  const heading = section.title || labelFromKey(section.section_key);
  const blocksLabel = sectionBlocksLabel(section.type, section);
  const defaultBlockConfig = BLOCK_FIELD_CONFIG[SECTION_DEFAULT_BLOCK[section.type] || "card"] || BLOCK_FIELD_CONFIG.card;

  return (
    <article className="panelCard contentArea">
      <div className="areaHeader">
        <button className="areaHeaderMain" type="button" onClick={() => setOpen((v) => !v)}>
          <span className="sectionHandle">{(section.section_key || section.type || "").slice(0, 2).toUpperCase()}</span>
          <span>
            {eyebrow && <small className="eyebrow" style={{ color: "var(--gold)", fontWeight: 900, display: "block", marginBottom: "2px" }}>{eyebrow}</small>}
            <strong>{heading}</strong>
            <small>{section.type} · {section.blocks.length} {blocksLabel.toLowerCase()} · {section.is_visible ? "Visible" : "Hidden"}</small>
          </span>
        </button>
        <span className="headerActions">
          <button className="iconMiniButton" disabled={!canMoveUp} type="button" onClick={onMoveUp} aria-label="Move section up">
            <ArrowUp size={14} aria-hidden="true" />
          </button>
          <button className="iconMiniButton" disabled={!canMoveDown} type="button" onClick={onMoveDown} aria-label="Move section down">
            <ArrowDown size={14} aria-hidden="true" />
          </button>
          <button className="iconMiniButton" type="button" onClick={() => setOpen((v) => !v)}>
            <ChevronRight className={open ? "rotate" : ""} size={16} aria-hidden="true" />
          </button>
        </span>
      </div>

      {open && (
        <div className="areaBody">
          <div className="formGrid">
            {"subtitle" in fieldConfig && (
              <TextField
                label={fieldConfig.subtitle}
                value={draft.subtitle}
                onBlur={saveSection}
                onChange={(v) => setDraft((d) => ({ ...d, subtitle: v }))}
              />
            )}
            {"title" in fieldConfig && (
              <TextField
                label={fieldConfig.title}
                value={draft.title}
                onBlur={saveSection}
                onChange={(v) => setDraft((d) => ({ ...d, title: v }))}
              />
            )}
            {"summary" in fieldConfig && (
              <TextArea
                label={fieldConfig.summary}
                rows={3}
                value={draft.summary}
                onBlur={saveSection}
                onChange={(v) => setDraft((d) => ({ ...d, summary: v }))}
              />
            )}
            {"body" in fieldConfig && (
              <TextArea
                label={fieldConfig.body}
                rows={section.type === "rich_text" ? 12 : 4}
                value={draft.body}
                onBlur={saveSection}
                onChange={(v) => setDraft((d) => ({ ...d, body: v }))}
              />
            )}
          </div>

          <label className="checkboxRow">
            <input
              checked={draft.is_visible}
              type="checkbox"
              onChange={(e) => {
                const next = { ...draft, is_visible: e.target.checked };
                setDraft(next);
                updateSection(section.id, { is_visible: e.target.checked })
                  .then(() => onRefresh())
                  .catch((err) => setNotice({ type: "error", text: err.message }));
              }}
            />
            Show this section on the website
          </label>

          <div className="buttonRow">
            <button className="secondaryButton compactButton" disabled={saving} type="button" onClick={saveSection}>
              <Save size={16} aria-hidden="true" /> Save section
            </button>
            {section.type !== "hero" && (
              <button className="dangerButton compactButton" disabled={saving} type="button" onClick={removeSection}>
                <Trash2 size={16} aria-hidden="true" /> Remove section
              </button>
            )}
          </div>

          <details className="advancedSettings" open={settingsExpanded} onToggle={(event) => setSettingsExpanded(event.target.open)}>
            <summary>Section media &amp; advanced settings</summary>
            {presetFields.length > 0 && (
              <div className="formGrid">
                {presetFields.map((field) => (
                  <MediaField
                    key={field.key}
                    label={field.label}
                    mediaKind={field.mediaKind}
                    value={sectionSettings[field.key] || ""}
                    onChange={(value) => updatePresetSetting(field.key, value)}
                  />
                ))}
                <div className="buttonRow">
                  <button className="secondaryButton compactButton" disabled={saving} type="button" onClick={savePresetSettings}>
                    <Save size={14} aria-hidden="true" /> Save media
                  </button>
                </div>
              </div>
            )}
            <TextArea
              label="Raw settings JSON"
              rows={6}
              value={settingsJson}
              onChange={setSettingsJson}
              help="Edit the raw JSON for advanced per-section settings. The media fields above are stored here too."
            />
            <div className="buttonRow">
              <button className="secondaryButton compactButton" disabled={saving} type="button" onClick={saveRawSettings}>
                <Save size={14} aria-hidden="true" /> Save JSON
              </button>
            </div>
          </details>

          <div className="cardsEditor">
            <div className="cardsEditorHeader">
              <PanelHeader title={blocksLabel} subtitle={`${section.blocks.length} item${section.blocks.length === 1 ? "" : "s"}`} />
              <SmartCreateBlockPanel onRefresh={onRefresh} section={section} setNotice={setNotice} />
            </div>
            {section.blocks.length > 0 ? (
              section.blocks.map((block, index) => (
                <SmartBlockEditor
                  block={block}
                  canMoveDown={index < section.blocks.length - 1}
                  canMoveUp={index > 0}
                  key={block.id}
                  onMoveDown={() => moveBlock(block.id, 1)}
                  onMoveUp={() => moveBlock(block.id, -1)}
                  onRefresh={onRefresh}
                  section={section}
                  setNotice={setNotice}
                />
              ))
            ) : (
              <EmptyState
                title={`No ${blocksLabel.toLowerCase()} yet.`}
                text={`Add a ${defaultBlockConfig.label.toLowerCase()} to this section.`}
              />
            )}
          </div>
        </div>
      )}
    </article>
  );
}

function emptyBlockDraft() {
  return { title: "", subtitle: "", body: "", href: "", icon: "", image_url: "", video_url: "" };
}

function renderBlockField(field, draft, setDraft) {
  const value = draft[field.field] || "";
  const update = (v) => setDraft((d) => ({ ...d, [field.field]: v }));
  if (field.mediaKind) {
    return (
      <MediaField
        key={field.field}
        label={field.label}
        mediaKind={field.mediaKind}
        value={value}
        onChange={update}
      />
    );
  }
  if (field.rows) {
    return <TextArea key={field.field} label={field.label} rows={field.rows} value={value} onChange={update} />;
  }
  return <TextField key={field.field} label={field.label} value={value} onChange={update} />;
}

function SmartCreateBlockPanel({ onRefresh, section, setNotice }) {
  const defaultType = SECTION_DEFAULT_BLOCK[section.type] || "card";
  const validTypes = sectionBlockTypes(section.type);
  const [open, setOpen] = useState(false);
  const [blockType, setBlockType] = useState(defaultType);
  const [draft, setDraft] = useState(emptyBlockDraft);
  const [saving, setSaving] = useState(false);

  const config = blockFieldConfig(blockType, section);

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setNotice(emptyNotice);
    try {
      await createBlock(section.id, {
        type: blockType,
        title: draft.title,
        subtitle: draft.subtitle,
        body: draft.body,
        href: draft.href,
        icon: draft.icon,
        image_url: draft.image_url,
        video_url: draft.video_url,
        block_key: (draft.title || blockType).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `block-${Date.now()}`,
        order: section.blocks.length,
        is_visible: true,
        settings: {},
      });
      setDraft(emptyBlockDraft());
      setOpen(false);
      await onRefresh();
      setNotice({ type: "success", text: `${config.label} added.` });
    } catch (error) {
      setNotice({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="compactSectionCreate">
      <button className="secondaryButton compactButton" type="button" onClick={() => setOpen((v) => !v)}>
        <PlusSquare size={16} aria-hidden="true" /> {open ? "Close" : `Add ${config.label}`}
      </button>
      {open && (
        <form className="createForm wide compactItemForm" onSubmit={submit}>
          {validTypes.length > 1 && (
            <label>
              Item type
              <select value={blockType} onChange={(e) => { setBlockType(e.target.value); setDraft(emptyBlockDraft()); }}>
                {validTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </label>
          )}
          {config.layout.map((f) => renderBlockField(f, draft, setDraft))}
          <div className="formActions">
            <button className="primaryButton" disabled={saving} type="submit">
              <PlusSquare size={16} aria-hidden="true" /> Add {config.label}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function SmartBlockEditor({ block, canMoveDown, canMoveUp, onMoveDown, onMoveUp, onRefresh, section, setNotice }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(() => ({
    title: block.title || "",
    subtitle: block.subtitle || "",
    body: block.body || "",
    href: block.href || "",
    icon: block.icon || "",
    image_url: block.image_url || "",
    video_url: block.video_url || "",
    is_visible: Boolean(block.is_visible),
  }));
  const [settingsJson, setSettingsJson] = useState(() => JSON.stringify(block.settings || {}, null, 2));
  const [saving, setSaving] = useState(false);

  const config = blockFieldConfig(block.type, section);

  useEffect(() => {
    setDraft({
      title: block.title || "",
      subtitle: block.subtitle || "",
      body: block.body || "",
      href: block.href || "",
      icon: block.icon || "",
      image_url: block.image_url || "",
      video_url: block.video_url || "",
      is_visible: Boolean(block.is_visible),
    });
    setSettingsJson(JSON.stringify(block.settings || {}, null, 2));
  }, [block.id, block.updated_at]);

  async function saveBlock() {
    setSaving(true);
    setNotice(emptyNotice);
    try {
      let parsedSettings;
      try {
        parsedSettings = settingsJson.trim() ? JSON.parse(settingsJson) : {};
      } catch (err) {
        setNotice({ type: "error", text: `Advanced settings must be valid JSON: ${err.message}` });
        setSaving(false);
        return;
      }
      await updateBlock(block.id, {
        title: draft.title,
        subtitle: draft.subtitle,
        body: draft.body,
        href: draft.href,
        icon: draft.icon,
        image_url: draft.image_url,
        video_url: draft.video_url,
        is_visible: draft.is_visible,
        settings: parsedSettings,
      });
      await onRefresh();
      setNotice({ type: "success", text: `${draft.title || config.label} saved.` });
    } catch (error) {
      setNotice({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  }

  async function removeBlock() {
    if (!window.confirm(`Remove "${draft.title || config.label}"? This cannot be undone.`)) return;
    setSaving(true);
    setNotice(emptyNotice);
    try {
      await deleteBlock(block.id);
      await onRefresh();
      setNotice({ type: "success", text: `${config.label} removed.` });
    } catch (error) {
      setNotice({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <article className="contentItem">
      <div className="itemHeader">
        <button className="itemHeaderButton" type="button" onClick={() => setOpen((v) => !v)}>
          <span>
            <strong>{block.title || `${config.label} ${(block.order ?? 0) + 1}`}</strong>
            <small>{config.label} · {block.is_visible ? "Visible" : "Hidden"}</small>
          </span>
          <Pencil size={16} aria-hidden="true" />
        </button>
        <button className="iconDangerButton" disabled={saving} type="button" onClick={removeBlock} aria-label="Remove">
          <Trash2 size={15} aria-hidden="true" />
        </button>
        <button className="iconMiniButton" disabled={!canMoveUp || saving} type="button" onClick={onMoveUp} aria-label="Move up">
          <ArrowUp size={14} aria-hidden="true" />
        </button>
        <button className="iconMiniButton" disabled={!canMoveDown || saving} type="button" onClick={onMoveDown} aria-label="Move down">
          <ArrowDown size={14} aria-hidden="true" />
        </button>
      </div>
      {open && (
        <div className="itemBody">
          {config.layout.map((f) => {
            if (f.mediaKind) {
              return (
                <MediaField
                  key={f.field}
                  label={f.label}
                  mediaKind={f.mediaKind}
                  value={draft[f.field] || ""}
                  onChange={(v) => setDraft((d) => ({ ...d, [f.field]: v }))}
                />
              );
            }
            return f.rows ? (
              <TextArea
                key={f.field}
                label={f.label}
                rows={f.rows}
                value={draft[f.field] || ""}
                onBlur={saveBlock}
                onChange={(v) => setDraft((d) => ({ ...d, [f.field]: v }))}
              />
            ) : (
              <TextField
                key={f.field}
                label={f.label}
                value={draft[f.field] || ""}
                onBlur={saveBlock}
                onChange={(v) => setDraft((d) => ({ ...d, [f.field]: v }))}
              />
            );
          })}
          <details className="advancedSettings">
            <summary>Advanced settings (JSON)</summary>
            <TextArea
              label="settings"
              rows={6}
              value={settingsJson}
              onChange={setSettingsJson}
              help={'Free-form JSON, e.g. {"price": "OMR 125K", "beds": 3}'}
            />
          </details>
          <label className="checkboxRow">
            <input
              checked={draft.is_visible}
              type="checkbox"
              onChange={(e) => setDraft((d) => ({ ...d, is_visible: e.target.checked }))}
            />
            Show on website
          </label>
          <div className="buttonRow">
            <button className="secondaryButton compactButton" disabled={saving} type="button" onClick={saveBlock}>
              <Save size={16} aria-hidden="true" /> Save
            </button>
            <button className="dangerButton compactButton" disabled={saving} type="button" onClick={removeBlock}>
              <Trash2 size={16} aria-hidden="true" /> Remove
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

function MessagesScreen({ fixedSite = "", setNotice, sites }) {
  const [filters, setFilters] = useState(() => ({ search: "", site: fixedSite, status: "" }));
  const [inquiries, setInquiries] = useState([]);
  const [selectedInquiryId, setSelectedInquiryId] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedInquiry = useMemo(
    () => inquiries.find((inquiry) => String(inquiry.id) === String(selectedInquiryId)) || null,
    [inquiries, selectedInquiryId],
  );

  useEffect(() => {
    setFilters((current) => ({ ...current, site: fixedSite }));
  }, [fixedSite]);

  useEffect(() => {
    refresh();
  }, [filters.site, filters.status]);

  async function refresh(nextFilters = filters) {
    setLoading(true);
    setNotice(emptyNotice);
    try {
      const data = await listInquiries({ ...nextFilters, search: "" });
      const search = nextFilters.search.trim().toLowerCase();
      const filtered = search
        ? data.filter((inquiry) => (
            `${inquiry.name || ""} ${inquiry.email || ""} ${inquiry.phone || ""} ${inquiry.company || ""}`
              .toLowerCase()
              .includes(search)
          ))
        : data;
      setInquiries(filtered);
      setSelectedInquiryId((current) => {
        if (filtered.some((inquiry) => String(inquiry.id) === String(current))) return current;
        return filtered[0]?.id || "";
      });
    } catch (error) {
      setNotice({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  }

  function updateFilter(key, value) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function submitSearch(event) {
    event.preventDefault();
    refresh(filters);
  }

  return (
    <section className="messagesPanel">
      <aside className="messageListPanel">
        <PanelHeader title={fixedSite ? "Website messages" : "All messages"} subtitle="Review requests from all contact forms." />
        <form className="filters" onSubmit={submitSearch}>
          <div className="searchBox">
            <Search size={16} aria-hidden="true" />
            <input
              aria-label="Search messages"
              placeholder="Search name, email, phone, or company"
              value={filters.search}
              onChange={(event) => updateFilter("search", event.target.value)}
            />
          </div>
          {!fixedSite && (
            <label>
              Website
              <select value={filters.site} onChange={(event) => updateFilter("site", event.target.value)}>
                <option value="">All websites</option>
                {sites.map((site) => (
                  <option key={site.key} value={site.key}>{displaySite(site)}</option>
                ))}
              </select>
            </label>
          )}
          <label>
            Status
            <select value={filters.status} onChange={(event) => updateFilter("status", event.target.value)}>
              <option value="">All statuses</option>
              {inquiryStatuses.map((status) => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </label>
          <button className="secondaryButton" type="submit">
            <Search size={16} aria-hidden="true" /> Search
          </button>
        </form>
        {loading && <div className="inlineLoading">Loading messages...</div>}
        <div className="messageList">
          {inquiries.map((inquiry) => (
            <button
              className={String(inquiry.id) === String(selectedInquiryId) ? "messageButton active" : "messageButton"}
              key={inquiry.id}
              type="button"
              onClick={() => setSelectedInquiryId(inquiry.id)}
            >
              <span>{inquiry.name}</span>
              <small>{inquiry.email}</small>
              <small>{inquiry.site_name || inquiry.site_key}</small>
              <em className={statusClass(inquiry.status)}>{statusLabel(inquiry.status)}</em>
            </button>
          ))}
          {!inquiries.length && !loading && (
            <EmptyState title="No messages found." text="Try changing the website, status, or search term. New website form submissions will appear here." />
          )}
        </div>
      </aside>

      <section className="messageDetailPanel">
        {selectedInquiry ? (
          <MessageDetail inquiry={selectedInquiry} onRefresh={() => refresh(filters)} setNotice={setNotice} />
        ) : (
          <EmptyState title="Select a message to view details." text="Choose a visitor message from the list to see contact details, request text, and follow-up status." />
        )}
      </section>
    </section>
  );
}

function MessageDetail({ inquiry, onRefresh, setNotice }) {
  const [statusValue, setStatusValue] = useState(inquiry.status);
  const [saving, setSaving] = useState(false);
  const noteKey = `rezaei-note-${inquiry.id}`;
  const [note, setNote] = useState(() => localStorage.getItem(noteKey) || "");

  useEffect(() => {
    setStatusValue(inquiry.status);
    setNote(localStorage.getItem(`rezaei-note-${inquiry.id}`) || "");
  }, [inquiry.id, inquiry.status]);

  async function saveStatus() {
    setSaving(true);
    setNotice(emptyNotice);
    try {
      await updateInquiry(inquiry.id, { status: statusValue });
      localStorage.setItem(noteKey, note);
      await onRefresh();
      setNotice({ type: "success", text: "Message updated." });
    } catch (error) {
      setNotice({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="screenStack">
      <div className="editorHeader">
        <div>
          <p className="eyebrow">Visitor message</p>
          <h2>{inquiry.subject || inquiry.name}</h2>
          <div className="metaRow">
            <span className="badge">{inquiry.site_name || inquiry.site_key}</span>
            <span className={statusClass(inquiry.status)}>{statusLabel(inquiry.status)}</span>
          </div>
        </div>
        <div className="buttonRow">
          <label className="compactSelect">
            Status
            <select value={statusValue} onChange={(event) => setStatusValue(event.target.value)}>
              {inquiryStatuses.map((status) => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </label>
          <button className="primaryButton" disabled={saving} type="button" onClick={saveStatus}>
            Save follow-up status
          </button>
        </div>
      </div>

      <article className="contactSummary">
        <div>
          <Mail size={18} aria-hidden="true" />
          <span>Email</span>
          <strong>{inquiry.email}</strong>
        </div>
        <div>
          <Phone size={18} aria-hidden="true" />
          <span>Phone</span>
          <strong>{inquiry.phone || "Not provided"}</strong>
        </div>
        <div>
          <Globe2 size={18} aria-hidden="true" />
          <span>Website</span>
          <strong>{inquiry.site_name || inquiry.site_key}</strong>
        </div>
      </article>

      <div className="detailGrid">
        <DetailRow label="Name" value={inquiry.name} />
        <DetailRow label="Email" value={inquiry.email} />
        <DetailRow label="Phone" value={inquiry.phone || "-"} />
        <DetailRow label="Company" value={inquiry.company || "-"} />
        <DetailRow label="Country" value={inquiry.country || "-"} />
        <DetailRow label="Page" value={inquiry.page_slug || "-"} />
        <DetailRow label="Received" value={new Date(inquiry.created_at).toLocaleString()} />
      </div>

      <article className="panelCard">
        <PanelHeader title="Visitor message" />
        <p className="messageText">{inquiry.message}</p>
      </article>

      <article className="panelCard">
        <PanelHeader title="Private follow-up note" subtitle="This note is private to this browser in Phase 1. Use it for quick reminders only." />
        <TextArea label="Note" rows={5} value={note} onChange={setNote} />
      </article>
    </div>
  );
}

function GlobalSettingsScreen({ activeLocale, onLocaleChange, selectedSite, setNotice, sites }) {
  const [activeSiteId, setActiveSiteId] = useState(selectedSite?.id || sites[0]?.id || "");
  const activeSite = sites.find((site) => String(site.id) === String(activeSiteId)) || selectedSite || sites[0];

  useEffect(() => {
    if (!activeSiteId && sites[0]?.id) setActiveSiteId(sites[0].id);
  }, [activeSiteId, sites]);

  if (!activeSite) return <EmptyState title="No website selected." text="Choose a website from the left menu to edit its contact details and navigation labels." />;

  return (
    <section className="screenStack">
      <div className="panelCard">
        <PanelHeader title="Website settings" subtitle="Choose a website, then edit its contact details and menu labels." />
        <label className="compactSelect">
          Website
          <select value={activeSiteId} onChange={(event) => setActiveSiteId(event.target.value)}>
            {sites.map((site) => (
              <option key={site.id} value={site.id}>{displaySite(site)}</option>
            ))}
          </select>
        </label>
      </div>
      <SiteSettingsScreen
        activeLocale={activeLocale}
        onLocaleChange={onLocaleChange}
        selectedSite={activeSite}
        setNotice={setNotice}
        showNavigation
      />
    </section>
  );
}

function SiteSettingsScreen({ activeLocale, onLocaleChange, selectedSite, setNotice, showNavigation = true }) {
  const [settingsTab, setSettingsTab] = useState("contact");
  const [settings, setSettings] = useState(null);
  const [draft, setDraft] = useState(null);
  const [extra, setExtra] = useState({});
  const [extraJson, setExtraJson] = useState("{}");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    refresh();
  }, [selectedSite.id]);

  async function refresh() {
    setNotice(emptyNotice);
    try {
      const data = await getSiteSettings(selectedSite.id);
      setSettings(data);
      setDraft({
        contact_email: data.contact_email || "",
        contact_phone: data.contact_phone || "",
        contact_address: data.contact_address || "",
        whatsapp: data.whatsapp || "",
        footer_text: data.footer_text || "",
      });
      const sub = data.settings && typeof data.settings === "object" ? data.settings : {};
      setExtra(sub);
      setExtraJson(JSON.stringify(sub, null, 2));
    } catch (error) {
      setNotice({ type: "error", text: error.message });
    }
  }

  async function saveSettings(nextExtra = extra) {
    setSaving(true);
    setNotice(emptyNotice);
    try {
      await updateSiteSettings(selectedSite.id, {
        contact_email: draft.contact_email,
        contact_phone: draft.contact_phone,
        contact_address: draft.contact_address,
        whatsapp: draft.whatsapp,
        footer_text: draft.footer_text,
        settings: nextExtra,
      });
      await refresh();
      setNotice({ type: "success", text: "Website settings saved." });
    } catch (error) {
      setNotice({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  }

  function setExtraField(key, value) {
    const next = { ...extra };
    if (value === "" || value === null || value === undefined) delete next[key];
    else next[key] = value;
    setExtra(next);
    setExtraJson(JSON.stringify(next, null, 2));
  }

  function setExtraGroupSiteUrl(key, value) {
    const groupSiteUrls = { ...(extra.group_site_urls || {}) };
    if (value) groupSiteUrls[key] = value;
    else delete groupSiteUrls[key];
    const next = { ...extra };
    if (Object.keys(groupSiteUrls).length) next.group_site_urls = groupSiteUrls;
    else delete next.group_site_urls;
    setExtra(next);
    setExtraJson(JSON.stringify(next, null, 2));
  }

  function setUiString(key, locale, value) {
    const uiStrings = { ...(extra.ui_strings || {}) };
    const stringEntry = { ...(uiStrings[key] || {}) };
    if (value) stringEntry[locale] = value;
    else delete stringEntry[locale];
    if (Object.keys(stringEntry).length) uiStrings[key] = stringEntry;
    else delete uiStrings[key];
    const next = { ...extra };
    if (Object.keys(uiStrings).length) next.ui_strings = uiStrings;
    else delete next.ui_strings;
    setExtra(next);
    setExtraJson(JSON.stringify(next, null, 2));
  }

  function setFooterLocale(locale, value) {
    const map = { ...(extra.footer_text_by_locale || {}) };
    if (value) map[locale] = value;
    else delete map[locale];
    const next = { ...extra };
    if (Object.keys(map).length) next.footer_text_by_locale = map;
    else delete next.footer_text_by_locale;
    setExtra(next);
    setExtraJson(JSON.stringify(next, null, 2));
  }

  async function saveJsonTab() {
    let parsed;
    try {
      parsed = extraJson.trim() ? JSON.parse(extraJson) : {};
    } catch (err) {
      setNotice({ type: "error", text: `Settings JSON must be valid: ${err.message}` });
      return;
    }
    setExtra(parsed);
    await saveSettings(parsed);
  }

  if (!settings || !draft) return <div className="inlineLoading">Loading settings...</div>;

  const tabs = [
    { id: "contact", label: "Contact" },
    { id: "brand", label: "Brand & media" },
    { id: "links", label: "Group links" },
    { id: "strings", label: "UI strings" },
    { id: "footer", label: "Footer per language" },
    { id: "json", label: "Advanced JSON" },
  ];

  return (
    <div className="screenStack">
      <section className="panelCard">
        <div className="editorHeader">
          <PanelHeader
            title={`${displaySite(selectedSite)} settings`}
            subtitle="Contact details, brand, hero media, group links, and per-language UI strings."
          />
          <button className="primaryButton" disabled={saving} type="button" onClick={() => saveSettings()}>
            <Save size={16} aria-hidden="true" /> Save settings
          </button>
        </div>
        <div className="editorTabs" role="tablist" aria-label="Settings tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={settingsTab === tab.id ? "subNavItem active" : "subNavItem"}
              onClick={() => setSettingsTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {settingsTab === "contact" && (
          <>
            <div className="formGrid two">
              <TextField label="Contact email" value={draft.contact_email} onChange={(value) => setDraft((current) => ({ ...current, contact_email: value }))} />
              <TextField label="Contact phone" value={draft.contact_phone} onChange={(value) => setDraft((current) => ({ ...current, contact_phone: value }))} />
              <TextField label="WhatsApp" value={draft.whatsapp} onChange={(value) => setDraft((current) => ({ ...current, whatsapp: value }))} />
            </div>
            <TextArea label="Address" rows={3} value={draft.contact_address} onChange={(value) => setDraft((current) => ({ ...current, contact_address: value }))} />
            <TextArea label="Footer text (default language)" rows={3} value={draft.footer_text} onChange={(value) => setDraft((current) => ({ ...current, footer_text: value }))} />
          </>
        )}

        {settingsTab === "brand" && (
          <div className="screenStack">
            <PanelHeader title="Brand assets" subtitle="Logos, favicon, and colors used by the website chrome and social previews." />
            <div className="formGrid two">
              {BRAND_SETTING_FIELDS.map((field) =>
                field.mediaKind ? (
                  <MediaField
                    key={field.key}
                    label={field.label}
                    mediaKind={field.mediaKind}
                    value={extra[field.key] || ""}
                    onChange={(value) => setExtraField(field.key, value)}
                  />
                ) : (
                  <TextField
                    key={field.key}
                    label={field.label}
                    value={extra[field.key] || ""}
                    onChange={(value) => setExtraField(field.key, value)}
                  />
                ),
              )}
            </div>
            <PanelHeader title="Hero media" subtitle="Default hero video and poster. Individual pages can override via section settings." />
            <div className="formGrid two">
              {HERO_SETTING_FIELDS.map((field) => (
                <MediaField
                  key={field.key}
                  label={field.label}
                  mediaKind={field.mediaKind}
                  value={extra[field.key] || ""}
                  onChange={(value) => setExtraField(field.key, value)}
                />
              ))}
            </div>
            <div className="buttonRow">
              <button className="primaryButton" disabled={saving} type="button" onClick={() => saveSettings()}>
                <Save size={16} aria-hidden="true" /> Save brand & media
              </button>
            </div>
          </div>
        )}

        {settingsTab === "links" && (
          <div className="screenStack">
            <PanelHeader title="Group site URLs" subtitle="Cross-links between the holding, real-estate, finance, and visa sites." />
            <div className="formGrid two">
              {GROUP_SITE_KEYS.map((entry) => (
                <TextField
                  key={entry.key}
                  label={`${entry.label} URL`}
                  value={(extra.group_site_urls && extra.group_site_urls[entry.key]) || ""}
                  onChange={(value) => setExtraGroupSiteUrl(entry.key, value)}
                />
              ))}
            </div>
            <PanelHeader title="Other tags" subtitle="Areas of service for structured data." />
            <TextField
              label="Area served (comma-separated)"
              value={Array.isArray(extra.area_served) ? extra.area_served.join(", ") : extra.area_served || ""}
              onChange={(value) =>
                setExtraField(
                  "area_served",
                  value ? value.split(",").map((part) => part.trim()).filter(Boolean) : "",
                )
              }
            />
            <div className="buttonRow">
              <button className="primaryButton" disabled={saving} type="button" onClick={() => saveSettings()}>
                <Save size={16} aria-hidden="true" /> Save links
              </button>
            </div>
          </div>
        )}

        {settingsTab === "strings" && (
          <div className="screenStack">
            <PanelHeader
              title="Per-language UI strings"
              subtitle="Short labels and toasts shown across the website chrome (form labels, success/error toasts, footer notes, CTA labels)."
            />
            {UI_STRING_KEYS.map((entry) => (
              <article className="panelCard" key={entry.key} style={{ padding: 16 }}>
                <PanelHeader title={entry.label} subtitle={`Key: ${entry.key}`} />
                <div className="formGrid two">
                  {languages.map((language) =>
                    entry.rows ? (
                      <TextArea
                        key={language.code}
                        label={`${language.label} (${language.code.toUpperCase()})`}
                        rows={entry.rows}
                        value={(extra.ui_strings && extra.ui_strings[entry.key] && extra.ui_strings[entry.key][language.code]) || ""}
                        onChange={(value) => setUiString(entry.key, language.code, value)}
                      />
                    ) : (
                      <TextField
                        key={language.code}
                        label={`${language.label} (${language.code.toUpperCase()})`}
                        value={(extra.ui_strings && extra.ui_strings[entry.key] && extra.ui_strings[entry.key][language.code]) || ""}
                        onChange={(value) => setUiString(entry.key, language.code, value)}
                      />
                    ),
                  )}
                </div>
              </article>
            ))}
            <div className="buttonRow">
              <button className="primaryButton" disabled={saving} type="button" onClick={() => saveSettings()}>
                <Save size={16} aria-hidden="true" /> Save UI strings
              </button>
            </div>
          </div>
        )}

        {settingsTab === "footer" && (
          <div className="screenStack">
            <PanelHeader
              title="Footer text per language"
              subtitle="Optional translated footer paragraphs. Leave empty to use the default (Contact tab)."
            />
            <div className="formGrid">
              {languages.map((language) => (
                <TextArea
                  key={language.code}
                  label={`${language.label} (${language.code.toUpperCase()})`}
                  rows={3}
                  value={(extra.footer_text_by_locale && extra.footer_text_by_locale[language.code]) || ""}
                  onChange={(value) => setFooterLocale(language.code, value)}
                />
              ))}
            </div>
            <div className="buttonRow">
              <button className="primaryButton" disabled={saving} type="button" onClick={() => saveSettings()}>
                <Save size={16} aria-hidden="true" /> Save footers
              </button>
            </div>
          </div>
        )}

        {settingsTab === "json" && (
          <div className="screenStack">
            <PanelHeader
              title="Advanced settings JSON"
              subtitle="Free-form JSON stored at SiteSetting.settings. Use this for fields not exposed by the other tabs. Be careful — invalid JSON cannot be saved."
            />
            <TextArea
              label="settings"
              rows={20}
              value={extraJson}
              onChange={setExtraJson}
              help="Convention keys include brand_logo_wide, brand_logo_stacked, favicon_url, brand_color, hero_video, hero_poster, group_site_urls, area_served, ui_strings, footer_text_by_locale."
            />
            <div className="buttonRow">
              <button className="primaryButton" disabled={saving} type="button" onClick={saveJsonTab}>
                <Save size={16} aria-hidden="true" /> Save JSON
              </button>
            </div>
          </div>
        )}
      </section>

      {showNavigation && (
        <NavigationEditor
          activeLocale={activeLocale}
          onLocaleChange={onLocaleChange}
          selectedSite={selectedSite}
          setNotice={setNotice}
        />
      )}
    </div>
  );
}

function NavigationEditor({ activeLocale, onLocaleChange, selectedSite, setNotice }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    refresh();
  }, [selectedSite.id, activeLocale]);

  async function refresh() {
    setLoading(true);
    setNotice(emptyNotice);
    try {
      setItems(await listNavigation(selectedSite.id, activeLocale));
    } catch (error) {
      setNotice({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  }

  async function moveItem(itemId, direction) {
    const ids = items.map((item) => item.id);
    const index = ids.indexOf(itemId);
    const targetIndex = index + direction;
    if (index < 0 || targetIndex < 0 || targetIndex >= ids.length) return;
    [ids[index], ids[targetIndex]] = [ids[targetIndex], ids[index]];
    setNotice(emptyNotice);
    try {
      await reorderNavigationItems(selectedSite.id, ids);
      await refresh();
      setNotice({ type: "success", text: "Menu order updated." });
    } catch (error) {
      setNotice({ type: "error", text: error.message });
    }
  }

  return (
    <section className="panelCard">
      <div className="editorHeader">
        <PanelHeader title="Website menu" subtitle="Edit the labels and links shown in the website navigation for the selected language." />
        <div className="buttonRow">
          <label className="compactSelect">
            Language
            <select value={activeLocale} onChange={(event) => onLocaleChange(event.target.value)}>
              {languages.map((language) => (
                <option key={language.code} value={language.code}>{language.label}</option>
              ))}
            </select>
          </label>
          <CreateNavigationItemPanel
            defaultLocale={activeLocale}
            itemCount={items.length}
            onRefresh={refresh}
            selectedSite={selectedSite}
            setNotice={setNotice}
          />
        </div>
      </div>
      {loading && <div className="inlineLoading">Loading menu...</div>}
      <div className="menuEditorList">
        {items.map((item, index) => (
          <NavigationItemEditor
            canMoveDown={index < items.length - 1}
            canMoveUp={index > 0}
            item={item}
            key={item.id}
            onMoveDown={() => moveItem(item.id, 1)}
            onMoveUp={() => moveItem(item.id, -1)}
            onRefresh={refresh}
            setNotice={setNotice}
          />
        ))}
        {!loading && !items.length && (
          <EmptyState title="No menu items yet." text="Menu labels will appear here after this website has navigation content for this language." />
        )}
      </div>
    </section>
  );
}

function CreateNavigationItemPanel({ defaultLocale = "en", itemCount, onRefresh, selectedSite, setNotice }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({
    label: "",
    href: "",
    section_key: "",
    locale: defaultLocale,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDraft((current) => ({ ...current, locale: defaultLocale }));
  }, [defaultLocale]);

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setNotice(emptyNotice);
    try {
      await createNavigationItem(selectedSite.id, {
        ...draft,
        order: itemCount,
        is_visible: true,
      });
      setDraft({ label: "", href: "", section_key: "", locale: defaultLocale });
      setOpen(false);
      await onRefresh();
      setNotice({ type: "success", text: "Menu item added." });
    } catch (error) {
      setNotice({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="compactSectionCreate">
      <button className="secondaryButton compactButton" type="button" onClick={() => setOpen((value) => !value)}>
        <PlusSquare size={16} aria-hidden="true" /> {open ? "Close" : "Add menu item"}
      </button>
      {open && (
        <form className="createForm wide compactItemForm" onSubmit={submit}>
          <div className="formGrid two">
            <TextField label="Menu label" required value={draft.label} onChange={(value) => setDraft((current) => ({ ...current, label: value }))} />
            <TextField label="Link" required value={draft.href} onChange={(value) => setDraft((current) => ({ ...current, href: value }))} />
            <TextField label="Section key" value={draft.section_key} onChange={(value) => setDraft((current) => ({ ...current, section_key: value }))} />
            <label>
              Language
              <select value={draft.locale} onChange={(event) => setDraft((current) => ({ ...current, locale: event.target.value }))}>
                {languages.map((language) => <option key={language.code} value={language.code}>{language.label}</option>)}
              </select>
            </label>
          </div>
          <div className="formActions">
            <button className="primaryButton" disabled={saving} type="submit">
              <PlusSquare size={16} aria-hidden="true" /> Add item
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function NavigationItemEditor({ canMoveDown, canMoveUp, item, onMoveDown, onMoveUp, onRefresh, setNotice }) {
  const [draft, setDraft] = useState(() => ({
    label: item.label || "",
    href: item.href || "",
    section_key: item.section_key || "",
    is_visible: Boolean(item.is_visible),
  }));
  const [saving, setSaving] = useState(false);

  async function saveItem() {
    setSaving(true);
    setNotice(emptyNotice);
    try {
      await updateNavigationItem(item.id, draft);
      await onRefresh();
      setNotice({ type: "success", text: `"${draft.label}" saved.` });
    } catch (error) {
      setNotice({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  }

  async function removeItem() {
    const confirmed = window.confirm(`Remove "${draft.label || "this menu item"}" from the website menu? This cannot be undone.`);
    if (!confirmed) return;

    setSaving(true);
    setNotice(emptyNotice);
    try {
      await deleteNavigationItem(item.id);
      await onRefresh();
      setNotice({ type: "success", text: "Menu item removed." });
    } catch (error) {
      setNotice({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <article className="menuItemEditor">
      <TextField label="Menu label" value={draft.label} onChange={(value) => setDraft((current) => ({ ...current, label: value }))} />
      <TextField label="Link" value={draft.href} onChange={(value) => setDraft((current) => ({ ...current, href: value }))} />
      <label className="checkboxRow">
        <input checked={draft.is_visible} type="checkbox" onChange={(event) => setDraft((current) => ({ ...current, is_visible: event.target.checked }))} />
        Show in menu
      </label>
      <div className="headerActions">
        <button className="iconMiniButton" disabled={!canMoveUp || saving} type="button" onClick={onMoveUp} aria-label="Move menu item up">
          <ArrowUp size={14} aria-hidden="true" />
        </button>
        <button className="iconMiniButton" disabled={!canMoveDown || saving} type="button" onClick={onMoveDown} aria-label="Move menu item down">
          <ArrowDown size={14} aria-hidden="true" />
        </button>
      </div>
      <button className="secondaryButton" disabled={saving} type="button" onClick={saveItem}>
        Save
      </button>
      <button className="dangerButton" disabled={saving} type="button" onClick={removeItem}>
        <Trash2 size={16} aria-hidden="true" /> Remove
      </button>
    </article>
  );
}

function PanelHeader({ subtitle, title }) {
  return (
    <div className="panelHeader">
      <h3>{title}</h3>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="detailRow">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function TextField({ autoComplete, help, label, onBlur, onChange, required = false, type = "text", value }) {
  return (
    <label>
      {label}
      <input autoComplete={autoComplete} dir="auto" required={required} type={type} value={value} onBlur={onBlur} onChange={(event) => onChange(event.target.value)} />
      {help && <small className="fieldHelp">{help}</small>}
    </label>
  );
}

function TextArea({ help, label, onBlur, onChange, rows, value }) {
  return (
    <label>
      {label}
      <textarea dir="auto" rows={rows} value={value} onBlur={onBlur} onChange={(event) => onChange(event.target.value)} />
      {help && <small className="fieldHelp">{help}</small>}
    </label>
  );
}

function Notice({ notice }) {
  return (
    <div className={notice.type === "error" ? "notice error" : "notice success"}>
      {notice.type === "success" && <CheckCircle2 size={16} aria-hidden="true" />}
      {notice.text}
    </div>
  );
}

function EmptyState({ text, title }) {
  return (
    <div className="emptyState">
      <BarChart3 size={22} aria-hidden="true" />
      <span>
        <strong>{title}</strong>
        {text && <small>{text}</small>}
      </span>
    </div>
  );
}

function isImageMimeOrExt(value, mime) {
  if (mime && mime.startsWith("image/")) return true;
  if (!value) return false;
  return /\.(png|jpe?g|gif|webp|svg|avif|ico)$/i.test(String(value).split("?")[0]);
}

function isVideoMimeOrExt(value, mime) {
  if (mime && mime.startsWith("video/")) return true;
  if (!value) return false;
  return /\.(mp4|webm|ogg|mov|m4v)$/i.test(String(value).split("?")[0]);
}

function mediaPreviewUrl(asset) {
  return asset.file_url || asset.external_url || "";
}

function mediaMatchesKind(asset, kind) {
  if (!kind || kind === "any") return true;
  const url = mediaPreviewUrl(asset);
  if (kind === "image") return isImageMimeOrExt(url, asset.mime_type);
  if (kind === "video") return isVideoMimeOrExt(url, asset.mime_type);
  return true;
}

function MediaField({ label, value, onChange, mediaKind = "image", help }) {
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <label className="mediaField">
      <span className="mediaFieldLabel">{label}</span>
      <div className="mediaFieldRow">
        <input
          dir="auto"
          type="text"
          value={value || ""}
          placeholder={mediaKind === "video" ? "https://.../hero.mp4 or /media/..." : "https://.../image.jpg or /media/..."}
          onChange={(event) => onChange(event.target.value)}
        />
        <button className="secondaryButton compactButton" type="button" onClick={() => setPickerOpen(true)} aria-label={`Pick ${mediaKind}`}>
          {mediaKind === "video" ? <Video size={15} aria-hidden="true" /> : <ImageIcon size={15} aria-hidden="true" />}
          <span>Pick</span>
        </button>
      </div>
      {help && <small className="fieldHelp">{help}</small>}
      {value ? (
        <div className="mediaFieldPreview">
          {isImageMimeOrExt(value) ? (
            <img src={value} alt={label} loading="lazy" />
          ) : isVideoMimeOrExt(value) ? (
            <video src={value} muted playsInline />
          ) : (
            <span className="mediaFieldPreviewText">{value}</span>
          )}
        </div>
      ) : null}
      {pickerOpen && (
        <MediaPickerDialog
          mediaKind={mediaKind}
          onClose={() => setPickerOpen(false)}
          onPick={(picked) => {
            onChange(picked);
            setPickerOpen(false);
          }}
        />
      )}
    </label>
  );
}

function MediaPickerDialog({ mediaKind = "image", onClose, onPick }) {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  async function refresh() {
    setLoading(true);
    setError("");
    try {
      const data = await listMediaAssets();
      setAssets(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const asset = await uploadMediaAsset({ file, title: file.name });
      await refresh();
      const url = mediaPreviewUrl(asset);
      if (url) onPick(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  const filtered = assets
    .filter((asset) => mediaMatchesKind(asset, mediaKind))
    .filter((asset) => {
      if (!search.trim()) return true;
      const haystack = `${asset.title || ""} ${asset.alt_text || ""} ${asset.external_url || ""} ${asset.file_url || ""}`.toLowerCase();
      return haystack.includes(search.trim().toLowerCase());
    });

  return (
    <div className="adminModalOverlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="adminModal" onClick={(event) => event.stopPropagation()}>
        <div className="adminModalHeader">
          <div>
            <p className="eyebrow">Media library</p>
            <h3>Choose a {mediaKind}</h3>
            <span className="muted">Upload a new file or pick from previously uploaded assets.</span>
          </div>
          <button className="iconMiniButton" type="button" onClick={onClose} aria-label="Close media picker">
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        <div className="adminModalToolbar">
          <input
            className="mediaSearch"
            placeholder="Search title, alt text, or URL"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept={mediaKind === "video" ? "video/*" : mediaKind === "image" ? "image/*" : undefined}
            style={{ display: "none" }}
            onChange={handleFile}
          />
          <button className="primaryButton" type="button" disabled={uploading} onClick={() => fileInputRef.current?.click()}>
            <Upload size={16} aria-hidden="true" /> {uploading ? "Uploading…" : "Upload new"}
          </button>
        </div>

        {error && <div className="notice error" style={{ margin: "0 0 12px" }}>{error}</div>}

        <div className="mediaGrid">
          {loading ? (
            <div className="inlineLoading">Loading media…</div>
          ) : filtered.length ? (
            filtered.map((asset) => {
              const url = mediaPreviewUrl(asset);
              return (
                <button className="mediaTile" key={asset.id} type="button" onClick={() => onPick(url)}>
                  <div className="mediaTilePreview">
                    {isImageMimeOrExt(url, asset.mime_type) ? (
                      <img src={url} alt={asset.alt_text || asset.title || ""} loading="lazy" />
                    ) : isVideoMimeOrExt(url, asset.mime_type) ? (
                      <video src={url} muted playsInline />
                    ) : (
                      <span>{(asset.title || url || "asset").slice(0, 24)}</span>
                    )}
                  </div>
                  <div className="mediaTileMeta">
                    <strong>{asset.title || asset.alt_text || "Untitled"}</strong>
                    <small>{asset.mime_type || (isImageMimeOrExt(url) ? "image" : isVideoMimeOrExt(url) ? "video" : "file")}</small>
                  </div>
                </button>
              );
            })
          ) : (
            <EmptyState title="No matching media." text="Try a different search, or upload a new file." />
          )}
        </div>
      </div>
    </div>
  );
}

function MediaLibraryScreen({ setNotice }) {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("any");
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  async function refresh() {
    setLoading(true);
    setNotice(emptyNotice);
    try {
      const data = await listMediaAssets();
      setAssets(data);
    } catch (error) {
      setNotice({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setNotice(emptyNotice);
    try {
      await uploadMediaAsset({ file, title: file.name });
      await refresh();
      setNotice({ type: "success", text: "File uploaded." });
    } catch (error) {
      setNotice({ type: "error", text: error.message });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function removeAsset(asset) {
    if (!window.confirm(`Delete "${asset.title || asset.id}"? Pages that already reference its URL will keep the link unless updated.`)) return;
    try {
      await deleteMediaAsset(asset.id);
      await refresh();
      setNotice({ type: "success", text: "Asset removed." });
    } catch (error) {
      setNotice({ type: "error", text: error.message });
    }
  }

  async function saveMeta(asset, data) {
    try {
      await updateMediaAsset(asset.id, data);
      await refresh();
      setNotice({ type: "success", text: "Metadata saved." });
    } catch (error) {
      setNotice({ type: "error", text: error.message });
    }
  }

  function copyUrl(url) {
    if (!url) return;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(
        () => setNotice({ type: "success", text: "URL copied to clipboard." }),
        () => setNotice({ type: "error", text: "Unable to copy URL." }),
      );
    }
  }

  const filtered = assets
    .filter((asset) => mediaMatchesKind(asset, filter))
    .filter((asset) => {
      if (!search.trim()) return true;
      const haystack = `${asset.title || ""} ${asset.alt_text || ""} ${asset.external_url || ""} ${asset.file_url || ""}`.toLowerCase();
      return haystack.includes(search.trim().toLowerCase());
    });

  return (
    <section className="screenStack">
      <section className="panelCard">
        <div className="editorHeader">
          <PanelHeader
            title="Media library"
            subtitle="Upload images and videos once, then reuse them in any website's hero, sections, cards, or settings."
          />
          <div className="buttonRow">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              style={{ display: "none" }}
              onChange={handleFile}
            />
            <button className="primaryButton" disabled={uploading} type="button" onClick={() => fileInputRef.current?.click()}>
              <Upload size={16} aria-hidden="true" /> {uploading ? "Uploading…" : "Upload file"}
            </button>
          </div>
        </div>

        <div className="adminModalToolbar" style={{ marginTop: 12 }}>
          <input
            className="mediaSearch"
            placeholder="Search title, alt text, or URL"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <label className="compactSelect">
            Type
            <select value={filter} onChange={(event) => setFilter(event.target.value)}>
              <option value="any">All</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
            </select>
          </label>
        </div>
      </section>

      {loading && <div className="inlineLoading">Loading media…</div>}

      <div className="mediaGrid">
        {!loading && filtered.length === 0 && (
          <EmptyState title="No media yet." text="Upload images or videos to use them across all websites." />
        )}
        {filtered.map((asset) => (
          <MediaAssetCard
            key={asset.id}
            asset={asset}
            onCopy={() => copyUrl(mediaPreviewUrl(asset))}
            onDelete={() => removeAsset(asset)}
            onSave={(data) => saveMeta(asset, data)}
          />
        ))}
      </div>
    </section>
  );
}

function MediaAssetCard({ asset, onCopy, onDelete, onSave }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({
    title: asset.title || "",
    alt_text: asset.alt_text || "",
    external_url: asset.external_url || "",
  });
  const url = mediaPreviewUrl(asset);

  useEffect(() => {
    setDraft({
      title: asset.title || "",
      alt_text: asset.alt_text || "",
      external_url: asset.external_url || "",
    });
  }, [asset.id, asset.title, asset.alt_text, asset.external_url]);

  return (
    <article className="mediaCard">
      <div className="mediaTilePreview large">
        {isImageMimeOrExt(url, asset.mime_type) ? (
          <img src={url} alt={asset.alt_text || asset.title || ""} loading="lazy" />
        ) : isVideoMimeOrExt(url, asset.mime_type) ? (
          <video src={url} controls muted playsInline />
        ) : (
          <span>{(asset.title || url || "asset").slice(0, 28)}</span>
        )}
      </div>
      <div className="mediaCardBody">
        <strong>{asset.title || "Untitled"}</strong>
        <small className="muted">{asset.mime_type || "file"}</small>
        <code className="mediaUrl">{url || "(no URL)"}</code>
        {editing ? (
          <>
            <TextField label="Title" value={draft.title} onChange={(value) => setDraft((current) => ({ ...current, title: value }))} />
            <TextField label="Alt text" value={draft.alt_text} onChange={(value) => setDraft((current) => ({ ...current, alt_text: value }))} />
            <TextField label="External URL (if no file)" value={draft.external_url} onChange={(value) => setDraft((current) => ({ ...current, external_url: value }))} />
          </>
        ) : null}
        <div className="buttonRow">
          <button className="secondaryButton compactButton" type="button" onClick={onCopy}>
            <Copy size={14} aria-hidden="true" /> Copy URL
          </button>
          {editing ? (
            <button className="primaryButton compactButton" type="button" onClick={() => { onSave(draft); setEditing(false); }}>
              <Save size={14} aria-hidden="true" /> Save
            </button>
          ) : (
            <button className="secondaryButton compactButton" type="button" onClick={() => setEditing(true)}>
              <Pencil size={14} aria-hidden="true" /> Edit
            </button>
          )}
          <button className="dangerButton compactButton" type="button" onClick={onDelete}>
            <Trash2 size={14} aria-hidden="true" /> Delete
          </button>
        </div>
      </div>
    </article>
  );
}

export default App;
