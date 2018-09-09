const fs = require("fs");

const source = `${__dirname}/src`;
const compiled = `${__dirname}/compiled`;
const destination = `${__dirname}/bundled`;


const pkg = JSON.parse(fs.readFileSync(`${__dirname}/package.json`));
if (!pkg) {
  throw("Could not read package.json");
}

const version_name = `v${pkg.version}-alpha`;


// add current version in frontend and backend.
const mustache = require("mustache");
["frontend.js"].forEach(file_name => {
  fs.readFile(`${destination}/${file_name}`, (err, result) => {
    if (err) {
      throw("Error reading file");
    }
    let rendered = mustache.render(result.toString(), {version: version_name});
    fs.writeFileSync(`${destination}/${file_name}`, rendered);
  })
})


// build manifest.json
fs.writeFileSync(`${destination}/manifest.json`, JSON.stringify({
  "name": pkg.name,
  "description": pkg.description,
  "version": pkg.version,
  "version_name": version_name,
  "author": pkg.author,
  "manifest_version": 2,
  "icons": {
    "16": "icon16.png",
    "48": "icon48.png",
    "128": "icon128.png"
  },

  "browser_action": {
    "default_title": "Topiary",
    "default_popup": "topiary.htm?popup",
    "default_icon": "icon128.png"
  },
  "background": {
    "persistent": false,
    "scripts": ["backend.js"]
  },

  "options_ui": {
    "page": "options.htm",
    "chrome_style": true
  },

  "optional_permissions": [
    "activeTab",
    "alarms",
    "bookmarks",
    "history",
    "http://*/",
    "https://*/"
  ]
}, null, 2));


// create sources.json
const builtin_source_list = require(`${destination}/builtin_sources`).source_list;
const source_list = require(`${destination}/sources`).source_list;
fs.writeFileSync(`${destination}/sources.json`, JSON.stringify(builtin_source_list.concat(source_list)));
fs.unlinkSync(`${destination}/sources.js`);
fs.unlinkSync(`${destination}/builtin_sources.js`);


// copy assets over
["styles.css", "icon16.png", "icon48.png", "icon128.png"].forEach(asset => {
  fs.copyFileSync(`${source}/gui/${asset}`, `${destination}/${asset}`);
});

/*["LICENSE.txt"].forEach(license => {
  fs.copyFileSync(`${__dirname}/${license}`, `${destination}/${license}`);
})*/


// create html
[{name: "topiary", script: "frontend"}, {name: "options", script: "options"}].forEach(file => {

  let contents = `<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <title>${file.name}</title>
        <meta name="viewport" content="width=device-width" />

        <link rel="stylesheet" type="text/css" href="/styles.css" />
        <script defer src="/${file.script}.js"></script>
    </head>
    <body>
        <noscript><p>Sorry, Topiary requires a JavaScript environment to function.</p></noscript>
    </body>
</html>
`

  fs.writeFileSync(`${destination}/${file.name}.htm`, contents);
})
