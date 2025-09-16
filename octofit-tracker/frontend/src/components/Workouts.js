import React, { useEffect, useState } from 'react';

const initialForm = { name: '', description: '', suggested_for: '' };

const API_URL = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`;

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [feedback, setFeedback] = useState('');

  const fetchWorkouts = () => {
    console.log('Fetching from:', API_URL);
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        const results = data.results || data;
        setWorkouts(results);
        console.log('Fetched workouts:', results);
      })
      .catch(err => console.error('Error fetching workouts:', err));
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    setFeedback('');
    console.log('POST to:', API_URL, 'with data:', form);
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(data => {
        if (data.id || data._id) {
          setFeedback('Workout added successfully!');
          setShowModal(false);
          setForm(initialForm);
          fetchWorkouts();
        } else {
          setFeedback('Error: ' + JSON.stringify(data));
        }
        console.log('Created workout:', data);
      })
      .catch(err => {
        setFeedback('Error: ' + err);
        console.error('Error creating workout:', err);
      });
  };

  return (
    <div>
      <h2 className="mb-4 text-danger">Workouts</h2>
      <button className="btn btn-danger mb-3" onClick={() => setShowModal(true)}>Add Workout</button>
      {feedback && <div className="alert alert-info">{feedback}</div>}

      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Description</th>
            <th>Suggested For</th>
          </tr>
        </thead>
        <tbody>
          {workouts.map((workout, idx) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td>{workout.name || '-'}</td>
              <td>{workout.description || '-'}</td>
              <td>{workout.suggested_for || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Workout</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input type="text" className="form-control" name="name" value={form.name} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <input type="text" className="form-control" name="description" value={form.description} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Suggested For</label>
                    <input type="text" className="form-control" name="suggested_for" value={form.suggested_for} onChange={handleChange} required />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-danger">Add Workout</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Workouts;
