import Link from "next/link";
import { Check, X } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="text-center mb-12">
        <h1 className="font-mono text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h1>
        <p className="text-[#666] text-lg">
          Conductor is and will always be free. No hidden fees, no surprises.
        </p>
      </div>

      {/* Free Forever Card */}
      <div className="rounded-xl border border-[#1a1a1a] bg-[#080808] p-8 mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-mono text-2xl font-bold text-white">Free Forever</h2>
            <p className="text-[#666]">For individuals and teams</p>
          </div>
          <div className="text-right">
            <span className="font-mono text-4xl font-bold text-white">$0</span>
            <span className="text-[#666]">/forever</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="p-4 rounded-lg border border-[#1a1a1a]">
            <h3 className="font-mono text-white font-semibold mb-2">Unlimited Devices</h3>
            <p className="text-[#666] text-sm">Sync credentials across all your machines</p>
          </div>
          <div className="p-4 rounded-lg border border-[#1a1a1a]">
            <h3 className="font-mono text-white font-semibold mb-2">255+ Plugins</h3>
            <p className="text-[#666] text-sm">Access to every integration</p>
          </div>
          <div className="p-4 rounded-lg border border-[#1a1a1a]">
            <h3 className="font-mono text-white font-semibold mb-2">Zero-Knowledge Cloud</h3>
            <p className="text-[#666] text-sm">We never see your credentials</p>
          </div>
        </div>

        <ul className="space-y-3 mb-8">
          {[
            'All 255+ tools and integrations',
            'Unlimited devices and credential sync',
            'Zero-knowledge cloud storage',
            'Self-hosting option available',
            'MCP protocol compatible',
            'Audit logging',
            'Circuit breakers',
            'Command allowlisting',
            'Community support via Discord',
          ].map((feature) => (
            <li key={feature} className="flex items-center gap-3 text-[#666]">
              <Check className="h-5 w-5 text-green-500" />
              {feature}
            </li>
          ))}
        </ul>

        <Link
          href="/login"
          className="block w-full py-3 rounded-lg bg-white text-black font-mono font-semibold text-center hover:bg-[#e8e8e8]"
        >
          Get Started Free
        </Link>
      </div>

      {/* Enterprise Section */}
      <div className="rounded-xl border border-[#1a1a1a] bg-[#080808] p-8 mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-mono text-2xl font-bold text-white">Enterprise</h2>
            <p className="text-[#666]">For organizations with advanced needs</p>
          </div>
          <div className="text-right">
            <span className="font-mono text-4xl font-bold text-white">Custom</span>
          </div>
        </div>

        <p className="text-[#666] mb-6">
          Need dedicated support, custom integrations, or on-premise deployment? 
          We offer tailored solutions for enterprises.
        </p>

        <ul className="space-y-3 mb-8">
          {[
            'Dedicated support channel',
            'Custom plugin development',
            'On-premise deployment',
            'SLA guarantees',
            'SSO/SAML integration',
            'Team management dashboard',
            'Advanced audit logs',
            'Compliance reporting (SOC2, GDPR)',
          ].map((feature) => (
            <li key={feature} className="flex items-center gap-3 text-[#666]">
              <Check className="h-5 w-5 text-green-500" />
              {feature}
            </li>
          ))}
        </ul>

        <a
          href="mailto:enterprise@conductor.sh"
          className="block w-full py-3 rounded-lg border border-[#1a1a1a] text-white font-mono font-semibold text-center hover:border-[#2a2a2a]"
        >
          Contact Sales
        </a>
      </div>

      {/* FAQ */}
      <div className="rounded-xl border border-[#1a1a1a] bg-[#080808] p-8">
        <h2 className="font-mono text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="font-mono text-white font-semibold mb-2">Is it really free?</h3>
            <p className="text-[#666]">Yes. Conductor will always have a free tier with no limits. We're building a sustainable open-source business through enterprise support, not by locking features behind a paywall.</p>
          </div>
          
          <div>
            <h3 className="font-mono text-white font-semibold mb-2">How do you make money?</h3>
            <p className="text-[#666]">We offer paid enterprise support and custom development. If you need dedicated support, custom plugins, or on-premise deployment, that's where we generate revenue while keeping the core product free.</p>
          </div>
          
          <div>
            <h3 className="font-mono text-white font-semibold mb-2">Can I self-host?</h3>
            <p className="text-[#666]">Yes! We provide Docker Compose configurations for self-hosting. You can run your own Conductor Cloud instance with full data sovereignty. See our <Link href="/docs/cloud" className="text-white hover:underline">Self-Hosting Guide</Link>.</p>
          </div>
          
          <div>
            <h3 className="font-mono text-white font-semibold mb-2">What about data privacy?</h3>
            <p className="text-[#666]">We're zero-knowledge by design. Your credentials are encrypted on your device before they ever leave your machine. We literally cannot see your data even if we wanted to.</p>
          </div>
        </div>
      </div>
    </div>
  );
}