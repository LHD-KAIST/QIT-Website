/**
 * GitHub OAuth — step 2: exchange the code for an access token and hand it back
 * to the CMS window via postMessage (the protocol Decap/Sveltia CMS expects).
 */
export default async (req) => {
  const code = new URL(req.url).searchParams.get('code');
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  let status = 'error';
  let content = { error: 'OAuth failed' };

  try {
    const res = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
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

  return new Response(body, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
};
