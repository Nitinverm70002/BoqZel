'use client';

import { motion } from 'framer-motion';
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card';

export default function AboutSection() {
  return (
    <section className="py-24 bg-boq-dark-900 overflow-hidden" id="about-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-16">
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1"
          >
            <span className="text-boq-teal-400 font-medium text-sm tracking-wider uppercase mb-4 block">
              Our Vision
            </span>
            <h2 className="font-outfit text-4xl md:text-5xl font-bold text-boq-text-primary leading-tight mb-8">
              Redefining Modern <span className="text-gradient-teal">Luxury</span> Travel.
            </h2>
            <div className="space-y-6 text-boq-text-secondary text-lg font-light leading-relaxed">
              <p>
                BoqZel was born from a simple idea: travel should be as seamless as it is inspiring. 
                We combine cutting-edge AI intelligence with meticulously handpicked stays to create 
                journeys that are uniquely yours.
              </p>
              <p>
                From hidden gems in remote islands to the heartbeat of the world&apos;s greatest cities, 
                our platform handles the logistics so you can focus on the experience.
              </p>
            </div>
            
            {/* Stats/Highlights */}
            <div className="grid grid-cols-2 gap-8 mt-12 pt-12 border-t border-boq-border">
              <div>
                <div className="text-3xl font-bold text-boq-text-primary mb-1">500+</div>
                <div className="text-sm text-boq-text-muted">Curated Stays</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-boq-text-primary mb-1">AI-Powered</div>
                <div className="text-sm text-boq-text-muted">Planning Intelligence</div>
              </div>
            </div>
          </motion.div>

          {/* Visual Element (3D Card Effect) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 w-full max-w-lg"
          >
            <CardContainer className="inter-var">
              <CardBody className="relative group/card w-auto sm:w-[30rem] h-auto rounded-3xl p-6 border border-white/[0.1] bg-boq-dark-900/50 backdrop-blur-xl">
                <CardItem
                  translateZ="50"
                  className="text-xl font-bold text-white mb-4"
                >
                  Exclusive Curation
                </CardItem>
                <CardItem
                  as="p"
                  translateZ="60"
                  className="text-white/70 text-sm max-w-sm mt-2 mb-6"
                >
                  Every destination is verified for the highest standards of luxury and authenticity.
                </CardItem>
                <CardItem translateZ="100" className="w-full mt-4">
                  <div className="relative aspect-square overflow-hidden rounded-2xl group">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80')] bg-cover bg-center opacity-70 transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-boq-dark-900 via-boq-dark-900/40 to-transparent" />
                  </div>
                </CardItem>
                
                {/* Decorative Elements with 3D Pop */}
                <CardItem
                  translateZ="80"
                  className="absolute -top-4 -right-4 w-24 h-24 bg-boq-teal-500/20 rounded-full blur-2xl pointer-events-none"
                >
                  <></>
                </CardItem>
                <CardItem
                  translateZ="20"
                  className="mt-8 flex justify-between items-center"
                >
                  <div className="px-4 py-2 rounded-xl text-xs font-normal text-white bg-white/10 backdrop-blur-md border border-white/10">
                    Premium Quality
                  </div>
                </CardItem>
              </CardBody>
            </CardContainer>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
