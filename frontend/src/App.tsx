import { BookingPanel } from './components/BookingPanel';
import { FeatureGrid } from './components/FeatureGrid';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { Navigation } from './components/Navigation';

function App() {
  return (
    <main className="mx-auto min-h-screen max-w-site overflow-hidden bg-ink font-sans text-cream">
      <Navigation />
      <HeroSection />
      <BookingPanel />
      <FeatureGrid />
      <Footer />
    </main>
  );
}

export default App;
