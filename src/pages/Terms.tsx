
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FileText } from 'lucide-react';

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-16 mt-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold">Terms of Service</h1>
            </div>
            
            <div className="text-sm text-muted-foreground mb-8">
              Last Updated: June 1, 2025
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p className="lead">
                Welcome to Nexify. These Terms of Service ("Terms") govern your access to and use of the Nexify website, apps, and services. Please read these Terms carefully before using our services.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing or using our services, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you may not access or use our services.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">2. Eligibility</h2>
              <p>
                You must be at least 18 years old to use our services. By using our services, you represent and warrant that you meet this requirement and that you have the right, authority, and capacity to enter into these Terms.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">3. Account Registration</h2>
              <p>
                To access certain features of our services, you may be required to create an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
              </p>
              <p>
                You are responsible for safeguarding your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">4. User Conduct</h2>
              <p>
                When using our services, you agree not to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe the rights of others, including privacy and intellectual property rights</li>
                <li>Post false, inaccurate, misleading, deceptive, or offensive content</li>
                <li>Create multiple accounts or impersonate any person or entity</li>
                <li>Use our services for any illegal or unauthorized purpose</li>
                <li>Interfere with or disrupt the operation of our services</li>
                <li>Attempt to gain unauthorized access to our systems or user accounts</li>
                <li>Collect or harvest data from our services without our consent</li>
                <li>Transmit viruses, malware, or other harmful code</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">5. Job Listings and Applications</h2>
              <p>
                <strong>For Employers:</strong> You are solely responsible for the job listings you post, including their accuracy and legality. All job postings must comply with applicable employment and anti-discrimination laws.
              </p>
              <p>
                <strong>For Job Seekers:</strong> You are responsible for the content of your profile and applications. You agree that all information provided is accurate, and you have all necessary rights to the content you submit.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">6. Fees and Payments</h2>
              <p>
                Some of our services may require payment. By using our paid services, you agree to pay all fees and charges associated with your account on a timely basis and according to the pricing and terms in effect when the charges were incurred.
              </p>
              <p>
                All payments are non-refundable unless explicitly stated otherwise or required by law.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">7. Intellectual Property Rights</h2>
              <p>
                Our services and their contents, features, and functionality are owned by Nexify and are protected by copyright, trademark, and other intellectual property laws.
              </p>
              <p>
                You may not use, reproduce, distribute, modify, or create derivative works of our content without our explicit permission.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">8. Termination</h2>
              <p>
                We may terminate or suspend your account and access to our services at our sole discretion, without notice, for any reason, including if you violate these Terms.
              </p>
              <p>
                You may terminate your account at any time by following the instructions on our website or contacting us.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">9. Disclaimer of Warranties</h2>
              <p>
                Our services are provided "as is" and "as available" without any warranties of any kind, either express or implied, including but not limited to the implied warranties of merchantability, fitness for a particular purpose, or non-infringement.
              </p>
              <p>
                We do not guarantee that our services will be uninterrupted, secure, or error-free, or that any defects will be corrected.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">10. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, Nexify shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or use, arising out of or in connection with these Terms or our services.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">11. Indemnification</h2>
              <p>
                You agree to indemnify, defend, and hold harmless Nexify, its affiliates, officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, costs, or expenses arising out of or in connection with your use of our services or violation of these Terms.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">12. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">13. Changes to Terms</h2>
              <p>
                We may update these Terms from time to time. We will notify you of any changes by posting the new Terms on this page and updating the "Last Updated" date.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">14. Contact Us</h2>
              <p>
                If you have questions or concerns about these Terms, please contact us at:
              </p>
              <p>
                Email: nexify@gmail.com<br />
                Address: Walchand Institute of Technology, Walchand Hirachand Marg, Ashok Chowk, Solapur, Maharashtra, India - 413005
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
