
# Eklavyaa Academy Landing Page

A modern, high-conversion landing page for Eklavyaa Academy, a premier coaching institute.

## Features
- **Responsive Design**: Optimized for mobile, tablet, and desktop.
- **Modern UI**: Built with React, Tailwind CSS, and Lucide icons.
- **Smooth Animations**: Intersection observers for scroll-triggered animations.
- **Dual Enquiry System**: 
  - Standard admission enquiry form.
  - Dedicated **Free Revision Batch** registration flow (8th & 9th Std).
- **WhatsApp Integration**: Instant redirection to WhatsApp for seat confirmation after registration.
- **Google Sheets Integration**: Form submissions are sent directly to Google Sheets via Apps Script.

## Project Structure
- `/components`: UI building blocks (Navbar, Hero, Courses, RevisionPage, etc.)
- `/ui`: Reusable atomic components (Buttons, Modals, Sections)
- `index.tsx`: Main entry point
- `types.ts`: TypeScript interfaces

## Tech Stack
- **Framework**: React 19
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite

## Deployment Instructions (Vercel via GitHub)

To update your live site, follow these steps in your terminal:

1. **Stage and Commit Changes**:
   ```bash
   git add .
   git commit -m "Added Free Revision Page and WhatsApp integration"
   ```

2. **Push to GitHub**:
   ```bash
   git push origin main
   ```

3. **Vercel Auto-Deployment**:
   - Vercel will automatically detect the new commit on your `main` branch.
   - It will start a new build.
   - Once the build finishes (usually 1-2 minutes), your live site will be updated.

---
© 2026 Eklavyaa Academy. Aim. Learn. Achieve.
