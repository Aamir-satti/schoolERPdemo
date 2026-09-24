import { Student, Teacher, ClassInfo, Subject, TimetableEntry, AttendanceRecord, Exam, Mark, FeeRecord, SalaryRecord, Notification, Activity, User } from '../types';

// Users
export const users: User[] = [
  { id: 'U001', email: 'admin@demo.school', password: 'admin123', name: 'Dr. Rashid Mehmood', role: 'admin' },
  { id: 'U002', email: 'teacher@demo.school', password: 'teacher123', name: 'Mr. Ahmed Khan', role: 'teacher' },
  { id: 'U003', email: 'student@demo.school', password: 'student123', name: 'Ali Hassan', role: 'student' },
];

// Teachers
export const teachers: Teacher[] = [
  { id: 'T001', employeeId: 'EMP001', name: 'Mr. Ahmed Khan', subject: 'Mathematics', classes: ['C001', 'C002'], phone: '0300-1234567', email: 'ahmed.khan@demo.school', joiningDate: '2020-03-15', status: 'Active', qualification: 'M.Sc Mathematics', baseSalary: 75000, allowances: 10000, deductions: 2000 },
  { id: 'T002', employeeId: 'EMP002', name: 'Ms. Sara Malik', subject: 'English', classes: ['C001', 'C003'], phone: '0301-2345678', email: 'sara.malik@demo.school', joiningDate: '2019-08-01', status: 'Active', qualification: 'M.A English Literature', baseSalary: 70000, allowances: 8000, deductions: 1500 },
  { id: 'T003', employeeId: 'EMP003', name: 'Mr. Usman Ali', subject: 'Physics', classes: ['C002', 'C004'], phone: '0302-3456789', email: 'usman.ali@demo.school', joiningDate: '2021-01-10', status: 'Active', qualification: 'M.Sc Physics', baseSalary: 72000, allowances: 9000, deductions: 1800 },
  { id: 'T004', employeeId: 'EMP004', name: 'Ms. Fatima Noor', subject: 'Chemistry', classes: ['C003', 'C004'], phone: '0303-4567890', email: 'fatima.noor@demo.school', joiningDate: '2020-06-20', status: 'Active', qualification: 'M.Sc Chemistry', baseSalary: 68000, allowances: 8500, deductions: 1600 },
  { id: 'T005', employeeId: 'EMP005', name: 'Mr. Bilal Ahmad', subject: 'Computer Science', classes: ['C001', 'C002', 'C005'], phone: '0304-5678901', email: 'bilal.ahmad@demo.school', joiningDate: '2022-02-01', status: 'Active', qualification: 'BS Computer Science', baseSalary: 80000, allowances: 12000, deductions: 2500 },
];

// Classes
export const classes: ClassInfo[] = [
  { id: 'C001', name: 'Grade 9', section: 'A', teacherId: 'T001', subjects: ['S001', 'S002', 'S003', 'S006'], studentCount: 35, room: 'Room 101' },
  { id: 'C002', name: 'Grade 10', section: 'A', teacherId: 'T002', subjects: ['S001', 'S002', 'S003', 'S006'], studentCount: 32, room: 'Room 102' },
  { id: 'C003', name: 'Grade 9', section: 'B', teacherId: 'T003', subjects: ['S001', 'S002', 'S004', 'S006'], studentCount: 30, room: 'Room 103' },
  { id: 'C004', name: 'Grade 10', section: 'B', teacherId: 'T004', subjects: ['S001', 'S003', 'S004', 'S005'], studentCount: 28, room: 'Room 104' },
  { id: 'C005', name: 'Grade 8', section: 'A', teacherId: 'T005', subjects: ['S001', 'S002', 'S005', 'S007', 'S008'], studentCount: 38, room: 'Room 105' },
];

