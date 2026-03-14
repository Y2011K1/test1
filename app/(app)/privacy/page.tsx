export const metadata = {
  title: "Privacy Policy | EduNova",
  description: "How EduNova collects, uses, and protects your personal data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-white pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-black tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-gray-500 text-sm mb-10">Last updated: March 2025</p>

        <div className="space-y-10 text-gray-400 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-white mb-3">1. Information We Collect</h2>
            <p>We collect information you provide when you create an account, enroll in courses, or contact us. This includes your name, email address, and payment information. We also automatically collect usage data like pages visited and course progress.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">2. How We Use Your Information</h2>
            <p>We use your information to provide and improve our services, process payments, send transactional emails, and personalize your learning experience. We do not sell your personal data to third parties.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">3. Data Storage and Security</h2>
            <p>Your data is stored securely using industry-standard encryption. We use Clerk for authentication and Sanity for content management, both of which implement robust security practices. Despite our best efforts, no system is 100% secure.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">4. Cookies</h2>
            <p>We use essential cookies to keep you logged in and to remember your preferences. We do not use advertising cookies. You can disable cookies in your browser settings, though this may affect functionality.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">5. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal data at any time. To exercise these rights, contact us at <a href="mailto:khatatbehy1@gmail.com" className="text-blue-400 hover:underline">khatatbehy1@gmail.com</a>.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">6. Third-Party Services</h2>
            <p>We use third-party providers including Clerk (authentication), Sanity (content management), and Mux (video streaming). Each operates under their own privacy policy.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">7. Contact</h2>
            <p>For privacy-related inquiries, contact us at <a href="mailto:khatatbehy1@gmail.com" className="text-blue-400 hover:underline">khatatbehy1@gmail.com</a> or call <a href="tel:+966560980921" className="text-blue-400 hover:underline">+966 56 098 0921</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
