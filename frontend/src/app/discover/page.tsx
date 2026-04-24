import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import DiscoverSection from '@/components/discovery/DiscoverSection';
import AuthGuard from '@/components/auth/AuthGuard';

export const metadata = {
  title: 'Discover Destinations | BoqZel',
  description: 'Uncover trending destinations, top experiences, and travel vibes curated for your next masterpiece.',
};

export default function DiscoverPage() {
  return (
    <AuthGuard>
      <Navbar />
      <main className="flex-1 pt-24 bg-gradient-dark min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DiscoverSection />
        </div>
      </main>
      <Footer />
    </AuthGuard>
  );
}
