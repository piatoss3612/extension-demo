export const init = () => {
  chrome.runtime.onMessage.addListener(
    (
      message,
      // sender, sendResponse
    ) => {
      if (message.type === 'NOTIFICATION') {
        setTimeout(() => {
          chrome.notifications.create(
            {
              type: 'basic',
              iconUrl: chrome.runtime.getURL('side-panel/wfh_cat.png'),
              title: 'Notification',
              message: message.message,
              priority: 0,
              requireInteraction: !!message.requireInteraction,
            },
            notificationId => {
              console.log('notificationId', notificationId);
            },
          );

          chrome.notifications.onClicked.addListener(notificationId => {
            console.log('notification clicked', notificationId);
          });
        }, 3000);
      }
    },
  );

  console.log('background loaded');
  console.log("Edit 'chrome-extension/src/background/index.ts' and save to reload.");
};
