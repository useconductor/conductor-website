import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CopyButton } from "@/components/copy-button";

type EventType = {
  event: string;
  description: string;
  payload: string;
};

const eventTypes: EventType[] = [
  {
    event: "tool.called",
    description: "Fires when a tool execution completes successfully.",
    payload: `{
  "id": "evt_01HXYZ",
  "type": "tool.called",
  "timestamp": "2026-04-04T10:23:45.123Z",
  "data": {
    "tool_name": "github_issues",
    "plugin": "github",
    "input": { "owner": "myorg", "repo": "api", "state": "open" },
    "output": { "count": 14, "issues": [...] },
    "latency_ms": 312,
    "session_id": "sess_abc123"
  }
}`,
  },
  {
    event: "tool.failed",
    description: "Fires when a tool throws an error or times out.",
    payload: `{
  "id": "evt_01HXYZ",
  "type": "tool.failed",
  "timestamp": "2026-04-04T10:23:45.123Z",
  "data": {
    "tool_name": "slack_send",
    "plugin": "slack",
    "error": "ECONNREFUSED — Slack API unreachable",
    "error_code": "PLUGIN_REQUEST_FAILED",
    "circuit_state": "closed",
    "attempt": 3
  }
}`,
  },
  {
    event: "plugin.ready",
    description: "Fires when a plugin initializes successfully and its tools are registered.",
    payload: `{
  "id": "evt_01HXYZ",
  "type": "plugin.ready",
  "timestamp": "2026-04-04T10:23:45.123Z",
  "data": {
    "plugin_name": "github",
    "tool_count": 20,
    "zero_config": false,
    "version": "1.0.0"
  }
}`,
  },
  {
    event: "plugin.error",
    description: "Fires when a plugin's initialize() throws or isConfigured() returns false.",
    payload: `{
  "id": "evt_01HXYZ",
  "type": "plugin.error",
  "timestamp": "2026-04-04T10:23:45.123Z",
  "data": {
    "plugin_name": "slack",
    "error": "Missing SLACK_BOT_TOKEN in keychain",
    "error_code": "PLUGIN_NOT_CONFIGURED",
    "state": "not_configured"
  }
}`,
  },
  {
    event: "circuit.opened",
    description: "Fires when a circuit breaker opens after repeated tool failures.",
    payload: `{
  "id": "evt_01HXYZ",
  "type": "circuit.opened",
  "timestamp": "2026-04-04T10:23:45.123Z",
  "data": {
    "tool_name": "github_issues",
    "plugin": "github",
    "failure_count": 5,
    "threshold": 5,
    "reset_after_ms": 30000
  }
}`,
  },
  {
    event: "circuit.closed",
    description: "Fires when a circuit breaker resets and the tool is available again.",
    payload: `{
  "id": "evt_01HXYZ",
  "type": "circuit.closed",
  "timestamp": "2026-04-04T10:23:45.123Z",
  "data": {
    "tool_name": "github_issues",
    "plugin": "github",
    "downtime_ms": 32410
  }
}`,
  },
  {
    event: "audit.written",
    description: "Fires every time an entry is written to the append-only audit log.",
    payload: `{
  "id": "evt_01HXYZ",
  "type": "audit.written",
  "timestamp": "2026-04-04T10:23:45.123Z",
  "data": {
    "seq": 1043,
    "entry_hash": "sha256:a3f4...",
    "previous_hash": "sha256:9b2c...",
    "tool": "github_create_issue",
    "chain_intact": true
  }
}`,
  },
  {
    event: "server.started",
    description: "Fires once when the MCP server finishes initialization.",
    payload: `{
  "id": "evt_01HXYZ",
  "type": "server.started",
  "timestamp": "2026-04-04T10:23:45.123Z",
  "data": {
    "version": "2.1.0",
    "tool_count": 87,
    "plugin_count": 12,
    "transport": "stdio",
    "zero_config_plugins": 8
  }
}`,
  },
];

const addWebhookCmd = `# Subscribe to all events:
conductor webhooks add --url https://hooks.example.com/conductor

# Subscribe to specific events only:
conductor webhooks add \\
  --url https://hooks.example.com/conductor \\
  --events tool.called,tool.failed

# Add with HMAC signing secret:
conductor webhooks add \\
  --url https://hooks.example.com/conductor \\
  --events tool.called,tool.failed,circuit.opened \\
  --secret whsec_your_signing_secret

# List all registered webhooks:
conductor webhooks list

# Remove a webhook:
conductor webhooks remove <id>

# Send a test payload:
conductor webhooks test <id>`;

