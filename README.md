# Student App

Independent static frontend for the university student portal.

## Pages

| Page | Route |
| --- | --- |
| Login and registration gateway | `/` |
| Dashboard and notifications bell | `/pages/dashboard/` |
| Class schedule | `/pages/schedule/` |
| Attendance and QR | `/pages/attendance/` |
| Course materials | `/pages/course-materials/` |
| Settings (GPS, language, password) | `/pages/settings/` |
| Notifications | `/pages/notifications/` |
| Profile | `/pages/profile/` |
| Help and support | `/pages/help-support/` |

Page titles use the `Page Name | Student Portal` format. Authentication, attendance, account settings, and academic data are page scaffolds until the corresponding services are connected.

## Requirements

- Node.js 20 or newer
- npm

## Development

```bash
npm ci
npm run dev
```

The development server runs at `http://127.0.0.1:5175`.

## Production build

```bash
npm run build
npm run preview
```

Deploy the contents of `dist/` to this site's hosting provider. `dist/` is generated and should not be committed.

Add site-specific domain, canonical URL, `CNAME`, and sitemap settings only when the production domain is finalized.
