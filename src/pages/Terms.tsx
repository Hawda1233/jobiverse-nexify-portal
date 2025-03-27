
import React from 'react';
import { Scroll, ShieldCheck, FileCheck } from 'lucide-react';

const Terms = () => {
  return (
    <div className="min-h-screen">
      <main className="py-12 md:py-16 mt-16 md:mt-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">Terms of Service</h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-lg md:text-xl text-muted-foreground mb-6 md:mb-8">
                Last Updated: March 30, 2025 | Effective Date: March 30, 2025
              </p>
              
              <p className="mb-5 md:mb-6 text-sm md:text-base">
                Welcome to Nexify, a platform founded on March 30, 2025. These Terms of Service ("Terms") govern your access to and use of the Nexify website, services, and applications (collectively, the "Services"). By accessing or using our Services, you agree to be bound by these Terms.
              </p>
              
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 flex items-center">
                <FileCheck className="mr-2 h-5 w-5 md:h-6 md:w-6 text-primary flex-shrink-0" />
                Acceptance of Terms
              </h2>
              <p className="mb-5 md:mb-6 text-sm md:text-base">
                By accessing or using the Services, you represent that you have read, understood, and agree to be bound by these Terms. If you do not agree to these Terms, please do not use our Services.
              </p>
              
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 flex items-center">
                <Scroll className="mr-2 h-5 w-5 md:h-6 md:w-6 text-primary flex-shrink-0" />
                User Accounts
              </h2>
              <p className="mb-5 md:mb-6 text-sm md:text-base">
                To access certain features of our Services, you may need to create an account. You are responsible for maintaining the confidentiality of your account information, including your password, and for all activity that occurs under your account. You agree to notify us immediately of any unauthorized use of your account.
              </p>
              
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 flex items-center">
                <ShieldCheck className="mr-2 h-5 w-5 md:h-6 md:w-6 text-primary flex-shrink-0" />
                Privacy Policy
              </h2>
              <p className="mb-5 md:mb-6 text-sm md:text-base">
                Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal information. By using our Services, you consent to the collection, use, and disclosure of your information as described in our Privacy Policy.
              </p>
              
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 flex items-center">
                <FileCheck className="mr-2 h-5 w-5 md:h-6 md:w-6 text-primary flex-shrink-0" />
                User Content
              </h2>
              <p className="mb-5 md:mb-6 text-sm md:text-base">
                You retain ownership of any content you submit, post, or display on or through our Services ("User Content"). By submitting User Content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, and distribute your User Content.
              </p>
              
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 flex items-center">
                <FileCheck className="mr-2 h-5 w-5 md:h-6 md:w-6 text-primary flex-shrink-0" />
                Prohibited Conduct
              </h2>
              <p className="mb-3 md:mb-4 text-sm md:text-base">
                You agree not to engage in any of the following activities:
              </p>
              <ul className="space-y-1 md:space-y-2 mb-5 md:mb-6 list-disc pl-5 md:pl-6 text-sm md:text-base">
                <li>Violating any applicable laws or regulations</li>
                <li>Impersonating any person or entity</li>
                <li>Harassing, threatening, or intimidating other users</li>
                <li>Posting or transmitting unauthorized commercial communications</li>
                <li>Interfering with the proper working of the Services</li>
                <li>Attempting to access areas of the Services that you are not authorized to access</li>
              </ul>
              
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 flex items-center">
                <FileCheck className="mr-2 h-5 w-5 md:h-6 md:w-6 text-primary flex-shrink-0" />
                Termination
              </h2>
              <p className="mb-5 md:mb-6 text-sm md:text-base">
                We reserve the right to terminate or suspend your account and access to the Services at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users of the Services, us, or third parties, or for any other reason.
              </p>
              
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 flex items-center">
                <FileCheck className="mr-2 h-5 w-5 md:h-6 md:w-6 text-primary flex-shrink-0" />
                Changes to Terms
              </h2>
              <p className="mb-5 md:mb-6 text-sm md:text-base">
                We may modify these Terms at any time. If we make changes, we will provide notice by posting the updated Terms on our Services and updating the "Last Updated" date. Your continued use of the Services after such notice constitutes your acceptance of the modified Terms.
              </p>
              
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 flex items-center">
                <FileCheck className="mr-2 h-5 w-5 md:h-6 md:w-6 text-primary flex-shrink-0" />
                Contact Information
              </h2>
              <p className="mb-3 md:mb-4 text-sm md:text-base">
                If you have any questions about these Terms, please contact us at:
              </p>
              <address className="not-italic mb-5 md:mb-6 text-sm md:text-base">
                Nexify<br />
                Walchand Institute of Technology<br />
                Walchand Hirachand Marg<br />
                Ashok Chowk, Solapur<br />
                Maharashtra, India<br />
                PIN: 413005<br />
                Email: nexify@gmail.com
              </address>
              
              <div className="bg-muted/30 p-4 md:p-6 rounded-lg border mt-8 md:mt-10">
                <p className="text-center text-muted-foreground text-sm md:text-base">
                  By using Nexify, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Terms;
