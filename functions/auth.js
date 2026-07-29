/**
 * Cloudflare Pages Function — GitHub OAuth step 1.
 * Route: /auth   (used by the CMS backend auth_endpoint)
 */
export async function onRequest(context) {
  const { request, env } = context;
  const origin = new URL(request.url).origin;
  const params = new URLSearchParams({
    client_id: env.GITHUB_CLIENT_ID || '',
    redirect_uri: `${origin}/callback`,
    scope: 'public_repo',
    state: crypto.randomUUID(),
  });
  return new Response(null, {
    status: 302,
    headers: { Location: `https://github.com/login/oauth/authorize?${params}` },
  });
}
