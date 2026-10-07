import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import RoleRoute from './components/RoleRoute';

// Chef Components
import ChefDashboardLayout from './pages/chef/ChefDashboardLayout';
import ChefOverview from './pages/chef/ChefOverview';
import AddRecipe from './pages/chef/AddRecipe';
import EditRecipe from './pages/chef/EditRecipe';
import MyRecipes from './pages/chef/MyRecipes';
import ChefProfile from './pages/chef/ChefProfile';
import ChefReviews from './pages/chef/ChefReviews';

// Admin Components
import AdminDashboardLayout from './pages/admin/AdminDashboardLayout';
import AdminOverview from './pages/admin/AdminOverview';
import PendingRecipes from './pages/admin/PendingRecipes';
import ManageReviews from './pages/admin/ManageReviews';
import ManageAds from './pages/admin/ManageAds';
import ManageUsers from './pages/admin/ManageUsers';

// User Portal
import UserDashboardLayout from './pages/user/UserDashboardLayout';
import UserHome from './pages/user/UserHome';
import SavedRecipes from './pages/user/SavedRecipes';
import UserProfile from './pages/user/UserProfile';
import AIHelper from './pages/user/AIHelper';
import SocialFeed from './pages/SocialFeed';
import ChefPublicProfile from './pages/user/ChefPublicProfile';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
  if (!user) return <Navigate to="/login" />;
  
  return children;
};

function AppContent() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        
        {/* Chef Portal Routes */}
        <Route 
          path="/chef" 
          element={
            <RoleRoute allowedRole="chef">
              <ChefDashboardLayout />
            </RoleRoute>
          }
        >
            <Route index element={<ChefOverview />} />
            <Route path="add-recipe" element={<AddRecipe />} />
            <Route path="edit-recipe/:id" element={<EditRecipe />} />
            <Route path="my-recipes" element={<MyRecipes />} />
            <Route path="reviews" element={<ChefReviews />} />
            <Route path="profile" element={<ChefProfile />} />
            <Route path="discover" element={<UserHome />} />
            <Route path="social" element={<SocialFeed />} />
            <Route path="ai-helper" element={<AIHelper />} />
            <Route path="chef/:id" element={<ChefPublicProfile />} />
        </Route>

        {/* Admin Portal Routes */}
        <Route 
          path="/admin" 
          element={
            <RoleRoute allowedRole="admin">
              <AdminDashboardLayout />
            </RoleRoute>
          }
        >
            <Route index element={<AdminOverview />} />
            <Route path="pending-recipes" element={<PendingRecipes />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="social" element={<SocialFeed />} />
            <Route path="manage-reviews" element={<ManageReviews />} />
            <Route path="advertisements" element={<ManageAds />} />
        </Route>

        {/* User Portal Routes */}
        <Route
          path="/user"
          element={
            <PrivateRoute>
              <UserDashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<UserHome />} />
          <Route path="saved" element={<SavedRecipes />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="social" element={<SocialFeed />} />
          <Route path="ai-helper" element={<AIHelper />} />
          <Route path="chef/:id" element={<ChefPublicProfile />} />
        </Route>
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
