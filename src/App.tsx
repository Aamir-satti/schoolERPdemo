import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { LandingPage, LoginPage } from './pages/Public';
import { AdminDashboard, AdminStudents, AdminTeachers, AdminClasses, AdminSubjects } from './pages/AdminCore';
import { AdminTimetable, AdminAttendance, AdminExams, AdminResults, AdminFinance, AdminNotifications, AdminReports } from './pages/AdminModules';
import { TeacherDashboard, TeacherClasses, TeacherStudents, TeacherTimetable, TeacherAttendance, TeacherMarks, TeacherResults, TeacherReports } from './pages/TeacherPages';
import { StudentDashboard, StudentProfile, StudentTimetable, StudentAttendance, StudentResults, StudentFees, StudentNotifications } from './pages/StudentPages';

function ProtectedRoute({ children, role }: { children: React.ReactNode; role: 'admin' | 'teacher' | 'student' }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to={`/${user.role}`} replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { user } = useApp();

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={user ? <Navigate to={`/${user.role}`} replace /> : <LoginPage />} />

      {/* Admin */}
      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/students" element={<ProtectedRoute role="admin"><AdminStudents /></ProtectedRoute>} />
      <Route path="/admin/teachers" element={<ProtectedRoute role="admin"><AdminTeachers /></ProtectedRoute>} />
      <Route path="/admin/classes" element={<ProtectedRoute role="admin"><AdminClasses /></ProtectedRoute>} />
      <Route path="/admin/subjects" element={<ProtectedRoute role="admin"><AdminSubjects /></ProtectedRoute>} />
      <Route path="/admin/timetable" element={<ProtectedRoute role="admin"><AdminTimetable /></ProtectedRoute>} />
      <Route path="/admin/attendance" element={<ProtectedRoute role="admin"><AdminAttendance /></ProtectedRoute>} />
      <Route path="/admin/exams" element={<ProtectedRoute role="admin"><AdminExams /></ProtectedRoute>} />
      <Route path="/admin/results" element={<ProtectedRoute role="admin"><AdminResults /></ProtectedRoute>} />
      <Route path="/admin/finance" element={<ProtectedRoute role="admin"><AdminFinance /></ProtectedRoute>} />
      <Route path="/admin/notifications" element={<ProtectedRoute role="admin"><AdminNotifications /></ProtectedRoute>} />
      <Route path="/admin/reports" element={<ProtectedRoute role="admin"><AdminReports /></ProtectedRoute>} />

      {/* Teacher */}
      <Route path="/teacher" element={<ProtectedRoute role="teacher"><TeacherDashboard /></ProtectedRoute>} />
      <Route path="/teacher/classes" element={<ProtectedRoute role="teacher"><TeacherClasses /></ProtectedRoute>} />
      <Route path="/teacher/students" element={<ProtectedRoute role="teacher"><TeacherStudents /></ProtectedRoute>} />
      <Route path="/teacher/timetable" element={<ProtectedRoute role="teacher"><TeacherTimetable /></ProtectedRoute>} />
      <Route path="/teacher/attendance" element={<ProtectedRoute role="teacher"><TeacherAttendance /></ProtectedRoute>} />
      <Route path="/teacher/marks" element={<ProtectedRoute role="teacher"><TeacherMarks /></ProtectedRoute>} />
      <Route path="/teacher/results" element={<ProtectedRoute role="teacher"><TeacherResults /></ProtectedRoute>} />
      <Route path="/teacher/reports" element={<ProtectedRoute role="teacher"><TeacherReports /></ProtectedRoute>} />

      {/* Student */}
      <Route path="/student" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
      <Route path="/student/profile" element={<ProtectedRoute role="student"><StudentProfile /></ProtectedRoute>} />
      <Route path="/student/timetable" element={<ProtectedRoute role="student"><StudentTimetable /></ProtectedRoute>} />
      <Route path="/student/attendance" element={<ProtectedRoute role="student"><StudentAttendance /></ProtectedRoute>} />
      <Route path="/student/results" element={<ProtectedRoute role="student"><StudentResults /></ProtectedRoute>} />
      <Route path="/student/fees" element={<ProtectedRoute role="student"><StudentFees /></ProtectedRoute>} />
      <Route path="/student/notifications" element={<ProtectedRoute role="student"><StudentNotifications /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}
