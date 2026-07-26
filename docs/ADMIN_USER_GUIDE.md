# Admin User Guide

This guide explains how to use the website admin panel. It is written for
website owners and content editors who need to update website content without
changing code.

## 1. What the Admin Panel Is For

The admin panel is used to edit website content across the Rezaei websites.

You can use it to:

- Log in as an authorized admin.
- Choose a website.
- Open pages for that website.
- Edit page titles and SEO text.
- Edit page sections.
- Edit content blocks such as cards, buttons, and service items.
- Publish or unpublish pages.
- Edit navigation labels and links.
- Edit site settings such as contact information.
- Work with English, Persian, Arabic, and Turkish content.

The admin panel is for content management only. It is not a design editor.

## 2. Content vs Layout

Content is the text and information shown on the website.

Examples of content:

- Page titles
- Section headings
- Paragraph text
- Service cards
- Button text
- Button links
- Navigation labels
- SEO title and description
- Contact email, phone, and address

Layout is the design and structure of the website.

Examples of layout:

- Colors
- Spacing
- Fonts
- Page structure
- Animations
- Mobile layout
- Position of major design elements

The admin panel can change content. It does not control the layout.
If a design or layout change is needed, ask a developer.

## 3. Logging In

1. Open the admin panel URL.
2. Enter your admin username.
3. Enter your password.
4. Click **Login**.

If login fails:

- Check that the username and password are correct.
- Make sure you are using an admin account.
- Contact the system administrator if the account is locked or missing.

## 4. Choosing a Website

After login, the left side of the admin panel shows the available websites.

To choose a website:

1. Look at the site list on the left.
2. Click the website you want to edit.
3. The main area will show pages and tools for that website.

Be careful to choose the correct website before editing. Content changes apply
only to the selected website.

## 5. Choosing a Language

The admin panel has a language selector near the top.

Available languages:

- English
- Persian
- Arabic
- Turkish

English is the default language and fallback language.

To edit another language:

1. Choose the website.
2. Open the language selector.
3. Select Persian, Arabic, or Turkish.
4. Edit the pages in that language.

Persian and Arabic text fields support right-to-left typing automatically.

## 6. English Fallback Behavior

English is the fallback content.

This means:

- If Persian content is not available, the public website can show English.
- If Arabic content is not available, the public website can show English.
- If Turkish content is not available, the public website can show English.
- Draft content is not shown publicly.

Fallback helps keep the website working even when translation is incomplete.

## 7. Creating Translated Pages from English

If you select Persian, Arabic, or Turkish and no pages exist yet, the admin
panel can create translated page drafts from English.

To create translated pages:

1. Choose the website.
2. Select Persian, Arabic, or Turkish from the language selector.
3. If there are no pages, click **Create pages from English**.
4. The system creates draft copies using the English page structure.
5. Open each page and replace the English text with translated content.
6. Publish the translated page when it is ready.

Important: Creating translated pages does not automatically translate the text.
It copies the English structure so you can edit it safely.

## 8. Page List

The **Pages** tab shows pages for the selected website and selected language.

Each page item shows:

- Page title
- Page slug
- Language
- Status, such as draft or published

To open a page:

1. Choose the correct website.
2. Choose the correct language.
3. Open the **Pages** tab.
4. Click the page you want to edit.

Use the search box to find a page by title or slug.

## 9. Editing a Page

After opening a page, you can edit the main page fields.

Common page fields:

- Title: The internal and visible page title.
- Slug: The page URL path.
- Status: Draft or published.
- OG Image URL: The image used for social sharing, where supported.

To edit a page:

1. Open the page.
2. Update the fields you need.
3. Click **Save Page**.
4. Publish the page when the content is ready.

Do not change page slugs unless you understand the effect on public URLs.
Changing a slug can break links or navigation if the website route does not
match.

## 10. SEO Fields

SEO fields help control how a page appears in search engines and social previews.

Editable SEO fields:

- SEO Title
- SEO Description
- SEO Keywords
- OG Image URL

Simple guidance:

- Keep SEO titles clear and specific.
- Keep SEO descriptions short and readable.
- Use keywords naturally.
- Do not stuff repeated keywords into the fields.

After editing SEO fields, click **Save Page**.

## 11. Editing Sections

Sections are major parts of a page.

Examples:

