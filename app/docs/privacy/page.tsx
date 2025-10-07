import { DocsLayout } from "@/components/docs-layout"

export default function PrivacyPage() {
  return (
    <DocsLayout>
      <div className="prose prose-gray max-w-none">
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-gray-500 mb-8">Last updated: January 2025</p>

        <div className="space-y-6 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold mb-3">1. Information We Collect</h2>
            <p>We collect the following types of information:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>Account Information:</strong> Email address, name, and password (encrypted) for authentication
              </li>
              <li>
                <strong>Website Information:</strong> Domain names and URLs of websites you connect to Popuply
              </li>
              <li>
                <strong>Analytics Data:</strong> Popup views, clicks, and conversion metrics for your popups
              </li>
              <li>
                <strong>Payment Information:</strong> Handled securely by Razorpay; we do not store card details
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">2. How We Use Your Information</h2>
            <p>We use collected information to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Provide and maintain the Popuply service</li>
              <li>Process your subscription payments</li>
              <li>Display analytics and performance metrics in your dashboard</li>
              <li>Send important service updates and notifications</li>
              <li>Improve our product and user experience</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">3. Data Sharing</h2>
            <p>
              We do not sell or share your personal data with third parties for marketing purposes. We only share data
              with:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>Payment Processors:</strong> Razorpay for handling subscription payments
              </li>
              <li>
                <strong>Service Providers:</strong> Hosting and infrastructure providers necessary to operate Popuply
              </li>
              <li>
                <strong>Legal Requirements:</strong> When required by law or to protect our rights
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">4. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your data, including encryption, secure
              servers, and regular security audits. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">5. Cookies and Tracking</h2>
            <p>
              Popuply uses cookies to maintain your login session and improve user experience. The embed script on your
              website may use local storage to track popup display frequency and prevent showing the same popup
              repeatedly to visitors.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Access your personal data stored in Popuply</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your account and associated data</li>
              <li>Export your data in a portable format</li>
              <li>Opt out of marketing communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">7. Data Retention</h2>
            <p>
              We retain your data for as long as your account is active. If you delete your account, we will remove your
              personal data within 30 days, except where required by law to retain certain information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">8. Children's Privacy</h2>
            <p>
              Popuply is not intended for users under the age of 13. We do not knowingly collect personal information
              from children under 13.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">9. Changes to Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of significant changes via email
              or through the Popuply dashboard.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">10. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or how we handle your data, please contact us at
              privacy@popuply.in
            </p>
          </section>
        </div>
      </div>
    </DocsLayout>
  )
}
