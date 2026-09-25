// Вход в админку через GitHub (шаг 2): получает токен и передаёт его в админку.
export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const saved = (request.headers.get("Cookie") || "").match(/(?:^|;\s*)decap_state=([^;]+)/);
  if (!code || !saved || saved[1] !== state) return reply("error", { message: "Сессия входа устарела. Попробуйте ещё раз." });

  const res = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json", "User-Agent": "decap-cms-oauth" },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: `${url.origin}/api/callback`,
    }),
  });
  const data = await res.json();
  if (!data.access_token) return reply("error", { message: data.error_description || "GitHub не выдал токен" });
  return reply("success", { token: data.access_token, provider: "github" });
}

function reply(status, content) {
  const message = JSON.stringify(`authorization:github:${status}:${JSON.stringify(content)}`);
  const html = `<!doctype html><meta charset="utf-8"><body><p>Вход…</p><script>
(function () {
  function receive(e) {
    window.opener.postMessage(${message}, e.origin);
    window.removeEventListener("message", receive, false);
  }
  window.addEventListener("message", receive, false);
  window.opener.postMessage("authorizing:github", "*");
})();
</script></body>`;
  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8", "Set-Cookie": "decap_state=; Path=/api; Max-Age=0; Secure; HttpOnly; SameSite=Lax" },
  });
}