// Subjects
export const subjects: Subject[] = [
  { id: 'S001', name: 'Mathematics', code: 'MATH', teacherId: 'T001', classes: ['C001', 'C002', 'C003', 'C004', 'C005'] },
  { id: 'S002', name: 'English', code: 'ENG', teacherId: 'T002', classes: ['C001', 'C002', 'C003', 'C005'] },
  { id: 'S003', name: 'Physics', code: 'PHY', teacherId: 'T003', classes: ['C001', 'C002', 'C004'] },
  { id: 'S004', name: 'Chemistry', code: 'CHEM', teacherId: 'T004', classes: ['C003', 'C004'] },
  { id: 'S005', name: 'Computer Science', code: 'CS', teacherId: 'T005', classes: ['C004', 'C005'] },
  { id: 'S006', name: 'Biology', code: 'BIO', teacherId: 'T003', classes: ['C001', 'C002', 'C003'] },
  { id: 'S007', name: 'Urdu', code: 'URD', teacherId: 'T002', classes: ['C005'] },
  { id: 'S008', name: 'Pakistan Studies', code: 'PST', teacherId: 'T004', classes: ['C005'] },
];

// Students
export const students: Student[] = [
  { id: 'ST001', regNo: 'GGS-2024-001', name: 'Ali Hassan', classId: 'C002', section: 'A', gender: 'Male', parentName: 'Muhammad Hassan', phone: '0311-1111111', email: 'ali.hassan@student.demo', status: 'Active', admissionDate: '2023-04-01', dateOfBirth: '2009-05-15', address: '123 Main Street, Lahore' },
  { id: 'ST002', regNo: 'GGS-2024-002', name: 'Ayesha Fatima', classId: 'C002', section: 'A', gender: 'Female', parentName: 'Muhammad Fatima', phone: '0312-2222222', email: 'ayesha.fatima@student.demo', status: 'Active', admissionDate: '2023-04-01', dateOfBirth: '2009-07-22', address: '456 Garden Block, Lahore' },
  { id: 'ST003', regNo: 'GGS-2024-003', name: 'Omar Siddiqui', classId: 'C002', section: 'A', gender: 'Male', parentName: 'Tariq Siddiqui', phone: '0313-3333333', email: 'omar.siddiqui@student.demo', status: 'Active', admissionDate: '2023-04-01', dateOfBirth: '2009-03-10', address: '789 Model Town, Lahore' },
  { id: 'ST004', regNo: 'GGS-2024-004', name: 'Zainab Khan', classId: 'C001', section: 'A', gender: 'Female', parentName: 'Imran Khan', phone: '0314-4444444', email: 'zainab.khan@student.demo', status: 'Active', admissionDate: '2023-04-01', dateOfBirth: '2010-01-20', address: '321 Cantt Area, Lahore' },
  { id: 'ST005', regNo: 'GGS-2024-005', name: 'Hamza Ahmed', classId: 'C001', section: 'A', gender: 'Male', parentName: 'Ahmed Raza', phone: '0315-5555555', email: 'hamza.ahmed@student.demo', status: 'Active', admissionDate: '2023-04-01', dateOfBirth: '2010-09-05', address: '654 Johar Town, Lahore' },
  { id: 'ST006', regNo: 'GGS-2024-006', name: 'Sara Iqbal', classId: 'C003', section: 'B', gender: 'Female', parentName: 'Muhammad Iqbal', phone: '0316-6666666', email: 'sara.iqbal@student.demo', status: 'Active', admissionDate: '2023-04-01', dateOfBirth: '2010-11-12', address: '987 DHA Phase 5, Lahore' },
  { id: 'ST007', regNo: 'GGS-2024-007', name: 'Bilal Mahmood', classId: 'C003', section: 'B', gender: 'Male', parentName: 'Mahmood Ali', phone: '0317-7777777', email: 'bilal.mahmood@student.demo', status: 'Active', admissionDate: '2023-04-01', dateOfBirth: '2010-06-30', address: '147 Gulberg, Lahore' },
  { id: 'ST008', regNo: 'GGS-2024-008', name: 'Hira Nawaz', classId: 'C004', section: 'B', gender: 'Female', parentName: 'Nawaz Sharif', phone: '0318-8888888', email: 'hira.nawaz@student.demo', status: 'Active', admissionDate: '2023-04-01', dateOfBirth: '2009-08-18', address: '258 Bahria Town, Lahore' },
  { id: 'ST009', regNo: 'GGS-2024-009', name: 'Fahad Raza', classId: 'C004', section: 'B', gender: 'Male', parentName: 'Raza Muhammad', phone: '0319-9999999', email: 'fahad.raza@student.demo', status: 'Active', admissionDate: '2023-04-01', dateOfBirth: '2009-12-25', address: '369 Wapda Town, Lahore' },
  { id: 'ST010', regNo: 'GGS-2024-010', name: 'Maryam Aslam', classId: 'C005', section: 'A', gender: 'Female', parentName: 'Aslam Pervez', phone: '0320-0000000', email: 'maryam.aslam@student.demo', status: 'Active', admissionDate: '2023-04-01', dateOfBirth: '2011-02-14', address: '741 Township, Lahore' },
  { id: 'ST011', regNo: 'GGS-2024-011', name: 'Usman Ghani', classId: 'C005', section: 'A', gender: 'Male', parentName: 'Ghani Ahmad', phone: '0321-1112222', email: 'usman.ghani@student.demo', status: 'Active', admissionDate: '2023-04-01', dateOfBirth: '2011-04-08', address: '852 Cavalry Ground, Lahore' },
  { id: 'ST012', regNo: 'GGS-2024-012', name: 'Nadia Bukhari', classId: 'C001', section: 'A', gender: 'Female', parentName: 'Bukhari Ali', phone: '0322-3334444', email: 'nadia.bukhari@student.demo', status: 'Active', admissionDate: '2023-04-01', dateOfBirth: '2010-07-19', address: '963 Faisal Town, Lahore' },
  { id: 'ST013', regNo: 'GGS-2024-013', name: 'Kamran Yousaf', classId: 'C002', section: 'A', gender: 'Male', parentName: 'Yousaf Ali', phone: '0323-5556666', email: 'kamran.yousaf@student.demo', status: 'Active', admissionDate: '2023-04-01', dateOfBirth: '2009-10-03', address: '159 Muslim Town, Lahore' },
  { id: 'ST014', regNo: 'GGS-2024-014', name: 'Rabia Sultana', classId: 'C003', section: 'B', gender: 'Female', parentName: 'Sultana Begum', phone: '0324-7778888', email: 'rabia.sultana@student.demo', status: 'Active', admissionDate: '2023-04-01', dateOfBirth: '2010-03-28', address: '267 Iqbal Town, Lahore' },
  { id: 'ST015', regNo: 'GGS-2024-015', name: 'Tariq Jameel', classId: 'C004', section: 'B', gender: 'Male', parentName: 'Jameel Ahmad', phone: '0325-9990000', email: 'tariq.jameel@student.demo', status: 'Active', admissionDate: '2023-04-01', dateOfBirth: '2009-01-17', address: '378 Shahdara, Lahore' },
];

