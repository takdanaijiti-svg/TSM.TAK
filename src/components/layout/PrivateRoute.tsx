import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Role } from '../../types';
import { motion } from 'framer-motion';

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export function PrivateRoute({ children, allowedRoles }: PrivateRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-green-100 border-t-green-600 rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-800">ไม่มีสิทธิ์เข้าถึง</h2>
        <p className="text-slate-500 mt-2">คุณไม่มีสิทธิ์ในการดูหน้านี้</p>
      </div>
    );
  }

  return <>{children}</>;
}
