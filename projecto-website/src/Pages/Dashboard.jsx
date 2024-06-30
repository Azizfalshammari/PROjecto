import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    setLoading(true);
    axios.get('https://665855e85c3617052647fe40.mockapi.io/USERS')
      .then(response => {
        setStudents(response.data.filter(user => user.isUser));
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching students:', error);
        setLoading(false);
      });
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredStudents = students.filter(student =>
    student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAccept = (studentId) => {
    setAlertMessage(`Accepted project for student with ID: ${studentId}`);
    setTimeout(() => setAlertMessage(''), 3000);
  };

  const handleReject = (studentId) => {
    const reason = prompt('Enter reason for rejection:');
    setAlertMessage(`Rejected project for student with ID: ${studentId} due to: ${reason}`);
    setTimeout(() => setAlertMessage(''), 3000);
  };

  const handleDeleteStudent = (studentId) => {
    setAlertMessage(
      <div role="alert" className="alert">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info h-6 w-6 shrink-0">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>Are you sure you want to delete student with ID: {studentId}?</span>
        <div>
          <button className="btn btn-sm" onClick={() => setAlertMessage('')}>Cancel</button>
          <button className="btn btn-sm btn-primary" onClick={() => confirmDeleteStudent(studentId)}>Delete</button>
        </div>
      </div>
    );
  };

  const confirmDeleteStudent = (studentId) => {
    setAlertMessage(`Deleted student account with ID: ${studentId}`);
    setTimeout(() => setAlertMessage(''), 3000);
    // Add your logic to delete the student account here
  };

  return (
    <div className="min-h-screen bg-base-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      {alertMessage && (
        <div className="alert mb-4">
          {alertMessage}
        </div>
      )}
      <input
        type="text"
        placeholder="Search for a student"
        value={searchTerm}
        onChange={handleSearch}
        className="input input-bordered mb-4"
      />
      {loading && (
        <span className="loading loading-spinner loading-lg"></span>
      )}
      {!loading && (
        <div>
          <h2 className="text-xl font-bold mb-2">New Projects</h2>
          <table className="table-auto w-full bg-white shadow-md rounded mb-4">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.filter(student => student.projectStatus === 'new').map(student => (
                <tr key={student.id}>
                  <td>{student.firstName} {student.lastName}</td>
                  <td>{student.email}</td>
                  <td>
                    <button className="btn btn-success mr-2" onClick={() => handleAccept(student.id)}>Accept</button>
                    <button className="btn btn-error mr-2" onClick={() => handleReject(student.id)}>Reject</button>
                    <button className="btn btn-warning" onClick={() => handleDeleteStudent(student.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h2 className="text-xl font-bold mb-2">Shortlisted Projects</h2>
          <table className="table-auto w-full bg-white shadow-md rounded mb-4">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.filter(student => student.projectStatus === 'shortlisted').map(student => (
                <tr key={student.id}>
                  <td>{student.firstName} {student.lastName}</td>
                  <td>{student.email}</td>
                  <td>
                    <button className="btn btn-warning" onClick={() => handleDeleteStudent(student.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h2 className="text-xl font-bold mb-2">Interviewed Projects</h2>
          <table className="table-auto w-full bg-white shadow-md rounded mb-4">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.filter(student => student.projectStatus === 'interviewed').map(student => (
                <tr key={student.id}>
                  <td>{student.firstName} {student.lastName}</td>
                  <td>{student.email}</td>
                  <td>
                    <button className="btn btn-warning" onClick={() => handleDeleteStudent(student.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
