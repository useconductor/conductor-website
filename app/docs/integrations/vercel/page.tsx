// FILE: app/docs/integrations/vercel/page.tsx

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CopyButton } from "@/components/copy-button";

const conductorConfig = `{
  "plugins": {
    "vercel": {
      "token": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      "teamId": "team_xxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      "projectId": "prj_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    }
  }
}`;

const findTeamId = `// Team ID — go to vercel.com/[your-team]/settings
// Under "General" tab, look for "Team ID"
// Starts with "team_"

// Project ID — go to vercel.com/[team]/[project]/settings
// Under "General" tab, look for "Project ID"
// Starts with "prj_"`;

const deployHookCreate = `// Create a deploy hook in:
// Project Settings → Git → Deploy Hooks
// Name: "Conductor trigger"
// Branch: main (or any branch)
// Vercel provides a URL like:
// https://api.vercel.com/v1/integrations/deploy/xxxxxxxx/yyyyyyyy

// Trigger it with:
curl -X POST https://api.vercel.com/v1/integrations/deploy/xxxxxxxx/yyyyyyyy`;

const deployHookTrigger = `curl -X POST \\
  "https://api.vercel.com/v1/integrations/deploy/YOUR_HOOK_ID/YOUR_HOOK_TOKEN"`;

const envAddExample = `// Add an environment variable to a project
// vercel.env.add example parameters:
{
  "tool": "vercel.env.add",
  "projectId": "prj_xxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "key": "DATABASE_URL",
  "value": "postgresql://user:pass@host/db",
  "target": ["production", "preview", "development"],
  "type": "encrypted"
}`;

const tools = [
  { name: "vercel.deployment.list", desc: "List recent deployments for a project. Returns URL, state, branch, and created time." },
  { name: "vercel.deployment.get", desc: "Get full details for a deployment by deployment ID." },
  { name: "vercel.deployment.create", desc: "Create a new deployment from a Git ref or file bundle." },
  { name: "vercel.deployment.cancel", desc: "Cancel a queued or building deployment by deployment ID." },
  { name: "vercel.domain.list", desc: "List all domains attached to the team or a specific project." },
  { name: "vercel.domain.add", desc: "Add a domain to a project. Returns DNS configuration required." },
  { name: "vercel.env.list", desc: "List all environment variables for a project across all environments." },
  { name: "vercel.env.add", desc: "Add or update an environment variable for a project." },
  { name: "vercel.env.delete", desc: "Delete an environment variable by its ID." },
  { name: "vercel.project.list", desc: "List all projects in the team or personal account." },
  { name: "vercel.project.get", desc: "Get metadata for a project including framework, repo, and domains." },
  { name: "vercel.logs.get", desc: "Retrieve build or runtime logs for a deployment." },
];

const errors = [
  {
    code: "403 — missing scope",
    cause: "The access token does not have permission for the requested operation.",
    fix: "Create a new token at vercel.com/account/settings/tokens with full scope, or add the required scope to a limited token.",
  },
  {
    code: "team not found",
    cause: "The teamId does not match any team the token has access to.",
    fix: "Copy the Team ID from team settings. Ensure the token belongs to a user who is a member of that team.",
  },
  {
    code: "project not found",
    cause: "The projectId does not exist or does not belong to the configured team.",
    fix: "Copy the Project ID from project settings. Verify teamId and projectId match the same team/project.",
  },
  {
    code: "deployment not cancellable",
    cause: "The deployment is already in a terminal state (READY, ERROR, or CANCELED).",
    fix: "Only deployments in QUEUED or BUILDING state can be cancelled. Check current state with vercel.deployment.get first.",
  },
  {
    code: "rate limit exceeded",
    cause: "Too many API requests in a short window.",
    fix: "Vercel enforces 200 requests per minute per token. Conductor backs off automatically, but reduce frequency of polling if this occurs repeatedly.",
  },
  {
    code: "Invalid token",
    cause: "Token was deleted, expired, or belongs to a different account.",
    fix: "Create a new token at vercel.com/account/settings/tokens. Update the Conductor config.",
  },
];

