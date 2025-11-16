# Public Assets

This directory contains static assets served by Next.js.

## Directory Structure

- **icons/** - Favicons and app icons
  - `favicon.ico` - Browser favicon
  - `apple-touch-icon.png` - iOS home screen icon

- **images/** - Image assets
  - `news/` - News article images
  - `team/` - Team member photos
  - `og/` - Open Graph images for social media sharing

- **og-image.jpg** - Default Open Graph image for social media previews

## Usage

Files in this directory are served from the root path `/`. For example:
- `/icons/favicon.ico` → `public/icons/favicon.ico`
- `/images/news/example.jpg` → `public/images/news/example.jpg`

## Image Optimization

Next.js automatically optimizes images when using the `<Image>` component. Store source images here and reference them in components.
