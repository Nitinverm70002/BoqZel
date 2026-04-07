'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function TermsPage() {
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
            <h1 className="text-4xl font-black text-white mb-4 tracking-tight">Terms of Service</h1>
            <p className="text-boq-text-muted text-sm uppercase tracking-widest font-bold">Last Updated: April 7, 2026</p>
          </motion.div>

          <div className="prose prose-invert prose-boq max-w-none space-y-12 text-boq-text-secondary leading-relaxed">
            
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">1. Platform Usage</h2>
              <p>
                By using BoqZel, you agree to comply with all applicable local, national, and international 
                laws and regulations. Our platform provides AI-driven itinerary building, booking management, 
                and property curation services for registered users.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-6">2. AI Scout and Content Disclaimer</h2>
              <p>
                The AI Scout feature provides automated travel suggestions and itinerary optimizations 
                based on user input and dynamic market data. While we strive for accuracy, 
                AI-generated content is provided &quot;as-is&quot; and results should be verified by the user. 
                BoqZel is not liable for errors or inconsistencies in AI-driven suggestions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-6">3. Bookings and Partner Services</h2>
              <p>
                BoqZel facilitates bookings with third-party partners (hotels, airlines, local operators). 
                When you make a booking, you are entering into a direct contract with the respective partner. 
                All cancellations, refunds, and modifications are subject to the partners&apos; individual 
                terms and conditions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-6">4. Platform Integrity</h2>
              <p>
                Users are strictly prohibited from attempting to bypass our security measures, 
                scraping platform data, or using our AI tools for unauthorized commercial purposes. 
                Violation of these terms may result in immediate account termination.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-6">5. Governing Law</h2>
              <p>
                These Terms of Service are governed by the laws of the jurisdiction in which BoqZel 
                operates. Any disputes will be settled in the appropriate legal forums within that jurisdiction.
              </p>
            </section>

            <section className="pt-12 border-t border-white/5">
              <p className="text-sm italic">
                Questions regarding these terms? Contact us at 
                <span className="text-white font-bold ml-1">boqzel676@gmail.com</span>.
              </p>
            </section>

          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
