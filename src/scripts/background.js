chrome.tabs.onUpdated.addListener(async (tabId, { url, title }) => {
  await setBadgeText(tabId, url);
});

async function setBadgeText(tabId, url) {
  if (!url) return;
  if (url.includes("youtube") && url.includes("v=")) {
    await chrome.action.setBadgeText({ text: "✓", tabId });
  } else {
    await chrome.action.setBadgeText({ text: "X", tabId });
  }
}