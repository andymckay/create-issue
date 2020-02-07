window.addEventListener("load", async function() {
	browser.storage.sync.get().then((data) => {
		console.log(data.repo)
		if (typeof(data.repo) === "undefined") {
			console.log("hiding")
			this.document.getElementById("issue-wrapper").style.display = "none"
		}
	})
	document.getElementById("issues").addEventListener("click", (event) => {
		browser.storage.sync.get().then((data) => {
			browser.tabs.create({"url": `https://github.com/${data.org}/${data.repo}/issues`});
			this.window.close();
		})
	})
	document.getElementById("config").addEventListener("click", (event) => {
		browser.tabs.create({"url": "/config.html"});
		this.window.close();
	})
})