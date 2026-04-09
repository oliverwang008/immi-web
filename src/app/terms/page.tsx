export default function TermsPage() {
  return (
    <main className="min-h-screen py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-3xl font-bold text-[#F0F4FF] mb-2">Terms &amp; Conditions</h1>
        <p className="text-[#3D6080] text-sm mb-10">Last updated: April 2025 &nbsp;·&nbsp; OLITECH AI PTY LTD</p>

        <section className="space-y-8 text-[#8BB8DC] leading-relaxed text-sm">

          <div>
            <h2 className="text-[#F0F4FF] font-semibold text-base mb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing or using AussieVisa Tracker (&ldquo;the Service&rdquo;), operated by OLITECH AI PTY LTD
              (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), you agree to be bound by these Terms &amp;
              Conditions and our Privacy Policy. If you do not agree, please do not use the Service.
            </p>
          </div>

          <div>
            <h2 className="text-[#F0F4FF] font-semibold text-base mb-2">2. Nature of the Service</h2>
            <p>
              AussieVisa Tracker is a community-sourced data platform that allows users to voluntarily submit and view
              anonymised Australian visa processing timelines. The information provided on this platform is for
              informational and statistical purposes only.
            </p>
            <p className="mt-3 font-medium text-[#FFD200]">
              This Service does not constitute legal, immigration, or professional advice. Always consult a registered
              migration agent or legal professional for guidance specific to your circumstances.
            </p>
          </div>

          <div>
            <h2 className="text-[#F0F4FF] font-semibold text-base mb-2">3. User Submissions</h2>
            <p>By submitting data to the platform, you confirm that:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
              <li>The information you provide is accurate to the best of your knowledge.</li>
              <li>You are submitting data voluntarily and anonymously.</li>
              <li>You grant us a non-exclusive, royalty-free licence to display and use the submitted data in
                aggregated, anonymised form for statistical and research purposes.</li>
              <li>You will not submit false, misleading, or fabricated information.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-[#F0F4FF] font-semibold text-base mb-2">4. Anonymity &amp; Privacy</h2>
            <p>
              We do not collect personally identifiable information without your explicit consent. Optional email
              addresses submitted are used solely for the purpose of sending relevant immigration updates and
              newsletters. You may unsubscribe at any time. We do not sell or share your personal data with third
              parties.
            </p>
          </div>

          <div>
            <h2 className="text-[#F0F4FF] font-semibold text-base mb-2">5. Accuracy of Data</h2>
            <p>
              All data displayed on this platform is community-sourced and has not been verified by the Department of
              Home Affairs or any government body. We make no representations or warranties about the accuracy,
              completeness, or reliability of any data displayed. Processing times shown are based on user reports and
              may not reflect official government timelines.
            </p>
          </div>

          <div>
            <h2 className="text-[#F0F4FF] font-semibold text-base mb-2">6. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by Australian law, OLITECH AI PTY LTD shall not be liable for any
              direct, indirect, incidental, special, or consequential damages arising from your use of, or reliance
              on, the Service or any data presented therein.
            </p>
          </div>

          <div>
            <h2 className="text-[#F0F4FF] font-semibold text-base mb-2">7. Intellectual Property</h2>
            <p>
              All design, code, and original content on this platform is owned by OLITECH AI PTY LTD. You may not
              reproduce, copy, or redistribute any part of the Service without written permission, except for personal,
              non-commercial use.
            </p>
          </div>

          <div>
            <h2 className="text-[#F0F4FF] font-semibold text-base mb-2">8. Modifications</h2>
            <p>
              We reserve the right to modify these Terms &amp; Conditions at any time. Continued use of the Service
              after any changes constitutes your acceptance of the updated terms.
            </p>
          </div>

          <div>
            <h2 className="text-[#F0F4FF] font-semibold text-base mb-2">9. Governing Law</h2>
            <p>
              These Terms are governed by the laws of the State of New South Wales, Australia. Any disputes shall be
              subject to the exclusive jurisdiction of the courts of New South Wales.
            </p>
          </div>

          <div>
            <h2 className="text-[#F0F4FF] font-semibold text-base mb-2">10. Contact</h2>
            <p>
              For any questions regarding these Terms, please contact us through the website.
            </p>
          </div>
        </section>

        <div className="mt-12 pt-6 border-t border-[rgba(0,61,165,0.3)]">
          <a href="/" className="text-sm text-[#3D6080] hover:text-[#8BB8DC] transition-colors">
            ← Back to AussieVisa Tracker
          </a>
        </div>
      </div>
    </main>
  );
}
