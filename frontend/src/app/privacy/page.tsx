'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-boq-dark-900 overflow-hidden">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <h1 className="text-4xl font-black text-white mb-4 tracking-tight">Privacy Policy</h1>
            <p className="text-boq-text-muted text-sm uppercase tracking-widest font-bold">Effective Date: April 7, 2026</p>
          </motion.div>

          <div className="prose prose-invert prose-boq max-w-none space-y-12 text-boq-text-secondary leading-relaxed">
            
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">1. Information We Collect</h2>
              <div className="space-y-4">
                <p>
                  At BoqZel, we collect information to provide a more personalized and efficient travel experience. 
                  This includes:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Account Information:</strong> Name, email address, password, and contact details provided during registration.</li>
                  <li><strong>Booking and Itinerary Data:</strong> Information about your travel preferences, destinations, and booking history.</li>
                  <li><strong>AI Input Data:</strong> Preferences and constraints you provide to our AI Scout for itinerary generation.</li>
                  <li><strong>Technical Data:</strong> IP address, device information, and browsing activity while using our platform.</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-6">2. How We Use Data</h2>
              <p>
                The primary purpose of collecting your information is to enhance the BoqZel experience. 
                We use your data to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Personalize and optimize your AI-generated travel itineraries.</li>
                <li>Facilitate secure bookings with our global partners (stays, flights, experiences).</li>
                <li>Communicate critical updates, security alerts, and promotional offers.</li>
                <li>Improve our proprietary AI models and platform performance.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-6">3. Data Sharing and Protection</h2>
              <p>
                We do not sell your personal data. We only share information with third-party service providers 
                (booking partners, payment processors, AI engine providers) strictly necessary for providing 
                our services. 
              </p>
              <p className="mt-4">
                We employ industry-standard encryption and security protocols to protect your information 
                from unauthorized access or disclosure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-6">4. Your Data Rights</h2>
              <p>
                You have the right to access, correct, or delete your personal information at any time. 
                You can manage these settings from your account profile or by contacting our 
                privacy team directly at <span className="text-white font-bold">boqzel676@gmail.com</span>.
              </p>
            </section>

            <section className="pt-12 border-t border-white/5">
              <p className="text-sm italic">
                This Privacy Policy is subject to updates. Users will be notified of significant changes via 
                email or prominent notice on the platform.
              </p>
            </section>

          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
