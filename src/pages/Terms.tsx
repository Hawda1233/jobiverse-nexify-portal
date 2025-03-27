
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Scroll, ShieldCheck, FileCheck } from 'lucide-react';

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-16 mt-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-muted-foreground mb-8">
                Last Updated: March 30, 2025 | Effective Date: March 30, 2025
              </p>
              
              <p className="mb-6">
                Welcome to Nexify, a platform founded on March 30, 2025. These Terms of Service ("Terms") govern your access to and use of the Nexify website, services, and applications (collectively, the "Services"). By accessing or using our Services, you agree to be bound by these Terms.
              </p>
              
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <FileCheck className="mr-2 h-6 w-6 text-primary" />
                Acceptance of Terms
              </h2>
              <p className="mb-6">
                By accessing or using the Services, you represent that you have read, understood, and agree to be bound by these Terms. If you do not agree to these Terms, please do not use our Services.
              </p>
              
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Scroll className="mr-2 h-6 w-6 text-primary" />
                User Accounts
              </h2>
              <p className="mb-6">
                To access certain features of our Services, you may need to create an account. You are responsible for maintaining the confidentiality of your account information, including your password, and for all activity that occurs under your account. You agree to notify us immediately of any unauthorized use of your account.
              </p>
              
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <ShieldCheck className="mr-2 h-6 w-6 text-primary" />
                Privacy Policy
              </h2>
              <p className="mb-6">
                Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal information. By using our Services, you consent to the collection, use, and disclosure of your information as described in our Privacy Policy.
              </p>
              
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <FileCheck className="mr-2 h-6 w-6 text-primary" />
                User Content
              </h2>
              <p className="mb-6">
                You retain ownership of any content you submit, post, or display on or through our Services ("User Content"). By submitting User Content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, and distribute your User Content.
              </p>
              
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <FileCheck className="mr-2 h-6 w-6 text-primary" />
                Prohibited Conduct
              </h2>
              <p className="mb-6">
                You agree not to engage in any of the following activities:
              </p>
              <ul className="space-y-2 mb-6 list-disc pl-6">
                <li>Violating any applicable laws or regulations</li>
                <li>Impersonating any person or entity</li>
                <li>Harassing, threatening, or intimidating other users</li>
                <li>Posting or transmitting unauthorized commercial communications</li>
                <li>Interfering with the proper working of the Services</li>
                <li>Attempting to access areas of the Services that you are not authorized to access</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <FileCheck className="mr-2 h-6 w-6 text-primary" />
                Termination
              </h2>
              <p className="mb-6">
                We reserve the right to terminate or suspend your account and access to the Services at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users of the Services, us, or third parties, or for any other reason.
              </p>
              
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <FileCheck className="mr-2 h-6 w-6 text-primary" />
                Changes to Terms
              </h2>
              <p className="mb-6">
                We may modify these Terms at any time. If we make changes, we will provide notice by posting the updated Terms on our Services and updating the "Last Updated" date. Your continued use of the Services after such notice constitutes your acceptance of the modified Terms.
              </p>
              
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <FileCheck className="mr-2 h-6 w-6 text-primary" />
                Contact Information
              </h2>
              <p className="mb-6">
                If you have any questions about these Terms, please contact us at:
              </p>
              <address className="not-italic mb-6">
                Nexify<br />
                Walchand Institute of Technology<br />
                Walchand Hirachand Marg<br />
                Ashok Chowk, Solapur<br />
                Maharashtra, India<br />
                PIN: 413005<br />
                Email: nexify@gmail.com
              </address>
              
              <div className="bg-muted/30 p-6 rounded-lg border mt-10">
                <p className="text-center text-muted-foreground">
                  By using Nexify, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
