// Custom Feature 1 (done by Cursor AI): Live Post DOM Injection + dynamic tweet stats/likes.
// Custom Feature 2 (done by Cursor AI): Splash Screen timer and reveal.
const splashScreen = document.getElementById("splashScreen");
const feedContent = document.querySelector(".feed-content");
const composerInput = document.querySelector(".compose-right input");
const postButton = document.querySelector(".post-btn-small");
const STATS_GROWTH_INTERVAL_MS = 30000;

function escapeHtml(value) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function formatTweetTime(date) {
    return date.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit"
    });
}

function updatePostButtonState() {
    const hasText = composerInput.value.trim().length > 0;
    postButton.disabled = !hasText;
}

function formatStatCount(value) {
    if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1).replace(/\.0$/, "")}M`;
    }

    if (value >= 1000) {
        return `${(value / 1000).toFixed(1).replace(/\.0$/, "")}K`;
    }

    return String(value);
}

function updateStatText(statElement) {
    const value = Number(statElement.dataset.count || "0");
    statElement.textContent = formatStatCount(value);
}

function incrementStat(statElement, amount = 1) {
    const currentValue = Number(statElement.dataset.count || "0");
    statElement.dataset.count = String(Math.max(0, currentValue + amount));
    updateStatText(statElement);
}

function buildActionItem(statType, initialCount, svgPath, extraClasses = "") {
    return `
        <div class="action-item ${extraClasses}" data-stat="${statType}" data-count="${initialCount}" data-liked="false">
            <svg viewBox="0 0 24 24"><g><path d="${svgPath}"></path></g></svg>
            <span>${formatStatCount(initialCount)}</span>
        </div>
    `;
}

function buildTweetCard(tweetText) {
    const safeText = escapeHtml(tweetText);
    const timeLabel = formatTweetTime(new Date());

    return `
        <div class="tweet-card live-tweet">
            <div class="tweet-left">
                <img src="./assets/profile picture .png" alt="Neo Malesa avatar" class="profile-pic">
            </div>
            <div class="tweet-right">
                <div class="tweet-header">
                    <div class="user-meta">
                        <span class="display-name">Neo Malesa</span>
                        <span class="handle">@neo_malesa_ · ${timeLabel}</span>
                    </div>
                    <svg viewBox="0 0 24 24" class="more-icon"><g><path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path></g></svg>
                </div>
                <p class="tweet-text">${safeText}</p>
                <div class="tweet-actions">
                    ${buildActionItem("comments", 0, "M1.75 3.25c0-1.105.895-2 2-2h16.5c1.105 0 2 .895 2 2v12c0 1.105-.895 2-2 2H12l-5.5 5.5V17.25h-2.75c-1.105 0-2-.895-2-2v-12zM3.75 3.25v12h4.5v3.5l3.5-3.5h8.5v-12h-16.5z")}
                    ${buildActionItem("reposts", 0, "M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z")}
                    ${buildActionItem("likes", 0, "M16.697 5.5c-1.222-.06-2.679.351-3.75 1.326-1.071-.975-2.528-1.386-3.75-1.326-2.737.134-4.861 2.339-4.861 5.059 0 3.371 3.056 5.906 5.8 8.134l2.811 2.288 2.811-2.288c2.744-2.228 5.8-4.763 5.8-8.134 0-2.72-2.124-4.925-4.861-5.059zM12 18.523l-2.023-1.646c-2.433-1.98-5.04-4.102-5.04-6.318 0-1.802 1.411-3.264 3.23-3.353 1.026-.05 2.147.33 2.924 1.037l.909.825.909-.825c.777-.707 1.898-1.087 2.924-1.037 1.819.089 3.23 1.551 3.23 3.353 0 2.216-2.607 4.338-5.04 6.318L12 18.523z", "like-action")}
                    ${buildActionItem("views", 1, "M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM3.5 21V11.5h2V21h-2z")}
                </div>
            </div>
        </div>
    `;
}

function createTweet() {
    const tweetText = composerInput.value.trim();
    if (!tweetText) {
        return;
    }

    const tweetMarkup = buildTweetCard(tweetText);
    feedContent.insertAdjacentHTML("afterbegin", tweetMarkup);
    composerInput.value = "";
    updatePostButtonState();
    composerInput.focus();
}

function handleLikeClick(actionItem) {
    const wasLiked = actionItem.dataset.liked === "true";
    actionItem.dataset.liked = wasLiked ? "false" : "true";
    actionItem.classList.toggle("liked", !wasLiked);
    incrementStat(actionItem, wasLiked ? -1 : 1);
}

function growLiveTweetStats() {
    const liveStatItems = feedContent?.querySelectorAll(".live-tweet .action-item[data-stat]") || [];
    liveStatItems.forEach((actionItem) => {
        const statType = actionItem.dataset.stat;
        let growthBy = 1;

        if (statType === "views") {
            growthBy = Math.floor(Math.random() * 6) + 2;
        } else if (statType === "likes") {
            growthBy = Math.floor(Math.random() * 3);
        } else {
            growthBy = Math.floor(Math.random() * 2);
        }

        if (growthBy > 0) {
            incrementStat(actionItem, growthBy);
        }
    });
}

if (composerInput && postButton && feedContent) {
    composerInput.addEventListener("input", updatePostButtonState);
    postButton.addEventListener("click", createTweet);

    composerInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            createTweet();
        }
    });

    feedContent.addEventListener("click", (event) => {
        const clickedItem = event.target.closest(".live-tweet .action-item.like-action");
        if (!clickedItem) {
            return;
        }

        handleLikeClick(clickedItem);
    });

    setInterval(growLiveTweetStats, STATS_GROWTH_INTERVAL_MS);
}

window.addEventListener("load", () => {
    setTimeout(() => {
        splashScreen?.classList.add("splash-hidden");
    }, 1500);
});

// Toggle between light/dark themes.
const darkModeToggle = document.getElementById("darkModeToggle");

function applyTheme(isDark) {
    document.body.classList.toggle("dark-mode", isDark);
    darkModeToggle?.setAttribute("aria-pressed", String(isDark));
}

if (darkModeToggle) {
    const savedTheme = window.localStorage.getItem("theme");
    const shouldUseDark = savedTheme === "dark";
    applyTheme(shouldUseDark);

    darkModeToggle.addEventListener("click", () => {
        const isDarkNow = !document.body.classList.contains("dark-mode");
        applyTheme(isDarkNow);
        window.localStorage.setItem("theme", isDarkNow ? "dark" : "light");
    });
}
