/**
 * Cloudflare Pages Function — GitHub OAuth step 2.
 * Route: /callback  (must match the GitHub OAuth App's Authorization callback URL)
 */
export async function onRequest(context) {
  const { request, env } = context;
  const code = new URL(request.url).searchParams.get('code');

  let status = 'error';
  let content = { error: 'OAuth failed' };
  try {
    const res = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'User-Agent': 'QIT-site',
      },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });
    const data = await res.json();
    if (data.access_token) {
      status = 'success';
      content = { token: data.access_token, provider: 'github' };
    } else {
      content = { error: data.error_description || 'No access token returned' };
    }
  } catch (e) {
    content = { error: String(e) };
  }

  const payload = JSON.stringify(content);
  const body = `<!doctype html><html><body><script>
    (function () {
      function receive(e) {
        window.opener.postMessage('authorization:github:${status}:${payload}', e.origin);
        window.removeEventListener('message', receive, false);
      }
      window.addEventListener('message', receive, false);
      window.opener.postMessage('authorizing:github', '*');
    })();
  </script></body></html>`;

  return new Response(body, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}
