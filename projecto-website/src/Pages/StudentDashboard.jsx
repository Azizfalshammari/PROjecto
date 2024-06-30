import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [editProjectId, setEditProjectId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
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

  const handleAddOrUpdateProject = () => {
    setLoading(true);
    const projectData = {
      name: newProjectName,
      description: newProjectDescription,
      status: 'waiting',
      user: user.email,
    };

    const apiCall = editProjectId
      ? axios.put(`https://665855e85c3617052647fe40.mockapi.io/Projects/${editProjectId}`, projectData)
      : axios.post('https://665855e85c3617052647fe40.mockapi.io/Projects', projectData);

    apiCall
      .then(() => {
        fetchProjects();
        document.getElementById('project_modal').close();
        setAlertMessage(editProjectId ? 'Project updated successfully!' : 'Project submitted successfully!');
        setNewProjectName('');
        setNewProjectDescription('');
        setEditProjectId(null);
        setRejectionReason('');
        setTimeout(() => setAlertMessage(''), 3000);
      })
      .catch(error => {
        console.error('Error adding/updating project:', error);
        setLoading(false);
      });
  };

  const handleEditProject = (project) => {
    setNewProjectName(project.name);
    setNewProjectDescription(project.description);
    setEditProjectId(project.id);
    setRejectionReason(project.rejectionReason || '');
    document.getElementById('project_modal').showModal();
  };

  const renderProjects = (status) => (
    projects
      .filter(project => project.status === status && (project.name?.toLowerCase().includes(searchTerm.toLowerCase()) || project.user?.toLowerCase().includes(searchTerm.toLowerCase())))
      .map((project, index) => (
        <tr key={project.id}>
          <th>{index + 1}</th>
          <td>{project.name}</td>
          <td>{project.description}</td>
          <td>{project.user}</td>
          <td>
            <div className={`badge ${status === 'approved' ? 'badge-success' : status === 'rejected' ? 'badge-error' : 'badge-warning'} gap-2`}>
              {status}
            </div>
            {status === 'rejected' && (
              <>
                <button className="btn btn-xs btn-secondary ml-2" onClick={() => handleEditProject(project)}>
                  Edit
                </button>
                <div className="text-sm text-red-500 mt-1">Reason: {project.rejectionReason}</div>
              </>
            )}
          </td>
        </tr>
      ))
  );

  const renderUserProjects = () => (
    projects
      .filter(project => project.user === user.email)
      .map((project, index) => (
        <tr key={project.id}>
          <th>{index + 1}</th>
          <td>{project.name}</td>
          <td>{project.description}</td>
          <td>
            <div className={`badge ${project.status === 'approved' ? 'badge-success' : project.status === 'rejected' ? 'badge-error' : 'badge-warning'} gap-2`}>
              {project.status}
            </div>
            {project.status === 'rejected' && (
              <>
                <button className="btn btn-xs btn-secondary ml-2" onClick={() => handleEditProject(project)}>
                  Edit
                </button>
                <div className="text-sm text-red-500 mt-1">Reason: {project.rejectionReason}</div>
              </>
            )}
          </td>
        </tr>
      ))
  );

  return (
    <div className="min-h-screen bg-base-100 p-4">
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">Project Management</a>
        </div>
        <div className="flex-none">
          <button className="btn" onClick={() => navigate('/')}>Logout</button>
        </div>
      </div>
      <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>
      {alertMessage && (
        <div className="alert mb-4">
          {alertMessage}
        </div>
      )}
      <div className="mb-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex flex-col md:flex-row items-center">
          <input
            type="text"
            placeholder="Search projects"
            className="input input-bordered w-full max-w-xs mb-2 md:mb-0 md:mr-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn btn-primary" onClick={() => fetchProjects()}>Search</button>
        </div>
        <button className="btn btn-secondary ml-2" onClick={() => {
          setEditProjectId(null);
          setNewProjectName('');
          setNewProjectDescription('');
          setRejectionReason('');
          document.getElementById('project_modal').showModal();
        }}>
          Add New Project
        </button>
      </div>
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
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {renderProjects('approved')}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-bold mb-2">My Projects</h2>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Project Name</th>
                <th>Description</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {renderUserProjects()}
            </tbody>
          </table>
        </div>
      </div>
      {/* Modal for adding or editing project */}
      <dialog id="project_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">{editProjectId ? 'Edit Project' : 'Add New Project'}</h3>
          <input
            type="text"
            placeholder="Enter project name"
            className="input input-bordered w-full max-w-xs mb-2"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
          />
          <textarea
            placeholder="Enter project description"
            className="textarea textarea-bordered w-full max-w-xs mb-2"
            value={newProjectDescription}
            onChange={(e) => setNewProjectDescription(e.target.value)}
          />
          {rejectionReason && (
            <div className="text-sm text-red-500 mb-2">
              Rejection Reason: {rejectionReason}
            </div>
          )}
          <div className="modal-action">
            <button className="btn" onClick={() => document.getElementById('project_modal').close()}>Cancel</button>
            <button className="btn btn-primary" onClick={handleAddOrUpdateProject}>{editProjectId ? 'Update' : 'Submit'}</button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default StudentDashboard;
