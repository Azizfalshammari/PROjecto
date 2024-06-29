import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LandingPage from '../Pages/LandingPage';
import AccountPage from '../Pages/AccountPage';

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
    element: <div>Dashboard</div>, // Replace with actual Dashboard component
  },
  {
    path: '/users',
    element: <div>Users Page</div>, // Replace with actual UsersPage component
  },
]);

function Router() {
  return <RouterProvider router={router} />;
}

export default Router;
