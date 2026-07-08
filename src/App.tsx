/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { EquipmentProvider } from './contexts/EquipmentContext';
import { CartProvider } from './contexts/CartContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { JobProvider } from './contexts/JobContext';
import { Layout } from './components/layout/Layout';
import { PrivateRoute } from './components/layout/PrivateRoute';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { CartPage } from './pages/CartPage';
import { Dashboard } from './pages/Dashboard';
import { KanbanBoard } from './pages/KanbanBoard';
import { Maintenance } from './pages/Maintenance';
import { Analytics } from './pages/Analytics';
import { StaffDirectory } from './pages/StaffDirectory';
import { ServiceRequest } from './pages/ServiceRequest';
import { Settings } from './pages/Settings';
import { JobKanban } from './pages/JobKanban';
import { Inventory } from './pages/Inventory';

export default function App() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <EquipmentProvider>
          <CartProvider>
            <JobProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="login" element={<Login />} />
                    <Route path="service-request" element={<ServiceRequest />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="staff" element={<StaffDirectory />} />
                    <Route path="inventory" element={
                      <PrivateRoute allowedRoles={['Admin', 'Manager', 'Staff']}>
                        <Inventory />
                      </PrivateRoute>
                    } />
                    
                    <Route path="cart" element={
                      <PrivateRoute>
                        <CartPage />
                      </PrivateRoute>
                    } />
                    <Route path="kanban" element={
                      <PrivateRoute allowedRoles={['Admin', 'Manager']}>
                        <KanbanBoard />
                      </PrivateRoute>
                    } />
                    <Route path="job-kanban" element={
                      <PrivateRoute allowedRoles={['Admin', 'Manager']}>
                        <JobKanban />
                      </PrivateRoute>
                    } />
                    <Route path="maintenance" element={
                      <PrivateRoute allowedRoles={['Admin', 'Manager']}>
                        <Maintenance />
                      </PrivateRoute>
                    } />
                    <Route path="analytics" element={
                      <PrivateRoute allowedRoles={['Admin', 'Manager']}>
                        <Analytics />
                      </PrivateRoute>
                    } />
                    <Route path="settings" element={
                      <PrivateRoute allowedRoles={['Admin']}>
                        <Settings />
                      </PrivateRoute>
                    } />
                    {/* Fallback */}
                    <Route path="*" element={
                      <div className="text-center py-20">
                        <h2 className="text-2xl font-bold text-slate-800">404 ไม่พบหน้าเว็บ</h2>
                      </div>
                    } />
                  </Route>
                </Routes>
              </BrowserRouter>
            </JobProvider>
          </CartProvider>
        </EquipmentProvider>
      </AuthProvider>
    </SettingsProvider>
  );
}
