// Раскладывает файлы из корня репозитория по папкам перед сборкой.
// Нужен, потому что при загрузке через браузер папки не сохранились.
const fs = require("fs");
const path = require("path");
const step = process.argv[2];
const mk = (d) => fs.mkdirSync(d, { recursive: true });
const cp = (from, to) => { mk(path.dirname(to)); fs.copyFileSync(from, to); };

if (step === "post") {
  cp("_worker.js", "_site/_worker.js");
  fs.writeFileSync("_site/.assetsignore", "_worker.js\n");
  console.log("worker copied");
  process.exit(0);
}

const includes = ["base.njk", "macros.njk", "tube.njk"];
const data = ["site.json", "home.json", "course.json", "club.json", "cases.json"];
const admin = ["config.yml", "index.html", "decap-cms.js"];
const img = /\.(jpe?g|png|webp|gif|svg)$/i;

for (const f of fs.readdirSync(".")) {
  if (!fs.statSync(f).isFile()) continue;
  if (includes.includes(f)) cp(f, "src/_includes/" + f);
  else if (f.endsWith(".njk")) cp(f, "src/" + f);
  else if (data.includes(f)) cp(f, "src/_data/" + f);
  else if (admin.includes(f)) cp(f, "src/admin/" + f);
  else if (f === "site.css" || f === "site.js") cp(f, "src/assets/" + f);
  else if (f.endsWith(".woff2")) cp(f, "src/assets/fonts/" + f);
  else if (img.test(f)) cp(f, "src/images/uploads/" + f);
}
// фото, загруженные через админку
if (fs.existsSync("uploads")) for (const f of fs.readdirSync("uploads")) cp("uploads/" + f, "src/images/uploads/" + f);

// лендинги: один файл landings.json → отдельные файлы для сборки
mk("src/_data/landings");
const L = JSON.parse(fs.readFileSync("landings.json", "utf8")).items || [];
L.forEach((l, i) => {
  l.url = String(l.url || "stranica-" + (i + 1)).toLowerCase().replace(/[^a-z0-9-]+/g, "-");
  fs.writeFileSync("src/_data/landings/" + l.url + ".json", JSON.stringify(l));
});
console.log("prepared", L.length, "landings");
