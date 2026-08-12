import { BrowserRouter, Route, Routes } from 'react-router';
import { AuthPage } from './components/AuthPage';
import { BookingPanel } from './components/BookingPanel';
import { FeatureGrid } from './components/FeatureGrid';
import { HeroSection } from './components/HeroSection';
import { ReservationPage } from './components/ReservationPage';
import { PageShell } from './components/PageShell';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <PageShell>
              <HeroSection />
              <BookingPanel />
              <FeatureGrid />
            </PageShell>
          }
          path="/"
        />
        <Route element={<PageShell><ReservationPage /></PageShell>} path="/reservar" />
        <Route element={<PageShell><AuthPage mode="register" /></PageShell>} path="/registrarse" />
        <Route element={<PageShell><AuthPage mode="login" /></PageShell>} path="/login" />
        <Route element={<PageShell />} path="*" />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
