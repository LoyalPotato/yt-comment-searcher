chrome.tabs.onUpdated.addListener((tabId, { url, title }) => {
  void setBadgeText(tabId, url);
  void setElemTitle(title ?? "Video")
});

// NOTE: I think I can use declarativeContent
// https://developer.chrome.com/docs/extensions/reference/declarativeContent/
// to do this behavior
// https://developer.chrome.com/docs/extensions/reference/declarativeContent/

function setBadgeText(tabId, url) {
  if (!url) return;
  if (url.includes("youtube") && url.includes("v=")) {
    chrome.action.setBadgeText({ text: "✓", tabId });
  } else {
    chrome.action.setBadgeText({ text: "X", tabId });
  }
}

function setElemTitle(title) {
  // if (document) {
  //   title = title.replace(/\(\d+\)/g, ""); // Remove notification part
  //   const elem = document.getElementById("video-title");
  //   elem.innerText = title;
  // }
}
// chrome.runtime.onStartup.addListener(async () => {
//   const res = await fetch(
//     "https://www.googleapis.com/youtube/v3/commentThreads?part=snippet",
//     {
//       method: "GET",
//       // headers: new Header({
//       //   Authorization: "Bearer AIzaSyAqoQYbZDIMKZsPLE-P1fxD6up-o-RenBo",
//       // }),
//     }
//   );
//   console.log("res", res);
// });
