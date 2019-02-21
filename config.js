async function saveFields(event) {
    event.preventDefault();
    let formData = new FormData(event.target);
    for (let entry of formData.entries()) {
        browser.storage.sync.set({[entry[0]]: entry[1]});
    }
}

async function loadFields() {
    for (let field of ["pat", "repo", "org"]) {
        let result = browser.storage.sync.get(field);
        result.then((res) => {
            document.querySelector(`input[name=${field}]`).value = res[field] || '';
        });
    }
}

async function saveRepo(event) {
    await saveFields(event);
}

async function savePat(event) {
    await saveFields(event);
    hidePat(event);
}

function hidePat() {
    document.getElementById("pat").style.display = "none";
    document.getElementById("show-pat").style.display = "block";
}

function showPat() {
    document.getElementById("pat").style.display = "block";
    document.getElementById("show-pat").style.display = "none";
}

window.addEventListener("load", async function() {
    await loadFields();
    document.getElementById("pat").addEventListener("submit", savePat);
    document.getElementById("repo").addEventListener("submit", saveRepo);
    document.getElementById("show-pat").addEventListener("click", showPat);
});