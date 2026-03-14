export const metadata = {
  title: "Terms of Service | EduNova",
  description: "Terms and conditions for using the EduNova LMS platform.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-white pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-black tracking-tight mb-2">Terms of Service</h1>
        <p className="text-gray-500 text-sm mb-10">Last updated: March 2025</p>

        <div className="space-y-10 text-gray-400 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-white mb-3">1. Agreement to Terms</h2>
            <p>By accessing or using EduNova, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the platform.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">2. Use of the Platform</h2>
            <p>EduNova is a learning management system providing educational content. You agree to use the platform only for lawful educational purposes. You may not share your account credentials, redistribute course content, or use the platform for any illegal activities.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">3. User Accounts</h2>
            <p>You are responsible for maintaining the confidentiality of your account credentials. You are liable for all activity that occurs under your account. Notify us immediately of any unauthorized use at <a href="mailto:khatatbehy1@gmail.com" className="text-blue-400 hover:underline">khatatbehy1@gmail.com</a>.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">4. Subscription and Payments</h2>
            <p>Paid plans are billed monthly or annually. Subscriptions renew automatically unless cancelled before the renewal date. We reserve the right to modify pricing with reasonable notice. Refunds are handled on a case-by-case basis.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">5. Intellectual Property</h2>
            <p>All course content, platform design, and software are the intellectual property of EduNova. You may not copy, reproduce, or use any content outside of your personal learning without explicit written permission.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">6. Limitation of Liability</h2>
            <p>EduNova is provided "as is" without warranties. We are not liable for any damages resulting from your use of the platform, including loss of data, loss of progress, or service interruptions.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">7. Termination</h2>
            <p>We reserve the right to suspend or terminate accounts that violate these terms, at our sole discretion, without prior notice.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">8. Contact</h2>
            <p>For questions about these terms, contact us at <a href="mailto:khatatbehy1@gmail.com" className="text-blue-400 hover:underline">khatatbehy1@gmail.com</a> or call <a href="tel:+966560980921" className="text-blue-400 hover:underline">+966 56 098 0921</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
