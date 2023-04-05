const tabs = await chrome.tabs.query({
  active: true,
  currentWindow: true,
  url: "https://*.youtube.com/watch*",
});

let tab;
if (tabs && tabs.length === 1) {
  tab = tabs[0];
  setElemTitle(tab.title);
}

function setElemTitle(title) {
  if (document) {
    title = title.replace(/\(\d+\)/g, ""); // Remove notification part
    title = title.replace(" - YouTube", "");
    const elem = document.getElementById("video-title");
    elem.innerText = title;
  }
}

const commentsInput = document.getElementById("comment-input");
let timer;

commentsInput.addEventListener("input", () => {
  if (commentsInput.value === "") return;
  if (timer) clearTimeout(timer);
  timer = setTimeout(fetchComment, 500, commentsInput.value);
});


export async function fetchComment(commentSearchTerm) {
  const noCommentsElem = document.getElementById("no-comments");
  if (noCommentsElem) {
    noCommentsElem.style.display = "none";
  }

  if (!commentSearchTerm || !tab) return Promise.reject();
  let videoId = tab.url.split("v=")[1];
  const ampersandPosition = videoId.indexOf("&");
  if (ampersandPosition !== -1) {
    videoId = videoId.substring(0, ampersandPosition);
  }

  try {
    const baseUrl = new URL(
      "https://www.googleapis.com/youtube/v3/commentThreads"
    );
    baseUrl.searchParams.append("part", "snippet");
    baseUrl.searchParams.append(
      "key"
      // Key here
    );
    baseUrl.searchParams.append("videoId", videoId);
    baseUrl.searchParams.append("searchTerms", commentSearchTerm);
    baseUrl.searchParams.append("maxResults", 50);
    baseUrl.searchParams.append("order", "relevance");

    document.getElementById("comments-list").replaceChildren();

    const res = await fetch(baseUrl, {
      method: "GET",
    });

    const json = await res.json();

    if (json.items.length === 0) {
      setNoComments(noCommentsElem, commentSearchTerm);
    } else {
      const elems = buildList(json.items, commentSearchTerm);
      if (elems === 0) setNoComments(noCommentsElem, commentSearchTerm);
    }
  } catch (e) {
    console.error(e);
  }
}

function setNoComments(noCommentsElem, searchTerm) {
  noCommentsElem.innerText = `No comments found that include: '${searchTerm}'`;
  noCommentsElem.style.display = "block";
}

function buildList(items, originalSearchTerm) {
  const comments = new Set();
  const template = document.getElementById("li_template");
  for (const item of items) {
    const commentInfo = item.snippet.topLevelComment.snippet;
    if (
      !commentInfo.textOriginal
        .toLowerCase()
        .includes(originalSearchTerm.toLowerCase())
    )
      continue;
    const element = template.content.firstElementChild.cloneNode(true);
    element.querySelector(".profilePic").src =
      commentInfo.authorProfileImageUrl;
    element.querySelector(".author").textContent =
      commentInfo.authorDisplayName;
    element.querySelector(".comment").textContent = commentInfo.textOriginal;

    comments.add(element);
  }

  if (comments.size === 0) {
    return 0;
  }

  document.getElementById("comments-list").append(...comments);

  return comments.size;
}
