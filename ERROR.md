# FlashMaster - Known Errors and Issues

This document tracks all known errors and issues in the FlashMaster project.

## ESLint Errors

### 1. Apple Touch Icon Link Element

**Error:**
```
The 'apple-touch-icon' link element should be specified in the '<head>'.
```

**Location:** `src/pages/_document.tsx` (line 20)

**Current Status:** Unresolved

**Explanation:** This appears to be a false positive in the ESLint rule since the link element is already correctly placed within the `<Head>` component from Next.js, which renders inside the HTML `<head>` tag.

**Possible Solutions:**
- Add to .eslintrc.json: `"@next/next/no-head-element": "off"`
- Try a more specific eslint-disable comment:
  ```jsx
  {/* eslint-disable-next-line @next/next/no-head-element */}
  ```
- Consider migrating to App Router's metadata API in the future

## NPM/Node.js Issues

### 1. Next.js Command Not Recognized

**Error:**
```
'next' is not recognized as an internal or external command, operable program or batch file.
```

**Current Status:** Workaround implemented

**Explanation:** There seems to be an issue with the npm installation of Next.js, causing the `next` command to not be recognized.

**Current Workaround:**
- Use `npx next dev` instead of `npm run dev`

**Possible Solutions:**
- Reinstall Node.js and npm
- Try installing Next.js with a specific version: `npm install next@14.0.4 react react-dom`
- Check npm's global and local paths

## Browser Compatibility Issues

### 1. Theme Color Meta Tag Support

**Error:**
```
'meta[name=theme-color]' is not supported by Firefox, Firefox for Android, Opera.
```

**Current Status:** Fixed

**Solution Implemented:**
Added browser-specific meta tags with media queries for light and dark mode:
```html
<meta name="theme-color" content="#0ea5e9" />
<meta name="theme-color" media="(prefers-color-scheme: light)" content="#0ea5e9" />
<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0c4a6e" />
```

## TypeScript Errors

### 1. Missing Type Declarations for Heroicons

**Error:**
```
Could not find a declaration file for module '@heroicons/react/24/outline/SunIcon'.
```

**Current Status:** Fixed

**Solution Implemented:**
Created type declarations in `src/types/heroicons.d.ts` for all Heroicon components being used.

## PWA/Asset Errors

### 1. Missing Icon Files

**Error:** No visible error, but potential issue with PWA functionality

**Explanation:** The project references icon paths that may not exist:
```
<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
```

**Recommendation:**
Ensure all referenced icon files exist in the public directory:
- `/public/icons/apple-touch-icon.png`
- `/public/favicon.ico`
- `/public/manifest.json` 