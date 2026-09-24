import React, { useState, ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { X, Menu, Bell, LogOut, User, ChevronDown, GraduationCap } from 'lucide-react';

// Toast notification
export function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error' | 'info'; onClose: () => void }) {
  React.useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  const bg = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
  return (
    <div className={`fixed top-4 right-4 z-50 ${bg} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-in`}>
      <span>{message}</span>
      <button onClick={onClose}><X size={16} /></button>
    </div>
  );
}

// Modal
export function Modal({ isOpen, onClose, title, children, size = 'md' }: { isOpen: boolean; onClose: () => void; title: string; children: ReactNode; size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  if (!isOpen) return null;
  const sizeClass = size === 'sm' ? 'max-w-md' : size === 'lg' ? 'max-w-4xl' : size === 'xl' ? 'max-w-6xl' : 'max-w-2xl';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className={`bg-white rounded-xl shadow-2xl w-full ${sizeClass} max-h-[90vh] overflow-hidden`} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded"><X size={20} /></button>
        </div>
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">{children}</div>
      </div>
    </div>
  );
}

// Card
export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}>{children}</div>;
}

// Stat Card
export function StatCard({ title, value, icon, color, subtitle }: { title: string; value: string | number; icon: ReactNode; color: string; subtitle?: string }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
      </div>
    </Card>
  );
}

// Badge
export function Badge({ children, variant = 'default' }: { children: ReactNode; variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' }) {
  const colors = { default: 'bg-gray-100 text-gray-700', success: 'bg-green-100 text-green-700', warning: 'bg-yellow-100 text-yellow-700', danger: 'bg-red-100 text-red-700', info: 'bg-blue-100 text-blue-700' };
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[variant]}`}>{children}</span>;
}

// Empty State
export function EmptyState({ message, subMessage }: { message: string; subMessage?: string }) {
  return (
    <div className="text-center py-12">
      <div className="text-gray-300 text-5xl mb-4">📋</div>
      <p className="text-gray-500 font-medium">{message}</p>
      {subMessage && <p className="text-gray-400 text-sm mt-1">{subMessage}</p>}
    </div>
  );
}

// Loading
export function Loading({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mr-3"></div>
      <span className="text-gray-500">{text}</span>
    </div>
  );
}

// Page Header
export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// Button
export function Button({ children, onClick, variant = 'primary', size = 'md', disabled, type = 'button', className = '' }: {
  children: ReactNode; onClick?: () => void; variant?: 'primary' | 'secondary' | 'danger' | 'ghost'; size?: 'sm' | 'md' | 'lg'; disabled?: boolean; type?: 'button' | 'submit'; className?: string;
}) {
  const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variants = { primary: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500', secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500', danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500', ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-500' };
  const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2 text-sm', lg: 'px-6 py-3 text-base' };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      {children}
    </button>
  );
}

// Input
export function Input({ label, ...props }: { label?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      <input {...props} className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-sm ${props.className || ''}`} />
    </div>
  );
}

// Select
export function Select({ label, children, ...props }: { label?: string; children: ReactNode } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      <select {...props} className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-sm bg-white ${props.className || ''}`}>
        {children}
      </select>
    </div>
  );
}

// Sidebar Layout
const adminNav = [
  { path: '/admin', label: 'Dashboard', icon: '📊' },
  { path: '/admin/students', label: 'Students', icon: '🎓' },
  { path: '/admin/teachers', label: 'Teachers', icon: '👨‍🏫' },
  { path: '/admin/classes', label: 'Classes', icon: '🏫' },
  { path: '/admin/subjects', label: 'Subjects', icon: '📚' },
  { path: '/admin/timetable', label: 'Timetable', icon: '📅' },
  { path: '/admin/attendance', label: 'Attendance', icon: '✅' },
  { path: '/admin/exams', label: 'Examinations', icon: '📝' },
  { path: '/admin/results', label: 'Results', icon: '📋' },
  { path: '/admin/finance', label: 'Finance', icon: '💰' },
  { path: '/admin/notifications', label: 'Notifications', icon: '🔔' },
  { path: '/admin/reports', label: 'Reports', icon: '📈' },
];

const teacherNav = [
  { path: '/teacher', label: 'Dashboard', icon: '📊' },
  { path: '/teacher/classes', label: 'My Classes', icon: '🏫' },
  { path: '/teacher/students', label: 'Students', icon: '🎓' },
  { path: '/teacher/timetable', label: 'Timetable', icon: '📅' },
  { path: '/teacher/attendance', label: 'Attendance', icon: '✅' },
  { path: '/teacher/marks', label: 'Enter Marks', icon: '📝' },
  { path: '/teacher/results', label: 'Results', icon: '📋' },
  { path: '/teacher/reports', label: 'Reports', icon: '📈' },
];

const studentNav = [
  { path: '/student', label: 'Dashboard', icon: '📊' },
  { path: '/student/profile', label: 'My Profile', icon: '👤' },
  { path: '/student/timetable', label: 'Timetable', icon: '📅' },
  { path: '/student/attendance', label: 'Attendance', icon: '✅' },
  { path: '/student/results', label: 'Results', icon: '📋' },
  { path: '/student/fees', label: 'Fee Challans', icon: '💰' },
  { path: '/student/notifications', label: 'Notifications', icon: '🔔' },
];

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout, notifications } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const nav = user?.role === 'admin' ? adminNav : user?.role === 'teacher' ? teacherNav : studentNav;
  const unreadNotifs = notifications.filter(n => n.isPublic || n.targetRole === user?.role || n.targetRole === 'all').length;

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-2 p-4 border-b bg-gradient-to-r from-green-600 to-green-700">
          <GraduationCap className="text-white" size={28} />
          <div>
            <h1 className="text-white font-bold text-sm">Greenfield Grammar</h1>
            <p className="text-green-100 text-xs">School Management</p>
          </div>
        </div>
        <div className="px-3 py-2 bg-yellow-50 border-b border-yellow-100">
          <p className="text-xs text-yellow-700 font-medium text-center">⚡ DEMO MODE</p>
        </div>
        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-160px)]">
          {nav.map(item => (
            <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${location.pathname === item.path ? 'bg-green-50 text-green-700 border border-green-200' : 'text-gray-600 hover:bg-gray-50'}`}>
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 lg:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
                <Menu size={20} />
              </button>
              <div className="hidden sm:block">
                <p className="text-xs text-gray-400">Welcome back,</p>
                <p className="text-sm font-semibold text-gray-700">{user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                {user?.role?.toUpperCase()}
              </span>
              <div className="relative">
                <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                  <Bell size={20} className="text-gray-600" />
                  {unreadNotifs > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>}
                </button>
              </div>
              <div className="relative">
                <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <User size={16} className="text-green-700" />
                  </div>
                  <ChevronDown size={14} className="text-gray-400 hidden sm:block" />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border py-1 z-50">
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-gray-400">{user?.email}</p>
                    </div>
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 md:p-6">{children}</main>
      </div>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
}
