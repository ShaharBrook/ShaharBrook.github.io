/* ==========================================================================
   Renders tools/og-template.html to assets/img/og.png at exactly 1200×630.

   Usage:  node tools/og-render.mjs

   Requires Playwright and a local Chrome. If you do not have Playwright:
     npm install --no-save playwright
   The site itself has no dependencies — this is a build tool you run by hand
   on the rare occasion the preview card changes, not part of the deploy.
   ========================================================================== */

import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const template = path.join(here, 'og-template.html');
const out = path.join(here, '..', 'assets', 'img', 'og.png');

const browser = await chromium.launch({ channel: 'chrome' });
// deviceScaleFactor 1: Open Graph consumers want exactly 1200×630, and a 2x
// image is four times the bytes for no visible gain in a chat preview.
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});
await page.goto('file://' + template, { waitUntil: 'load' });
await page.waitForTimeout(300);          // let fonts settle
await page.screenshot({ path: out });
await browser.close();

console.log('wrote ' + out);
