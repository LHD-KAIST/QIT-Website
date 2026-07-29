/**
 * GitHub OAuth — step 1: send the user to GitHub to authorize.
 * The client id/secret live in Netlify environment variables, never in the repo.
 * Scope `public_repo` = write access to public repositories only.
 */
export default async (req) => {
  const origin = new URL(req.url).origin;
  const clientId = process.env.GITHUB_CLIENT_ID;

  const params = new URLSearchParams({
    client_id: clientId ?? '',
    redirect_uri: `${origin}/.netlify/functions/callback`,
    scope: 'public_repo',
    state: crypto.randomUUID(),
  });

  return new Response(null, {
    status: 302,
    headers: { Location: `https://github.com/login/oauth/authorize?${params}` },
  });
};
