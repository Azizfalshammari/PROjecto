import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCheck, FaTimes, FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchUserTerm, setSearchUserTerm] = useState('');
  const [comments, setComments] = useState({});
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [viewProjects, setViewProjects] = useState(true);
  const [editProject, setEditProject] = useState(null);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  useEffect(() => {
    fetchProjects();
    fetchUsers();
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

  const fetchUsers = () => {
    setLoading(true);
    axios.get('https://665855e85c3617052647fe40.mockapi.io/USERS')
      .then(response => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        setLoading(false);
      });
  };

  const updateProjectStatus = (id, status) => {
    setLoading(true);
    const updateData = { status };
    if (status === 'rejected') {
      updateData.rejectionReason = comments[id] || '';
    }
    axios.put(`https://665855e85c3617052647fe40.mockapi.io/Projects/${id}`, updateData)
      .then(() => {
        fetchProjects();
        setAlertMessage(`Project status updated to ${status}.`);
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
      document.getElementById('rejection_modal').close();
    }
  };

  const handleEditProject = (project) => {
    setEditProject(project.id);
    setProjectName(project.name);
    setProjectDescription(project.description);
    document.getElementById('edit_project_modal').showModal();
  };

  const handleUpdateProject = () => {
    setLoading(true);
    axios.put(`https://665855e85c3617052647fe40.mockapi.io/Projects/${editProject}`, {
      name: projectName,
      description: projectDescription,
      status: 'waiting'
    })
      .then(() => {
        fetchProjects();
        document.getElementById('edit_project_modal').close();
        setAlertMessage('Project updated successfully!');
        setEditProject(null);
        setProjectName('');
        setProjectDescription('');
        setTimeout(() => setAlertMessage(''), 3000);
      })
      .catch(error => {
        console.error('Error updating project:', error);
        setLoading(false);
      });
  };

  const handleDeleteProject = (projectId) => {
    setLoading(true);
    axios.delete(`https://665855e85c3617052647fe40.mockapi.io/Projects/${projectId}`)
      .then(() => {
        fetchProjects();
        setAlertMessage('Project deleted successfully!');
        setTimeout(() => setAlertMessage(''), 3000);
      })
      .catch(error => {
        console.error('Error deleting project:', error);
        setLoading(false);
      });
  };
  const handleDeleteUser = (userId) => {
    setLoading(true);
    axios.delete(`https://665855e85c3617052647fe40.mockapi.io/USERS/${userId}`)
      .then(() => {
        fetchUsers();
        fetchProjects();
        setAlertMessage('User deleted successfully!');
        setTimeout(() => setAlertMessage(''), 3000);
      })
      .catch(error => {
        console.error('Error deleting user:', error);
        setLoading(false);
      });
  };

  const renderProjects = (status) => (
    projects
      .filter(project => project.status === status)
      .map((project, index) => (
        <div key={project.id} className="card bg-neutral text-neutral-content w-96 mb-4">
          <div className="card-body">
            <h2 className="card-title">{project.name}</h2>
            <p>{project.description}</p>
            <p><strong>User:</strong> {project.user}</p>
            <p><strong>Status:</strong> 
              <span className={`badge ${project.status === 'approved' ? 'badge-success' : project.status === 'rejected' ? 'badge-error' : 'badge-warning'}`}>
                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
              </span>
            </p>
            <div className="card-actions justify-end">
              {status === "waiting" && isAdmin && (
                <div className="flex space-x-2">
                  <FaCheck
                    className="text-green-500 cursor-pointer"
                    onClick={() => updateProjectStatus(project.id, "approved")}
                  />
                  <FaTimes
                    className="text-red-500 cursor-pointer"
                    onClick={() => {
                      setCurrentProjectId(project.id);
                      document.getElementById("rejection_modal").showModal();
                    }}
                  />
                  <FaEdit
                    className="text-blue-500 cursor-pointer"
                    onClick={() => handleEditProject(project)}
                  />
                  <FaTrash
                    className="text-red-500 cursor-pointer"
                    onClick={() => handleDeleteProject(project.id)}
                  />
                </div>
              )}
              {status === "approved" && isAdmin && (
                <div className="flex space-x-2">
                  <FaTimes
                    className="text-red-500 cursor-pointer"
                    onClick={() => {
                      setCurrentProjectId(project.id);
                      document.getElementById("rejection_modal").showModal();
                    }}
                  />
                  <FaEdit
                    className="text-blue-500 cursor-pointer"
                    onClick={() => handleEditProject(project)}
                  />
                  <FaTrash
                    className="text-red-500 cursor-pointer"
                    onClick={() => handleDeleteProject(project.id)}
                  />
                </div>
              )}
              {status === "rejected" && isAdmin && (
                <div className="flex space-x-2">
                  <FaCheck
                    className="text-green-500 cursor-pointer"
                    onClick={() => updateProjectStatus(project.id, "approved")}
                  />
                  <FaEdit
                    className="text-blue-500 cursor-pointer"
                    onClick={() => handleEditProject(project)}
                  />
                  <FaTrash
                    className="text-red-500 cursor-pointer"
                    onClick={() => handleDeleteProject(project.id)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ))
  );

  const renderUsers = () => (
    users
      .filter(
        (user) =>
          user.firstName?.toLowerCase().includes(searchUserTerm.toLowerCase()) ||
          user.lastName?.toLowerCase().includes(searchUserTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchUserTerm.toLowerCase())
      )
      .map((user, index) => (
        <div key={user.id} className="card bg-neutral text-neutral-content w-96 mb-4" onClick={() => setSelectedUser(user)}>
          <div className="card-body">
            <h2 className="card-title">{user.firstName} {user.lastName}</h2>
            <p>{user.email}</p>
            <p><strong>Projects:</strong> {projects.filter(project => project.user === user.email).length}</p>
            <div className="card-actions justify-end">
              <button
                className="btn btn-xs btn-error"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteUser(user.id);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))
  );
  const renderContent = () => {
    if (viewProjects) {
      return (
 
          <div className="flex flex-row space-x-4">
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-2">Approved Projects</h2>
              {renderProjects('approved')}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-2">Rejected Projects</h2>
              {renderProjects('rejected')}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-2">Projects Waiting for Approval</h2>
              {renderProjects('waiting')}
            </div>
          </div>
        
      );
    } else {
      return (
        <div className="flex flex-col space-y-4">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search students..."
              className="input input-bordered w-full"
              value={searchUserTerm}
              onChange={(e) => setSearchUserTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap">
            {renderUsers()}
          </div>
          {selectedUser && (
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-2">
                {selectedUser.firstName} {selectedUser.lastName}'s Projects
              </h2>
              {projects
                .filter((project) => project.user === selectedUser.email)
                .map((project, index) => (
                  <div
                    key={project.id}
                    className="card bg-neutral text-neutral-content w-96 mb-4"
                  >
                    <div className="card-body">
                      <h2 className="card-title">{project.name}</h2>
                      <p>{project.description}</p>
                      <p>
                        <strong>Status:</strong>
                        <span
                          className={`badge ${
                            project.status === 'approved'
                              ? 'badge-success'
                              : project.status === 'rejected'
                              ? 'badge-error'
                              : 'badge-warning'
                          }`}
                        >
                          {project.status.charAt(0).toUpperCase() +
                            project.status.slice(1)}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-base-100 p-4">
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">Project Management</a>
        </div>
        <div className="flex-none">
          <button className="btn" onClick={() => navigate('/')}>
            Logout
          </button>
          <button
            className="btn ml-2"
            onClick={() => navigate(`/profile/${localStorage.getItem('userId')}`)}
          >
            Profile
          </button>
        </div>
      </div>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      {alertMessage && <div className="alert mb-4">{alertMessage}</div>}
      <label className="swap">
        <input
          type="checkbox"
          onChange={() => setViewProjects(!viewProjects)}
        />
        <div className="swap-on">View Projects</div>
        <div className="swap-off">View Students</div>
      </label>
      {loading && (
        <span className="loading loading-spinner loading-lg"></span>
      )}
      {!loading && renderContent()}
      {/* Modal for rejection reason */}
      <dialog id="rejection_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Rejection Reason</h3>
          <input
            type="text"
            placeholder="Enter rejection reason"
            className="input input-bordered w-full mt-4"
            value={comments[currentProjectId] || ''}
            onChange={(e) =>
              setComments({ ...comments, [currentProjectId]: e.target.value })
            }
          />
          <div className="modal-action">
            <button
              className="btn"
              onClick={() => document.getElementById('rejection_modal').close()}
            >
              Cancel
            </button>
            <button className="btn btn-danger" onClick={handleRejectionConfirm}>
              Confirm
            </button>
          </div>
        </div>
      </dialog>
      {/* Modal for editing project */}
      <dialog id="edit_project_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Edit Project</h3>
          <input
            type="text"
            placeholder="Enter project name"
            className="input input-bordered w-full max-w-xs mb-2"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
          <textarea
            placeholder="Enter project description"
            className="textarea textarea-bordered w-full max-w-xs mb-2"
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
          />
          <div className="modal-action">
            <button
              className="btn"
              onClick={() => document.getElementById('edit_project_modal').close()}
            >
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleUpdateProject}>
              Update
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default AdminDashboard;
