import React, { useEffect, useState } from 'react';

const initialForm = { team: '', points: '' };
const TEAMS_API_URL = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`;

const API_URL = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`;


function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [teams, setTeams] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [feedback, setFeedback] = useState('');

  const fetchLeaderboard = () => {
    console.log('Fetching from:', API_URL);
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        const results = data.results || data;
        setLeaderboard(results);
        console.log('Fetched leaderboard:', results);
      })
      .catch(err => console.error('Error fetching leaderboard:', err));
  };

  const fetchTeams = () => {
    console.log('Fetching teams from:', TEAMS_API_URL);
    fetch(TEAMS_API_URL)
      .then(res => res.json())
      .then(data => {
        const results = data.results || data;
        setTeams(results);
        console.log('Fetched teams:', results);
      })
      .catch(err => console.error('Error fetching teams:', err));
  };

  useEffect(() => {
    fetchLeaderboard();
    fetchTeams();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    setFeedback('');
    // Ensure team is sent as PK
    const submitForm = { ...form, team: form.team };
    console.log('POST to:', API_URL, 'with data:', submitForm);
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submitForm)
    })
      .then(res => res.json())
      .then(data => {
        if (data.id || data._id) {
          setFeedback('Leaderboard entry added successfully!');
          setShowModal(false);
          setForm(initialForm);
          fetchLeaderboard();
        } else {
          setFeedback('Error: ' + JSON.stringify(data));
        }
        console.log('Created leaderboard entry:', data);
      })
      .catch(err => {
        setFeedback('Error: ' + err);
        console.error('Error creating leaderboard entry:', err);
      });
  };

  return (
    <div>
      <h2 className="mb-4 text-success">Leaderboard</h2>
      <button className="btn btn-success mb-3" onClick={() => setShowModal(true)}>Add Leaderboard Entry</button>
      {feedback && <div className="alert alert-info">{feedback}</div>}

      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Team</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((entry, idx) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td>{entry.team?.name || entry.team || '-'}</td>
              <td>{entry.points || '-'}</td>
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
                <h5 className="modal-title">Add Leaderboard Entry</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Team</label>
                    <select className="form-select" name="team" value={form.team} onChange={handleChange} required>
                      <option value="">Select team</option>
                      {teams.map(team => (
                        <option key={team.id || team._id} value={team.id || team._id}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Points</label>
                    <input type="number" className="form-control" name="points" value={form.points} onChange={handleChange} required />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-success">Add Entry</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Leaderboard;
