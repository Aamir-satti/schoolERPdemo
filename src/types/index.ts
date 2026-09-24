export type UserRole = 'admin' | 'teacher' | 'student';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface Student {
  id: string;
  regNo: string;
  name: string;
  classId: string;
  section: string;
  gender: 'Male' | 'Female';
  parentName: string;
  phone: string;
  email: string;
  status: 'Active' | 'Inactive';
  admissionDate: string;
  dateOfBirth: string;
  address: string;
}

export interface Teacher {
  id: string;
  employeeId: string;
  name: string;
  subject: string;
  classes: string[];
  phone: string;
  email: string;
  joiningDate: string;
  status: 'Active' | 'Inactive';
  qualification: string;
  baseSalary: number;
  allowances: number;
  deductions: number;
}

export interface ClassInfo {
  id: string;
  name: string;
  section: string;
  teacherId: string;
  subjects: string[];
  studentCount: number;
  room: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  teacherId: string;
  classes: string[];
}

export interface TimetableEntry {
  id: string;
  day: string;
  time: string;
  subjectId: string;
  teacherId: string;
  classId: string;
  room: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  classId: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late' | 'Leave';
  subjectId?: string;
}

export interface Exam {
  id: string;
  name: string;
  classId: string;
  subjectId: string;
  date: string;
  totalMarks: number;
  passingMarks: number;
  term: string;
}

export interface Mark {
  id: string;
  examId: string;
  studentId: string;
  subjectId: string;
  obtained: number;
  totalMarks: number;
}

export interface FeeRecord {
  id: string;
  studentId: string;
  month: string;
  year: number;
  amount: number;
  paid: number;
  dueDate: string;
  status: 'Paid' | 'Partial' | 'Unpaid';
  paymentMethod?: 'Cash' | 'Bank' | 'Online Transfer';
  paymentDate?: string;
}

export interface SalaryRecord {
  id: string;
  teacherId: string;
  month: string;
  year: number;
  baseSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: 'Paid' | 'Pending';
  paidDate?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  expiry?: string;
  isPublic: boolean;
  targetRole?: UserRole | 'all';
  attachment?: string;
}

export interface Activity {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  user: string;
}
