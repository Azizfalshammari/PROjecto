import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const UsersPage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [comments, setComments] = useState({});
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = () => {
    setLoading(true);
    axios.get('https://665855e85c3617052647fe40.mockapi.io/Projects')
      .then(response => {
        setProjects(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching projects:', error);
        setLoading(false);
      });
  };

  const updateProjectStatus = (id, status) => {
    if (status === 'rejected') {
      setCurrentProjectId(id);
      document.getElementById('my_modal_1').showModal();
      return;
    }

    setLoading(true);
    axios.put(`https://665855e85c3617052647fe40.mockapi.io/Projects/${id}`, { status })
      .then(() => {
        fetchProjects();
        setAlertMessage(
          <div role="alert" className="alert">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-info h-6 w-6 shrink-0">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Project status updated to {status}.</span>
            <div>
              <button className="btn btn-sm btn-primary" onClick={() => setAlertMessage('')}>Close</button>
            </div>
          </div>
        );
        setTimeout(() => setAlertMessage(''), 3000);
      })
      .catch(error => {
        console.error('Error updating project status:', error);
        setLoading(false);
      });
  };

  const handleRejectionConfirm = () => {
    if (currentProjectId) {
      updateProjectStatus(currentProjectId, 'rejected');
      setCurrentProjectId(null);
      document.getElementById('my_modal_1').close();
    }
  };

  const renderProjects = (status) => (
    projects
      .filter(
        (project) =>
          project.status === status &&
          (project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.user?.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .map((project, index) => (
        <tr key={project.id} onClick={() => navigate(`/project/${project.id}`)} className="cursor-pointer">
          <th>{index + 1}</th>
          <td>{project.name}</td>
          <td>{project.description}</td>
          <td>{project.user}</td>
          <td>
            {status === 'waiting' && isAdmin && (
              <>
                <FaCheck
                  className="text-green-500 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateProjectStatus(project.id, 'approved');
                  }}
                />
                <FaTimes
                  className="text-red-500 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentProjectId(project.id);
                    document.getElementById('my_modal_1').showModal();
                  }}
                />
              </>
            )}
            {status === 'rejected' && isAdmin && (
              <FaCheck
                className="text-green-500 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  updateProjectStatus(project.id, 'approved');
                }}
              />
            )}
            {status === 'approved' && isAdmin && (
              <FaTimes
                className="text-red-500 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  updateProjectStatus(project.id, 'rejected');
                }}
              />
            )}
          </td>
        </tr>
      ))
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">Project Management</a>
        </div>
        <div className="flex-none">
          <button className="btn" onClick={() => navigate('/')}>Logout</button>
        </div>
      </div>
      <h1 className="text-2xl font-bold mb-4">Dashboard - Student Projects</h1>
      {alertMessage && (
        <div className="alert mb-4">
          {alertMessage}
        </div>
      )}
      <div className="mb-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex flex-col md:flex-row items-center">
          <input
            type="text"
            placeholder="Search projects or users"
            className="input input-bordered w-full max-w-xs mb-2 md:mb-0 md:mr-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn btn-primary" onClick={() => fetchProjects()}>Search</button>
        </div>
      </div>
      {loading && (
        <span className="loading loading-spinner loading-lg"></span>
      )}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h2 className="text-xl font-bold mb-2">Approved Projects</h2>
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Project Name</th>
                    <th>Description</th>
                    <th>User</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {renderProjects('approved')}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2">Rejected Projects</h2>
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Project Name</th>
                    <th>Description</th>
                    <th>User</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {renderProjects('rejected')}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2">Waiting for Approval</h2>
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Project Name</th>
                    <th>Description</th>
                    <th>User</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {renderProjects('waiting')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {/* Modal for rejection reason */}
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Rejection Reason</h3>
          <input
            type="text"
            placeholder="Enter rejection reason"
            className="input input-bordered w-full mt-4"
            value={comments[currentProjectId] || ''}
            onChange={(e) => setComments({ ...comments, [currentProjectId]: e.target.value })}
          />
          <div className="modal-action">
            <button className="btn" onClick={() => document.getElementById('my_modal_1').close()}>Cancel</button>
            <button className="btn btn-danger" onClick={handleRejectionConfirm}>Confirm</button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default UsersPage;
