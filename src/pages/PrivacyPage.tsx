export default function PrivacyPage() {
  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Privacy Policy</h1>
        <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 space-y-6">
          <p className="text-sm text-gray-500">Last Updated: April 12, 2026</p>
          
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us when you create an account, upload files, or communicate with us. This includes your name, email address, and the metadata of the files you upload.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">2. How We Use Your Information</h2>
            <p>
              We use the information we collect to provide, maintain, and improve our services, including the AI-driven analysis and file processing features. We do not sell your personal information or file data to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">3. Data Security</h2>
            <p>
              We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access. All file transfers are encrypted using SSL/TLS, and files are stored securely in AWS S3.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">4. AI Analysis</h2>
            <p>
              When you use our AI features, we process file metadata and content through secure AI models (like Google Gemini). This data is used solely for generating suggestions and processing your files as requested.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">5. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at privacy@omni-saas.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
