# Project Guide

## 1. Project Overview

This project is a multi-website platform for Rezaei Global LLC and its business divisions. It provides a professional online presence for the holding company and its main service areas.

The platform was built to give each business area its own clear website while keeping all sites connected under one group identity. Visitors can understand the full company structure, then move into the specific service website that matches their need.

The holding company acts as the central brand. It presents the group, introduces the business units, and gives the audience a trusted entry point into the wider organization.

The four public websites are:

- Main Site: The central holding company website for Rezaei Global LLC.
- Real Estate: Property, construction, project sourcing, materials, and investment opportunities.
- Finance & Trade: Import, export, trade coordination, currency transfer, and finance-related services.
- Residency, Visa & Translation: Residency, visa, corporate setup, translation, legalization, and attestation services.

## 2. Site Map

Main Site

```text
Main Site
|-- Home
|-- About
|-- Group Structure
|-- Governance
`-- Contact
```

Real Estate

```text
Real Estate
|-- Home
|-- Properties
|-- Projects
|-- Building Materials
|-- Quotation
|-- Market Insights
`-- Contact
```

Finance & Trade

```text
Finance
|-- Home
|-- About
|-- Services
|-- Process
|-- Standards
`-- Contact
```

Residency, Visa & Translation

```text
Visa
|-- Home
|-- Residency & Visa
|-- Corporate Setup
|-- Translation
|-- Legalization
|-- Attestation
|-- Case Review
`-- Contact
```

## 3. System Architecture

The system has two main paths: one for public visitors and one for administrators.

```text
Visitor
  -> Public Websites
  -> CMS API
  -> PostgreSQL

Admin
  -> Admin Panel
  -> CMS API
  -> PostgreSQL
```

The public websites are what visitors see. They show the company content, services, contact information, and page sections.

The CMS API is the content service. It stores and delivers page content to the websites and the admin panel.

The admin panel is the private editing area. It allows authorized users to update website content without editing the website code.

PostgreSQL is the database. It stores websites, pages, sections, content blocks, navigation items, settings, and publishing status.

## 4. Project Structure

The project is organized into three main areas:

```text
apps/
services/
infra/
```

`apps/` contains the user-facing applications:

- `main-site`: The holding company website.
- `real-estate`: The real estate, construction, projects, and materials website.
- `finance`: The finance, trade, import, export, and currency transfer website.
- `visa`: The residency, visa, translation, legalization, and attestation website.
- `admin-panel`: The private CMS editing interface.

`services/` contains backend services:

- `cms-api`: The content management API used by the public websites and admin panel.

`infra/` contains infrastructure configuration:

- Nginx configuration for routing traffic to the correct website or service.

## 5. How Content Management Works

Website content is stored in the CMS. The public websites read content from the CMS at runtime.

If the CMS is temporarily unavailable, the public websites use fallback content. This keeps the sites visible even if the CMS API or database is down.

The CMS controls content only. It does not control the full website design or layout.

Content means the editable information, such as:

- Page titles
- Section headings
- Paragraphs
- Cards
- Links
- Navigation labels
- SEO text
- Contact information

Layout means the fixed visual structure, such as:

- Page design
- Spacing
- Colors
- Component placement
- Animations
- Mobile and desktop behavior

This separation protects the brand design while still allowing the client to edit day-to-day content.

## 6. Admin Panel Guide

The admin panel is used to manage website content.

Basic workflow:

1. Open the admin panel.
2. Log in with an authorized admin account.
3. Choose the website you want to edit.
4. Open the page list for that website.
5. Choose a page.
6. Edit the page title, SEO fields, sections, or content blocks.
7. Save the changes.
8. Publish the page when the content is ready.

Editing a section:

1. Open a page.
2. Find the section you want to update.
3. Edit the title, subtitle, summary, or body text.
4. Save the section.
5. Check the public page after publishing.

Editing content blocks:

Content blocks are smaller pieces inside a section. They are commonly used for cards, service items, process steps, or links.

Example:

On the Real Estate website, the Properties page may have cards for residential properties, commercial properties, and investment properties. Each card can be represented as a content block.

Publishing:

Publishing makes the page available through the public CMS API. Published content can appear on the public website.

Unpublishing:

Unpublishing hides the page from the public CMS API. Draft or unpublished content should not appear publicly.

Practical examples:

- To update a service description, edit the matching section or content block and publish the page.
- To temporarily hide a page, unpublish it.
- To improve Google search previews, update the SEO title and SEO description.
- To change a button label or destination, update the related content block link.