export default function VercelIntegrationPage() {
  return (
    <div>
      <div className="mb-12">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#3a3a3a]">
          Integrations
        </p>
        <h1 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">Vercel</h1>
        <p className="mt-3 text-[#666]">
          Connect Conductor to Vercel to manage deployments, domains, environment variables, and
          projects. Covers token creation, finding IDs, deploy hooks, and all available tools.
        </p>
      </div>

      <div className="space-y-14">

        {/* Access token */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Creating an access token</h2>
          <ol className="space-y-2 text-sm text-[#666]">
            <li className="flex gap-3"><span className="font-mono text-[#444]">1.</span>Go to <span className="font-mono text-[#888]">vercel.com/account/settings/tokens</span>.</li>
            <li className="flex gap-3"><span className="font-mono text-[#444]">2.</span>Click <span className="font-mono text-[#888]">Create</span>. Give the token a name (e.g., "Conductor").</li>
            <li className="flex gap-3"><span className="font-mono text-[#444]">3.</span>Choose scope: <span className="font-mono text-[#888]">Full Account</span> for all operations, or a limited scope for specific teams.</li>
            <li className="flex gap-3"><span className="font-mono text-[#444]">4.</span>Set an expiration or choose "No expiration" for long-lived automation tokens.</li>
            <li className="flex gap-3"><span className="font-mono text-[#444]">5.</span>Copy the token immediately — it is only shown once.</li>
          </ol>
          <div className="mt-4 rounded-lg border border-[#1a1a1a] bg-[#060606] p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#3a3a3a]">Full vs limited scope</p>
            <p className="mt-2 text-xs text-[#555]">
              Full-scope tokens can access all teams the user belongs to. Limited-scope tokens are
              scoped to a single team. If you receive 403 errors on team operations, your token may
              be scoped to the wrong team or to personal only.
            </p>
          </div>
        </section>

        {/* Finding IDs */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Finding Team ID and Project ID</h2>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">where to find IDs</span>
              <CopyButton text={findTeamId} />
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{findTeamId}</code></pre>
          </div>
          <p className="mt-3 text-xs text-[#555]">
            Personal accounts do not have a Team ID. Leave{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">teamId</code>{" "}
            empty or omit it entirely when using a personal account token.
          </p>
        </section>

        {/* Conductor config */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Conductor config</h2>
          <p className="mb-3 text-sm text-[#666]">
            The <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">projectId</code>{" "}
            sets the default project for all project-scoped tools. You can override it per-call by
            passing the <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">projectId</code>{" "}
            parameter directly to any tool that accepts it.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">conductor.config.json</span>
              <CopyButton text={conductorConfig} />
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{conductorConfig}</code></pre>
          </div>
        </section>

        {/* Tools */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Available tools</h2>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a]">
            <table className="w-full text-sm">
              <thead className="bg-[#080808]">
                <tr className="border-b border-[#1a1a1a]">
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] font-normal uppercase tracking-widest text-[#3a3a3a]">Tool</th>
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] font-normal uppercase tracking-widest text-[#3a3a3a]">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0d0d0d] bg-[#060606]">
                {tools.map((t) => (
                  <tr key={t.name}>
                    <td className="px-4 py-2.5 font-mono text-xs text-[#888]">{t.name}</td>
                    <td className="px-4 py-2.5 text-xs text-[#555]">{t.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Deploy hooks */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Deploy hooks</h2>
          <p className="mb-3 text-sm text-[#666]">
            Deploy hooks let you trigger a deployment without API credentials — useful for external
            systems or simple cron-based redeploys. Create one in project settings and trigger it
            with a plain HTTP POST.
          </p>
          <div className="space-y-3">
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                <span className="font-mono text-[10px] text-[#3a3a3a]">creating a deploy hook</span>
                <CopyButton text={deployHookCreate} />
              </div>
              <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{deployHookCreate}</code></pre>
            </div>
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                <span className="font-mono text-[10px] text-[#3a3a3a]">triggering a deploy hook</span>
                <CopyButton text={deployHookTrigger} />
              </div>
              <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{deployHookTrigger}</code></pre>
            </div>
          </div>
        </section>

        {/* Env vars */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Environment variables</h2>
          <p className="mb-3 text-sm text-[#666]">
            Vercel environment variables can target specific environments: production, preview, and
            development. The <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">type</code>{" "}
            field controls storage:{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">encrypted</code>{" "}
            for secrets (never shown after save),{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">plain</code> for
            non-sensitive values,{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">sensitive</code>{" "}
            for values masked in logs.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">vercel.env.add example</span>
              <CopyButton text={envAddExample} />
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{envAddExample}</code></pre>
          </div>
        </section>

        {/* Rate limits */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Rate limits</h2>
          <p className="mb-3 text-sm text-[#666]">
            The Vercel REST API enforces 200 requests per minute per access token. Deployment
            creation is additionally limited to the number of deployments included in your plan
            (Hobby: 100/day, Pro: unlimited). Conductor retries 429 responses with exponential
            backoff. To avoid hitting limits when polling deployment status, use{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">vercel.deployment.get</code>{" "}
            once rather than repeatedly polling.
          </p>
        </section>

        {/* Common errors */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Common errors</h2>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a]">
            <table className="w-full text-sm">
              <thead className="bg-[#080808]">
                <tr className="border-b border-[#1a1a1a]">
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] font-normal uppercase tracking-widest text-[#3a3a3a]">Error</th>
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] font-normal uppercase tracking-widest text-[#3a3a3a]">Cause</th>
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] font-normal uppercase tracking-widest text-[#3a3a3a]">Fix</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0d0d0d] bg-[#060606]">
                {errors.map((e) => (
                  <tr key={e.code}>
                    <td className="px-4 py-3 font-mono text-xs text-[#888] align-top">{e.code}</td>
                    <td className="px-4 py-3 text-xs text-[#555] align-top">{e.cause}</td>
                    <td className="px-4 py-3 text-xs text-[#444] align-top">{e.fix}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>

      <div className="mt-14 border-t border-[#1a1a1a] pt-8">
        <Link
          href="/docs/integrations"
          className="inline-flex items-center gap-2 text-sm text-[#555] transition-colors hover:text-white"
        >
          All integrations
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
