import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CopyButton } from "@/components/copy-button";

const sampleEntry = `{
  "id": "a3f2c1d4-8b7e-4a9f-b2c3-1d4e5f6a7b8c",
  "timestamp": "2025-04-03T14:22:11.847Z",
  "tool": "filesystem.read",
  "inputHash": "sha256:e3b0c44298fc1c149afb...",
  "result": "ok",
  "durationMs": 3,
  "user": "alex",
  "sessionId": "sess_9k2mxp",
  "prev": "sha256:d4e5f6a7b8c9d0e1f2a3...",
  "hash": "sha256:f7a8b9c0d1e2f3a4b5c6..."
}`;

const chainVerify = `# Verify the entire audit log chain
conductor audit verify

# Output:
# ✓ Chain intact (1,847 entries)
# First entry: 2025-01-12T09:00:00Z
# Last entry:  2025-04-03T14:22:11Z

# What a tampered chain looks like:
# ✗ Chain broken at entry 423
#   Expected: sha256:abc123...
#   Got:      sha256:def456...`;

const auditCmds = `# Print the last 20 entries
conductor audit list

# Filter by tool name
conductor audit list --tool filesystem.write

# Filter by date range
conductor audit list --since 2025-04-01 --until 2025-04-03

# Filter by result
conductor audit list --result error

# Export as JSON
conductor audit export --output audit-2025-04.json

# Verify chain integrity
conductor audit verify`;

const jsonQuery = `# Using jq to analyze audit logs
# Raw log location
cat ~/.conductor/audit.log | jq .

# Count calls per tool (last 24h)
cat ~/.conductor/audit.log \\
  | jq -r '.tool' \\
  | sort | uniq -c | sort -rn

# Find all failed calls
cat ~/.conductor/audit.log \\
  | jq 'select(.result == "error")'

# Average duration per tool
cat ~/.conductor/audit.log \\
  | jq -r '[.tool, (.durationMs | tostring)] | join(",")' \\
  | awk -F, '{sum[$1]+=$2; count[$1]++}
             END{for(t in sum) print sum[t]/count[t], t}' \\
  | sort -rn`;

const forwardLog = `# Forward to Splunk via syslog
conductor audit tail | logger -t conductor -p local0.info

# Forward to Datadog
conductor audit tail --json | datadog-agent stream-logs

# Forward to S3 (example with AWS CLI)
conductor audit export --output /tmp/audit.json
aws s3 cp /tmp/audit.json s3://your-bucket/conductor/audit-$(date +%Y%m%d).json`;

const retentionConfig = `// ~/.conductor/config.json
{
  "audit": {
    "retentionDays": 90,     // Auto-archive entries older than 90 days
    "maxSizeMb": 500,         // Roll over when file exceeds 500 MB
    "compress": true,         // Gzip archived files
    "archivePath": "~/.conductor/audit-archive"
  }
}`;

export default function AuditLogsPage() {
  return (
    <div>
      <div className="mb-12">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#3a3a3a]">
          Core
        </p>
        <h1 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">
          Audit logs
        </h1>
        <p className="mt-3 text-[#666]">
          Every tool call is permanently recorded in a SHA-256 chained log. Tamper-evident, queryable, forwardable to any SIEM.
        </p>
      </div>

      <div className="space-y-14">

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">How it works</h2>
          <p className="mb-4 text-sm leading-relaxed text-[#666]">
            The audit log is an append-only newline-delimited JSON file at{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">~/.conductor/audit.log</code>.
            Each entry includes a SHA-256 hash of itself chained to the previous entry&apos;s hash.
            Modifying, inserting, or deleting any entry breaks the chain — detectable immediately with{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">conductor audit verify</code>.
          </p>
          <div className="space-y-2">
            {[
              { title: "Every call logged", body: "All tool calls, regardless of result, are written before the response is returned. There is no way to skip this step." },
              { title: "Input hashed, not stored", body: "The raw input is hashed (SHA-256) before logging. Sensitive values don't appear in the log in cleartext." },
              { title: "SHA-256 chain", body: "Each entry's hash includes the previous entry's hash. Breaking the chain at any point is cryptographically detectable." },
              { title: "Immutable by design", body: "The log is append-only. Conductor never modifies or deletes existing entries at runtime." },
            ].map((item) => (
              <div key={item.title} className="rounded-lg border border-[#1a1a1a] bg-[#080808] p-4">
                <p className="font-mono text-xs font-semibold text-white">{item.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-[#555]">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Log entry format</h2>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">sample entry</span>
            </div>
            <pre className="p-4 font-mono text-xs leading-relaxed text-[#888]">
              <code>{sampleEntry}</code>
            </pre>
          </div>
          <div className="mt-4 overflow-hidden rounded-lg border border-[#1a1a1a]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1a1a1a] bg-[#080808]">
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-[#333]">Field</th>
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-[#333]">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0d0d0d] bg-[#060606]">
                {[
                  { field: "id", desc: "UUID v4. Unique per call." },
                  { field: "timestamp", desc: "ISO 8601 UTC timestamp of when the call completed." },
                  { field: "tool", desc: "Fully-qualified tool name (e.g. filesystem.read)." },
                  { field: "inputHash", desc: "SHA-256 of the raw input arguments. Not the input itself." },
                  { field: "result", desc: "ok | error | rejected (user denied approval gate)." },
                  { field: "durationMs", desc: "Wall-clock time from call receipt to response, in milliseconds." },
                  { field: "user", desc: "OS username of the process that made the call." },
                  { field: "sessionId", desc: "Identifies the client session. Consistent across calls within one session." },
                  { field: "prev", desc: "SHA-256 hash of the previous log entry. null for the first entry." },
                  { field: "hash", desc: "SHA-256 of this entry (including the prev field). Forms the chain." },
                ].map((r) => (
                  <tr key={r.field}>
                    <td className="px-4 py-3"><code className="font-mono text-xs text-white">{r.field}</code></td>
                    <td className="px-4 py-3 text-xs text-[#444]">{r.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">CLI commands</h2>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">terminal</span>
              <CopyButton text={auditCmds} />
            </div>
            <pre className="p-4 font-mono text-xs leading-relaxed text-[#888]">
              <code>{auditCmds}</code>
            </pre>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Chain verification</h2>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">conductor audit verify</span>
              <CopyButton text={chainVerify} />
            </div>
            <pre className="p-4 font-mono text-xs leading-relaxed text-[#888]">
              <code>{chainVerify}</code>
            </pre>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Querying with jq</h2>
          <p className="mb-4 text-sm text-[#666]">
            The log is newline-delimited JSON — pipe it through{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">jq</code> for
            ad-hoc analysis.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">jq recipes</span>
              <CopyButton text={jsonQuery} />
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]">
              <code>{jsonQuery}</code>
            </pre>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Forwarding to a SIEM</h2>
          <p className="mb-4 text-sm text-[#666]">
            Use <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">conductor audit tail</code> to
            stream new entries to any log aggregator.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">forwarding examples</span>
              <CopyButton text={forwardLog} />
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]">
              <code>{forwardLog}</code>
            </pre>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Retention and rotation</h2>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">~/.conductor/config.json</span>
              <CopyButton text={retentionConfig} />
            </div>
            <pre className="p-4 font-mono text-xs leading-relaxed text-[#888]">
              <code>{retentionConfig}</code>
            </pre>
          </div>
        </section>

      </div>

      <div className="mt-12 border-t border-[#1a1a1a] pt-8">
        <Link href="/docs/circuit-breakers" className="inline-flex items-center gap-2 text-sm text-[#777] transition-colors hover:text-white">
          Next: Circuit breakers
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
