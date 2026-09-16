import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProjects, imageUrl } from '../api.js';
import Lightbox from '../components/Lightbox.jsx';
import Reveal from '../components/Reveal.jsx';
import './Home.css';

const services = [
  {
    name: 'Residential Building',
    detail: 'New homes and extensions, built to last.',
    images: [
      '/images/residential-1.jpg',
      '/images/residential-2.jpg',
      '/images/residential-3.jpg'
    ]
  },
  {
    name: 'Commercial Construction',
    detail: 'Offices, retail spaces, and warehouses.',
    images: [
      '/images/commercial-1.jpg',
      '/images/commercial-2.jpg',
      '/images/commercial-3.jpg'
    ]
  },
  {
    name: 'Renovation & Remodeling',
    detail: 'Bringing older structures up to standard.',
    images: [
      '/images/renovation-1.jpg',
      '/images/renovation-2.jpg',
      '/images/renovation-3.jpg'
    ]
  },
  {
    name: 'Site Development',
    detail: 'Land clearing, grading, and foundation work.',
    images: [
      '/images/sitedev-1.jpg',
      '/images/sitedev-2.jpg',
      '/images/sitedev-3.jpg'
    ]
  },
  {
    name: 'Block Production',
    detail: 'Concrete blocks moulded and supplied for your build.',
    images: [
      '/images/blocks-1.jpg',
      '/images/blocks-2.jpg',
      '/images/blocks-3.jpg'
    ]
  }
];

// Shown if a placeholder photo fails to load, so a broken external service
// never leaves an empty gap on the page.
const IMAGE_FALLBACK =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="360"><rect width="100%" height="100%" fill="#c9c3b6"/><text x="50%" y="50%" font-family="sans-serif" font-size="20" fill="#6b6b66" text-anchor="middle" dominant-baseline="middle">Photo</text></svg>`
  );

const steps = [
  { title: 'Send your request', detail: 'Tell us what you need built and where.' },
  { title: 'Site visit & quote', detail: 'We assess the job and give you a clear price.' },
  { title: 'We build', detail: 'Work begins on schedule, with regular updates.' },
  { title: 'Handover', detail: 'You get a finished, inspected, ready-to-use space.' }
];

const HEADLINE = 'Welcome to T-Construction, where vision becomes structure.';
// Character ranges (within HEADLINE) that get special colors while/after typing.
const NAME_START = HEADLINE.indexOf('T-Construction');
const NAME_END = NAME_START + 'T-Construction'.length;
const TAGLINE_START = HEADLINE.indexOf('where vision');

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(false);
  const [typedCount, setTypedCount] = useState(0);
  const [lightboxSrc, setLightboxSrc] = useState(null);

  useEffect(() => {
    fetchProjects()
      .then((data) => setProjects(data.slice(0, 3)))
      .catch(() => setError(true));
  }, []);

  useEffect(() => {
    setTypedCount(0);
    const interval = setInterval(() => {
      setTypedCount((count) => {
        if (count >= HEADLINE.length) {
          clearInterval(interval);
          return count;
        }
        return count + 1;
      });
    }, 45);
    return () => clearInterval(interval);
  }, []);

  const typed = HEADLINE.slice(0, typedCount);

  return (
    <>
      <section className="hero">
        <svg className="hero__beam" viewBox="0 0 1200 600" preserveAspectRatio="none" aria-hidden="true">
          <line x1="0" y1="520" x2="1200" y2="60" stroke="#45443f" strokeWidth="2" />
          <line x1="0" y1="600" x2="1200" y2="140" stroke="#e8940f" strokeWidth="2" />
        </svg>
        <div className="wrap hero__content">
          <h1 className="hero__headline hero__headline--typed">
            {typed.split('').map((char, i) => {
              const inName = i >= NAME_START && i < NAME_END;
              const inTagline = i >= TAGLINE_START;
              const cls = inName ? 'hero__word-accent' : inTagline ? 'hero__word-tagline' : 'hero__word-plain';
              return (
                <span className={cls} key={i}>
                  {char}
                </span>
              );
            })}
            {typedCount < HEADLINE.length && <span className="hero__cursor" aria-hidden="true" />}
          </h1>
          <p className="hero__sub">
            We plan, build, and hand over residential and commercial projects across the region —
            from the first site visit to the final walkthrough.
          </p>
          <div className="hero__actions">
            <Link to="/request" className="btn btn-primary">Request a job</Link>
            <Link to="/work" className="btn btn-outline-light">See our work</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2 className="services__title">What we build</h2>
          <div className="services-showcase">
            {services.map((s, blockIdx) => (
              <Reveal className="service-block" key={s.name} delay={blockIdx * 60}>
                <div className="service-block__head">
                  <h3>{s.name}</h3>
                  <p>{s.detail}</p>
                </div>
                <div className="service-block__images">
                  {s.images.map((src, idx) => (
                    <div className="service-block__img-wrap" key={idx}>
                      <img
                        src={src}
                        alt={`${s.name} example ${idx + 1}`}
                        loading="lazy"
                        className="zoomable"
                        onClick={() => setLightboxSrc(src)}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = IMAGE_FALLBACK;
                        }}
                      />
                    </div>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Lightbox src={lightboxSrc} alt="Service example" onClose={() => setLightboxSrc(null)} />

      <section className="section steps-section">
        <div className="wrap">
          <h2 className="steps__title">How a job gets done</h2>
          <div className="steps">
            {steps.map((step, i) => (
              <div className="steps__item" key={step.title}>
                <span className="steps__index">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="steps__name">{step.title}</h3>
                  <p className="steps__detail">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {!error && projects.length > 0 && (
        <section className="section">
          <div className="wrap">
            <div className="featured__head">
              <h2>Recent work</h2>
              <Link to="/work" className="featured__link">View all projects →</Link>
            </div>
            <div className="featured__grid">
              {projects.map((p) => (
                <Link to={`/work/${p.id}`} className="featured__card" key={p.id}>
                  {p.cover_image_url && (
                    <img src={imageUrl(p.cover_image_url)} alt={p.title} />
                  )}
                  <div className="featured__caption">
                    <span className="featured__project-title">{p.title}</span>
                    {p.location && <span className="featured__project-loc">{p.location}</span>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="cta-band">
        <div className="wrap cta-band__row">
          <div>
            <h2 className="cta-band__title">Ready to start your project?</h2>
            <p className="cta-band__sub">Tell us what you need — we'll get back to you with a plan.</p>
          </div>
          <Link to="/request" className="btn btn-primary">Request a job</Link>
        </div>
      </section>
    </>
  );
}
