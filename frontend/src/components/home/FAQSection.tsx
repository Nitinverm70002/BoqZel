'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "What is BoqZel?",
    answer: "BoqZel is a premium travel and accommodation platform that curates unique stays and experiences tailored to your distinctive preferences, combining luxury with seamless convenience."
  },
  {
    question: "How does the AI Itinerary Scout work?",
    answer: "Our proprietary AI analyzes your travel style, destination, and duration to generate bespoke daily plans in seconds, ensuring you experience the best local spots and hidden gems without the stress of manual planning."
  },
  {
    question: "Are all stays on BoqZel verified?",
    answer: "Absolutely. Every single hotel, villa, and apartment on our platform is handpicked and personally verified by our team for safety, quality, and luxury standards."
  },
  {
    question: "Can I book flights along with my stay?",
    answer: "Yes, our Unified Checkout allows you to book your entire trip—including flights, stays, and premium transit—in a single, secure, and seamless transaction."
  },
  {
    question: "What kind of support can I expect during my trip?",
    answer: "You have access to our Real-time Assistant, a 24/7 digital concierge ready to handle itinerary changes, provide exclusive local recommendations, and resolve any issues instantly."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-gradient-to-b from-black to-boq-dark-900 relative overflow-hidden" id="faq-section">
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-boq-teal-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-boq-purple-500/5 rounded-full blur-[100px] pointer-events-none orb-purple"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-label bg-boq-dark-800 border-boq-border text-boq-text-muted mb-6"
          >
            F.A.Q
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-outfit text-4xl md:text-5xl font-bold text-boq-text-primary mb-6 tracking-tight"
          >
            Frequently Asked <span className="text-gradient-teal">Questions</span>.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-boq-text-secondary text-lg font-light max-w-2xl mx-auto"
          >
            Everything you need to know about traveling the BoqZel way.
          </motion.p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index }}
                className={`glass border transition-all duration-300 rounded-2xl overflow-hidden ${
                  isOpen ? 'border-boq-teal-500/30 glow-teal-sm' : 'border-boq-border hover:border-boq-teal-500/20'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex justify-between items-center w-full p-6 text-left group"
                >
                  <span className={`font-outfit text-lg font-medium transition-colors ${
                    isOpen ? 'text-boq-teal-400' : 'text-boq-text-primary'
                  }`}>
                    {faq.question}
                  </span>
                  <div className={`flex-shrink-0 ml-4 rounded-full p-2 border transition-all duration-300 ${
                    isOpen 
                      ? 'bg-boq-teal-500/10 border-boq-teal-500/30 text-boq-teal-400 rotate-180' 
                      : 'bg-boq-dark-900 border-boq-border text-boq-text-muted group-hover:text-boq-teal-400 rotate-0'
                  }`}>
                    <ChevronDown size={18} />
                  </div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 pt-0 text-boq-text-secondary font-light leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
