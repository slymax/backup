const fetch = require("node-fetch");
const download = require("download");
const args = require("args").option("token").parse(process.argv);

const backup = async token => {
    const options = {
        method: "GET",
        headers: {
            "Accept": "application/vnd.github.mister-fantastic-preview+json",
            "Authorization": "token " + token
        }
    };
    const date = (new Date).getTime();
    const response = await fetch("https://api.github.com/user/repos?affiliation=owner&per_page=100", options);
    const repos = await response.json();
    for (const repo of repos) {
        const response = await fetch(`https://api.github.com/repos/${repo.owner.login}/${repo.name}/branches`, options);
        const branches = await response.json();
        for (const branch of branches) {
            console.log(`downloading ${repo.owner.login}/${repo.name}/${branch.name}`);
            await download(`https://github.com/${repo.owner.login}/${repo.name}/archive/${branch.name}.zip`, `backups/${date}/${repo.name}/${branch.name}`, { "headers": options.headers, "extract": true, "strip": 1 });
        }
    }
}

if (args.token) {
    backup(args.token);
}
