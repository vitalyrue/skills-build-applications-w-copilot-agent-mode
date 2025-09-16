import React, { useEffect, useState } from 'react';

const initialForm = { user: '', type: '', duration: '', date: '' };
const USERS_API_URL = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/users/`;

const API_URL = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/activities/`;


function Activities() {
  const [activities, setActivities] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [feedback, setFeedback] = useState('');

  const fetchActivities = () => {
    console.log('Fetching from:', API_URL);
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        const results = data.results || data;
        setActivities(results);
        console.log('Fetched activities:', results);
      })
      .catch(err => console.error('Error fetching activities:', err));
  };

  const fetchUsers = () => {
    console.log('Fetching users from:', USERS_API_URL);
    fetch(USERS_API_URL)
      .then(res => res.json())
      .then(data => {
        const results = data.results || data;
        setUsers(results);
        console.log('Fetched users:', results);
      })
      .catch(err => console.error('Error fetching users:', err));
  };

  useEffect(() => {
    fetchActivities();
    fetchUsers();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    setFeedback('');
    // Ensure user is sent as PK
    const submitForm = { ...form, user: form.user };
    console.log('POST to:', API_URL, 'with data:', submitForm);
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submitForm)
    })
      .then(res => res.json())
      .then(data => {
        if (data.id || data._id) {
          setFeedback('Activity added successfully!');
          setShowModal(false);
          setForm(initialForm);
          fetchActivities();
        } else {
          setFeedback('Error: ' + JSON.stringify(data));
        }
        console.log('Created activity:', data);
      })
      .catch(err => {
        setFeedback('Error: ' + err);
        console.error('Error creating activity:', err);
      });
  };

  return (
    <div>
      <h2 className="mb-4 text-primary">Activities</h2>
      <button className="btn btn-primary mb-3" onClick={() => setShowModal(true)}>Add Activity</button>
      {feedback && <div className="alert alert-info">{feedback}</div>}

      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>User</th>
            <th>Type</th>
            <th>Duration</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity, idx) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td>{activity.user?.name || activity.user || '-'}</td>
              <td>{activity.type || '-'}</td>
              <td>{activity.duration || '-'}</td>
              <td>{activity.date || '-'}</td>
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
                <h5 className="modal-title">Add Activity</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">User</label>
                    <select className="form-select" name="user" value={form.user} onChange={handleChange} required>
                      <option value="">Select user</option>
                      {users.map(user => (
                        <option key={user.id || user._id} value={user.id || user._id}>
                          {user.name} ({user.email})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Type</label>
                    <input type="text" className="form-control" name="type" value={form.type} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Duration (minutes)</label>
                    <input type="number" className="form-control" name="duration" value={form.duration} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Date</label>
                    <input type="date" className="form-control" name="date" value={form.date} onChange={handleChange} required />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Add Activity</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Activities;
