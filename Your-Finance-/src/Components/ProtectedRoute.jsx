import React from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

/**
 * Componente que intercepta rotas privadas.
 * Se o usuário não possuir token JWT ativo, é redirecionado para a tela de Login.
 */
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-gray-950">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
