// FILE: app/docs/integrations/stripe/page.tsx

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CopyButton } from "@/components/copy-button";

const conductorConfig = `{
  "plugins": {
    "stripe": {
      "secretKey": "sk_test_51xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      "webhookSecret": "whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    }
  }
}`;

const testVsLive = `// Test mode keys — safe for development, hit no real charges
sk_test_...   // secret key
pk_test_...   // publishable key (not needed for Conductor)

// Live mode keys — real money, real customers
sk_live_...   // secret key
pk_live_...   // publishable key

// NEVER use sk_live_ in development, CI, or staging environments.
// Test mode and live mode are completely separate environments:
// different customers, different charges, different subscriptions.`;

const restrictedKeySetup = `// Create a restricted key at:
// dashboard.stripe.com → Developers → API keys → Create restricted key

// Recommended minimal permissions for Conductor:
// Customers:           Read
// Charges:             Read
// PaymentIntents:      Write (if creating payments)
// Subscriptions:       Read + Write (if managing subscriptions)
// Invoices:            Read
// Products:            Read
// Prices:              Read
// Refunds:             Write (if issuing refunds)

// Restricted keys start with: rk_test_ or rk_live_`;

const webhookLocalDev = `# Install the Stripe CLI for local webhook forwarding
brew install stripe/stripe-cli/stripe

# Log in
stripe login

# Forward webhooks to your local Conductor instance
stripe listen --forward-to http://localhost:3000/webhooks/stripe

# The CLI prints your webhook signing secret:
# > Ready! Your webhook signing secret is whsec_xxxxxxxx (^C to quit)`;

const webhookProduction = `// Production webhook setup:
// 1. Go to dashboard.stripe.com → Developers → Webhooks
// 2. Click "Add endpoint"
// 3. Enter your public URL: https://yourdomain.com/webhooks/stripe
// 4. Select events to listen for (e.g., payment_intent.succeeded)
// 5. After saving, click "Reveal" under Signing secret
// 6. Copy the whsec_... value into Conductor config`;

const idempotencyNote = `// Idempotency keys prevent duplicate operations on retries.
// Conductor automatically generates and attaches idempotency keys
// for all write operations (charge creation, refunds, etc.).
//
// For manual calls, pass an idempotency key as a parameter:
{
  "tool": "stripe.payment-intent.create",
  "amount": 2000,
  "currency": "usd",
  "idempotencyKey": "order_12345_attempt_1"
}
// Using the same key within 24 hours returns the original response
// without creating a duplicate charge.`;

const tools = [
  { name: "stripe.customer.list", desc: "List customers with optional email or metadata filter." },
  { name: "stripe.customer.create", desc: "Create a new customer with email, name, and metadata." },
  { name: "stripe.charge.list", desc: "List charges with optional customer, date range, or status filter." },
  { name: "stripe.charge.get", desc: "Retrieve a single charge by charge ID." },
  { name: "stripe.payment-intent.create", desc: "Create a PaymentIntent for a given amount and currency." },
  { name: "stripe.subscription.list", desc: "List subscriptions with optional customer or status filter." },
  { name: "stripe.subscription.cancel", desc: "Cancel a subscription immediately or at period end." },
  { name: "stripe.invoice.list", desc: "List invoices with optional customer or status filter." },
  { name: "stripe.product.list", desc: "List all products in the Stripe account." },
  { name: "stripe.price.list", desc: "List prices with optional product filter." },
  { name: "stripe.refund.create", desc: "Issue a full or partial refund for a charge or PaymentIntent." },
];

const errors = [
  {
    code: "invalid_request_error",
    cause: "A required parameter is missing, has the wrong type, or an ID references a nonexistent resource.",
    fix: "Read the error message — it names the specific parameter. Check IDs are correct for the current mode (test vs live).",
  },
  {
    code: "authentication_required",
    cause: "The secret key is invalid, from the wrong mode, or has been revoked.",
    fix: "Verify the key starts with sk_test_ (test) or sk_live_ (live). Regenerate if it was compromised.",
  },
  {
    code: "card_declined",
    cause: "In test mode: use test card numbers. In live mode: the card issuer declined the charge.",
    fix: "Test mode: use 4242 4242 4242 4242 for success. In live mode, the decline reason is in error.decline_code.",
  },
  {
    code: "rate_limit",
    cause: "Too many API requests in a short window.",
    fix: "Conductor automatically retries with backoff. In test mode: 100 read + 100 write/second. In live mode: 25 write/second on some endpoints.",
  },
  {
    code: "no such customer",
    cause: "The customer ID does not exist in the current mode.",
    fix: "Test and live mode customers are separate. cus_xxx from test mode will not exist in live mode.",
  },
  {
    code: "no such charge / subscription",
    cause: "The resource ID is from the wrong mode or was deleted.",
    fix: "Verify you are in the correct mode. Check the dashboard to confirm the resource exists.",
  },
  {
    code: "idempotency_key_in_use",
    cause: "A concurrent request is using the same idempotency key.",
    fix: "Wait for the first request to complete, or use a different idempotency key for the new request.",
  },
];

