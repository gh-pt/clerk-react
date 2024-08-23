import React,{StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import App from './App.jsx'

// Import the layouts
import DashboardLayout from './layout/DashboardLayout.jsx'

// Import the components
import Home from './components/Home.jsx'
import Contact from './components/Contact.jsx'
import SignInPage from './components/SignIn.jsx'
import SignUpPage from './components/SignUp.jsx'
import Dashboard from './components/Dashboard.jsx'
import DashboardProfile from './components/DashboardProfile.jsx'

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/contact', element: <Contact /> },
      { path: '/sign-in/*', element: <SignInPage /> },
      { path: '/sign-up/*', element: <SignUpPage /> },
      {
        element: <DashboardLayout />,
        path: 'dashboard',
        children: [
          { path: '/dashboard', element: <Dashboard /> },
          { path: '/dashboard/profile', element: <DashboardProfile /> },
        ],
      },
    ],
  },
])

createRoot(document.getElementById('root')).render(


    <RouterProvider router={router} />

)