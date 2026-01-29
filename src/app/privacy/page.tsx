import type { Metadata } from 'next';
import { Box, Container, Typography, List, ListItem, Paper } from '@mui/material';

export const metadata: Metadata = {
  title: 'Privacy Policy - Movies Tracker',
  description: 'Privacy policy for Movies Tracker application',
};

export default function PrivacyPolicyPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #111827, #1f2937, #111827)',
        color: 'white',
        py: 6,
        px: 3,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ maxWidth: '900px', mx: 'auto' }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 'bold',
              mb: 2,
              background: 'linear-gradient(to right, #c084fc, #f472b6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Privacy Policy
          </Typography>
          
          <Typography variant="body2" sx={{ color: '#9ca3af', mb: 4 }}>
            <strong>Last Updated:</strong> January 28, 2026
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        
            <Box component="section">
              <Typography variant="h4" sx={{ fontWeight: 'semibold', mb: 2, color: '#d8b4fe' }}>
                1. Introduction
              </Typography>
              <Typography sx={{ color: '#d1d5db' }}>
                Welcome to Movies Tracker (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We respect your privacy and are committed 
                to protecting your personal data. This privacy policy explains how we collect, use, and 
                safeguard your information when you use our website and mobile application.
              </Typography>
            </Box>

            <Box component="section">
              <Typography variant="h4" sx={{ fontWeight: 'semibold', mb: 2, color: '#d8b4fe' }}>
                2. Information We Collect
              </Typography>
              
              <Typography variant="h5" sx={{ fontWeight: 'semibold', mt: 3, mb: 1.5, color: '#fbcfe8' }}>
                2.1 Information from Google Sign-In
              </Typography>
              <Typography sx={{ color: '#d1d5db', mb: 1 }}>When you sign in with Google, we collect:</Typography>
              <List sx={{ pl: 3, '& li': { display: 'list-item', listStyleType: 'disc', color: '#d1d5db' } }}>
                <ListItem sx={{ display: 'list-item', p: 0, mb: 0.5 }}>
                  <strong style={{ color: 'white' }}>Email address:</strong> Your Google account email
                </ListItem>
                <ListItem sx={{ display: 'list-item', p: 0, mb: 0.5 }}>
                  <strong style={{ color: 'white' }}>Name:</strong> Your display name from your Google account
                </ListItem>
                <ListItem sx={{ display: 'list-item', p: 0, mb: 0.5 }}>
                  <strong style={{ color: 'white' }}>Profile picture:</strong> Your Google account profile photo
                </ListItem>
                <ListItem sx={{ display: 'list-item', p: 0, mb: 0.5 }}>
                  <strong style={{ color: 'white' }}>User ID:</strong> A unique identifier from Google authentication
                </ListItem>
              </List>
              <Typography sx={{ mt: 1.5, color: '#d1d5db' }}>
                We use Google OAuth 2.0 for authentication. Your Google password is never shared with us 
                or stored on our servers.
              </Typography>

              <Typography variant="h5" sx={{ fontWeight: 'semibold', mt: 3, mb: 1.5, color: '#fbcfe8' }}>
                2.2 Usage Data
              </Typography>
              <Typography sx={{ color: '#d1d5db', mb: 1 }}>We collect information about your activity on our platform:</Typography>
              <List sx={{ pl: 3, '& li': { display: 'list-item', listStyleType: 'disc', color: '#d1d5db' } }}>
                <ListItem sx={{ display: 'list-item', p: 0, mb: 0.5 }}>
                  <strong style={{ color: 'white' }}>Watchlist:</strong> Movies and TV shows you add to your watchlist
                </ListItem>
                <ListItem sx={{ display: 'list-item', p: 0, mb: 0.5 }}>
                  <strong style={{ color: 'white' }}>Watched items:</strong> Content you mark as watched
                </ListItem>
                <ListItem sx={{ display: 'list-item', p: 0, mb: 0.5 }}>
                  <strong style={{ color: 'white' }}>Favorite providers:</strong> Streaming services you select as favorites
                </ListItem>
                <ListItem sx={{ display: 'list-item', p: 0, mb: 0.5 }}>
                  <strong style={{ color: 'white' }}>Search history:</strong> Searches you perform within the app
                </ListItem>
                <ListItem sx={{ display: 'list-item', p: 0, mb: 0.5 }}>
                  <strong style={{ color: 'white' }}>Activity logs:</strong> Your interactions with content (views, clicks)
                </ListItem>
              </List>

              <Typography variant="h5" sx={{ fontWeight: 'semibold', mt: 3, mb: 1.5, color: '#fbcfe8' }}>
                2.3 Technical Data
              </Typography>
              <List sx={{ pl: 3, '& li': { display: 'list-item', listStyleType: 'disc', color: '#d1d5db' } }}>
                <ListItem sx={{ display: 'list-item', p: 0, mb: 0.5 }}>
                  <strong style={{ color: 'white' }}>Device information:</strong> Browser type, device type, operating system
                </ListItem>
                <ListItem sx={{ display: 'list-item', p: 0, mb: 0.5 }}>
                  <strong style={{ color: 'white' }}>IP address:</strong> For security and analytics purposes
                </ListItem>
                <ListItem sx={{ display: 'list-item', p: 0, mb: 0.5 }}>
                  <strong style={{ color: 'white' }}>Cookies and local storage:</strong> To maintain your session and preferences
                </ListItem>
                <ListItem sx={{ display: 'list-item', p: 0, mb: 0.5 }}>
                  <strong style={{ color: 'white' }}>Authentication tokens:</strong> Firebase authentication tokens for secure access
                </ListItem>
              </List>

              <Typography variant="h5" sx={{ fontWeight: 'semibold', mt: 3, mb: 1.5, color: '#fbcfe8' }}>
                2.4 Third-Party Data
              </Typography>
              <Typography sx={{ color: '#d1d5db', mb: 1 }}>We retrieve movie and TV show information from:</Typography>
              <List sx={{ pl: 3, '& li': { display: 'list-item', listStyleType: 'disc', color: '#d1d5db' } }}>
                <ListItem sx={{ display: 'list-item', p: 0, mb: 0.5 }}>
                  <strong style={{ color: 'white' }}>The Movie Database (TMDB):</strong> Movie metadata, posters, and descriptions
                </ListItem>
                <ListItem sx={{ display: 'list-item', p: 0, mb: 0.5 }}>
                  <strong style={{ color: 'white' }}>Streaming availability services:</strong> Information about where content is available to stream
                </ListItem>
              </List>
              <Typography sx={{ mt: 1.5, color: '#d1d5db' }}>
                This data is used solely to provide you with content information and is not linked to your 
                personal identity beyond your personal watchlist and preferences.
              </Typography>
            </Box>

            <Box component="section">
              <Typography variant="h4" sx={{ fontWeight: 'semibold', mb: 2, color: '#d8b4fe' }}>
                3. How We Use Your Information
              </Typography>
              <Typography sx={{ color: '#d1d5db', mb: 1 }}>We use the collected information for:</Typography>
              <List sx={{ pl: 3, '& li': { display: 'list-item', listStyleType: 'disc', color: '#d1d5db' } }}>
                <ListItem sx={{ display: 'list-item', p: 0, mb: 0.5 }}>
                  <strong style={{ color: 'white' }}>Authentication:</strong> To verify your identity and provide secure access
                </ListItem>
                <ListItem sx={{ display: 'list-item', p: 0, mb: 0.5 }}>
                  <strong style={{ color: 'white' }}>Personalization:</strong> To customize your experience based on your preferences
                </ListItem>
                <ListItem sx={{ display: 'list-item', p: 0, mb: 0.5 }}>
                  <strong style={{ color: 'white' }}>Service functionality:</strong> To provide watchlist, recommendations, and streaming availability features
                </ListItem>
                <ListItem sx={{ display: 'list-item', p: 0, mb: 0.5 }}>
                  <strong style={{ color: 'white' }}>Analytics:</strong> To understand how users interact with our platform and improve our services
                </ListItem>
                <ListItem sx={{ display: 'list-item', p: 0, mb: 0.5 }}>
                  <strong style={{ color: 'white' }}>Communication:</strong> To send important updates about our service (if applicable)
                </ListItem>
                <ListItem sx={{ display: 'list-item', p: 0, mb: 0.5 }}>
                  <strong style={{ color: 'white' }}>Security:</strong> To detect and prevent fraud, abuse, and security incidents
                </ListItem>
              </List>
            </Box>

            <Box component="section">
              <Typography variant="h4" sx={{ fontWeight: 'semibold', mb: 2, color: '#d8b4fe' }}>
                4. Data Storage and Security
              </Typography>
              <Typography sx={{ color: '#d1d5db', mb: 1 }}>
                Your data is stored securely using Firebase, Googles backend platform. We implement 
                industry-standard security measures including:
              </Typography>
              <List sx={{ pl: 3, '& li': { display: 'list-item', listStyleType: 'disc', color: '#d1d5db' } }}>
                <ListItem sx={{ display: 'list-item', p: 0, mb: 0.5 }}>
                  Encrypted data transmission (HTTPS/TLS)
                </ListItem>
                <ListItem sx={{ display: 'list-item', p: 0, mb: 0.5 }}>
                  Secure authentication tokens with automatic expiration
                </ListItem>
                <ListItem sx={{ display: 'list-item', p: 0, mb: 0.5 }}>
                  Firebase security rules to restrict unauthorized access
                </ListItem>
                <ListItem sx={{ display: 'list-item', p: 0, mb: 0.5 }}>
                  Regular security updates and monitoring
                </ListItem>
              </List>
              <Typography sx={{ mt: 1.5, color: '#d1d5db' }}>
                While we strive to protect your data, no method of transmission over the internet is 
                100% secure. We cannot guarantee absolute security.
              </Typography>
            </Box>

            <Box component="section">
              <Typography variant="h4" sx={{ fontWeight: 'semibold', mb: 2, color: '#d8b4fe' }}>
                5. Data Sharing and Disclosure
              </Typography>
              <Typography sx={{ fontWeight: 'semibold', fontSize: '1.125rem', mb: 1.5, color: 'white' }}>
                We do NOT share, sell, rent, or trade your personal information with third parties for their marketing purposes.
              </Typography>
              <Typography sx={{ mb: 1.5, color: '#d1d5db' }}>
                Your personal data (name, email, watchlist, preferences) remains private and is never shared with other users or external companies.
              </Typography>
              <Typography sx={{ mb: 1.5, color: '#d1d5db' }}>
                The only scenarios where data may be accessed or disclosed are:
              </Typography>
              <List sx={{ pl: 3, '& li': { display: 'list-item', listStyleType: 'disc', color: '#d1d5db' } }}>
                <ListItem sx={{ display: 'list-item', p: 0, mb: 0.5 }}>
                  <strong style={{ color: 'white' }}>Technical infrastructure:</strong> We use Firebase (Google Cloud) to securely store your data. Google acts as a data processor and does not use your information for any other purpose
                </ListItem>
                <ListItem sx={{ display: 'list-item', p: 0, mb: 0.5 }}>
                  <strong style={{ color: 'white' }}>Legal requirements:</strong> Only when required by law, court order, or to protect our legal rights
                </ListItem>
                <ListItem sx={{ display: 'list-item', p: 0, mb: 0.5 }}>
                  <strong style={{ color: 'white' }}>With your explicit consent:</strong> Only if you specifically authorize us to share information
                </ListItem>
              </List>
              <Typography variant="body2" sx={{ mt: 1.5, color: '#9ca3af' }}>
                <strong>Note:</strong> We use TMDB and streaming availability APIs to retrieve public movie/TV information, 
                but we do not send your personal information to these services. Your searches and watchlist data stay private.
              </Typography>
            </Box>

            <Box component="section">
              <Typography variant="h4" sx={{ fontWeight: 'semibold', mb: 2, color: '#d8b4fe' }}>
                6. Cookies and Tracking Technologies
              </Typography>
              <Typography sx={{ color: '#d1d5db', mb: 1 }}>
                We use cookies and similar technologies to maintain your session, remember your preferences, 
                and analyze site usage. You can control cookies through your browser settings, but disabling 
                cookies may affect functionality.
              </Typography>
              <Typography sx={{ mt: 1.5, color: '#d1d5db', mb: 1 }}>Types of cookies we use:</Typography>
              <List sx={{ pl: 3, '& li': { display: 'list-item', listStyleType: 'disc', color: '#d1d5db' } }}>
                <ListItem sx={{ display: 'list-item', p: 0, mb: 0.5 }}>
                  <strong style={{ color: 'white' }}>Essential cookies:</strong> Required for aut`he`ntication and core functionality
                </ListItem>
                <ListItem sx={{ display: 'list-item', p: 0, mb: 0.5 }}>
                  <strong style={{ color: 'white' }}>Preference cookies:</strong> Remember your settings and choices
                </ListItem>
                <ListItem sx={{ display: 'list-item', p: 0, mb: 0.5 }}>
                  <strong style={{ color: 'white' }}>Analytics cookies:</strong> Help us understand how you use our service
                </ListItem>
              </List>
            </Box>

            <Box component="section">
              <Typography variant="h4" sx={{ fontWeight: 'semibold', mb: 2, color: '#d8b4fe' }}>
                7. Your Privacy Rights
              </Typography>
              <Typography sx={{ color: '#d1d5db', mb: 1 }}>You have the right to:</Typography>
              <List sx={{ pl: 3, '& li': { display: 'list-item', listStyleType: 'disc', color: '#d1d5db' } }}>
                <ListItem sx={{ display: 'list-item', p: 0, mb: 0.5 }}>
                  <strong style={{ color: 'white' }}>Access:</strong> Request a copy of your personal data
                </ListItem>
                <ListItem sx={{ display: 'list-item', p: 0, mb: 0.5 }}>
                  <strong style={{ color: 'white' }}>Correction:</strong> Update or correct inaccurate information
                </ListItem>
                <ListItem sx={{ display: 'list-item', p: 0, mb: 0.5 }}>
                  <strong style={{ color: 'white' }}>Deletion:</strong> Request deletion of your account and associated data
                </ListItem>
                <ListItem sx={{ display: 'list-item', p: 0, mb: 0.5 }}>
                  <strong style={{ color: 'white' }}>Data portability:</strong> Receive your data in a structured, commonly used format
                </ListItem>
                <ListItem sx={{ display: 'list-item', p: 0, mb: 0.5 }}>
                  <strong style={{ color: 'white' }}>Opt-out:</strong> Unsubscribe from non-essential communications
                </ListItem>
                <ListItem sx={{ display: 'list-item', p: 0, mb: 0.5 }}>
                  <strong style={{ color: 'white' }}>Revoke consent:</strong> Withdraw consent for data processing at any time
                </ListItem>
              </List>
              <Typography sx={{ mt: 1.5, color: '#d1d5db' }}>
                To exercise these rights, please contact us using the information provided below. You can 
                also manage many of these options directly through your account settings.
              </Typography>
            </Box>

            <Box component="section">
              <Typography variant="h4" sx={{ fontWeight: 'semibold', mb: 2, color: '#d8b4fe' }}>
                8. Children&apos;s Privacy
              </Typography>
              <Typography sx={{ color: '#d1d5db' }}>
                Our service is not intended for children under 13 years of age. We do not knowingly collect 
                personal information from children under 13. If you believe we have collected information 
                from a child under 13, please contact us immediately.
              </Typography>
            </Box>

            <Box component="section">
              <Typography variant="h4" sx={{ fontWeight: 'semibold', mb: 2, color: '#d8b4fe' }}>
                9. Data Retention
              </Typography>
              <Typography sx={{ color: '#d1d5db' }}>
                We retain your personal data only as long as necessary to provide our services and fulfill 
                the purposes outlined in this policy. When you delete your account, we will delete or 
                anonymize your personal information within 30 days, except where we are required to retain 
                it for legal purposes.
              </Typography>
            </Box>

            <Box component="section">
              <Typography variant="h4" sx={{ fontWeight: 'semibold', mb: 2, color: '#d8b4fe' }}>
                10. International Data Transfers
              </Typography>
              <Typography sx={{ color: '#d1d5db' }}>
                Your information may be transferred to and processed in countries other than your own. 
                We use Firebase (Google Cloud), which has data centers worldwide. These transfers are 
                protected by appropriate safeguards, including Google&apos;s compliance with relevant data 
                protection frameworks.
              </Typography>
            </Box>

            <Box component="section">
              <Typography variant="h4" sx={{ fontWeight: 'semibold', mb: 2, color: '#d8b4fe' }}>
                11. Third-Party Links
              </Typography>
              <Typography sx={{ color: '#d1d5db' }}>
                Our service may contain links to third-party websites (e.g., streaming platforms, TMDB). 
                We are not responsible for the privacy practices of these external sites. We encourage you 
                to review their privacy policies.
              </Typography>
            </Box>

            <Box component="section">
              <Typography variant="h4" sx={{ fontWeight: 'semibold', mb: 2, color: '#d8b4fe' }}>
                12. Changes to This Privacy Policy
              </Typography>
              <Typography sx={{ color: '#d1d5db' }}>
                We may update this privacy policy from time to time. We will notify you of significant 
                changes by posting the new policy on this page and updating the &quot;Last Updated&quot; date. 
                Continued use of our service after changes indicates your acceptance of the updated policy.
              </Typography>
            </Box>

            <Box component="section">
              <Typography variant="h4" sx={{ fontWeight: 'semibold', mb: 2, color: '#d8b4fe' }}>
                13. Contact Us
              </Typography>
              <Typography sx={{ color: '#d1d5db', mb: 2 }}>
                If you have questions about this privacy policy or wish to exercise your privacy rights, 
                please contact us at:
              </Typography>
              <Paper 
                sx={{ 
                  bgcolor: '#1f2937', 
                  border: '1px solid #374151',
                  p: 2, 
                  borderRadius: 2 
                }}
              >
                <Typography sx={{ color: '#d1d5db' }}>
                  <strong style={{ color: 'white' }}>Email:</strong> privacy@moviestracker.com
                </Typography>
                <Typography sx={{ mt: 1, color: '#d1d5db' }}>
                  <strong style={{ color: 'white' }}>Project:</strong> Movies Tracker
                </Typography>
                <Typography sx={{ mt: 1, color: '#d1d5db' }}>
                  <strong style={{ color: 'white' }}>GitHub:</strong> blankenshipd001/track-my-stuff
                </Typography>
              </Paper>
            </Box>

            <Box component="section" sx={{ borderTop: '1px solid #374151', pt: 3, mt: 4 }}>
              <Typography variant="h4" sx={{ fontWeight: 'semibold', mb: 2, color: '#d8b4fe' }}>
                California Privacy Rights (CCPA)
              </Typography>
              <Typography sx={{ color: '#d1d5db', mb: 1 }}>
                If you are a California resident, you have additional rights under the California Consumer 
                Privacy Act (CCPA):
              </Typography>
              <List sx={{ pl: 3, '& li': { display: 'list-item', listStyleType: 'disc', color: '#d1d5db' } }}>
                <ListItem sx={{ display: 'list-item', p: 0, mb: 0.5 }}>
                  Right to know what personal information is collected
                </ListItem>
                <ListItem sx={{ display: 'list-item', p: 0, mb: 0.5 }}>
                  Right to know if personal information is sold or disclosed
                </ListItem>
                <ListItem sx={{ display: 'list-item', p: 0, mb: 0.5 }}>
                  Right to say no to the sale of personal information
                </ListItem>
                <ListItem sx={{ display: 'list-item', p: 0, mb: 0.5 }}>
                  Right to delete personal information
                </ListItem>
                <ListItem sx={{ display: 'list-item', p: 0, mb: 0.5 }}>
                  Right to non-discrimination for exercising CCPA rights
                </ListItem>
              </List>
              <Typography sx={{ mt: 1.5, color: '#d1d5db' }}>
                <strong style={{ color: 'white' }}>Note:</strong> We do not sell your personal information.
              </Typography>
            </Box>

            <Box component="section" sx={{ borderTop: '1px solid #374151', pt: 3, mt: 4 }}>
              <Typography variant="h4" sx={{ fontWeight: 'semibold', mb: 2, color: '#d8b4fe' }}>
                European Privacy Rights (GDPR)
              </Typography>
              <Typography sx={{ color: '#d1d5db', mb: 1 }}>
                If you are located in the European Economic Area (EEA), you have rights under the General 
                Data Protection Regulation (GDPR) including:
              </Typography>
              <List sx={{ pl: 3, '& li': { display: 'list-item', listStyleType: 'disc', color: '#d1d5db' } }}>
                <ListItem sx={{ display: 'list-item', p: 0, mb: 0.5 }}>
                  Right of access to your personal data
                </ListItem>
                <ListItem sx={{ display: 'list-item', p: 0, mb: 0.5 }}>
                  Right to rectification of inaccurate data
                </ListItem>
                <ListItem sx={{ display: 'list-item', p: 0, mb: 0.5 }}>
                  Right to erasure (&quot;right to be forgotten&quot;)
                </ListItem>
                <ListItem sx={{ display: 'list-item', p: 0, mb: 0.5 }}>
                  Right to restriction of processing
                </ListItem>
                <ListItem sx={{ display: 'list-item', p: 0, mb: 0.5 }}>
                  Right to data portability
                </ListItem>
                <ListItem sx={{ display: 'list-item', p: 0, mb: 0.5 }}>
                  Right to object to processing
                </ListItem>
                <ListItem sx={{ display: 'list-item', p: 0, mb: 0.5 }}>
                  Rights related to automated decision-making
                </ListItem>
              </List>
              <Typography sx={{ mt: 1.5, color: '#d1d5db' }}>
                <strong style={{ color: 'white' }}>Legal basis for processing:</strong> We process your data based on your consent 
                (Google Sign-In) and our legitimate interest in providing and improving our services.
              </Typography>
            </Box>

          </Box>
        </Box>
      </Container>
    </Box>
  );
}
