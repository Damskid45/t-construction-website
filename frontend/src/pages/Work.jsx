import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProjects, imageUrl } from '../api.js';
import './Work.css';

const categories = ['All', 'Residential', 'Commercial', 'Renovation', 'Site Development', 'Block Production'];

export default function Work() {
  const [projects, setProjects] = useState([]);
  const [active, setActive] = useState('All');
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    setStatus('loading');
    fetchProjects(active === 'All' ? undefined : active)
      .then((data) => {
        setProjects(data);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, [active]);

  return (
    <section className="section work-page">
      <div className="wrap">
        <div className="work-page__head">
          <h1>Our work</h1>
          <p>A record of what we've built — residential, commercial, and everything between.</p>
        </div>

        <div className="work-page__filters">
          {categories.map((c) => (
            <button
              key={c}
              className={`work-page__filter ${active === c ? 'is-active' : ''}`}
              onClick={() => setActive(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {status === 'loading' && <p className="work-page__note">Loading projects…</p>}
        {status === 'error' && (
          <p className="work-page__note">
            Couldn't load projects right now. Make sure the backend API is running and reachable.
          </p>
        )}
        {status === 'ready' && projects.length === 0 && (
          <p className="work-page__note">No projects in this category yet — check back soon.</p>
        )}

        <div className="work-grid">
          {projects.map((p) => (
            <Link to={`/work/${p.id}`} className="work-card" key={p.id}>
              {p.cover_image_url && <img src={imageUrl(p.cover_image_url)} alt={p.title} />}
              <div className="work-card__body">
                <span className="work-card__category">{p.category}</span>
                <h3>{p.title}</h3>
                {p.location && <span className="work-card__loc">{p.location}</span>}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