- Hero section
- Services section
- Process section
- Contact section
- Cards section

To edit a section:

1. Open a page.
2. Find the section you want to edit.
3. Click the section header to expand it.
4. Edit the title, subtitle, summary, or body.
5. Choose whether it is visible on the public API.
6. Click **Save Section**.

If a section is hidden, it should not appear in the public CMS content.

## 12. Editing Content Blocks

Content blocks are smaller items inside a section.

Examples:

- A service card
- A process step
- A contact row
- A button
- A link

To edit a content block:

1. Open a page.
2. Expand the section that contains the block.
3. Find the content block.
4. Click the block header to expand it.
5. Edit fields such as title, subtitle, body, href, icon, or image URL.
6. Choose whether it is visible.
7. Click **Save Block**.

Be careful when editing links. A wrong link can send visitors to the wrong page.

## 13. Publish and Unpublish

Pages can be either draft or published.

Draft means:

- The page exists in the CMS.
- Editors can work on it.
- It should not appear publicly through the CMS API.

Published means:

- The page is available through the public CMS API.
- The public website can display it.

To publish a page:

1. Open the page.
2. Review the content.
3. Click **Publish**.

To unpublish a page:

1. Open the page.
2. Click **Unpublish**.

Unpublishing hides that page from the public CMS API. If another language is
requested and the translated page is unpublished, the website may fall back to
English.

## 14. Navigation Editing

The **Navigation** tab is used to edit menu items for the selected website and
selected language.

Navigation fields:

- Label: The text shown in the menu.
- Href: The link destination.
- Section Key: The matching homepage section or internal section key.
- Visible: Whether the item is shown.

To edit navigation:

1. Choose the website.
2. Choose the language.
3. Open the **Navigation** tab.
4. Edit the label, link, or section key.
5. Click **Save** for the item.

Do not change href or section key unless you know the matching page or section exists.

## 15. Site Settings

The **Settings** tab stores basic site-level information.

Editable settings include:

- Contact email
- Contact phone
- WhatsApp
- Contact address
- Footer text
- Settings JSON

To edit site settings:

1. Choose the website.
2. Open the **Settings** tab.
3. Edit the required fields.
4. Click **Save Settings**.

Be careful with **Settings JSON**. It should only be edited by someone who
understands the required format.

## 16. Editing Persian, Arabic, and Turkish Content

To edit localized content:

1. Choose the website.
2. Select the target language.
3. Create pages from English if the language has no pages yet.
4. Open a page.
5. Replace English text with translated text.
6. Save sections and blocks as you edit them.
7. Publish the page when translation is complete.

For Persian and Arabic:

- Text fields automatically support right-to-left typing.
- Keep punctuation and numbers readable.
- Review the public page after publishing.

For Turkish:

- Text is left-to-right.
- Review special characters after saving.

## 17. What Happens if the CMS Is Offline

If the CMS is offline, the public websites can still show fallback content.

This means visitors may still see the website, but they may not see the newest
CMS edits until the CMS is online again.

The admin panel needs the CMS API to work. If the CMS is offline, login,
editing, saving, and publishing may not work.

## 18. Why Changes May Not Appear Immediately

Changes may not appear immediately for several reasons:

- The page was saved but not published.
- The wrong website was edited.
- The wrong language was edited.
- The public website is showing English fallback because the translated page is
  still draft.
- The CMS is temporarily offline.
- The browser is showing cached content.
- The changed field is not used by the current page layout.

Check the selected website, selected language, page status, and publish state first.

## 19. What Not to Touch Without Developer Help

Ask a developer before changing:

- Page slugs
- Navigation href values
- Section keys
- Settings JSON
- Image URLs used by important brand sections
- Any field whose purpose is unclear

These fields can affect routing, layout behavior, or how public pages connect
to CMS content.

## 20. Simple Editing Checklist

Before editing:

1. Confirm the correct website.
2. Confirm the correct language.
3. Open the correct page.

While editing:

1. Save the page, section, or block you changed.
2. Keep translated content in the matching language.
3. Avoid changing technical fields unless needed.

Before publishing:

1. Review the content.
2. Check links.
3. Check SEO fields if the page is important for search.
4. Publish only when the page is ready.

After publishing:

1. Open the public website.
2. Check the page in the selected language.
3. Confirm the change appears correctly.
