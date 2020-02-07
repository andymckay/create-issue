async function createIssue(issue) {
    let data = await browser.storage.sync.get();
    let url = `https://api.github.com/repos/${data.org}/${data.repo}/issues`;
    let req = fetch(url, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            "Authorization": `token ${data.pat}`
        },
        body: JSON.stringify(issue)
    })
    .then(res => {
        let message = '';
        if (res.status == 201) {
            message = "Issue successfully created.";
        } else {
            message = "There was an error creating that issue.";
        }
        browser.notifications.create({
            type: "basic",
            title: "Create GitHub Issue",
            message: message
      });
    });
}

async function getIssueCount() {
    let data = await browser.storage.sync.get();
    let url = `https://api.github.com/search/issues?q=q=is%3Aissue+is%3Aopen+repo%3A${data.org}%2F${data.repo}`;
    let req = fetch(url, {
        method: "GET",
        headers: {
            "Content-type": "application/json",
            "Authorization": `token ${data.pat}`
        }
    })
    .then(res => {
        return res.json()
    })
    .then(json => {
        browser.browserAction.setBadgeText({text: json.total_count.toString()})
    })
    .catch(err => {
        browser.browserAction.setBadgeText({text: 'ERR'})
    })
}

browser.contextMenus.create({
    id: "create-issue",
    title: "Create GitHub Issue",
    contexts: ["selection"],
    icons: {
        "16": "icon.svg"
    }
});

browser.contextMenus.onClicked.addListener((info, tab) => {
    let title = info.selectionText;
    let data = {
        'title': title.length > 30 ? title.slice(0, 30) + "..." : title,
        'body': `${info.selectionText}\n\n${info.pageUrl}`
    }
    createIssue(data);
});

browser.alarms.onAlarm.addListener(() => {
	getIssueCount()
})

browser.alarms.create("getIssueCount", {periodInMinutes: 1})
browser.browserAction.setBadgeBackgroundColor({color: "blue"})