import React from 'react';
import { ShieldCheck } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="min-h-screen">
      <main className="py-16 mt-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold">Privacy Policy</h1>
            </div>
            
            <div className="text-sm text-muted-foreground mb-8">
              Last Updated: June 1, 2025
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p className="lead">
                At Nexify, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Information We Collect</h2>
              
              <h3 className="text-xl font-medium mt-6 mb-3">Personal Information</h3>
              <p>
                We may collect personal information that you voluntarily provide to us when you:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Register for an account</li>
                <li>Complete your profile</li>
                <li>Apply for jobs through our platform</li>
                <li>Post job listings as an employer</li>
                <li>Contact our support team</li>
                <li>Subscribe to our newsletter</li>
              </ul>
              <p>
                This information may include your name, email address, phone number, resume, work history, education, skills, and other information relevant to job applications and hiring processes.
              </p>
              
              <h3 className="text-xl font-medium mt-6 mb-3">Usage Information</h3>
              <p>
                We automatically collect certain information about how you interact with our platform, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>IP address</li>
                <li>Browser type</li>
                <li>Device information</li>
                <li>Pages viewed</li>
                <li>Time spent on pages</li>
                <li>Referring URLs</li>
                <li>Search terms used on our platform</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">How We Use Your Information</h2>
              <p>
                We use the information we collect for various purposes, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Providing and maintaining our services</li>
                <li>Matching job seekers with appropriate job opportunities</li>
                <li>Allowing employers to review applications and contact candidates</li>
                <li>Personalizing your experience on our platform</li>
                <li>Improving our website and services</li>
                <li>Communicating with you about your account or job opportunities</li>
                <li>Sending relevant newsletters and marketing communications (with your consent)</li>
                <li>Analyzing usage patterns to enhance user experience</li>
                <li>Preventing fraudulent activity and enhancing security</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Data Sharing and Disclosure</h2>
              <p>
                We may share your information with:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Employers:</strong> When you apply for jobs, your profile information and application materials are shared with the respective employers.</li>
                <li><strong>Service Providers:</strong> We work with third-party service providers who perform services on our behalf, such as hosting, data analysis, payment processing, and customer service.</li>
                <li><strong>Business Partners:</strong> We may share information with our business partners to offer you certain products, services, or promotions.</li>
                <li><strong>Legal Requirements:</strong> We may disclose your information if required by law or in response to valid requests from public authorities.</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Your Rights and Choices</h2>
              <p>
                Depending on your location, you may have certain rights regarding your personal information:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access to your personal information</li>
                <li>Correction of inaccurate or incomplete information</li>
                <li>Deletion of your personal information</li>
                <li>Restriction of processing of your personal information</li>
                <li>Data portability</li>
                <li>Objection to processing of your personal information</li>
              </ul>
              <p>
                To exercise these rights, please contact us at nexify@gmail.com.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Security Measures</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Updates to This Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
              <p>
                If you have questions or concerns about this Privacy Policy or our data practices, please contact us at:
              </p>
              <p>
                Email: nexify@gmail.com<br />
                Address: Walchand Institute of Technology, Walchand Hirachand Marg, Ashok Chowk, Solapur, Maharashtra, India - 413005
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Privacy;
