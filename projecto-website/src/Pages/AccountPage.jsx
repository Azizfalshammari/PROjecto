import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AccountPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupFirstName, setSignupFirstName] = useState('');
  const [signupLastName, setSignupLastName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [alertMessage, setAlertMessage] = useState('');
  const [fieldError, setFieldError] = useState({});

  useEffect(() => {
    axios.get('https://665855e85c3617052647fe40.mockapi.io/USERS')
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const user = users.find(u => u.email === loginEmail && u.password === loginPassword);
    if (user) {
      localStorage.setItem('isAdmin', user.isAdmin ? 'true' : 'false');
      localStorage.setItem('user', JSON.stringify(user));
      setAlertMessage('Logged in successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } else {
      setFieldError({ login: 'Invalid credentials' });
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (!signupEmail.endsWith('@tuwaiq.edu.sa')) {
      setFieldError({ signupEmail: 'Email must end with @tuwaiq.edu.sa' });
      return;
    }

    const newUser = {
      firstName: signupFirstName,
      lastName: signupLastName,
      email: signupEmail,
      password: signupPassword,
      isAdmin: signupEmail.startsWith('admin'),
      isUser: true,
      ProjectId: null,
    };

    axios.post('https://665855e85c3617052647fe40.mockapi.io/USERS', newUser)
      .then(response => {
        setUsers([...users, response.data]);
        setAlertMessage('User registered successfully!');
        setIsLoginForm(true);
      })
      .catch(error => console.error('Error registering user:', error));
  };

  const toggleForm = () => {
    setIsLoginForm(!isLoginForm);
    setFieldError({});
  };

  return (
    <div className="drawer drawer-start">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <div className="navbar bg-base-100">
          <div className="flex-1">
            <a className="btn btn-ghost text-xl">Project Management</a>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center min-h-screen bg-base-100">
          {alertMessage && (
            <div role="alert" className="alert alert-info mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="h-6 w-6 shrink-0 stroke-current">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>{alertMessage}</span>
            </div>
          )}
          <h1 className="text-4xl font-bold mb-4">{isLoginForm ? 'Login' : 'Sign Up'}</h1>
          <div className="w-full max-w-sm">
            {isLoginForm ? (
              <form onSubmit={handleLogin} className="mb-4">
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text">Email</span>
                    <span className="label-text-alt">Required</span>
                  </div>
                  <input
                    id="loginEmail"
                    type="email"
                    placeholder="Type here"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="input input-bordered w-full max-w-xs"
                    required
                  />
                  {fieldError.login && <span className="text-red-500">{fieldError.login}</span>}
                </label>
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text">Password</span>
                    <span className="label-text-alt">Required</span>
                  </div>
                  <input
                    id="loginPassword"
                    type="password"
                    placeholder="Type here"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="input input-bordered w-full max-w-xs"
                    required
                  />
                  {fieldError.login && <span className="text-red-500">{fieldError.login}</span>}
                </label>
                <div className="flex items-center justify-between mt-4">
                  <button type="submit" className="btn btn-primary">
                    Login
                  </button>
                  <a href="#" onClick={toggleForm} className="link link-primary">
                    Don't have an account? Sign up
                  </a>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="mb-4">
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text">First Name</span>
                    <span className="label-text-alt">Required</span>
                  </div>
                  <input
                    id="signupFirstName"
                    type="text"
                    placeholder="Type here"
                    value={signupFirstName}
                    onChange={(e) => setSignupFirstName(e.target.value)}
                    className="input input-bordered w-full max-w-xs"
                    required
                  />
                </label>
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text">Last Name</span>
                    <span className="label-text-alt">Required</span>
                  </div>
                  <input
                    id="signupLastName"
                    type="text"
                    placeholder="Type here"
                    value={signupLastName}
                    onChange={(e) => setSignupLastName(e.target.value)}
                    className="input input-bordered w-full max-w-xs"
                    required
                  />
                </label>
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text">Email</span>
                    <span className="label-text-alt">Required</span>
                  </div>
                  <input
                    id="signupEmail"
                    type="email"
                    placeholder="Type here"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="input input-bordered w-full max-w-xs"
                    required
                  />
                  {fieldError.signupEmail && <span className="text-red-500">{fieldError.signupEmail}</span>}
                </label>
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text">Password</span>
                    <span className="label-text-alt">Required</span>
                  </div>
                  <input
                    id="signupPassword"
                    type="password"
                    placeholder="Type here"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="input input-bordered w-full max-w-xs"
                    required
                  />
                </label>
                <div className="flex items-center justify-between mt-4">
                  <button type="submit" className="btn btn-secondary">
                    Sign Up
                  </button>
                  <a href="#" onClick={toggleForm} className="link link-primary">
                    Already have an account? Login
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
