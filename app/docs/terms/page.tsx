import { DocsLayout } from "@/components/docs-layout"

export default function TermsPage() {
  return (
    <DocsLayout>
      <div className="prose prose-gray max-w-none">
        <h1 className="text-4xl font-bold mb-4">Terms & Conditions</h1>
        <p className="text-gray-500 mb-8">Last updated: January 2025</p>

        <div className="space-y-6 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing and using Popuply, you accept and agree to be bound by the terms and provision of this
              agreement. If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">2. Use of Service</h2>
            <p>
              Popuply is a SaaS product that allows users to create and manage website popups. By using Popuply, you
              agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Provide accurate details during signup and account management</li>
              <li>Maintain the security of your account credentials</li>
              <li>Use the service in compliance with all applicable laws and regulations</li>
              <li>Not use popups for spam, harmful content, or illegal activities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">3. Account Plans</h2>
            <p>Popuply offers both Free and Pro subscription plans:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Free plan is limited to 1 website and 1 active popup</li>
              <li>Pro plan requires a monthly subscription via Razorpay</li>
              <li>Subscriptions renew automatically unless cancelled</li>
              <li>You can cancel your subscription at any time from your account settings</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">4. Content Responsibility</h2>
            <p>
              You are solely responsible for the content of your popups. Popuply reserves the right to remove or disable
              any popup that violates these terms or is deemed inappropriate.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">5. Service Availability</h2>
            <p>
              While we strive for 99.9% uptime, Popuply is not liable for website downtime, lost conversions, or any
              indirect damages resulting from service interruptions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">6. Intellectual Property</h2>
            <p>
              All Popuply branding, software, and documentation are the property of Popuply. You may not copy, modify,
              or distribute our software without explicit permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">7. Termination</h2>
            <p>
              We reserve the right to terminate or suspend your account at any time for violations of these terms. You
              may also request account deletion at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">8. Changes to Terms</h2>
            <p>
              Popuply reserves the right to modify these terms at any time. Continued use of the service after changes
              constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">9. Contact</h2>
            <p>If you have any questions about these Terms & Conditions, please contact us at support@popuply.in</p>
          </section>
        </div>
      </div>
    </DocsLayout>
  )
}
