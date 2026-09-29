import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Leads from '../pages/Leads';
import AddLead from '../pages/AddLead';
import EditLead from '../pages/EditLead';
import Companies from '../pages/Companies';
import CompanyDetails from '../pages/CompanyDetails';
import Tasks from '../pages/Tasks';
import MainLayout from '../components/layout/MainLayout';
import Loader from '../components/common/Loader';
import { Box, Typography, Button, Container } from '@mui/material';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader message="Verifying authentication..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Route (redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader message="Loading..." />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const NotFound = () => (
  <Container maxWidth="sm" sx={{ textCenter: 'center', py: 8 }}>
    <Typography variant="h3" fontWeight="bold" gutterBottom color="primary">
      404
    </Typography>
    <Typography variant="h5" gutterBottom>
      Page Not Found
    </Typography>
    <Typography variant="body1" color="text.secondary" paragraph>
      The page you are looking for does not exist or has been moved.
    </Typography>
    <Button variant="contained" href="/dashboard" sx={{ mt: 2 }}>
      Return to Dashboard
    </Button>
  </Container>
);

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="leads" element={<Leads />} />
        <Route path="leads/new" element={<AddLead />} />
        <Route path="leads/:id/edit" element={<EditLead />} />
        <Route path="companies" element={<Companies />} />
        <Route path="companies/:id" element={<CompanyDetails />} />
        <Route path="tasks" element={<Tasks />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
