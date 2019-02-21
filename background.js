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

browser.contextMenus.create({
    id: "create-issue",
    title: "Create GitHub Issue",
    contexts: ["selection"],
    icons: {
        "16": "icon.svg"
    }
});

browser.contextMenus.onClicked.addListener((info, tab) => {
    let data = {
        'title': info.selectionText.slice(0, 30) + '...',
        'body': `${info.selectionText}\n\n${info.pageUrl}`
    }
    createIssue(data);
});

browser.browserAction.onClicked.addListener(() => {
    browser.tabs.create({"url": "/config.html"});
});
