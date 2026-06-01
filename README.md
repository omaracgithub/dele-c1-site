# DELE C1 Prep — Marketing Site

Marketing website for the DELE C1 Prep iOS app, hosted at [C1.prepdele.com](https://C1.prepdele.com).

## Overview

Static HTML site with bilingual content (Spanish + English) covering:
- Landing pages (ES/EN)
- Blog articles about DELE C1 exam preparation
- Sample exam page
- Support, privacy, and terms pages

## Tech Stack

- Static HTML/CSS (no build step required)
- Hosted on GitHub Pages
- DNS via Cloudflare
- Analytics: Google Analytics 4 (G-YB13BHW7X5)

## Local Development

Simply open any HTML file in a browser, or use a local server:

```bash
# Using Python
python3 -m http.server 8000

# Using Node.js
npx serve .
```

Then visit `http://localhost:8000`.

## Project Structure

```
dele-c1-site/
├── index.html              # Spanish landing page
├── en/                     # English pages
│   ├── index.html
│   └── blog/
│       ├── index.html      # EN blog index
│       ├── what-is-dele-c1/
│       ├── how-to-pass-dele-c1/
│       ├── reading-comprehension-dele-c1/
│       ├── listening-comprehension-dele-c1/
│       └── writing-tips-dele-c1/
├── blog/                   # Spanish blog articles
│   ├── que-es-dele-c1/
│   ├── dele-c1-vs-dele-b2/
│   ├── como-aprobar-dele-c1/
│   ├── expresion-escrita-dele-c1/
│   ├── vocabulario-dele-c1/
│   ├── comprension-auditiva-dele-c1/
│   ├── comprension-lectora-dele-c1/
│   ├── expresion-oral-dele-c1/
│   ├── errores-comunes-dele-c1/
│   └── recursos-preparar-dele-c1/
├── modelo-examen/          # Sample exam (ES)
├── en/sample-exam/         # Sample exam (EN)
├── support/                # Support page
├── privacy/                # Privacy policy
├── terms/                  # Terms of service
├── styles.css              # Global stylesheet
├── analytics.js            # Analytics helpers
├── sitemap.xml             # XML sitemap
├── llms.txt                # AI agent discoverability
├── robots.txt              # Crawler directives
├── CNAME                   # GitHub Pages custom domain
├── scripts/
│   └── tag-ctas.js         # UTM parameter tagging script
└── README.md
```

## Deployment (GitHub Pages)

### Initial Setup

1. Create a GitHub repository for the site
2. Push all files to the `main` branch
3. Go to Settings → Pages → Source: Deploy from branch (`main`, root `/`)
4. Add the `CNAME` file with content: `C1.prepdele.com`

### Cloudflare DNS Setup

1. Add a CNAME record:
   - Name: `C1`
   - Target: `<your-github-username>.github.io`
   - Proxy: ON (orange cloud)

2. SSL/TLS settings:
   - Mode: Full (strict)
   - Always Use HTTPS: ON
   - Minimum TLS: 1.2

3. Page Rules (optional):
   - `C1.prepdele.com/*` → Cache Level: Cache Everything

### After DNS Propagation

GitHub will automatically provision an SSL certificate. Verify at Settings → Pages that the custom domain shows a green checkmark.

## GA4 Setup

The site uses Google Analytics 4 with measurement ID `G-YB13BHW7X5`.

Each page includes the GA4 snippet in the `<head>`:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-YB13BHW7X5"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-YB13BHW7X5');
</script>
```

### Recommended GA4 Events

Configure these custom events in GA4:
- `click_appstore` — when users click the App Store CTA
- `scroll_depth` — 25%, 50%, 75%, 100% scroll milestones
- `blog_read` — when users spend >30s on a blog article

## Scripts

### Tag CTAs

Ensures all App Store links have correct UTM parameters:

```bash
# Preview changes without modifying files
node scripts/tag-ctas.js --dry-run

# Apply changes
node scripts/tag-ctas.js
```

Parameters added:
- `pt=126845029` (provider token)
- `ct=<page-slug>` (campaign tag, auto-derived from path)
- `mt=8` (media type: iOS app)

## Content Guidelines

- All content is bilingual (ES primary, EN secondary)
- Spanish articles use `lang="es"`, English use `lang="en"`
- Each page includes `hreflang` tags linking both language versions
- Blog articles should be 700-900 words
- Every article ends with an App Store CTA
- No references to Android or Google Play
- Always include disclaimer: "No afiliado al Instituto Cervantes"

## Contact

- Email: hello@prepdele.com
- Domain: C1.prepdele.com
