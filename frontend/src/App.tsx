import { BrowserRouter, Route, Routes } from 'react-router';
import { AuthPage } from './components/AuthPage';
import { BookingPanel } from './components/BookingPanel';
import { FeatureGrid } from './components/FeatureGrid';
import { HeroSection } from './components/HeroSection';
import { ProtectedDashboard } from './components/ProtectedDashboard';
import { MyReservationsPage } from './components/MyReservationsPage';
import { ReservationPage } from './components/ReservationPage';
import { PageShell } from './components/PageShell';
import { InfoPage } from './components/InfoPage';

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
        <Route element={<PageShell><InfoPage eyebrow="La carta" title="Sabores para recordar" /></PageShell>} path="/carta" />
        <Route element={<PageShell><InfoPage eyebrow="La experiencia" title="Una noche hecha a tu medida" /></PageShell>} path="/experiencia" />
        <Route element={<PageShell><ReservationPage /></PageShell>} path="/reservar" />
        <Route element={<PageShell><AuthPage mode="register" /></PageShell>} path="/registrarse" />
        <Route element={<PageShell><AuthPage mode="login" /></PageShell>} path="/login" />
        <Route element={<PageShell><MyReservationsPage /></PageShell>} path="/mis-reservas" />
        <Route element={<PageShell><ProtectedDashboard /></PageShell>} path="/dashboard" />
        <Route element={<PageShell />} path="*" />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