## 7. Page Structure

Each website is organized using a simple content structure:

```text
Page
  -> Sections
  -> Content Blocks
```

A page is a full website page, such as Real Estate Properties or Visa Case Review.

A section is a major part of that page, such as a hero area, service overview, process explanation, or contact section.

A content block is a smaller item inside a section, such as a card, step, feature, button, or service item.

Example from the Real Estate website:

```text
Page: Properties
  Section: Property Opportunities
    Block: Residential Properties
    Block: Commercial Properties
    Block: Investment Properties

  Section: Buyer Guidance
    Block: Location Review
    Block: Budget Planning
    Block: Follow-up Path
```

This structure keeps content organized and makes editing easier.

## 8. Deployment Overview

The project has two environments: development and production.

The development environment is used by developers to build, test, and preview changes locally. It includes the public websites, admin panel, CMS API, database, and local routing.

The production environment is used for the live websites. It is designed to run the public websites, admin panel, CMS API, database, and Nginx routing on a server.

Main parts of deployment:

- Docker runs the services in containers.
- Nginx routes visitors to the correct website or service.
- CMS API provides content to websites and the admin panel.
- Admin Panel allows authorized users to edit content.
- PostgreSQL stores the CMS content.

The public websites are built as static sites. The admin panel is also built as a static site. The CMS API runs as a backend service.

## 9. Backup & Recovery

The most important backup is the CMS database. It contains the editable website content.

Items that should be backed up:

- PostgreSQL database
- Production environment variables
- Media files, when media uploads are added in the future

The database backup allows the team to restore website content if the server fails, content is accidentally changed, or a deployment causes a problem.

Environment variables should be backed up securely because they contain production configuration and secrets. They should never be stored in public repositories or shared in chat.

Recovery concept:

1. Restore the server or create a new server.
2. Restore the project files.
3. Restore the production environment variables.
4. Restore the PostgreSQL database backup.
5. Start the production services.
6. Check the public websites, admin panel, and CMS API.

Backups should be stored off-server and tested regularly.

## 10. Security Notes

Admin credentials must be protected. Only trusted people should have access to the admin panel.

Use strong passwords for all admin accounts. Do not use shared, simple, or predictable credentials.

Production secrets must be private. This includes database passwords, Django secret keys, and any future API keys.

The production CMS must not use development settings. Debug mode should be disabled in production.

HTTPS is required for production. Admin login and content editing should never happen over plain HTTP on a public network.

Access to the server should be limited to trusted administrators. Database backups should be encrypted or stored in a secure location.

## 11. Future Roadmap

Possible future improvements include:

- Media uploads: Allow admins to upload and manage images or documents.
- Multilingual content: Support English, Persian, Arabic, or other required languages.
- Contact submissions: Store contact form messages in the CMS.
- Lead management: Track inquiries, follow-ups, and client status.
- Roles & permissions: Add editor, manager, and admin-level access.
- Content workflow: Add draft review, approvals, and scheduled publishing.

These features can be added gradually without changing the overall purpose of the platform.

## 12. FAQ

### How do I edit a page?

Log in to the admin panel, choose the website, open the page list, select the page, edit its sections or content blocks, save the changes, and publish the page.

### Why do I not see my changes?

The most common reasons are:

- The page was saved but not published.
- You are viewing fallback content because the CMS is unavailable.
- The browser is showing cached content.
- The wrong site or page was edited.

### What happens if the CMS is offline?

The public websites continue to show fallback content. Visitors can still view the sites, but CMS-managed updates will not appear until the CMS is available again.

### Can I add a new page?

The CMS can store pages, but the public website must also have a matching route and layout to display that page properly. For Phase 1, new public pages should be planned with a developer.

### Can I upload images?

Not yet in the Phase 1 admin panel. Image URLs can be stored where supported, but a full media upload library is planned for a future phase.

### Can multiple admins use the system?

Phase 1 is designed around simple admin access. Multiple accounts may be possible through the CMS user system, but advanced roles and permissions are planned for a future phase.

### Can the CMS change the website design?

No. The CMS changes content, not layout. This protects the visual identity and prevents accidental design damage.

### Can a page be hidden temporarily?

Yes. A page can be unpublished so it no longer appears through the public CMS API.

### Who should manage backups?

The system administrator or project owner should be responsible for regular backups and recovery testing.
