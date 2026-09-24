import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User, Student, Teacher, ClassInfo, Subject, TimetableEntry, AttendanceRecord, Exam, Mark, FeeRecord, SalaryRecord, Notification, Activity } from '../types';
import * as demoData from '../data/demoData';

interface AppState {
  user: User | null;
  students: Student[];
  teachers: Teacher[];
  classes: ClassInfo[];
  subjects: Subject[];
  timetable: TimetableEntry[];
  attendance: AttendanceRecord[];
  exams: Exam[];
  marks: Mark[];
  fees: FeeRecord[];
  salaries: SalaryRecord[];
  notifications: Notification[];
  activities: Activity[];
}

interface AppContextType extends AppState {
  login: (email: string, password: string) => User | null;
  logout: () => void;
  addStudent: (student: Omit<Student, 'id' | 'regNo'>) => void;
  updateStudent: (id: string, data: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  addTeacher: (teacher: Omit<Teacher, 'id' | 'employeeId'>) => void;
  updateTeacher: (id: string, data: Partial<Teacher>) => void;
  saveAttendance: (classId: string, date: string, records: { studentId: string; status: 'Present' | 'Absent' | 'Late' | 'Leave' }[]) => void;
  saveMarks: (examId: string, marksData: { studentId: string; subjectId: string; obtained: number; totalMarks: number }[]) => void;
  updateFeePayment: (feeId: string, amount: number, method: 'Cash' | 'Bank' | 'Online Transfer') => void;
  updateSalaryStatus: (salaryId: string, status: 'Paid' | 'Pending') => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  addClass: (cls: Omit<ClassInfo, 'id'>) => void;
  addSubject: (subject: Omit<Subject, 'id'>) => void;
  addExam: (exam: Omit<Exam, 'id'>) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [students, setStudents] = useState<Student[]>(demoData.students);
  const [teachers, setTeachers] = useState<Teacher[]>(demoData.teachers);
  const [classes, setClasses] = useState<ClassInfo[]>(demoData.classes);
  const [subjects, setSubjects] = useState<Subject[]>(demoData.subjects);
  const [timetable] = useState<TimetableEntry[]>(demoData.timetable);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(demoData.attendanceRecords);
  const [exams, setExams] = useState<Exam[]>(demoData.exams);
  const [marks, setMarks] = useState<Mark[]>(demoData.marks);
  const [fees, setFees] = useState<FeeRecord[]>(demoData.feeRecords);
  const [salaries, setSalaries] = useState<SalaryRecord[]>(demoData.salaryRecords);
  const [notifications, setNotifications] = useState<Notification[]>(demoData.notifications);
  const [activities, setActivities] = useState<Activity[]>(demoData.activities);

  const login = useCallback((email: string, password: string) => {
    const found = demoData.users.find(u => u.email === email && u.password === password);
    if (found) { setUser(found); return found; }
    return null;
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const addStudent = useCallback((data: Omit<Student, 'id' | 'regNo'>) => {
    const id = `ST${String(students.length + 1).padStart(3, '0')}`;
    const regNo = `GGS-2024-${String(students.length + 1).padStart(3, '0')}`;
    setStudents(prev => [...prev, { ...data, id, regNo }]);
    setActivities(prev => [{ id: `A${Date.now()}`, type: 'student', message: `New student ${data.name} admitted to ${classes.find(c => c.id === data.classId)?.name || ''} - ${data.section}`, timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '), user: 'Admin' }, ...prev]);
  }, [students.length, classes]);

  const updateStudent = useCallback((id: string, data: Partial<Student>) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
  }, []);

  const deleteStudent = useCallback((id: string) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status: 'Inactive' as const } : s));
  }, []);

  const addTeacher = useCallback((data: Omit<Teacher, 'id' | 'employeeId'>) => {
    const id = `T${String(teachers.length + 1).padStart(3, '0')}`;
    const employeeId = `EMP${String(teachers.length + 1).padStart(3, '0')}`;
    setTeachers(prev => [...prev, { ...data, id, employeeId }]);
  }, [teachers.length]);

  const updateTeacher = useCallback((id: string, data: Partial<Teacher>) => {
    setTeachers(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
  }, []);

  const saveAttendance = useCallback((classId: string, date: string, records: { studentId: string; status: 'Present' | 'Absent' | 'Late' | 'Leave' }[]) => {
    setAttendance(prev => {
      const filtered = prev.filter(a => !(a.classId === classId && a.date === date));
      const newRecords: AttendanceRecord[] = records.map(r => ({
        id: `ATT-${r.studentId}-${date}`,
        studentId: r.studentId,
        classId,
        date,
        status: r.status,
      }));
      return [...filtered, ...newRecords];
    });
    setActivities(prev => [{ id: `A${Date.now()}`, type: 'attendance', message: `Attendance submitted for ${classes.find(c => c.id === classId)?.name || ''} by ${user?.name || 'Unknown'}`, timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '), user: user?.name || 'Unknown' }, ...prev]);
  }, [classes, user]);

  const saveMarks = useCallback((examId: string, marksData: { studentId: string; subjectId: string; obtained: number; totalMarks: number }[]) => {
    setMarks(prev => {
      const filtered = prev.filter(m => m.examId !== examId);
      const newMarks: Mark[] = marksData.map((m, idx) => ({
        id: `M${Date.now()}-${idx}`,
        examId,
        studentId: m.studentId,
        subjectId: m.subjectId,
        obtained: m.obtained,
        totalMarks: m.totalMarks,
      }));
      return [...filtered, ...newMarks];
    });
  }, []);

  const updateFeePayment = useCallback((feeId: string, amount: number, method: 'Cash' | 'Bank' | 'Online Transfer') => {
    setFees(prev => prev.map(f => {
      if (f.id !== feeId) return f;
      const newPaid = f.paid + amount;
      const status = newPaid >= f.amount ? 'Paid' : newPaid > 0 ? 'Partial' : 'Unpaid';
      return { ...f, paid: newPaid, status, paymentMethod: method, paymentDate: new Date().toISOString().split('T')[0] };
    }));
  }, []);

  const updateSalaryStatus = useCallback((salaryId: string, status: 'Paid' | 'Pending') => {
    setSalaries(prev => prev.map(s => s.id === salaryId ? { ...s, status, paidDate: status === 'Paid' ? new Date().toISOString().split('T')[0] : undefined } : s));
  }, []);

  const addNotification = useCallback((data: Omit<Notification, 'id'>) => {
    const id = `N${Date.now()}`;
    setNotifications(prev => [{ ...data, id }, ...prev]);
  }, []);

  const addClass = useCallback((data: Omit<ClassInfo, 'id'>) => {
    const id = `C${String(classes.length + 1).padStart(3, '0')}`;
    setClasses(prev => [...prev, { ...data, id }]);
  }, [classes.length]);

  const addSubject = useCallback((data: Omit<Subject, 'id'>) => {
    const id = `S${String(subjects.length + 1).padStart(3, '0')}`;
    setSubjects(prev => [...prev, { ...data, id }]);
  }, [subjects.length]);

  const addExam = useCallback((data: Omit<Exam, 'id'>) => {
    const id = `EX${String(exams.length + 1).padStart(3, '0')}`;
    setExams(prev => [...prev, { ...data, id }]);
  }, [exams.length]);

  return (
    <AppContext.Provider value={{
      user, students, teachers, classes, subjects, timetable, attendance, exams, marks, fees, salaries, notifications, activities,
      login, logout, addStudent, updateStudent, deleteStudent, addTeacher, updateTeacher, saveAttendance, saveMarks, updateFeePayment, updateSalaryStatus, addNotification, addClass, addSubject, addExam,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
