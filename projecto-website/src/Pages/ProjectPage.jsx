import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ProjectPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProject();
  }, []);

  const fetchProject = () => {
    setLoading(true);
    axios.get(`https://665855e85c3617052647fe40.mockapi.io/Projects/${id}`)
      .then(response => {
        setProject(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching project:', error);
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-base-100 p-4">
      {loading && (
        <span className="loading loading-spinner loading-lg"></span>
      )}
      {!loading && project && (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Field</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Project Name</th>
                <td>{project.name}</td>
              </tr>
              <tr>
                <th>Description</th>
                <td>{project.description}</td>
              </tr>
              <tr>
                <th>User</th>
                <td>{project.user}</td>
              </tr>
              <tr>
                <th>Status</th>
                <td>{project.status}</td>
              </tr>
              {project.rejectionReason && (
                <tr>
                  <th>Rejection Reason</th>
                  <td>{project.rejectionReason}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProjectPage;
