import 'webextension-polyfill';
import { init } from '@extension/background';

// Allows users to open the side panel by clicking on the action toolbar icon
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(error => console.error(error));

// Initialize the background script
init();
