import { CopyButton } from "@/components/copy-button";

export default function CloudPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold text-white mb-4">Self-Hosting Conductor Cloud</h1>
      <p className="text-[#666] text-lg mb-8">
        Run your own Conductor Cloud server to sync credentials across devices
      </p>

      <h2 className="text-xl font-bold text-white mt-8 mb-4">Why Self-Host?</h2>
      <ul className="list-disc list-inside text-[#666] space-y-2 mb-8">
        <li><span className="text-white">Full data sovereignty</span> - Your credentials never leave your infrastructure</li>
        <li><span className="text-white">No external dependencies</span> - Everything runs locally</li>
        <li><span className="text-white">Custom authentication</span> - Use your own OAuth credentials</li>
        <li><span className="text-white">Free forever</span> - No subscription, no cloud fees</li>
      </ul>

      <h2 className="text-xl font-bold text-white mt-8 mb-4">Quick Start (Docker)</h2>
      <div className="bg-[#080808] rounded-lg p-4 border border-[#1a1a1a] mb-8">
        <pre className="text-sm text-[#666] overflow-x-auto">
{`# Clone the repository
git clone https://github.com/useconductor/conductor.git
cd conductor

# Start the cloud server
docker-compose -f docker-compose.cloud.yml up -d`}
        </pre>
        <CopyButton text="git clone https://github.com/useconductor/conductor.git && cd conductor && docker-compose -f docker-compose.cloud.yml up -d" />
      </div>
      <p className="text-[#666] mb-8">The server will be available at <code className="text-white">http://localhost:3000</code></p>

      <h2 className="text-xl font-bold text-white mt-8 mb-4">Configuration</h2>
      <p className="text-[#666] mb-4">Create a <code className="text-white">.env</code> file:</p>
      <div className="bg-[#080808] rounded-lg p-4 border border-[#1a1a1a] mb-8">
        <pre className="text-sm text-[#666] overflow-x-auto">
{`# Server config
PORT=3000
NODE_ENV=production

# OAuth (get from GitHub/Google developer portals)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Security (generate a strong random string)
JWT_SECRET=your_super_secret_jwt_key
ENCRYPTION_KEY=your_256bit_encryption_key

# Database
DATABASE_URL=postgresql://conductor:conductor@db:5432/conductor`}
        </pre>
        <CopyButton text="PORT=3000\nNODE_ENV=production\nGITHUB_CLIENT_ID=\nGITHUB_CLIENT_SECRET=\nGOOGLE_CLIENT_ID=\nGOOGLE_CLIENT_SECRET=\nJWT_SECRET=\nDATABASE_URL=postgresql://conductor:conductor@db:5432/conductor" />
      </div>

      <h2 className="text-xl font-bold text-white mt-8 mb-4">Docker Compose Services</h2>
      <div className="bg-[#080808] rounded-lg p-4 border border-[#1a1a1a] mb-8">
        <pre className="text-sm text-[#666] overflow-x-auto">
{`services:
  # API Server
  conductor-api:
    build: ./conductor
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://conductor:conductor@db:5432/conductor
      - JWT_SECRET=\${JWT_SECRET}
    depends_on:
      - db

  # PostgreSQL
  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=conductor
      - POSTGRES_PASSWORD=conductor
      - POSTGRES_DB=conductor
    volumes:
      - postgres_data:/var/lib/postgresql/data

  # Redis (optional, for caching)
  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data`}
        </pre>
      </div>

      <h2 className="text-xl font-bold text-white mt-8 mb-4">Connecting CLI</h2>
      <p className="text-[#666] mb-4">After starting your server, configure the CLI:</p>
      <div className="bg-[#080808] rounded-lg p-4 border border-[#1a1a1a] mb-8">
        <pre className="text-sm text-[#666]">conductor cloud login --server http://localhost:3000</pre>
        <CopyButton text="conductor cloud login --server http://localhost:3000" />
      </div>

      <h2 className="text-xl font-bold text-white mt-8 mb-4">OAuth Setup</h2>
      
      <h3 className="text-lg font-bold text-white mt-6 mb-3">GitHub OAuth App</h3>
      <ol className="list-decimal list-inside text-[#666] space-y-2 mb-4">
        <li>Go to <a href="https://github.com/settings/developers" className="text-white hover:underline">GitHub Developer Settings</a></li>
        <li>Create a new OAuth App</li>
        <li>Set Homepage URL to your domain</li>
        <li>Set Authorization callback URL to <code className="text-white">https://yourdomain.com/auth/callback</code></li>
        <li>Copy Client ID and Client Secret</li>
      </ol>

      <h3 className="text-lg font-bold text-white mt-6 mb-3">Google OAuth</h3>
      <ol className="list-decimal list-inside text-[#666] space-y-2 mb-8">
        <li>Go to <a href="https://console.cloud.google.com/apis/credentials" className="text-white hover:underline">Google Cloud Console</a></li>
        <li>Create OAuth 2.0 Client ID</li>
        <li>Set authorized redirect URIs to <code className="text-white">https://yourdomain.com/auth/callback</code></li>
        <li>Copy Client ID and Client Secret</li>
      </ol>

      <h2 className="text-xl font-bold text-white mt-8 mb-4">Getting Help</h2>
      <ul className="list-disc list-inside text-[#666] space-y-2">
        <li><a href="https://github.com/useconductor/conductor/issues" className="text-white hover:underline">GitHub Issues</a></li>
        <li><a href="https://discord.gg/conductor" className="text-white hover:underline">Discord</a></li>
        <li><a href="https://conductor.sh/docs" className="text-white hover:underline">Documentation</a></li>
      </ul>
    </div>
  );
}