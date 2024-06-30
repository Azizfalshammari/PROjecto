import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LandingPage from '../Pages/LandingPage';
import AccountPage from '../Pages/AccountPage';
import AdminDashboard from '../Pages/AdminDashboard';
import ProjectPage from '../Pages/ProjectPage';
import StudentDashboard from '../Pages/StudentDashboard';
import ProfilePage from '../Pages/ProfilePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/account',
    element: <AccountPage />,
  },
  {
    path: '/dashboard',
    element: localStorage.getItem('isAdmin') === 'true' ? <AdminDashboard /> : <StudentDashboard />,
  },
  {
    path: '/project/:id',
    element: <ProjectPage />,
  },
  {
    path: '/profile/:id',
    element: <ProfilePage />,
  },
]);

function Router() {
  const [loggedInUser, setLoggedInUser] = React.useState(JSON.parse(localStorage.getItem('user')));

  return (
    <RouterProvider router={router}>
      {loggedInUser && (
        <div>
          {localStorage.getItem('isAdmin') === 'true' ? <AdminDashboard user={loggedInUser} /> : <StudentDashboard user={loggedInUser} />}
        </div>
      )}
    </RouterProvider>
  );
}

export default Router;
