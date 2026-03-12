export default function FAQ() {
  return (
    <section className="py-24 bg-white/[0.01]" id="faq">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-16">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {/* FAQ 1 */}
          <details className="glassmorphism rounded-custom group border border-white/5 overflow-hidden" open>
            <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-white/5 transition-all list-none">
              <span className="font-bold">Are the certificates recognized by employers?</span>
              <svg className="w-5 h-5 text-primary group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
            </summary>
            <div className="px-6 pb-6 text-gray-400 text-sm">
              Yes, our certificates are blockchain-verified and recognized by over 500+ global tech partners. You can easily share them on LinkedIn or include them in your digital portfolio.
            </div>
          </details>
          {/* FAQ 2 */}
          <details className="glassmorphism rounded-custom group border border-white/5 overflow-hidden">
            <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-white/5 transition-all list-none">
              <span className="font-bold">Can I cancel my subscription anytime?</span>
              <svg className="w-5 h-5 text-primary group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
            </summary>
            <div className="px-6 pb-6 text-gray-400 text-sm">
              Absolutely. You can cancel your subscription at any time from your account settings. You will retain access until the end of your current billing period.
            </div>
          </details>
          {/* FAQ 3 */}
          <details className="glassmorphism rounded-custom group border border-white/5 overflow-hidden">
            <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-white/5 transition-all list-none">
              <span className="font-bold">Is there a student discount available?</span>
              <svg className="w-5 h-5 text-primary group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
            </summary>
            <div className="px-6 pb-6 text-gray-400 text-sm">
              Yes! Students with a valid .edu email address can get 40% off the Pro monthly plan. Contact our support team for verification.
            </div>
          </details>
        </div>
      </div>
    </section>
  );
}
