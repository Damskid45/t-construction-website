import { Link } from 'react-router-dom';
import './About.css';

export default function About() {
  return (
    <>
      <section className="section about-hero">
        <div className="wrap">
          <h1>Built on the ground, not just on paper.</h1>
          <p>
            T-Construction takes on residential and commercial projects from the first site
            visit through to handover. We plan carefully, communicate clearly, and finish what
            we start.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap about-grid">
          <div>
            <h2>How we work</h2>
            <p>
              Every job starts with understanding the site and what the client actually needs —
              not a generic package. We give a clear quote before any work begins, keep you
              updated as the build progresses, and hand over a finished space that's ready to use.
            </p>
          </div>
          <div>
            <h2>What we value</h2>
            <p>
              Reliability on timelines. Honesty about cost and scope. Quality that holds up
              after the crew has left the site. If a job isn't done right, it isn't done.
            </p>
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="wrap cta-band__row">
          <div>
            <h2 className="cta-band__title">Have a project in mind?</h2>
            <p className="cta-band__sub">Send us the details and we'll get back to you.</p>
          </div>
          <Link to="/request" className="btn btn-primary">Request a job</Link>
        </div>
      </section>
    </>
  );
}