// Timetable
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const times = ['08:00 - 08:45', '08:50 - 09:35', '09:40 - 10:25', '10:45 - 11:30', '11:35 - 12:20', '12:25 - 01:10'];

export const timetable: TimetableEntry[] = [
  // Grade 10-A (C002)
  { id: 'TT001', day: 'Monday', time: '08:00 - 08:45', subjectId: 'S001', teacherId: 'T001', classId: 'C002', room: 'Room 102' },
  { id: 'TT002', day: 'Monday', time: '08:50 - 09:35', subjectId: 'S002', teacherId: 'T002', classId: 'C002', room: 'Room 102' },
  { id: 'TT003', day: 'Monday', time: '09:40 - 10:25', subjectId: 'S003', teacherId: 'T003', classId: 'C002', room: 'Lab 1' },
  { id: 'TT004', day: 'Monday', time: '10:45 - 11:30', subjectId: 'S006', teacherId: 'T003', classId: 'C002', room: 'Room 102' },
  { id: 'TT005', day: 'Tuesday', time: '08:00 - 08:45', subjectId: 'S002', teacherId: 'T002', classId: 'C002', room: 'Room 102' },
  { id: 'TT006', day: 'Tuesday', time: '08:50 - 09:35', subjectId: 'S001', teacherId: 'T001', classId: 'C002', room: 'Room 102' },
  { id: 'TT007', day: 'Tuesday', time: '09:40 - 10:25', subjectId: 'S006', teacherId: 'T003', classId: 'C002', room: 'Room 102' },
  { id: 'TT008', day: 'Tuesday', time: '10:45 - 11:30', subjectId: 'S003', teacherId: 'T003', classId: 'C002', room: 'Lab 1' },
  { id: 'TT009', day: 'Wednesday', time: '08:00 - 08:45', subjectId: 'S001', teacherId: 'T001', classId: 'C002', room: 'Room 102' },
  { id: 'TT010', day: 'Wednesday', time: '08:50 - 09:35', subjectId: 'S003', teacherId: 'T003', classId: 'C002', room: 'Lab 1' },
  { id: 'TT011', day: 'Wednesday', time: '09:40 - 10:25', subjectId: 'S002', teacherId: 'T002', classId: 'C002', room: 'Room 102' },
  { id: 'TT012', day: 'Wednesday', time: '10:45 - 11:30', subjectId: 'S006', teacherId: 'T003', classId: 'C002', room: 'Room 102' },
  { id: 'TT013', day: 'Thursday', time: '08:00 - 08:45', subjectId: 'S003', teacherId: 'T003', classId: 'C002', room: 'Lab 1' },
  { id: 'TT014', day: 'Thursday', time: '08:50 - 09:35', subjectId: 'S001', teacherId: 'T001', classId: 'C002', room: 'Room 102' },
  { id: 'TT015', day: 'Thursday', time: '09:40 - 10:25', subjectId: 'S006', teacherId: 'T003', classId: 'C002', room: 'Room 102' },
  { id: 'TT016', day: 'Thursday', time: '10:45 - 11:30', subjectId: 'S002', teacherId: 'T002', classId: 'C002', room: 'Room 102' },
  { id: 'TT017', day: 'Friday', time: '08:00 - 08:45', subjectId: 'S002', teacherId: 'T002', classId: 'C002', room: 'Room 102' },
  { id: 'TT018', day: 'Friday', time: '08:50 - 09:35', subjectId: 'S001', teacherId: 'T001', classId: 'C002', room: 'Room 102' },
  { id: 'TT019', day: 'Friday', time: '09:40 - 10:25', subjectId: 'S003', teacherId: 'T003', classId: 'C002', room: 'Lab 1' },
  { id: 'TT020', day: 'Friday', time: '10:45 - 11:30', subjectId: 'S006', teacherId: 'T003', classId: 'C002', room: 'Room 102' },
  // Grade 9-A (C001)
  { id: 'TT021', day: 'Monday', time: '08:00 - 08:45', subjectId: 'S001', teacherId: 'T001', classId: 'C001', room: 'Room 101' },
  { id: 'TT022', day: 'Monday', time: '08:50 - 09:35', subjectId: 'S002', teacherId: 'T002', classId: 'C001', room: 'Room 101' },
  { id: 'TT023', day: 'Monday', time: '09:40 - 10:25', subjectId: 'S003', teacherId: 'T003', classId: 'C001', room: 'Lab 1' },
  { id: 'TT024', day: 'Monday', time: '10:45 - 11:30', subjectId: 'S006', teacherId: 'T003', classId: 'C001', room: 'Room 101' },
  { id: 'TT025', day: 'Tuesday', time: '08:00 - 08:45', subjectId: 'S002', teacherId: 'T002', classId: 'C001', room: 'Room 101' },
  { id: 'TT026', day: 'Tuesday', time: '08:50 - 09:35', subjectId: 'S001', teacherId: 'T001', classId: 'C001', room: 'Room 101' },
  // Grade 8-A (C005)
  { id: 'TT027', day: 'Monday', time: '08:00 - 08:45', subjectId: 'S001', teacherId: 'T001', classId: 'C005', room: 'Room 105' },
  { id: 'TT028', day: 'Monday', time: '08:50 - 09:35', subjectId: 'S002', teacherId: 'T002', classId: 'C005', room: 'Room 105' },
  { id: 'TT029', day: 'Monday', time: '09:40 - 10:25', subjectId: 'S005', teacherId: 'T005', classId: 'C005', room: 'Computer Lab' },
  { id: 'TT030', day: 'Monday', time: '10:45 - 11:30', subjectId: 'S007', teacherId: 'T002', classId: 'C005', room: 'Room 105' },
];

