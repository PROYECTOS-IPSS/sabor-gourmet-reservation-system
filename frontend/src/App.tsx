import { useState } from 'react';

const timeSlots = ['18:30', '19:00', '19:30', '20:00', '20:30'];

function App() {
  const [date, setDate] = useState('2026-08-15');
  const [time, setTime] = useState('20:00');
  const [guests, setGuests] = useState('4');

  return (
    <main className="site-shell">
      <nav className="topbar" aria-label="Navegación principal">
        <a className="brand" href="/" aria-label="Sabor Gourmet, inicio">
          <span className="brand-mark">SG</span>
          <span>Sabor Gourmet</span>
        </a>
        <div className="nav-links">
          <a href="#carta">La carta</a>
          <a href="#experiencia">La experiencia</a>
          <a className="nav-cta" href="#reservar">Reservar mesa <span>↗</span></a>
        </div>
      </nav>

      <section className="hero" id="experiencia">
        <div className="hero-copy">
          <p className="eyebrow">Cocina de autor · Managua</p>
          <h1>Una mesa para<br /><em>recordar.</em></h1>
          <p className="hero-intro">
            Ingredientes de temporada, fuego lento y una noche hecha a tu medida.
            Tu próxima historia empieza aquí.
          </p>
          <a className="text-link" href="#reservar">Encuentra tu mesa <span>↓</span></a>
        </div>
        <div className="hero-stamp" aria-hidden="true">
          <span>DESDE</span>
          <strong>2018</strong>
          <span>HECHO CON CALMA</span>
        </div>
        <div className="hero-orbit" aria-hidden="true"><span /></div>
      </section>

      <section className="booking-panel" id="reservar" aria-labelledby="booking-title">
        <div className="booking-heading">
          <p className="eyebrow">Tu noche, a tu ritmo</p>
          <h2 id="booking-title">Reserva tu mesa</h2>
          <p>Selecciona fecha, hora y compañía. Nosotros nos ocupamos del resto.</p>
        </div>
        <form className="booking-form" onSubmit={(event) => event.preventDefault()}>
          <label>
            <span>Fecha</span>
            <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          </label>
          <label>
            <span>Personas</span>
            <select value={guests} onChange={(event) => setGuests(event.target.value)}>
              {[2, 3, 4, 5, 6, 7, 8].map((count) => <option key={count} value={count}>{count} personas</option>)}
            </select>
          </label>
          <fieldset>
            <legend>Hora</legend>
            <div className="time-slots">
              {timeSlots.map((slot) => (
                <button className={time === slot ? 'time-slot selected' : 'time-slot'} key={slot} onClick={() => setTime(slot)} type="button">
                  {slot}
                </button>
              ))}
            </div>
          </fieldset>
          <button className="submit-button" type="submit">Ver disponibilidad <span>→</span></button>
        </form>
      </section>

      <section className="feature-grid" id="carta">
        <article>
          <span className="feature-number">01</span>
          <h3>Del mercado<br />a la mesa</h3>
          <p>Cambiamos con la estación para servir siempre algo honesto, fresco y nuestro.</p>
        </article>
        <article>
          <span className="feature-number">02</span>
          <h3>El fuego<br />como lenguaje</h3>
          <p>Sabores nicaragüenses, técnicas precisas y tiempo para hacer las cosas bien.</p>
        </article>
        <article className="feature-note">
          <span>“</span>
          <p>La mejor parte de salir a cenar es tener algo que contar al volver.</p>
          <small>— Equipo Sabor Gourmet</small>
        </article>
      </section>

      <footer className="footer">
        <span>Sabor Gourmet / 2026</span>
        <span>Miércoles — Domingo · 18:00 — 23:00</span>
        <a href="mailto:hola@saborgourmet.local">hola@saborgourmet.local ↗</a>
      </footer>
    </main>
  );
}

export default App;
