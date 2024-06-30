import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ProfilePage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [password, setPassword] = useState('');
  const [archivedProjects, setArchivedProjects] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    fetchUser();
    fetchArchivedProjects();
  }, []);

  const fetchUser = () => {
    axios.get(`https://665855e85c3617052647fe40.mockapi.io/USERS/${id}`)
      .then(response => setUser(response.data))
      .catch(error => console.error('Error fetching user:', error));
  };

  const fetchArchivedProjects = () => {
    axios.get(`https://665855e85c3617052647fe40.mockapi.io/Projects?status=archived`)
      .then(response => {
        const userProjects = response.data.filter(project => project.user === user.email);
        setArchivedProjects(userProjects);
      })
      .catch(error => console.error('Error fetching archived projects:', error));
  };

  const handleUpdatePassword = () => {
    axios.put(`https://665855e85c3617052647fe40.mockapi.io/USERS/${id}`, { password })
      .then(() => {
        setAlertMessage('Password updated successfully!');
        setTimeout(() => setAlertMessage(''), 3000);
      })
      .catch(error => console.error('Error updating password:', error));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Profile Page</h1>
      {alertMessage && (
        <div className="alert mb-4">
          {alertMessage}
        </div>
      )}
      {user && (
        <div>
          <h2 className="text-xl font-bold mb-2">Edit Password</h2>
          <input
            type="password"
            placeholder="Enter new password"
            className="input input-bordered w-full max-w-xs mb-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleUpdatePassword}>Update Password</button>
        </div>
      )}
      <div>
        <h2 className="text-xl font-bold mb-2">Archived Projects</h2>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Project Name</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {archivedProjects.map((project, index) => (
                <tr key={project.id}>
                  <th>{index + 1}</th>
                  <td>{project.name}</td>
                  <td>{project.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
