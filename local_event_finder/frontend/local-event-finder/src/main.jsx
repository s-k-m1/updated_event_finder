import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {createBrowserRouter,RouterProvider} from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Home from './home/homepage.jsx';
import Event from './Events/event.jsx';
import EventDetail from './eventdetail.jsx';
import Catagories from './Catagories/catagories.jsx';
import About from './About/about.jsx';
import Signup from './signup.jsx';
import Login from './Login.jsx';
import ForgotPassword from './ForgotPassword.jsx';
import ResetPassword from './ResetPassword.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import Saved from './saved.jsx';
import MyRegistrations from './MyRegistrations.jsx';
import UserDashboard from './UserDashboard.jsx';
import PaymentReturn from './PaymentReturn.jsx';
import CreateEvent from './CreateEvent.jsx';
import AdminLayout from './admin/AdminLayout.jsx';
import AdminDashboard from './admin/AdminDashboard.jsx';
import AdminEvents from './admin/AdminEvents.jsx';
import AdminCategories from './admin/AdminCategories.jsx';
import AdminUsers from './admin/AdminUsers.jsx';
import AdminSubscribers from './admin/AdminSubscribers.jsx';
import AdminNotifications from './admin/AdminNotifications.jsx';
import AdminProfile from './admin/AdminProfile.jsx';
import './admin/admin.css';

const router = createBrowserRouter([
{
path:"/",
element:<Home />,
},
{
  path:"/login",
  element:<Login />,
},
{
  path:"/forgot-password",
  element:<ForgotPassword />,
},
{
  path:"/reset-password",
  element:<ResetPassword />,
},
{
path:"/signup",
element:<Signup />,
},
{
  path:"/event",
  element:<Event />,
},
{
  path:"/event/:slug",
  element:<EventDetail />,
},
{
  path:"/categories",
  element:<Catagories />,
},
{
  path:"/about",
  element:<About />,
},
{
  path: "/saved",
  element: (
    <ProtectedRoute>
      <Saved />
    </ProtectedRoute>
  ),
},
{
  path: "/registrations",
  element: (
    <ProtectedRoute>
      <MyRegistrations />
    </ProtectedRoute>
  ),
},
{
  path: "/dashboard",
  element: (
    <ProtectedRoute>
      <UserDashboard />
    </ProtectedRoute>
  ),
},
{
  path: "/payment/return",
  element: (
    <ProtectedRoute>
      <PaymentReturn />
    </ProtectedRoute>
  ),
},
{
  path: "/create-event",
  element: (
    <ProtectedRoute adminOnly>
      <CreateEvent />
    </ProtectedRoute>
  ),
},
{
  path: "/admin",
  element: (
    <ProtectedRoute adminOnly>
      <AdminLayout />
    </ProtectedRoute>
  ),
  children: [
    { index: true, element: <AdminDashboard /> },
    { path: "events", element: <AdminEvents /> },
    { path: "categories", element: <AdminCategories /> },
    { path: "users", element: <AdminUsers /> },
    { path: "subscribers", element: <AdminSubscribers /> },
    { path: "notifications", element: <AdminNotifications /> },
    { path: "profile", element: <AdminProfile /> },
  ],
}

])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </AuthProvider>
  </StrictMode>,
)