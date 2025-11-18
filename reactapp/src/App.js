import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { STYLES } from "./styles/constants";
import { LoadingSpinner } from "./components/common";
import Navbar from "./components/layout/Navbar";
import Home from "./components/ui/Home";
import AdminDashboard from "./components/dashboard/AdminDashboard";
import LoginForm from "./components/auth/LoginForm";
import SignupForm from "./components/auth/SignupForm";
import DocumentViewer from "./components/viewers/DocumentViewer";
import UserFileDashboard from "./components/dashboard/UserFileDashboard";

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) {
    return <div className={`${STYLES.flexCenter} min-h-screen`}><LoadingSpinner /></div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Normalize the role to handle ROLE_ADMIN, Admin, etc.
  const normalizedRole = user?.role?.toUpperCase() || "";

  if (adminOnly && !normalizedRole.includes("ADMIN")) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

// Public Route Component (redirect if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className={`${STYLES.flexCenter} min-h-screen`}><LoadingSpinner /></div>;
  }
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

// Dashboard Redirect Component
const DashboardRedirect = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className={`${STYLES.flexCenter} min-h-screen`}><LoadingSpinner /></div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Debug logging
  console.log('🔍 DashboardRedirect - Full user object:', user);
  console.log('🔍 DashboardRedirect - user.role:', user.role);
  console.log('🔍 DashboardRedirect - user.roles:', user.roles);

  // Handle both cases:
  // Case 1: user.role = "ROLE_ADMIN" or "ADMIN"
  // Case 2: user.roles = ["ROLE_ADMIN", "ROLE_USER"]
  let roles = [];

  if (Array.isArray(user.roles)) {
    roles = user.roles.map(r => r.toUpperCase());
  } else if (user.role) {
    roles = [user.role.toUpperCase()];
  }

  console.log('🔍 DashboardRedirect - processed roles:', roles);

  // Check if user has ADMIN in any of their roles
  const isAdmin = roles.some(r => r.includes("ADMIN"));
  
  console.log('🔍 DashboardRedirect - isAdmin:', isAdmin);

  if (isAdmin) {
    console.log('✅ Redirecting to admin dashboard');
    return <Navigate to="/admin-dashboard" replace />;
  } else {
    console.log('✅ Redirecting to file dashboard');
    return <Navigate to="/file-dashboard" replace />;
  }
};


function AppContent() {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className={STYLES.page}>
      <Routes>
        {/* Auth routes without navbar */}
        <Route path="/login" element={
          <PublicRoute>
            <LoginForm />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <SignupForm />
          </PublicRoute>
        } />
        
        {/* Main app routes with navbar */}
        <Route path="/" element={
          <>
            <Home />
          </>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Navbar />
            <main className="p-6 mt-20">
              <DashboardRedirect />
            </main>
          </ProtectedRoute>
        } />

        <Route path="/file-dashboard" element={
          <ProtectedRoute>
            <Navbar />
            <main className="p-6 mt-20">
              <UserFileDashboard />
            </main>
          </ProtectedRoute>
        } />
        <Route path="/admin-dashboard" element={
          <ProtectedRoute adminOnly={true}>
            <Navbar />
            <main className="p-6 mt-20">
              <AdminDashboard />
            </main>
          </ProtectedRoute>
        } />
        <Route path="/document/:id" element={
          <ProtectedRoute>
            <Navbar />
            <main className="p-6 mt-20">
              <DocumentViewer />
            </main>
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
