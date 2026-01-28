import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Movies Tracker',
  description: 'Privacy policy for Movies Tracker application',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      
      <p className="text-sm text-gray-600 mb-8">
        <strong>Last Updated:</strong> January 28, 2026
      </p>

      <div className="space-y-8 prose prose-slate max-w-none">
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p>
            Welcome to Movies Tracker ("we," "our," or "us"). We respect your privacy and are committed 
            to protecting your personal data. This privacy policy explains how we collect, use, and 
            safeguard your information when you use our website and mobile application.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">2.1 Information from Google Sign-In</h3>
          <p>When you sign in with Google, we collect:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Email address:</strong> Your Google account email</li>
            <li><strong>Name:</strong> Your display name from your Google account</li>
            <li><strong>Profile picture:</strong> Your Google account profile photo</li>
            <li><strong>User ID:</strong> A unique identifier from Google authentication</li>
          </ul>
          <p className="mt-3">
            We use Google OAuth 2.0 for authentication. Your Google password is never shared with us 
            or stored on our servers.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">2.2 Usage Data</h3>
          <p>We collect information about your activity on our platform:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Watchlist:</strong> Movies and TV shows you add to your watchlist</li>
            <li><strong>Watched items:</strong> Content you mark as watched</li>
            <li><strong>Favorite providers:</strong> Streaming services you select as favorites</li>
            <li><strong>Search history:</strong> Searches you perform within the app</li>
            <li><strong>Activity logs:</strong> Your interactions with content (views, clicks)</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">2.3 Technical Data</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Device information:</strong> Browser type, device type, operating system</li>
            <li><strong>IP address:</strong> For security and analytics purposes</li>
            <li><strong>Cookies and local storage:</strong> To maintain your session and preferences</li>
            <li><strong>Authentication tokens:</strong> Firebase authentication tokens for secure access</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">2.4 Third-Party Data</h3>
          <p>We retrieve movie and TV show information from:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>The Movie Database (TMDB):</strong> Movie metadata, posters, and descriptions</li>
            <li><strong>Streaming availability services:</strong> Information about where content is available to stream</li>
          </ul>
          <p className="mt-3">
            This data is used solely to provide you with content information and is not linked to your 
            personal identity beyond your personal watchlist and preferences.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
          <p>We use the collected information for:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Authentication:</strong> To verify your identity and provide secure access</li>
            <li><strong>Personalization:</strong> To customize your experience based on your preferences</li>
            <li><strong>Service functionality:</strong> To provide watchlist, recommendations, and streaming availability features</li>
            <li><strong>Analytics:</strong> To understand how users interact with our platform and improve our services</li>
            <li><strong>Communication:</strong> To send important updates about our service (if applicable)</li>
            <li><strong>Security:</strong> To detect and prevent fraud, abuse, and security incidents</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Data Storage and Security</h2>
          <p>
            Your data is stored securely using Firebase, Google's backend platform. We implement 
            industry-standard security measures including:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Encrypted data transmission (HTTPS/TLS)</li>
            <li>Secure authentication tokens with automatic expiration</li>
            <li>Firebase security rules to restrict unauthorized access</li>
            <li>Regular security updates and monitoring</li>
          </ul>
          <p className="mt-3">
            While we strive to protect your data, no method of transmission over the internet is 
            100% secure. We cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Data Sharing and Disclosure</h2>
          <p className="font-semibold text-lg mb-3">
            We do NOT share, sell, rent, or trade your personal information with third parties for their marketing purposes.
          </p>
          <p className="mb-3">
            Your personal data (name, email, watchlist, preferences) remains private and is never shared with other users or external companies.
          </p>
          <p className="mb-3">
            The only scenarios where data may be accessed or disclosed are:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Technical infrastructure:</strong> We use Firebase (Google Cloud) to securely store your data. Google acts as a data processor and does not use your information for any other purpose</li>
            <li><strong>Legal requirements:</strong> Only when required by law, court order, or to protect our legal rights</li>
            <li><strong>With your explicit consent:</strong> Only if you specifically authorize us to share information</li>
          </ul>
          <p className="mt-3 text-sm text-gray-600">
            <strong>Note:</strong> We use TMDB and streaming availability APIs to retrieve public movie/TV information, 
            but we do not send your personal information to these services. Your searches and watchlist data stay private.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies and similar technologies to maintain your session, remember your preferences, 
            and analyze site usage. You can control cookies through your browser settings, but disabling 
            cookies may affect functionality.
          </p>
          <p className="mt-3">Types of cookies we use:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Essential cookies:</strong> Required for authentication and core functionality</li>
            <li><strong>Preference cookies:</strong> Remember your settings and choices</li>
            <li><strong>Analytics cookies:</strong> Help us understand how you use our service</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Your Privacy Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Access:</strong> Request a copy of your personal data</li>
            <li><strong>Correction:</strong> Update or correct inaccurate information</li>
            <li><strong>Deletion:</strong> Request deletion of your account and associated data</li>
            <li><strong>Data portability:</strong> Receive your data in a structured, commonly used format</li>
            <li><strong>Opt-out:</strong> Unsubscribe from non-essential communications</li>
            <li><strong>Revoke consent:</strong> Withdraw consent for data processing at any time</li>
          </ul>
          <p className="mt-3">
            To exercise these rights, please contact us using the information provided below. You can 
            also manage many of these options directly through your account settings.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">8. Children's Privacy</h2>
          <p>
            Our service is not intended for children under 13 years of age. We do not knowingly collect 
            personal information from children under 13. If you believe we have collected information 
            from a child under 13, please contact us immediately.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">9. Data Retention</h2>
          <p>
            We retain your personal data only as long as necessary to provide our services and fulfill 
            the purposes outlined in this policy. When you delete your account, we will delete or 
            anonymize your personal information within 30 days, except where we are required to retain 
            it for legal purposes.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">10. International Data Transfers</h2>
          <p>
            Your information may be transferred to and processed in countries other than your own. 
            We use Firebase (Google Cloud), which has data centers worldwide. These transfers are 
            protected by appropriate safeguards, including Google's compliance with relevant data 
            protection frameworks.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">11. Third-Party Links</h2>
          <p>
            Our service may contain links to third-party websites (e.g., streaming platforms, TMDB). 
            We are not responsible for the privacy practices of these external sites. We encourage you 
            to review their privacy policies.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">12. Changes to This Privacy Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify you of significant 
            changes by posting the new policy on this page and updating the "Last Updated" date. 
            Continued use of our service after changes indicates your acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">13. Contact Us</h2>
          <p>
            If you have questions about this privacy policy or wish to exercise your privacy rights, 
            please contact us at:
          </p>
          <div className="bg-gray-100 p-4 rounded-lg mt-4">
            <p><strong>Email:</strong> privacy@moviestracker.com</p>
            <p className="mt-2"><strong>Project:</strong> Movies Tracker</p>
            <p className="mt-2"><strong>GitHub:</strong> blankenshipd001/track-my-stuff</p>
          </div>
        </section>

        <section className="border-t pt-6 mt-8">
          <h2 className="text-2xl font-semibold mb-4">California Privacy Rights (CCPA)</h2>
          <p>
            If you are a California resident, you have additional rights under the California Consumer 
            Privacy Act (CCPA):
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Right to know what personal information is collected</li>
            <li>Right to know if personal information is sold or disclosed</li>
            <li>Right to say no to the sale of personal information</li>
            <li>Right to delete personal information</li>
            <li>Right to non-discrimination for exercising CCPA rights</li>
          </ul>
          <p className="mt-3">
            <strong>Note:</strong> We do not sell your personal information.
          </p>
        </section>

        <section className="border-t pt-6 mt-8">
          <h2 className="text-2xl font-semibold mb-4">European Privacy Rights (GDPR)</h2>
          <p>
            If you are located in the European Economic Area (EEA), you have rights under the General 
            Data Protection Regulation (GDPR) including:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Right of access to your personal data</li>
            <li>Right to rectification of inaccurate data</li>
            <li>Right to erasure ("right to be forgotten")</li>
            <li>Right to restriction of processing</li>
            <li>Right to data portability</li>
            <li>Right to object to processing</li>
            <li>Rights related to automated decision-making</li>
          </ul>
          <p className="mt-3">
            <strong>Legal basis for processing:</strong> We process your data based on your consent 
            (Google Sign-In) and our legitimate interest in providing and improving our services.
          </p>
        </section>

      </div>
    </div>
  );
}
