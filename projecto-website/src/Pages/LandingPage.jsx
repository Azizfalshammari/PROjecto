import React from 'react';

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Welcome to the Project Management System</h1>
      <p className="text-lg">Manage your projects effectively and efficiently.</p>
      <div className="mt-8">
        <a href="/account" className="btn btn-primary">Go to Account Page</a>
      </div>
    </div>
  );
};

export default LandingPage;