// Generate attendance for last 30 days
export const attendanceRecords: AttendanceRecord[] = [];
const attendanceStatuses: ('Present' | 'Absent' | 'Late' | 'Leave')[] = ['Present', 'Present', 'Present', 'Present', 'Present', 'Present', 'Present', 'Present', 'Absent', 'Late'];

for (let d = 0; d < 30; d++) {
  const date = new Date(2026, 0, d + 1);
  if (date.getDay() === 0 || date.getDay() === 6) continue;
  const dateStr = date.toISOString().split('T')[0];
  students.forEach(student => {
    const status = attendanceStatuses[Math.floor(Math.random() * attendanceStatuses.length)];
    attendanceRecords.push({
      id: `ATT-${student.id}-${dateStr}`,
      studentId: student.id,
      classId: student.classId,
      date: dateStr,
      status,
    });
  });
}

// Exams
export const exams: Exam[] = [
  { id: 'EX001', name: 'Mid-Term Examination 2026', classId: 'C002', subjectId: 'S001', date: '2026-03-15', totalMarks: 100, passingMarks: 40, term: 'Mid-Term' },
  { id: 'EX002', name: 'Mid-Term Examination 2026', classId: 'C002', subjectId: 'S002', date: '2026-03-17', totalMarks: 100, passingMarks: 40, term: 'Mid-Term' },
  { id: 'EX003', name: 'Mid-Term Examination 2026', classId: 'C002', subjectId: 'S003', date: '2026-03-19', totalMarks: 100, passingMarks: 40, term: 'Mid-Term' },
  { id: 'EX004', name: 'Mid-Term Examination 2026', classId: 'C002', subjectId: 'S006', date: '2026-03-21', totalMarks: 100, passingMarks: 40, term: 'Mid-Term' },
  { id: 'EX005', name: 'Monthly Assessment - January', classId: 'C002', subjectId: 'S001', date: '2026-01-25', totalMarks: 50, passingMarks: 20, term: 'Monthly' },
  { id: 'EX006', name: 'Mid-Term Examination 2026', classId: 'C001', subjectId: 'S001', date: '2026-03-15', totalMarks: 100, passingMarks: 40, term: 'Mid-Term' },
  { id: 'EX007', name: 'Mid-Term Examination 2026', classId: 'C001', subjectId: 'S002', date: '2026-03-17', totalMarks: 100, passingMarks: 40, term: 'Mid-Term' },
];

