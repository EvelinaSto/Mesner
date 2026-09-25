module.exports = function (cfg) {
  cfg.addPassthroughCopy({ "src/assets": "assets" });
  cfg.addPassthroughCopy({ "src/images": "images" });
  cfg.addPassthroughCopy({ "src/admin": "admin" });
  cfg.ignores.add("src/admin/**");

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  cfg.addFilter("values", (o) => Object.values(o || {}));
  cfg.addFilter("published", (a) => (a || []).filter((l) => l.published));
  cfg.addFilter("inmenu", (a) => (a || []).filter((l) => l.published && l.menu));
  cfg.addFilter("pad", (n) => (n < 10 ? "0" + n : "" + n));
  cfg.addFilter("paras", (s) =>
    String(s || "").split(/\n\s*\n/).filter((p) => p.trim()).map((p) => "<p>" + esc(p.trim()).replace(/\n/g, "<br>") + "</p>").join("")
  );
  cfg.addFilter("br", (s) => esc(s).replace(/\n/g, "<br>"));
  cfg.addFilter("digits", (s) => String(s || "").replace(/\D/g, ""));

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    templateFormats: ["njk"],
    htmlTemplateEngine: "njk",
  };
};
