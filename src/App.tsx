import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Header from './components/Header'
import LoadingSpinner from './components/layout/LoadingSpinner'
import SignIn from './pages/SignIn'
import TeamEvaluation from './pages/TeamEvaluation'

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <SignIn />;
  }

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<TeamEvaluation />} />
        <Route path="/evaluation" element={<TeamEvaluation />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
