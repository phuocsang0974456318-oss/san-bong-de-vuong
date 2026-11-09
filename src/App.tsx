import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { Layers, Calendar, Users, Wrench, BarChart3, UserCheck, Settings, LogOut } from 'lucide-react';
import { AuthProvider } from './contexts/AuthContext';

// Import LoginPage từ file riêng thay vì viết trực tiếp trong App.tsx
import LoginPage from './pages/LoginPage';

// Import các trang khác
import Reports from './pages/ReportsPage';
import Courts from './pages/CourtsPage';
import Bookings from './pages/BookingPage';
import Customers from './pages/CustomersPage';
import Services from './pages/ServicesPage';
import Staff from './pages/StaffPage';
import SettingsPage from './pages/SettingsPage';

function AdminLayout({ onLogout }: { onLogout: () => void }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0e1322', fontFamily: 'sans-serif' }}>
      {/* Sidebar bên trái */}
      <aside style={{ width: '260px', backgroundColor: '#090d19', color: '#fff', padding: '20px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#38bdf8', marginBottom: '20px', paddingLeft: '10px' }}>QUẢN LÝ SÂN BÓNG</div>
          <NavLink to="/admin/reports" style={({ isActive }) => ({ ...navStyle, backgroundColor: isActive ? '#1e293b' : 'transparent', color: isActive ? '#38bdf8' : '#94a3b8' })}><BarChart3 size={18} /> Báo cáo</NavLink>
          <NavLink to="/admin/courts" style={({ isActive }) => ({ ...navStyle, backgroundColor: isActive ? '#1e293b' : 'transparent', color: isActive ? '#38bdf8' : '#94a3b8' })}><Layers size={18} /> Danh sách sân</NavLink>
          <NavLink to="/admin/bookings" style={({ isActive }) => ({ ...navStyle, backgroundColor: isActive ? '#1e293b' : 'transparent', color: isActive ? '#38bdf8' : '#94a3b8' })}><Calendar size={18} /> Lịch đặt sân</NavLink>
          <NavLink to="/admin/customers" style={({ isActive }) => ({ ...navStyle, backgroundColor: isActive ? '#1e293b' : 'transparent', color: isActive ? '#38bdf8' : '#94a3b8' })}><Users size={18} /> Khách hàng</NavLink>
          <NavLink to="/admin/services" style={({ isActive }) => ({ ...navStyle, backgroundColor: isActive ? '#1e293b' : 'transparent', color: isActive ? '#38bdf8' : '#94a3b8' })}><Wrench size={18} /> Dịch vụ đi kèm</NavLink>
          <NavLink to="/admin/staff" style={({ isActive }) => ({ ...navStyle, backgroundColor: isActive ? '#1e293b' : 'transparent', color: isActive ? '#38bdf8' : '#94a3b8' })}><UserCheck size={18} /> Quản trị viên</NavLink>
          <NavLink to="/admin/settings" style={({ isActive }) => ({ ...navStyle, backgroundColor: isActive ? '#1e293b' : 'transparent', color: isActive ? '#38bdf8' : '#94a3b8' })}><Settings size={18} /> Cài đặt</NavLink>
        </div>

        {/* Nút đăng xuất */}
        <div style={{ padding: '10px 0', borderTop: '1px solid #1e293b' }}>
          <button
            onClick={onLogout}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 14px', borderRadius: '8px', backgroundColor: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
          >
            <LogOut size={18} /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* Nội dung bên phải */}
      <main style={{ flex: 1, padding: '24px', backgroundColor: '#0e1322', overflowY: 'auto' }}>
        <div style={{ backgroundColor: '#f8fafc', borderRadius: '16px', padding: '32px', minHeight: 'calc(100vh - 48px)', color: '#1e293b', boxSizing: 'border-box' }}>
          <Routes>
            <Route path="/admin/reports" element={<Reports />} />
            <Route path="/admin/courts" element={<Courts />} />
            <Route path="/admin/bookings" element={<Bookings />} />
            <Route path="/admin/customers" element={<Customers />} />
            <Route path="/admin/services" element={<Services />} />
            <Route path="/admin/staff" element={<Staff />} />
            <Route path="/admin/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/admin/reports" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

const navStyle = { display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 500 };

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <AuthProvider>
        {!isLoggedIn ? (
          <LoginPage onLoginSuccess={() => setIsLoggedIn(true)} />
        ) : (
          <AdminLayout onLogout={handleLogout} />
        )}
      </AuthProvider>
    </Router>
  );
}