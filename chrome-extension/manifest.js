import fs from 'node:fs';
import dotenv from 'dotenv';

dotenv.config();

const packageJson = JSON.parse(fs.readFileSync('../package.json', 'utf8'));

/**
 * After changing, please reload the extension at `chrome://extensions`
 * @type {chrome.runtime.ManifestV3}
 */
const manifest = {
  manifest_version: 3,
  default_locale: 'en',
  /**
   * if you want to support multiple languages, you can use the following reference
   * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Internationalization
   */
  name: '__MSG_extensionName__',
  oauth2: {
    client_id: process.env.GOOGLE_CLIENT_ID,
    scopes: [''],
  },
  key: process.env.EXT_PUBLIC_KEY,
  version: packageJson.version,
  description: '__MSG_extensionDescription__',
  host_permissions: ['<all_urls>'],
  permissions: ['sidePanel', 'storage', 'identity', 'notifications'],
  side_panel: {
    default_path: 'side-panel/index.html',
  },
  background: {
    service_worker: 'background.iife.js',
    type: 'module',
  },
  action: {
    default_icon: 'icon-34.png',
  },
  icons: {
    128: 'icon-128.png',
  },
  web_accessible_resources: [
    {
      resources: ['*.js', '*.css', '*.svg', 'icon-128.png', 'icon-34.png'],
      matches: ['*://*/*'],
    },
  ],
};

export default manifest;