const rateLimits = [
  { mode: "Test mode — read", limit: "100 requests/second" },
  { mode: "Test mode — write", limit: "100 requests/second" },
  { mode: "Live mode — read", limit: "100 requests/second" },
  { mode: "Live mode — write (standard)", limit: "100 requests/second" },
  { mode: "Live mode — write (some endpoints)", limit: "25 requests/second" },
  { mode: "Webhook delivery", limit: "3 delivery attempts with exponential backoff" },
];

export default function StripeIntegrationPage() {
  return (
    <div>
      <div className="mb-12">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#3a3a3a]">
          Integrations
        </p>
        <h1 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">Stripe</h1>
        <p className="mt-3 text-[#666]">
          Connect Conductor to Stripe for payments, customers, subscriptions, and invoices. Covers
          test vs live mode, restricted keys, webhook setup, idempotency, and all available tools.
        </p>
      </div>

      <div className="space-y-14">

        {/* Test vs live */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Test mode vs live mode</h2>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">key prefixes</span>
              <CopyButton text={testVsLive} />
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{testVsLive}</code></pre>
          </div>
          <div className="mt-3 rounded-lg border border-[#1a1a1a] bg-[#060606] p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#3a3a3a]">Warning</p>
            <p className="mt-2 text-xs text-[#555]">
              If you configure a <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">sk_live_</code>{" "}
              key in development, Conductor will execute operations against real customers and real
              payment methods. Always use <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">sk_test_</code>{" "}
              in any non-production environment.
            </p>
          </div>
        </section>

        {/* Finding keys */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Finding your API keys</h2>
          <ol className="space-y-2 text-sm text-[#666]">
            <li className="flex gap-3"><span className="font-mono text-[#444]">1.</span>Go to <span className="font-mono text-[#888]">dashboard.stripe.com/apikeys</span> (or Developers → API keys).</li>
            <li className="flex gap-3"><span className="font-mono text-[#444]">2.</span>Toggle the test/live mode switch in the top right of the dashboard.</li>
            <li className="flex gap-3"><span className="font-mono text-[#444]">3.</span>Copy the <span className="font-mono text-[#888]">Secret key</span> — click "Reveal" if hidden.</li>
            <li className="flex gap-3"><span className="font-mono text-[#444]">4.</span>For production, use a Restricted key rather than the full secret key (see below).</li>
          </ol>
        </section>

        {/* Restricted keys */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Restricted API keys</h2>
          <p className="mb-3 text-sm text-[#666]">
            Restricted keys limit what the key can access. Follow the principle of least privilege:
            only grant the permissions Conductor needs for your specific workflow.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">restricted key setup</span>
              <CopyButton text={restrictedKeySetup} />
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{restrictedKeySetup}</code></pre>
          </div>
        </section>

        {/* Webhook local */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Webhook setup — local development</h2>
          <p className="mb-3 text-sm text-[#666]">
            The Stripe CLI forwards webhook events to your local machine. It also provides a
            webhook signing secret for verifying event authenticity. Use this during development
            instead of exposing a public URL.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">stripe cli — local webhook forwarding</span>
              <CopyButton text={webhookLocalDev} />
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{webhookLocalDev}</code></pre>
          </div>
        </section>

        {/* Webhook production */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Webhook setup — production</h2>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">dashboard webhook configuration</span>
              <CopyButton text={webhookProduction} />
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{webhookProduction}</code></pre>
          </div>
        </section>

        {/* Conductor config */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Conductor config</h2>
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

        {/* Idempotency */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Idempotency keys</h2>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <span className="font-mono text-[10px] text-[#3a3a3a]">idempotency key usage</span>
              <CopyButton text={idempotencyNote} />
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#888]"><code>{idempotencyNote}</code></pre>
          </div>
        </section>

        {/* Rate limits */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Rate limits</h2>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a]">
            <table className="w-full text-sm">
              <thead className="bg-[#080808]">
                <tr className="border-b border-[#1a1a1a]">
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] font-normal uppercase tracking-widest text-[#3a3a3a]">Mode / endpoint</th>
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] font-normal uppercase tracking-widest text-[#3a3a3a]">Limit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0d0d0d] bg-[#060606]">
                {rateLimits.map((r) => (
                  <tr key={r.mode}>
                    <td className="px-4 py-2.5 font-mono text-xs text-[#888]">{r.mode}</td>
                    <td className="px-4 py-2.5 text-xs text-[#555]">{r.limit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Security */}
        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Security</h2>
          <ul className="space-y-2 text-sm text-[#666]">
            <li className="flex gap-3"><span className="font-mono text-[#444]">—</span>Use restricted keys in production. Never store the full secret key in version control or plaintext config files.</li>
            <li className="flex gap-3"><span className="font-mono text-[#444]">—</span>Always verify webhook signatures using the signing secret. Conductor does this automatically when <code className="rounded bg-[#111] px-1.5 py-0.5 font-mono text-xs">webhookSecret</code> is configured.</li>
            <li className="flex gap-3"><span className="font-mono text-[#444]">—</span>Never log card data, CVV, or full PAN numbers. Stripe's API never returns full card numbers after initial creation.</li>
            <li className="flex gap-3"><span className="font-mono text-[#444]">—</span>Rotate keys immediately if compromised. Stripe lets you have up to two active keys simultaneously for zero-downtime rotation.</li>
            <li className="flex gap-3"><span className="font-mono text-[#444]">—</span>Test mode and live mode have separate key sets. A compromised test key cannot access live data.</li>
          </ul>
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
