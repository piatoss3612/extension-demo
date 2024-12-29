import 'webextension-polyfill';
import { exampleThemeStorage } from '@extension/storage';

// Allows users to open the side panel by clicking on the action toolbar icon
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(error => console.error(error));

exampleThemeStorage.get().then(theme => {
  console.log('theme', theme);
});

chrome.runtime.onMessage.addListener(
  (
    message,
    // sender, sendResponse
  ) => {
    if (message.type === 'WEB_NOTIFICATION') {
      setTimeout(() => {
        chrome.notifications.create(
          {
            type: 'basic',
            iconUrl: chrome.runtime.getURL('side-panel/smile_pepe.jpeg'),
            title: 'Web Notification',
            message: message.message,
            priority: 0,
            requireInteraction: true,
          },
          notificationId => {
            console.log('notificationId', notificationId);
          },
        );

        chrome.notifications.onClicked.addListener(notificationId => {
          console.log('notificationId', notificationId);
        });
      }, 3000);
    }
  },
);

console.log('background loaded');
console.log("Edit 'chrome-extension/src/background/index.ts' and save to reload.");
