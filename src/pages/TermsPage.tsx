export default function TermsPage() {
  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Terms of Service</h1>
        <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 space-y-6">
          <p className="text-sm text-gray-500">Last Updated: April 12, 2026</p>
          
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Omni, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">2. Description of Service</h2>
            <p>
              Omni provides AI-powered file management and processing services. We reserve the right to modify or discontinue the service at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">3. User Accounts</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">4. Content and Conduct</h2>
            <p>
              You retain all rights to the files you upload. You agree not to use Omni for any illegal purposes or to upload content that violates third-party rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">5. Limitation of Liability</h2>
            <p>
              Omni shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use our services.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
