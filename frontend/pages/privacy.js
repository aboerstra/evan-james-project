import React from 'react';
import Layout from '../components/Layout';

export default function PrivacyPage() {
  return (
    <Layout 
      title="Privacy Policy | Evan James Official" 
      description="Privacy policy for Evan James' official website. Learn how we collect, use, and protect your personal information."
    >
      <div className="min-h-screen pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-serif mb-8 text-ice-blue">Privacy Policy</h1>
          
          <div className="bg-navy/80 backdrop-blur-md p-6 rounded-lg border border-electric-blue/30 prose prose-lg prose-invert max-w-none space-y-8">
            <p>
              This Privacy Policy describes how your personal information is collected, used, and shared when you visit
              evanjamesofficial.com (the "Site").
            </p>
            
            <h2 className="text-2xl font-serif text-electric-blue">Personal Information We Collect</h2>
            <p>
              When you visit the Site, we automatically collect certain information about your device, including information
              about your web browser, IP address, time zone, and some of the cookies that are installed on your device.
              Additionally, as you browse the Site, we collect information about the individual web pages that you view, what
              websites or search terms referred you to the Site, and information about how you interact with the Site. We refer to
              this automatically-collected information as "Device Information."
            </p>
            
            <p>
              We collect Device Information using the following technologies:
            </p>
            <ul>
              <li>
                "Cookies" are data files that are placed on your device or computer and often include an anonymous unique identifier.
                For more information about cookies, and how to disable cookies, visit <a href="http://www.allaboutcookies.org" className="text-electric-blue hover:text-ice-blue">http://www.allaboutcookies.org</a>.
              </li>
              <li>
                "Log files" track actions occurring on the Site, and collect data including your IP address, browser type, Internet
                service provider, referring/exit pages, and date/time stamps.
              </li>
            </ul>
            
            <p>
              When we talk about "Personal Information" in this Privacy Policy, we are talking both about Device Information and
              Order Information.
            </p>
            
            <h2 className="text-2xl font-serif text-electric-blue">How Do We Use Your Personal Information?</h2>
            <p>
              We use the information that we collect to:
            </p>
            <ul>
              <li>Communicate with you, including sending you updates about new music, tour dates, and merchandise;</li>
              <li>Improve and optimize our site;</li>
              <li>Screen for potential security risks;</li>
              <li>When in line with the preferences you have shared with us, provide you with information relating to our products or services.</li>
            </ul>
            
            <h2 className="text-2xl font-serif text-electric-blue">Sharing Your Personal Information</h2>
            <p>
              We share your Personal Information with third parties to help us use your Personal Information, as described above.
              We use Google Analytics to help us understand how our customers use the Site. You can read more about how Google uses
              your Personal Information here: <a href="https://www.google.com/intl/en/policies/privacy/" className="text-electric-blue hover:text-ice-blue">https://www.google.com/intl/en/policies/privacy/</a>.
              You can also opt-out of Google Analytics here: <a href="https://tools.google.com/dlpage/gaoptout" className="text-electric-blue hover:text-ice-blue">https://tools.google.com/dlpage/gaoptout</a>.
            </p>
            
            <h2 className="text-2xl font-serif text-electric-blue">Your Rights</h2>
            <p>
              If you are a European resident, you have the right to access personal information we hold about you and to ask that
              your personal information be corrected, updated, or deleted. If you would like to exercise this right, please contact
              us through the contact information below.
            </p>
            
            <h2 className="text-2xl font-serif text-electric-blue">Data Retention</h2>
            <p>
              When you subscribe to our newsletter through the Site, we will maintain your information for our records unless and
              until you ask us to delete this information.
            </p>
            
            <h2 className="text-2xl font-serif text-electric-blue">Changes</h2>
            <p>
              We may update this privacy policy from time to time in order to reflect, for example, changes to our practices or for
              other operational, legal or regulatory reasons.
            </p>
            
            <h2 className="text-2xl font-serif text-electric-blue">Contact Us</h2>
            <p>
              For more information about our privacy practices, if you have questions, or if you would like to make a complaint,
              please contact us by e-mail at <a href="mailto:privacy@evanjamesofficial.com" className="text-electric-blue hover:text-ice-blue">privacy@evanjamesofficial.com</a>.
            </p>
            
            <p className="text-sm text-gray-400">
              Last updated: May 2025
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
