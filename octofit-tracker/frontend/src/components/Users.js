import React, { useEffect, useState } from 'react';

const initialForm = { name: '', email: '', is_superhero: false, team: '' };

const API_URL = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/users/`;

function Users() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [feedback, setFeedback] = useState('');

  const fetchUsers = () => {
    console.log('Fetching from:', API_URL);
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        const results = data.results || data;
        setUsers(results);
        console.log('Fetched users:', results);
      })
      .catch(err => console.error('Error fetching users:', err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
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
          setFeedback('User added successfully!');
          setShowModal(false);
          setForm(initialForm);
          fetchUsers();
        } else {
          setFeedback('Error: ' + JSON.stringify(data));
        }
        console.log('Created user:', data);
      })
      .catch(err => {
        setFeedback('Error: ' + err);
        console.error('Error creating user:', err);
      });
  };

  return (
    <div>
      <h2 className="mb-4 text-warning">Users</h2>
      <button className="btn btn-warning mb-3" onClick={() => setShowModal(true)}>Add User</button>
      {feedback && <div className="alert alert-info">{feedback}</div>}

      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Superhero</th>
            <th>Team</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, idx) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td>{user.name || '-'}</td>
              <td>{user.email || '-'}</td>
              <td>{user.is_superhero ? 'Yes' : 'No'}</td>
              <td>{user.team || '-'}</td>
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
                <h5 className="modal-title">Add User</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input type="text" className="form-control" name="name" value={form.name} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} required />
                  </div>
                  <div className="mb-3 form-check">
                    <input type="checkbox" className="form-check-input" name="is_superhero" checked={form.is_superhero} onChange={handleChange} />
                    <label className="form-check-label">Is Superhero</label>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Team</label>
                    <input type="text" className="form-control" name="team" value={form.team} onChange={handleChange} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-warning">Add User</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