// Marks
export const marks: Mark[] = [
  // Grade 10-A Mid-Term
  { id: 'M001', examId: 'EX001', studentId: 'ST001', subjectId: 'S001', obtained: 82, totalMarks: 100 },
  { id: 'M002', examId: 'EX001', studentId: 'ST002', subjectId: 'S001', obtained: 91, totalMarks: 100 },
  { id: 'M003', examId: 'EX001', studentId: 'ST003', subjectId: 'S001', obtained: 76, totalMarks: 100 },
  { id: 'M004', examId: 'EX001', studentId: 'ST013', subjectId: 'S001', obtained: 88, totalMarks: 100 },
  { id: 'M005', examId: 'EX002', studentId: 'ST001', subjectId: 'S002', obtained: 76, totalMarks: 100 },
  { id: 'M006', examId: 'EX002', studentId: 'ST002', subjectId: 'S002', obtained: 85, totalMarks: 100 },
  { id: 'M007', examId: 'EX002', studentId: 'ST003', subjectId: 'S002', obtained: 68, totalMarks: 100 },
  { id: 'M008', examId: 'EX002', studentId: 'ST013', subjectId: 'S002', obtained: 79, totalMarks: 100 },
  { id: 'M009', examId: 'EX003', studentId: 'ST001', subjectId: 'S003', obtained: 88, totalMarks: 100 },
  { id: 'M010', examId: 'EX003', studentId: 'ST002', subjectId: 'S003', obtained: 72, totalMarks: 100 },
  { id: 'M011', examId: 'EX003', studentId: 'ST003', subjectId: 'S003', obtained: 94, totalMarks: 100 },
  { id: 'M012', examId: 'EX003', studentId: 'ST013', subjectId: 'S003', obtained: 81, totalMarks: 100 },
  { id: 'M013', examId: 'EX004', studentId: 'ST001', subjectId: 'S006', obtained: 79, totalMarks: 100 },
  { id: 'M014', examId: 'EX004', studentId: 'ST002', subjectId: 'S006', obtained: 93, totalMarks: 100 },
  { id: 'M015', examId: 'EX004', studentId: 'ST003', subjectId: 'S006', obtained: 65, totalMarks: 100 },
  { id: 'M016', examId: 'EX004', studentId: 'ST013', subjectId: 'S006', obtained: 87, totalMarks: 100 },
  // Monthly
  { id: 'M017', examId: 'EX005', studentId: 'ST001', subjectId: 'S001', obtained: 42, totalMarks: 50 },
  { id: 'M018', examId: 'EX005', studentId: 'ST002', subjectId: 'S001', obtained: 47, totalMarks: 50 },
  { id: 'M019', examId: 'EX005', studentId: 'ST003', subjectId: 'S001', obtained: 38, totalMarks: 50 },
  { id: 'M020', examId: 'EX005', studentId: 'ST013', subjectId: 'S001', obtained: 44, totalMarks: 50 },
];

