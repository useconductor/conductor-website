export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold text-white mb-8">Privacy Policy</h1>
      
      <div className="space-y-6 text-[#666]">
        <p>Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">1. Introduction</h2>
          <p>Conductor (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services, including our website, CLI tool, and cloud synchronization features.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">2. Zero-Knowledge Architecture</h2>
          <p className="mb-4">Conductor uses a <strong className="text-white">zero-knowledge</strong> encryption architecture for credential storage:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Your API keys and credentials are encrypted <strong className="text-white">on your device</strong> before being transmitted</li>
            <li>We never have access to your plaintext credentials</li>
            <li>The server stores only encrypted blobs that can only be decrypted with your password</li>
            <li>If you lose your password, your credentials cannot be recovered</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">3. Information We Collect</h2>
          
          <h3 className="text-lg font-semibold text-white mb-2">Account Information</h3>
          <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
            <li>Email address (from OAuth providers like GitHub or Google)</li>
            <li>OAuth provider information</li>
            <li>Account creation date</li>
          </ul>

          <h3 className="text-lg font-semibold text-white mb-2">Device Information</h3>
          <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
            <li>Device ID (generated locally on your device)</li>
            <li>Device name (you provide when pairing)</li>
            <li>Public key (for encrypted communication)</li>
          </ul>

          <h3 className="text-lg font-semibold text-white mb-2">Encrypted Credential Metadata</h3>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Plugin names (e.g., &quot;github,&quot; &quot;slack&quot;)</li>
            <li>Creation and update timestamps</li>
            <li><strong className="text-white">Only</strong> encrypted credential data - we cannot read your actual API keys</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">4. How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>To provide and maintain the Conductor service</li>
            <li>To sync your encrypted credentials across your devices</li>
            <li>To authenticate you via OAuth (GitHub/Google)</li>
            <li>To communicate with you about your account</li>
            <li>To improve and develop our services</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">5. Data Encryption</h2>
          <p className="mb-4">All sensitive data is encrypted using <strong className="text-white">AES-256-GCM</strong> with keys derived from your password using <strong className="text-white">PBKDF2</strong> (100,000 iterations):</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Your password never leaves your device</li>
            <li>Encryption keys are derived locally</li>
            <li>Server-side data is opaque encrypted blobs</li>
            <li>We cannot reset or recover forgotten passwords</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">6. Data Sharing</h2>
          <p>We do <strong className="text-white">not</strong> sell, trade, or otherwise transfer your personal information to outside parties. We may share information with:</p>
          <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
            <li><strong className="text-white">Service providers</strong> who assist us in operating our service (e.g., Supabase for authentication)</li>
            <li><strong className="text-white">Legal requirements</strong> when required by law or in response to valid requests</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">7. Data Retention</h2>
          <p>We retain your account information and encrypted credentials as long as your account is active. You may request deletion of your account and all associated data at any time.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">8. Your Rights</h2>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Export your data</li>
            <li>Opt-out of non-essential communications</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">9. Security</h2>
          <p>We implement appropriate technical and organizational measures to protect your data, including:</p>
          <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
            <li>Encryption in transit (HTTPS)</li>
            <li>Zero-knowledge client-side encryption</li>
            <li>Secure OAuth authentication</li>
            <li>Regular security reviews</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">10. Children's Privacy</h2>
          <p>Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">11. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">12. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us:</p>
          <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
            <li>GitHub: <a href="https://github.com/useconductor/conductor" className="text-white hover:underline">https://github.com/useconductor/conductor</a></li>
            <li>Email: support@conductor.sh</li>
          </ul>
        </section>
      </div>
    </div>
  );
}