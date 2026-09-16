import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProject, imageUrl } from '../api.js';
import Lightbox from '../components/Lightbox.jsx';
import BeforeAfterSlider from '../components/BeforeAfterSlider.jsx';
import './ProjectDetail.css';

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [status, setStatus] = useState('loading');
  const [lightboxSrc, setLightboxSrc] = useState(null);

  useEffect(() => {
    setStatus('loading');
    fetchProject(id)
      .then((data) => {
        setProject(data);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, [id]);

  if (status === 'loading') {
    return (
      <section className="section wrap">
        <p>Loading project…</p>
      </section>
    );
  }

  if (status === 'error' || !project) {
    return (
      <section className="section wrap">
        <p>Couldn't find that project.</p>
        <Link to="/work" className="btn btn-outline" style={{ marginTop: '1rem' }}>
          Back to our work
        </Link>
      </section>
    );
  }

  const hasBeforeAfter = project.before_image_url && project.after_image_url;

  return (
    <section className="section project-detail">
      <div className="wrap">
        <Link to="/work" className="project-detail__back">← Back to our work</Link>

        <div className="project-detail__head">
          <span className="project-detail__category">{project.category}</span>
          <h1>{project.title}</h1>
          {project.location && <p className="project-detail__loc">{project.location}</p>}
        </div>

        {project.cover_image_url && (
          <img
            className="project-detail__cover zoomable"
            src={imageUrl(project.cover_image_url)}
            alt={project.title}
            onClick={() => setLightboxSrc(imageUrl(project.cover_image_url))}
          />
        )}

        {project.description && (
          <p className="project-detail__desc">{project.description}</p>
        )}

        {hasBeforeAfter ? (
          <div className="project-detail__slider-wrap">
            <h2 className="project-detail__slider-title">Before &amp; after</h2>
            <p className="project-detail__slider-hint">Drag the divider to compare</p>
            <BeforeAfterSlider
              beforeSrc={imageUrl(project.before_image_url)}
              afterSrc={imageUrl(project.after_image_url)}
              beforeAlt={`${project.title} before`}
              afterAlt={`${project.title} after`}
            />
          </div>
        ) : (
          (project.before_image_url || project.after_image_url) && (
            <div className="project-detail__ba">
              {project.before_image_url && (
                <div className="project-detail__ba-item">
                  <span>Before</span>
                  <img
                    className="zoomable"
                    src={imageUrl(project.before_image_url)}
                    alt={`${project.title} before`}
                    onClick={() => setLightboxSrc(imageUrl(project.before_image_url))}
                  />
                </div>
              )}
              {project.after_image_url && (
                <div className="project-detail__ba-item">
                  <span>After</span>
                  <img
                    className="zoomable"
                    src={imageUrl(project.after_image_url)}
                    alt={`${project.title} after`}
                    onClick={() => setLightboxSrc(imageUrl(project.after_image_url))}
                  />
                </div>
              )}
            </div>
          )
        )}

        <div className="project-detail__cta">
          <p>Want something like this built for you?</p>
          <Link to="/request" className="btn btn-primary">Request a job</Link>
        </div>
      </div>

      <Lightbox src={lightboxSrc} alt={project.title} onClose={() => setLightboxSrc(null)} />
    </section>
  );
}