// Fee Records
export const feeRecords: FeeRecord[] = [];
const months = ['January', 'February', 'March', 'April', 'May', 'June'];
students.forEach(student => {
  months.forEach((month, idx) => {
    const amount = 10000;
    let paid = 0;
    let status: 'Paid' | 'Partial' | 'Unpaid' = 'Unpaid';
    let paymentMethod: 'Cash' | 'Bank' | 'Online Transfer' | undefined;
    let paymentDate: string | undefined;

    if (idx < 2) {
      paid = amount;
      status = 'Paid';
      paymentMethod = idx === 0 ? 'Bank' : 'Online Transfer';
      paymentDate = `2026-0${idx + 1}-10`;
    } else if (idx === 2) {
      paid = 7000;
      status = 'Partial';
      paymentMethod = 'Cash';
      paymentDate = '2026-03-05';
    }

    feeRecords.push({
      id: `FEE-${student.id}-${month}`,
      studentId: student.id,
      month,
      year: 2026,
      amount,
      paid,
      dueDate: `2026-0${idx + 1}-15`,
      status,
      paymentMethod,
      paymentDate,
    });
  });
});

// Salary Records
export const salaryRecords: SalaryRecord[] = [];
teachers.forEach(teacher => {
  ['January', 'February', 'March'].forEach((month, idx) => {
    const net = teacher.baseSalary + teacher.allowances - teacher.deductions;
    salaryRecords.push({
      id: `SAL-${teacher.id}-${month}`,
      teacherId: teacher.id,
      month,
      year: 2026,
      baseSalary: teacher.baseSalary,
      allowances: teacher.allowances,
      deductions: teacher.deductions,
      netSalary: net,
      status: idx < 2 ? 'Paid' : 'Pending',
      paidDate: idx < 2 ? `2026-0${idx + 1}-28` : undefined,
    });
  });
});

