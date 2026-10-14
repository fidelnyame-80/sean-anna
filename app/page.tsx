import type { CSSProperties } from "react";
import Quiz from "./components/Quiz";
import RSVP from "./components/RSVP";
import Reveal from "./components/Reveal";
import { photos, wedding } from "./site-content";

type PhotoSlotProps = {
  src: string;
  label: string;
  className: string;
};

function PhotoSlot({ src, label, className }: PhotoSlotProps) {
  return (
    <div
      className={`photo-slot ${src ? "photo-slot--filled" : "photo-slot--empty"} ${className}`}
      role="img"
      aria-label={src ? label : `${label} photo placeholder`}
      style={src ? { backgroundImage: `url("${src}")` } : undefined}
    />
  );
}

export default function Home() {
  return (
    <div className="site-shell" id="top">
      <main>
        <section className="hero" aria-labelledby="hero-heading">
          <PhotoSlot src={photos.hero} label="Sean and Anna together" className="hero__photo" />
          <div className="hero__content">
            <p className="hero__eyebrow">A WEDDING CELEBRATION</p>
            <h1 id="hero-heading" aria-label="Sean & Anna">
              <span className="hero__typewriter" aria-hidden="true">
                {Array.from("Sean & Anna").map((character, index) => (
                  <span
                    key={index}
                    className={`hero__letter${character === "&" ? " hero__letter--ampersand" : ""}`}
                    style={{ "--type-delay": `${800 + index * 160}ms` } as CSSProperties}
                  >
                    {character}
                  </span>
                ))}
              </span>
            </h1>
            <span className="hero__rule" aria-hidden="true" />
            <p className="hero__invitation">We cannot wait to celebrate with you.</p>
          </div>
          <span className="hero__scroll" aria-hidden="true">SCROLL TO EXPLORE <b>↓</b></span>
        </section>

        <section className="info-band big-day" id="our-day" aria-labelledby="day-heading">
          <div className="portrait-frame portrait-frame--day">
            <PhotoSlot src={photos.ourDay} label="Sean and Anna portrait" className="portrait portrait--day" />
          </div>
          <div className="info-band__copy big-day__copy">
            <p className="section-kicker">THE CELEBRATION</p>
            <h2 id="day-heading">OUR BIG DAY</h2>
            <p className="section-intro">Please join us for a day filled with love.</p>
            <p className="date-line">{wedding.dateDisplay}</p>
            <p className="detail-note">Ceremony time to follow</p>
          </div>
        </section>

        <section className="info-band venue" id="venue" aria-labelledby="venue-heading">
          <Reveal className="info-band__copy venue__copy">
            <p className="section-kicker">WHERE WE&apos;LL GATHER</p>
            <h2 id="venue-heading">THE VENUE</h2>
            <p className="venue__name">{wedding.venueName}</p>
            <p className="venue__address">{wedding.venueDescription}</p>
            {wedding.mapUrl ? (
              <a className="venue__directions" href={wedding.mapUrl} target="_blank" rel="noopener noreferrer">DIRECTIONS</a>
            ) : (
              <button className="venue__directions" type="button" disabled title="Directions will be added when the venue is confirmed">DIRECTIONS SOON</button>
            )}
          </Reveal>
          <div className="portrait-frame portrait-frame--venue">
            <PhotoSlot src={photos.venue} label="Wedding venue" className="portrait portrait--venue" />
          </div>
        </section>

        <section className="info-band rsvp-band" id="rsvp" aria-labelledby="rsvp-heading">
          <div className="portrait-frame portrait-frame--rsvp">
            <PhotoSlot src={photos.rsvp} label="Sean and Anna portrait" className="portrait portrait--rsvp" />
          </div>
          <Reveal className="info-band__copy rsvp-band__copy">
            <p className="section-kicker">WE HOPE YOU&apos;LL JOIN US</p>
            <h2 id="rsvp-heading">KINDLY RSVP</h2>
            <p className="section-intro">Let us know if you can celebrate with us.</p>
            <p className="date-line">{wedding.rsvpDateDisplay}</p>
            <RSVP recipientEmail={wedding.rsvpEmail} />
          </Reveal>
        </section>

        <section className="quiz-band" id="quiz" aria-labelledby="quiz-heading">
          <Reveal className="quiz-intro">
            <p className="section-kicker">A LITTLE GAME</p>
            <h2 id="quiz-heading">How well do you <em>know</em> the couple?</h2>
            <p>Ten quick questions, just for fun.</p>
          </Reveal>
          <Reveal className="quiz-wrap" delay={80}>
            <Quiz />
          </Reveal>
        </section>

        <section className="closing-photo" aria-label="Sean and Anna photo">
          <PhotoSlot src={photos.closing} label="Sean and Anna together" className="closing-photo__image" />
          <p>See you at the celebration.</p>
        </section>
      </main>
      <footer className="site-footer">
        <span>Sean <i>&</i> Anna</span>
        <a href="#top" aria-label="Back to top">↑</a>
      </footer>
    </div>
  );
}
