export default function TermsOfService() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold text-white mb-8">Terms of Service</h1>
      
      <div className="space-y-6 text-[#666]">
        <p>Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
          <p>By accessing and using Conductor (&quot;the Service&quot;), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this Service.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">2. Description of Service</h2>
          <p>Conductor is an MCP (Model Context Protocol) server that provides AI agents with access to various tools and services. The Service includes:</p>
          <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
            <li>CLI tool for managing plugins and credentials</li>
            <li>Cloud synchronization for credentials across devices</li>
            <li>Zero-knowledge encryption for credential storage</li>
            <li>Plugin marketplace for discovering integrations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">3. Free Forever</h2>
          <p>Conductor is and will always remain <strong className="text-white">free forever</strong>. There are no paid tiers, subscriptions, or premium features. The Service is provided as-is, without cost to you.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">4. User Accounts and Authentication</h2>
          <p className="mb-4">To use certain features, you must create an account using OAuth authentication via GitHub or Google. You agree to:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Provide accurate and complete information</li>
            <li>Maintain the security of your account</li>
            <li>Notify us immediately of any unauthorized access</li>
            <li>Take responsibility for all activities under your account</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">5. Zero-Knowledge Encryption</h2>
          <p className="mb-4">The Service uses zero-knowledge encryption:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Your credentials are encrypted on your device before transmission</li>
            <li>We cannot access your plaintext credentials</li>
            <li><strong className="text-white">You are responsible for remembering your password</strong></li>
            <li>We cannot recover forgotten passwords - if you lose your password, your encrypted data cannot be decrypted</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">6. Acceptable Use</h2>
          <p>You agree not to use the Service to:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Violate any applicable laws or regulations</li>
            <li>Infringe upon the rights of others</li>
            <li>Attempt to gain unauthorized access to the Service</li>
            <li>Distribute malware or other harmful content</li>
            <li>Use the Service for any illegal or unauthorized purpose</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">7. Intellectual Property</h2>
          <p>The Service and its original content, features, and functionality are and will remain the exclusive property of Conductor and its licensors. The Service is distributed under the <strong className="text-white">MIT License</strong>.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">8. Disclaimer of Warranty</h2>
          <p>The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranty of any kind, either express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose, and non-infringement.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">9. Limitation of Liability</h2>
          <p>In no event shall Conductor be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:</p>
          <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
            <li>Your access to or use of or inability to access or use the Service</li>
            <li>Any conduct or content of any third party on the Service</li>
            <li>Any content obtained from the Service</li>
            <li>Unauthorized access, use, or alteration of your transmissions or content</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">10. Indemnification</h2>
          <p>You agree to defend, indemnify, and hold harmless Conductor and its officers, directors, employees, and agents from and against any claims, damages, obligations, losses, liabilities, costs, or debt, and expenses arising from:</p>
          <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
            <li>Your use of the Service</li>
            <li>Your violation of these Terms</li>
            <li>Your violation of any third-party rights</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">11. Termination</h2>
          <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason, including breach of these Terms. Upon termination, your right to use the Service will immediately cease.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">12. Changes to Terms</h2>
          <p>We reserve the right to modify these Terms at any time. We will provide notice of material changes by posting the new Terms on this page. Your continued use of the Service after such changes constitutes acceptance of the new Terms.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">13. Governing Law</h2>
          <p>These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">14. Contact</h2>
          <p>If you have any questions about these Terms, please contact us:</p>
          <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
            <li>GitHub: <a href="https://github.com/useconductor/conductor" className="text-white hover:underline">https://github.com/useconductor/conductor</a></li>
            <li>Email: support@conductor.sh</li>
          </ul>
        </section>
      </div>
    </div>
  );
}