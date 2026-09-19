import React, { useContext, useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import Login from './components/Auth/Login';
import EnhancedEmployeeDashboard from './components/Dashboard/EnhancedEmployeeDashboard';
import ManagerDashboard from './components/Dashboard/ManagerDashboard';
import AdminDashboardEnhanced from './components/Dashboard/AdminDashboardEnhanced';
import LandingPage from './components/LandingPage';
import ProfilePage from './components/Profile/ProfilePage';
import AnalyticsDashboard from './components/Analytics/AnalyticsDashboard';
import { AuthContext } from './context/AuthProvider';
import { apiRequest } from './utils/api';

const App = () => {
  const [user, setUser] = useState(null);
  const [loggedInUserData, setLoggedInUserData] = useState(null);
  const [userData, SetUserData] = useContext(AuthContext);
  const [showLanding, setShowLanding] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');
  useEffect(() => {
    const savedUser = localStorage.getItem('loggedInUser');
    const savedToken = localStorage.getItem('authToken');
    if (savedUser && savedToken) {
      try {
        const parsed = JSON.parse(savedUser);
        setLoggedInUserData(parsed);
        setUser(parsed.role === 'admin' ? 'admin' : parsed.role === 'manager' ? 'manager' : 'employee');
        setShowLanding(false);
      } catch {
        localStorage.removeItem('loggedInUser');
        localStorage.removeItem('authToken');
      }
    }
  }, []);

  const handleLogin = async (email, password) => {
    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('loggedInUser', JSON.stringify(data.user));
      const role = data.user.role === 'admin' ? 'admin' : data.user.role === 'manager' ? 'manager' : 'employee';
      setUser(role);
      setLoggedInUserData(data.user);
      setShowLanding(false);
    } catch (error) {
      toast.error(error.message || 'Invalid credentials');
    }
  };

  const handleNavigateToLogin = () => {
    setShowLanding(false);
  };

  const handleBackToHome = () => {
    setShowLanding(true);
    setUser(null);
    setCurrentView('dashboard');
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('authToken');
  };

  const handleNavigateToProfile = () => {
    setCurrentView('profile');
  };

  const handleUserUpdated = (updatedUser) => {
    setLoggedInUserData(updatedUser);
    localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
  };

  const handleNavigateToAnalytics = () => {
    setCurrentView('analytics');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };
  const renderContent = () => {
    if (showLanding && !user) {
      return <LandingPage onNavigateToLogin={handleNavigateToLogin} />;
    }

    if (!showLanding && !user) {
      return <Login handleLogin={handleLogin} onBackToHome={handleBackToHome} />;
    }
    if (user === 'admin') {
      if (currentView === 'profile') {
        return (
          <ProfilePage
            data={loggedInUserData}
            userRole="admin"
            onBackToHome={handleBackToDashboard}
            onUserUpdated={handleUserUpdated}
          />
        );
      }
      
      if (currentView === 'analytics') {
        return <AnalyticsDashboard onBackToHome={handleBackToDashboard} />;
      }

      return (
        <AdminDashboardEnhanced
          changeUser={setUser}
          onBackToHome={handleBackToHome}
          onNavigateToProfile={handleNavigateToProfile}
          onNavigateToAnalytics={handleNavigateToAnalytics}
        />
      );
    }
    if (user === 'manager') {
      if (currentView === 'profile') {
        return <ProfilePage data={loggedInUserData} userRole="manager" onBackToHome={handleBackToDashboard} onUserUpdated={handleUserUpdated} />;
      }
      return <ManagerDashboard changeUser={setUser} data={loggedInUserData} onBackToHome={handleBackToHome} onNavigateHome={handleBackToDashboard} onNavigateToProfile={handleNavigateToProfile} />;
    }

    if (user === 'employee') {
      if (currentView === 'profile') {
        return (
          <ProfilePage
            data={loggedInUserData}
            userRole={user}
            onBackToHome={handleBackToDashboard}
            onUserUpdated={handleUserUpdated}
          />
        );
      }

      return (
        <EnhancedEmployeeDashboard
          changeUser={setUser}
          data={loggedInUserData}
          onBackToHome={handleBackToHome}
          onNavigateHome={handleBackToDashboard}
          onNavigateToProfile={handleNavigateToProfile}
        />
      );
    }

    return null;
  };

  return (
    <>
      <Toaster position="top-right" />
      {renderContent()}
    </>
  );
};

export default App;