// Notifications
export const notifications: Notification[] = [
  { id: 'N001', title: 'Parent-Teacher Meeting', message: 'A parent-teacher meeting is scheduled for March 25, 2026. All parents are requested to attend.', date: '2026-03-10', expiry: '2026-03-26', isPublic: true, targetRole: 'all' },
  { id: 'N002', title: 'Annual Sports Day', message: 'Annual Sports Day will be held on April 5, 2026. Students are requested to participate in various events.', date: '2026-03-08', expiry: '2026-04-06', isPublic: true, targetRole: 'all' },
  { id: 'N003', title: 'Mid-Term Examination Schedule', message: 'Mid-term examinations will commence from March 15, 2026. Detailed schedule has been shared with class teachers.', date: '2026-03-05', expiry: '2026-03-22', isPublic: false, targetRole: 'all' },
  { id: 'N004', title: 'School Holiday Notice', message: 'School will remain closed on March 23 (Pakistan Day observance) and will reopen on March 24.', date: '2026-03-01', expiry: '2026-03-24', isPublic: true, targetRole: 'all' },
  { id: 'N005', title: 'Fee Payment Reminder', message: 'Parents are reminded to clear outstanding fee balances before March 15, 2026 to avoid late fee charges.', date: '2026-03-01', expiry: '2026-03-15', isPublic: false, targetRole: 'student' },
  { id: 'N006', title: 'New Computer Lab Inauguration', message: 'We are pleased to announce the inauguration of our new state-of-the-art computer lab on March 20, 2026.', date: '2026-02-28', expiry: '2026-03-21', isPublic: true, targetRole: 'all' },
  { id: 'N007', title: 'Staff Meeting', message: 'All teaching staff is requested to attend the monthly staff meeting on March 12 at 2:00 PM in the conference room.', date: '2026-03-08', expiry: '2026-03-13', isPublic: false, targetRole: 'teacher' },
  { id: 'N008', title: 'Science Fair 2026', message: 'Annual Science Fair registrations are now open. Last date to register is March 30, 2026.', date: '2026-03-12', expiry: '2026-03-31', isPublic: false, targetRole: 'student' },
  { id: 'N009', title: 'Library Book Return', message: 'Students who have borrowed library books are requested to return them before March 20, 2026.', date: '2026-03-11', expiry: '2026-03-20', isPublic: false, targetRole: 'student' },
  { id: 'N010', title: 'Report Card Distribution', message: 'Mid-term examination report cards will be distributed on March 28, 2026 during parent-teacher meeting.', date: '2026-03-14', expiry: '2026-03-29', isPublic: false, targetRole: 'all' },
];

// Activities
export const activities: Activity[] = [
  { id: 'A001', type: 'student', message: 'New student Maryam Aslam admitted to Grade 8-A', timestamp: '2026-03-14 09:30', user: 'Admin' },
  { id: 'A002', type: 'attendance', message: 'Attendance submitted for Grade 10-A by Mr. Ahmed Khan', timestamp: '2026-03-14 08:15', user: 'Mr. Ahmed Khan' },
  { id: 'A003', type: 'exam', message: 'Mid-Term marks uploaded for Mathematics (Grade 10-A)', timestamp: '2026-03-13 14:20', user: 'Mr. Ahmed Khan' },
  { id: 'A004', type: 'fee', message: 'Fee payment received from Ali Hassan - Rs. 7,000', timestamp: '2026-03-13 11:45', user: 'Admin' },
  { id: 'A005', type: 'notification', message: 'New notification published: Report Card Distribution', timestamp: '2026-03-14 10:00', user: 'Admin' },
  { id: 'A006', type: 'attendance', message: 'Attendance submitted for Grade 9-A by Ms. Sara Malik', timestamp: '2026-03-14 08:20', user: 'Ms. Sara Malik' },
  { id: 'A007', type: 'fee', message: 'Fee payment received from Ayesha Fatima - Rs. 10,000', timestamp: '2026-03-12 16:30', user: 'Admin' },
  { id: 'A008', type: 'exam', message: 'Monthly Assessment marks uploaded for English (Grade 10-A)', timestamp: '2026-03-11 13:10', user: 'Ms. Sara Malik' },
];
