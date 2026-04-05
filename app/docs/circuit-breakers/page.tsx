import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CopyButton } from "@/components/copy-button";

const statesDiagram = `         ┌──────────────────────────────────────────┐
         │              CLOSED                       │
         │   Normal operation. Requests pass through │
         └──────────────────┬──────────────────────┘
                            │ failure threshold reached
                            │ (default: 5 failures in 60s)
                            ▼
         ┌──────────────────────────────────────────┐
         │               OPEN                        │
         │   All requests fail immediately.           │
         │   No handlers called.                      │
         └──────────────────┬──────────────────────┘
                            │ reset timeout expires
                            │ (default: 30s)
                            ▼
         ┌──────────────────────────────────────────┐
         │            HALF-OPEN                      │
         │   One test request allowed through.        │
         │   Success → CLOSED. Failure → OPEN.        │
         └──────────────────────────────────────────┘`;

const cbConfig = `// ~/.conductor/config.json
{
  "circuitBreaker": {
    // Global defaults (apply to all tools unless overridden)
    "failureThreshold": 5,    // Open after N failures
    "successThreshold": 2,    // Close after N successes in HALF-OPEN
    "timeout": 30000,         // ms before OPEN → HALF-OPEN

    // Per-tool overrides
    "overrides": {
      "shell.exec": {
        "failureThreshold": 3,
        "timeout": 60000
      },
      "db.query": {
        "failureThreshold": 10,
        "timeout": 15000
      },
      "web.fetch": {
        "failureThreshold": 5,
        "timeout": 10000
      }
    }
  }
}`;

const cbStatus = `# Check all circuit breakers
conductor circuit list

# Output:
# TOOL                 STATE      FAILURES  LAST-FAILURE
# filesystem.read      CLOSED     0         —
# filesystem.write     CLOSED     1         2m ago
# shell.exec           OPEN       5         12s ago
# git.commit           CLOSED     0         —
# db.query             HALF-OPEN  3         35s ago

# Reset a specific circuit (forces CLOSED)
conductor circuit reset shell.exec

# Reset all circuits
conductor circuit reset --all`;

const aiResponse = `// What the AI sees when a circuit is OPEN:
{
  "error": {
    "code": "CIRCUIT_OPEN",
    "tool": "shell.exec",
    "message": "Circuit breaker is OPEN for shell.exec. Too many recent failures. Try again in 18s.",
    "retryAfterMs": 18000
  }
}

// The AI can use this to:
// 1. Try an alternative tool
// 2. Wait and retry
// 3. Report the issue to the user`;

export default function CircuitBreakersPage() {
  return (
    <div>
      <div className="mb-12">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#3a3a3a]">
          Core
        </p>
        <h1 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">
          Circuit breakers
        </h1>
        <p className="mt-3 text-[#666]">
          Per-tool failure counters that open automatically when a tool starts failing — preventing
          cascading errors and giving failing dependencies time to recover.
        </p>
      </div>

      <div className="space-y-14">

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Why circuit breakers</h2>
          <p className="mb-4 text-sm leading-relaxed text-[#666]">
            Without circuit breakers, a failing dependency (a database that went down, an API
            that&apos;s rate-limiting you) causes every tool call to hang until timeout, then
            return an error. With 10 retries and 30s timeouts, that&apos;s 5 minutes of
            the AI spinning in place.
          </p>
          <p className="text-sm leading-relaxed text-[#666]">
            Circuit breakers short-circuit this: after N failures, the circuit opens and all
            subsequent calls fail immediately with a clear message and a retry-after hint.
            The AI can respond intelligently — try an alternative, wait, or inform the user —
            rather than hammering a dead service.
          </p>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">States</h2>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#060606]">
            <div className="border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">state machine</span>
            </div>
            <pre className="overflow-x-auto p-5 font-mono text-xs leading-relaxed text-[#555]">
              <code>{statesDiagram}</code>
            </pre>
          </div>
          <div className="mt-4 space-y-2">
            {[
              { state: "CLOSED", color: "text-white", desc: "Normal. All requests pass through. Failure counter increments on each error. Resets to 0 on each success." },
              { state: "OPEN", color: "text-[#555]", desc: "Tripped. All requests fail immediately without calling the handler. After the timeout, transitions to HALF-OPEN." },
              { state: "HALF-OPEN", color: "text-[#888]", desc: "Testing. One request is allowed through. If it succeeds, the circuit closes. If it fails, it re-opens." },
            ].map((s) => (
              <div key={s.state} className="flex items-start gap-4 rounded-md border border-[#1a1a1a] bg-[#080808] px-4 py-3">
                <code className={`w-20 shrink-0 font-mono text-xs ${s.color}`}>{s.state}</code>
                <p className="text-xs text-[#555]">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Configuration</h2>
          <p className="mb-4 text-sm text-[#666]">
            Set global defaults and per-tool overrides. Tools that are naturally flaky (external
            APIs) get higher thresholds; critical local tools (shell, filesystem) get lower ones.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">~/.conductor/config.json</span>
              <CopyButton text={cbConfig} />
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]">
              <code>{cbConfig}</code>
            </pre>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Monitoring and resetting</h2>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">terminal</span>
              <CopyButton text={cbStatus} />
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]">
              <code>{cbStatus}</code>
            </pre>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">What the AI sees</h2>
          <p className="mb-4 text-sm text-[#666]">
            When a circuit is OPEN, the error response includes a{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">retryAfterMs</code>{" "}
            hint. Well-implemented AI clients can use this to schedule a retry or pick an alternative.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">error response when circuit is OPEN</span>
            </div>
            <pre className="p-4 font-mono text-xs leading-relaxed text-[#888]">
              <code>{aiResponse}</code>
            </pre>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Metrics</h2>
          <p className="mb-4 text-sm text-[#666]">
            Circuit breaker state is exposed in Prometheus metrics (HTTP transport only) at{" "}
            <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">GET /metrics</code>.
          </p>
          <div className="space-y-2">
            {[
              { metric: "conductor_circuit_state", desc: "Current state (0=CLOSED, 1=HALF_OPEN, 2=OPEN) per tool" },
              { metric: "conductor_circuit_failures_total", desc: "Cumulative failure count per tool" },
              { metric: "conductor_circuit_trips_total", desc: "Number of times each circuit has tripped" },
              { metric: "conductor_tool_duration_ms", desc: "Tool call duration histogram per tool" },
              { metric: "conductor_tool_calls_total", desc: "Total calls per tool, labeled by result" },
            ].map((m) => (
              <div key={m.metric} className="flex items-start gap-4 rounded-md border border-[#111] bg-[#070707] px-4 py-2.5">
                <code className="shrink-0 font-mono text-[10px] text-white">{m.metric}</code>
                <span className="text-xs text-[#444]">{m.desc}</span>
              </div>
            ))}
          </div>
        </section>

      </div>

      <div className="mt-12 border-t border-[#1a1a1a] pt-8">
        <Link href="/docs/troubleshooting" className="inline-flex items-center gap-2 text-sm text-[#777] transition-colors hover:text-white">
          Next: Troubleshooting
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