const nodeVerification = `const crypto = require("crypto");

function verifySignature(rawBody, signature, secret) {
  // Conductor sends: X-Conductor-Signature: sha256=<hex>
  const expected = "sha256=" + crypto
    .createHmac("sha256", secret)
    .update(rawBody)         // rawBody must be the raw Buffer, not parsed JSON
    .digest("hex");

  // Use timingSafeEqual to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(signature, "utf8"),
    Buffer.from(expected, "utf8")
  );
}

// Express.js middleware example:
app.post("/conductor-events", express.raw({ type: "application/json" }), (req, res) => {
  const sig = req.headers["x-conductor-signature"];
  const secret = process.env.CONDUCTOR_WEBHOOK_SECRET;

  if (!verifySignature(req.body, sig, secret)) {
    return res.status(401).send("Invalid signature");
  }

  const event = JSON.parse(req.body);
  console.log("Event:", event.type, event.data);
  res.status(200).send("ok");
});`;

const pythonVerification = `import hashlib
import hmac

def verify_signature(raw_body: bytes, signature: str, secret: str) -> bool:
    """
    Verify X-Conductor-Signature header.
    signature format: "sha256=<hex_digest>"
    """
    expected = "sha256=" + hmac.new(
        secret.encode("utf-8"),
        raw_body,
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(signature, expected)

# FastAPI example:
from fastapi import FastAPI, Request, HTTPException, Header

app = FastAPI()

@app.post("/conductor-events")
async def handle_event(
    request: Request,
    x_conductor_signature: str = Header(...)
):
    raw_body = await request.body()
    secret = os.environ["CONDUCTOR_WEBHOOK_SECRET"]

    if not verify_signature(raw_body, x_conductor_signature, secret):
        raise HTTPException(status_code=401, detail="Invalid signature")

    event = await request.json()
    print(f"Event: {event['type']}", event['data'])
    return {"ok": True}`;

const retrySchedule = [
  { attempt: 1, delay: "1 second", note: "Initial retry" },
  { attempt: 2, delay: "2 seconds", note: "Exponential backoff" },
  { attempt: 3, delay: "4 seconds", note: "Exponential backoff" },
  { attempt: 4, delay: "8 seconds", note: "Exponential backoff" },
  { attempt: 5, delay: "16 seconds", note: "Final attempt" },
];

const incomingWebhookCmd = `conductor webhooks create \\
  --name "github-events" \\
  --url /hooks/github \\
  --handler "process_github_event"`;

const outgoingCmd = `conductor webhooks register \\
  --url "https://example.com/conductor-events" \\
  --events "tool.called,tool.failed,plugin.error" \\
  --secret "whsec_your_signing_secret"`;

