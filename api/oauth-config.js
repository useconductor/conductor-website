// api/oauth-config.js
// Serves Google OAuth client credentials to the Conductor installer.
// Secrets are stored in Vercel environment variables — never in the repo.
//
// Vercel env vars to set:
//   GOOGLE_CLIENT_ID     — your OAuth 2.0 client ID
//   GOOGLE_CLIENT_SECRET — your OAuth 2.0 client secret

export default function handler(req, res) {
  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'method not allowed' });
  }

  // Only serve to the Conductor installer or conductor itself
  const ua = req.headers['user-agent'] || '';
  const installHeader = req.headers['x-conductor-install'] || '';
  const isConductor = ua.includes('Conductor') || installHeader === 'true' || ua.includes('curl');

  if (!isConductor) {
    return res.status(403).json({ error: 'forbidden' });
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(503).json({ error: 'oauth not configured' });
  }

  // No caching — always fetch fresh
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json');

  return res.status(200).json({
    client_id: clientId,
    client_secret: clientSecret,
  });
}
