import { useState } from 'react';
import { submitJobRequest } from '../api.js';
import './RequestJob.css';

const initialForm = {
  name: '',
  phone: '',
  email: '',
  location: '',
  job_type: '',
  details: '',
  preferred_date: ''
};

export default function RequestJob() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');
    try {
      await submitJobRequest(form);
      setStatus('success');
      setForm(initialForm);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    }
  }

  if (status === 'success') {
    return (
      <section className="section wrap request-page">
        <div className="request-success">
          <h1>Request received</h1>
          <p>Thanks — we've got your details and will contact you shortly to discuss your job.</p>
          <button className="btn btn-outline" onClick={() => setStatus('idle')}>
            Send another request
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="section request-page">
      <div className="wrap">
        <div className="request-page__head">
          <h1>Request a job</h1>
          <p>Tell us what you need built. We'll review the details and get back to you with next steps.</p>
        </div>

        <form className="request-form" onSubmit={handleSubmit}>
          <div className="request-form__row">
            <label>
              Full name
              <input type="text" name="name" value={form.name} onChange={handleChange} required />
            </label>
            <label>
              Phone number
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} required />
            </label>
          </div>

          <div className="request-form__row">
            <label>
              Email (optional)
              <input type="email" name="email" value={form.email} onChange={handleChange} />
            </label>
            <label>
              Site location
              <input type="text" name="location" value={form.location} onChange={handleChange} placeholder="City, area" />
            </label>
          </div>

          <div className="request-form__row">
            <label>
              Type of job
              <select name="job_type" value={form.job_type} onChange={handleChange}>
                <option value="">Select one</option>
                <option value="Residential Building">Residential Building</option>
                <option value="Commercial Construction">Commercial Construction</option>
                <option value="Renovation & Remodeling">Renovation & Remodeling</option>
                <option value="Site Development">Site Development</option>
                <option value="Block Production">Block Production</option>
                <option value="Other">Other</option>
              </select>
            </label>
            <label>
              Preferred start date (optional)
              <input type="date" name="preferred_date" value={form.preferred_date} onChange={handleChange} />
            </label>
          </div>

          <label className="request-form__full">
            Job details
            <textarea
              name="details"
              value={form.details}
              onChange={handleChange}
              rows={6}
              required
              placeholder="Describe the job — size, scope, timeline, anything we should know."
            />
          </label>

          {status === 'error' && <p className="request-form__error">{errorMsg}</p>}

          <button type="submit" className="btn btn-primary" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Sending…' : 'Send request'}
          </button>
        </form>
      </div>
    </section>
  );
}