export default function WebhooksPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-12">
        <p className="mb-3 text-[10px] font-mono uppercase tracking-[0.25em] text-[#3a3a3a]">
          Core
        </p>
        <h1 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">
          Webhooks
        </h1>
        <p className="mt-3 text-[#666]">
          Event-driven integrations. Push Conductor events to any endpoint, or receive external events
          to trigger tool calls. All outgoing webhooks are signed with HMAC-SHA256.
        </p>
      </div>

      <div className="space-y-14">
        {/* Overview */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Overview</h2>
          <p className="mb-3 text-sm leading-relaxed text-[#666]">
            Conductor supports two webhook directions:
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-[#1a1a1a] bg-[#080808] p-5">
              <h3 className="mb-2 font-mono text-sm font-semibold text-white">Outgoing webhooks</h3>
              <p className="text-xs leading-relaxed text-[#555]">
                Conductor pushes signed event payloads to your endpoints when tools are called,
                plugins change state, or the circuit breaker fires. Use these for observability,
                alerting, and automation — pipe Conductor events into Slack, PagerDuty, Datadog,
                or any custom endpoint.
              </p>
            </div>
            <div className="rounded-lg border border-[#1a1a1a] bg-[#080808] p-5">
              <h3 className="mb-2 font-mono text-sm font-semibold text-white">Incoming webhooks</h3>
              <p className="text-xs leading-relaxed text-[#555]">
                Register named endpoints that external services (GitHub, Stripe, CI pipelines) can
                POST to. Conductor validates, logs, and routes the payload to the specified handler
                tool. Requires HTTP transport.
              </p>
            </div>
          </div>
        </section>

        {/* Adding outgoing webhooks */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Adding a webhook</h2>
          <p className="mb-4 text-sm leading-relaxed text-[#666]">
            Register an outgoing webhook endpoint with the CLI. Webhooks fire for every enabled event
            type unless you filter with <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">--events</code>.
          </p>
          <div className="relative overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-3">
              <span className="font-mono text-[10px] text-[#3a3a3a]">terminal</span>
              <CopyButton text={addWebhookCmd} />
            </div>
            <pre className="p-4 text-xs font-mono leading-relaxed text-[#888]">
              <code>{addWebhookCmd}</code>
            </pre>
          </div>
        </section>

        {/* Event types */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Event types</h2>
          <p className="mb-5 text-sm leading-relaxed text-[#666]">
            8 event types are available. Expand each to see the full payload schema.
          </p>
          <div className="space-y-3">
            {eventTypes.map((item) => (
              <div
                key={item.event}
                className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]"
              >
                <div className="flex items-center justify-between px-4 py-4">
                  <div className="flex items-center gap-4">
                    <code className="rounded bg-[#111] px-2.5 py-1 font-mono text-xs text-white">
                      {item.event}
                    </code>
                    <span className="text-xs text-[#555]">{item.description}</span>
                  </div>
                </div>
                <div className="border-t border-[#111]">
                  <div className="flex items-center justify-between border-b border-[#111] px-4 py-2">
                    <span className="font-mono text-[10px] text-[#333]">example payload</span>
                    <CopyButton text={item.payload} />
                  </div>
                  <pre className="p-4 text-[10px] font-mono leading-relaxed text-[#555]">
                    <code>{item.payload}</code>
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Signature verification - Node */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Signature verification</h2>
          <p className="mb-4 text-sm leading-relaxed text-[#666]">
            Every outgoing webhook request includes an{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">X-Conductor-Signature</code> header
            in the format <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">sha256=&lt;hex_digest&gt;</code>.
            Always verify this header before processing a payload. Use your signing secret from{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">conductor webhooks add --secret</code>.
          </p>
          <div className="space-y-4">
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-3">
                <span className="font-mono text-[10px] text-[#3a3a3a]">Node.js</span>
                <CopyButton text={nodeVerification} />
              </div>
              <pre className="overflow-x-auto p-4 text-[10px] font-mono leading-relaxed text-[#888]">
                <code>{nodeVerification}</code>
              </pre>
            </div>
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-3">
                <span className="font-mono text-[10px] text-[#3a3a3a]">Python</span>
                <CopyButton text={pythonVerification} />
              </div>
              <pre className="overflow-x-auto p-4 text-[10px] font-mono leading-relaxed text-[#888]">
                <code>{pythonVerification}</code>
              </pre>
            </div>
          </div>
          <div className="mt-4 rounded-lg border border-[#1a1a1a] bg-[#080808] p-4">
            <p className="font-mono text-xs font-medium text-white">Important: raw body required</p>
            <p className="mt-1 text-xs leading-relaxed text-[#555]">
              The HMAC is computed over the raw request body bytes. Do not parse the JSON before
              verifying — pass the raw <code className="font-mono">Buffer</code> (Node) or{" "}
              <code className="font-mono">bytes</code> (Python) to the HMAC function. Any whitespace
              difference will cause verification to fail.
            </p>
          </div>
        </section>

        {/* Retry behavior */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Retry behavior</h2>
          <p className="mb-4 text-sm leading-relaxed text-[#666]">
            Conductor retries failed webhook deliveries (non-2xx response or connection error)
            up to 5 times with exponential backoff. After all retries are exhausted, the event
            is written to the dead letter queue at{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">~/.conductor/dlq.json</code>{" "}
            for manual inspection and replay.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a]">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#1a1a1a] bg-[#050505]">
                  <th className="px-4 py-2.5 text-left font-mono font-medium text-[#333]">Attempt</th>
                  <th className="px-4 py-2.5 text-left font-mono font-medium text-[#333]">Delay</th>
                  <th className="px-4 py-2.5 text-left font-mono font-medium text-[#333]">Notes</th>
                </tr>
              </thead>
              <tbody>
                {retrySchedule.map((row, i) => (
                  <tr key={row.attempt} className={i < retrySchedule.length - 1 ? "border-b border-[#111]" : ""}>
                    <td className="px-4 py-3 font-mono text-white">{row.attempt}</td>
                    <td className="px-4 py-3 font-mono text-[#888]">{row.delay}</td>
                    <td className="px-4 py-3 text-[#555]">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-[#444]">
            A small random jitter is added to each delay to prevent thundering herd issues when
            multiple webhooks are registered. Respond with any 2xx status code within 10 seconds
            to mark delivery as successful.
          </p>
        </section>

        {/* Incoming webhooks */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Incoming webhooks</h2>
          <p className="mb-4 text-sm leading-relaxed text-[#666]">
            Register a named endpoint on the Conductor HTTP server. External services POST to it,
            and Conductor validates, logs, and routes the payload to a handler tool. Requires
            HTTP transport (<code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">conductor mcp start --transport http</code>).
          </p>
          <div className="relative overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-3">
              <span className="font-mono text-[10px] text-[#3a3a3a]">terminal</span>
              <CopyButton text={incomingWebhookCmd} />
            </div>
            <pre className="p-4 text-xs font-mono leading-relaxed text-[#888]">
              <code>{incomingWebhookCmd}</code>
            </pre>
          </div>
          <p className="mt-3 text-xs text-[#444]">
            The endpoint becomes available at{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">
              POST http://localhost:3000/hooks/github
            </code>
            . All incoming payloads are recorded in the audit log.
          </p>
        </section>

        {/* Use cases */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Common use cases</h2>
          <div className="space-y-3">
            {[
              {
                title: "Alert on circuit breaker open",
                desc: "Subscribe to circuit.opened and forward to PagerDuty or Slack when a tool repeatedly fails. Automatically know when GitHub or Linear APIs are degraded.",
                events: "circuit.opened",
              },
              {
                title: "Audit trail to external SIEM",
                desc: "Subscribe to audit.written to stream every tool call and its inputs/outputs to your SIEM (Splunk, Datadog Logs, CloudWatch) for compliance.",
                events: "audit.written",
              },
              {
                title: "Real-time observability dashboard",
                desc: "Subscribe to tool.called and tool.failed to populate a custom metrics dashboard with tool call rates, latency, and error rates.",
                events: "tool.called, tool.failed",
              },
              {
                title: "React to external events",
                desc: "Set up an incoming webhook for GitHub push events. When code is pushed to main, automatically trigger a Linear status update or Slack notification via Conductor tools.",
                events: "incoming",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-lg border border-[#1a1a1a] bg-[#080808] p-4">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-mono text-xs font-semibold text-white">{item.title}</h3>
                  <code className="shrink-0 rounded bg-[#111] px-2 py-0.5 font-mono text-[10px] text-[#444]">
                    {item.events}
                  </code>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-[#555]">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Headers reference */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Request headers</h2>
          <p className="mb-4 text-sm leading-relaxed text-[#666]">
            Every outgoing webhook request includes these headers:
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a]">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#1a1a1a] bg-[#050505]">
                  <th className="px-4 py-2.5 text-left font-mono font-medium text-[#333]">Header</th>
                  <th className="px-4 py-2.5 text-left font-mono font-medium text-[#333]">Value</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { header: "Content-Type", value: "application/json" },
                  { header: "X-Conductor-Signature", value: "sha256=<hmac_hex> (if secret configured)" },
                  { header: "X-Conductor-Event", value: "tool.called (the event type)" },
                  { header: "X-Conductor-Delivery", value: "evt_01HXYZ (unique delivery ID)" },
                  { header: "X-Conductor-Version", value: "2.1.0 (Conductor version)" },
                  { header: "User-Agent", value: "Conductor-Webhooks/2.1.0" },
                ].map((row, i, arr) => (
                  <tr key={row.header} className={i < arr.length - 1 ? "border-b border-[#111]" : ""}>
                    <td className="px-4 py-3">
                      <code className="font-mono text-white">{row.header}</code>
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-[#555]">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Next */}
      <div className="mt-12 border-t border-[#1a1a1a] pt-8 flex items-center gap-4">
        <Link
          href="/docs/cli"
          className="inline-flex items-center gap-2 text-sm text-[#777] transition-colors hover:text-white"
        >
          CLI Reference
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <Link
          href="/docs/api-reference"
          className="inline-flex items-center gap-2 text-sm text-[#777] transition-colors hover:text-white"
        >
          API Reference
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
