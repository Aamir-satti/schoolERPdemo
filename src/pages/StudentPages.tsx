import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { DashboardLayout, Card, StatCard, PageHeader, Button, Badge, EmptyState } from '../components/UI';
import { BookOpen, Calendar, CheckCircle, DollarSign, Clock, Download, FileText, Bell } from 'lucide-react';
import { generateResultCard, generateFeeChallan, generateAttendanceReport } from '../utils/pdf';

// Helper: get student based on login
function useStudent() {
  const { user, students, teachers, classes, subjects, timetable, attendance, marks, exams, fees, notifications } = useApp();
  const student = students.find(s => s.email === user?.email) || students[0];
  const cls = classes.find(c => c.id === student.classId);
  const teacher = teachers.find(t => t.id === cls?.teacherId);
  return { student, cls, teacher, classes, subjects, timetable, attendance, marks, exams, fees, notifications, students, teachers };
}

// ===== STUDENT DASHBOARD =====
export function StudentDashboard() {
  const { student, cls, attendance, fees, marks, exams, timetable, subjects } = useStudent();
  const myAttendance = attendance.filter(a => a.studentId === student.id);
  const present = myAttendance.filter(a => a.status === 'Present' || a.status === 'Late').length;
  const attPct = myAttendance.length > 0 ? Math.round((present / myAttendance.length) * 100) : 91;

  const outstandingFees = fees.filter(f => f.studentId === student.id).reduce((s, f) => s + (f.amount - f.paid), 0);

  const today = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()];
  const todayEntries = timetable.filter(t => t.classId === student.classId && t.day === today);
  const nextClass = todayEntries[0];

  const latestExam = exams.filter(e => e.classId === student.classId)[0];
  const latestMarks = latestExam ? marks.filter(m => m.examId === latestExam.id && m.studentId === student.id) : [];
  const latestPct = latestMarks.length > 0 ? Math.round(latestMarks.reduce((s, m) => s + m.obtained, 0) / latestMarks.reduce((s, m) => s + m.totalMarks, 0) * 100) : 0;

  return (
    <DashboardLayout>
      <PageHeader title={`Welcome, ${student.name}`} subtitle={`${cls?.name} - ${cls?.section} | Roll No: ${student.regNo}`} />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Attendance" value={`${attPct}%`} icon={<CheckCircle size={20} className="text-green-600" />} color="bg-green-100" subtitle={`${present}/${myAttendance.length} days`} />
        <StatCard title="Class" value={`${cls?.name}-${cls?.section}`} icon={<BookOpen size={20} className="text-blue-600" />} color="bg-blue-100" subtitle={`Room: ${cls?.room}`} />
        <StatCard title="Latest Result" value={`${latestPct}%`} icon={<FileText size={20} className="text-purple-600" />} color="bg-purple-100" subtitle={latestExam?.name?.split(' ').slice(0, 2).join(' ')} />
        <StatCard title="Outstanding Fee" value={`Rs. ${outstandingFees.toLocaleString()}`} icon={<DollarSign size={20} className="text-red-600" />} color="bg-red-100" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><Clock size={18} /> Today's Classes</h3>
          {todayEntries.length > 0 ? (
            <div className="space-y-3">
              {todayEntries.map(e => (
                <div key={e.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-14 text-center">
                    <p className="text-xs font-bold text-green-600">{e.time.split(' - ')[0]}</p>
                    <p className="text-xs text-gray-400">{e.time.split(' - ')[1]}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{subjects.find(s => s.id === e.subjectId)?.name}</p>
                    <p className="text-sm text-gray-500">{e.room}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message="No classes today" subMessage="Enjoy your day off!" />
          )}
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <a href="/student/attendance" className="p-4 bg-green-50 rounded-lg text-center hover:bg-green-100 transition">
              <CheckCircle className="mx-auto text-green-600 mb-2" size={24} />
              <p className="text-sm font-medium text-gray-700">View Attendance</p>
            </a>
            <a href="/student/timetable" className="p-4 bg-blue-50 rounded-lg text-center hover:bg-blue-100 transition">
              <Calendar className="mx-auto text-blue-600 mb-2" size={24} />
              <p className="text-sm font-medium text-gray-700">View Timetable</p>
            </a>
            <a href="/student/results" className="p-4 bg-purple-50 rounded-lg text-center hover:bg-purple-100 transition">
              <FileText className="mx-auto text-purple-600 mb-2" size={24} />
              <p className="text-sm font-medium text-gray-700">View Results</p>
            </a>
            <a href="/student/fees" className="p-4 bg-yellow-50 rounded-lg text-center hover:bg-yellow-100 transition">
              <DollarSign className="mx-auto text-yellow-600 mb-2" size={24} />
              <p className="text-sm font-medium text-gray-700">Fee Challans</p>
            </a>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

// ===== STUDENT PROFILE =====
export function StudentProfile() {
  const { student, cls, teacher } = useStudent();
  return (
    <DashboardLayout>
      <PageHeader title="My Profile" />
      <Card className="p-6">
        <div className="flex items-start gap-6 mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-700 text-2xl font-bold">
            {student.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{student.name}</h2>
            <p className="text-gray-500">{student.regNo}</p>
            <Badge variant="success">{student.status}</Badge>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            ['Class', `${cls?.name} - ${cls?.section}`],
            ['Section', student.section],
            ['Gender', student.gender],
            ['Date of Birth', student.dateOfBirth],
            ['Parent/Guardian', student.parentName],
            ['Phone', student.phone],
            ['Email', student.email],
            ['Address', student.address],
            ['Admission Date', student.admissionDate],
            ['Class Teacher', teacher?.name || 'N/A'],
            ['Room', cls?.room || 'N/A'],
          ].map(([label, value], i) => (
            <div key={i} className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">{label}</p>
              <p className="font-medium text-gray-800 text-sm">{value}</p>
            </div>
          ))}
        </div>
      </Card>
    </DashboardLayout>
  );
}

// ===== STUDENT TIMETABLE =====
export function StudentTimetable() {
  const { student, timetable, subjects, teachers } = useStudent();
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const times = ['08:00 - 08:45', '08:50 - 09:35', '09:40 - 10:25', '10:45 - 11:30', '11:35 - 12:20', '12:25 - 01:10'];
  const myEntries = timetable.filter(t => t.classId === student.classId);

  return (
    <DashboardLayout>
      <PageHeader title="My Timetable" subtitle="Weekly class schedule" />
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-green-50">
                <th className="border px-3 py-2 text-left text-xs font-medium text-gray-600 w-28">Day / Time</th>
                {times.map(t => <th key={t} className="border px-2 py-2 text-center text-xs font-medium text-gray-600">{t}</th>)}
              </tr>
            </thead>
            <tbody>
              {days.map(day => (
                <tr key={day}>
                  <td className="border px-3 py-3 font-medium text-gray-700 bg-gray-50">{day}</td>
                  {times.map(time => {
                    const entry = myEntries.find(t => t.day === day && t.time === time);
                    return (
                      <td key={time} className="border px-2 py-2 text-center">
                        {entry ? (
                          <div>
                            <p className="font-medium text-green-700 text-xs">{subjects.find(s => s.id === entry.subjectId)?.name}</p>
                            <p className="text-xs text-gray-500">{teachers.find(t => t.id === entry.teacherId)?.name?.split(' ').pop()}</p>
                            <p className="text-xs text-gray-400">{entry.room}</p>
                          </div>
                        ) : <span className="text-gray-300 text-xs">—</span>}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardLayout>
  );
}

// ===== STUDENT ATTENDANCE =====
export function StudentAttendance() {
  const { student, attendance, cls } = useStudent();
  const myRecords = attendance.filter(a => a.studentId === student.id);
  const present = myRecords.filter(r => r.status === 'Present').length;
  const absent = myRecords.filter(r => r.status === 'Absent').length;
  const late = myRecords.filter(r => r.status === 'Late').length;
  const leave = myRecords.filter(r => r.status === 'Leave').length;
  const total = myRecords.length;
  const pct = total > 0 ? Math.round(((present + late) / total) * 100) : 0;

  const handleDownload = () => {
    generateAttendanceReport(student.name, myRecords, `${cls?.name} ${cls?.section}`);
  };

  return (
    <DashboardLayout>
      <PageHeader title="My Attendance" subtitle="Attendance record overview" action={<Button size="sm" onClick={handleDownload}><Download size={14} className="mr-1" /> Download Report</Button>} />

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-xl text-center border border-green-100">
          <p className="text-3xl font-bold text-green-600">{pct}%</p>
          <p className="text-sm text-gray-500">Overall</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-xl text-center"><p className="text-2xl font-bold text-blue-600">{present}</p><p className="text-sm text-gray-500">Present</p></div>
        <div className="bg-red-50 p-4 rounded-xl text-center"><p className="text-2xl font-bold text-red-600">{absent}</p><p className="text-sm text-gray-500">Absent</p></div>
        <div className="bg-yellow-50 p-4 rounded-xl text-center"><p className="text-2xl font-bold text-yellow-600">{late}</p><p className="text-sm text-gray-500">Late</p></div>
        <div className="bg-purple-50 p-4 rounded-xl text-center"><p className="text-2xl font-bold text-purple-600">{leave}</p><p className="text-sm text-gray-500">Leave</p></div>
      </div>

      <Card>
        <div className="p-4 border-b"><h3 className="font-semibold text-gray-700">Attendance History (Last 30 Days)</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Day</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {myRecords.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 30).map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{r.date}</td>
                  <td className="px-4 py-3">{new Date(r.date).toLocaleDateString('en', { weekday: 'long' })}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={r.status === 'Present' ? 'success' : r.status === 'Absent' ? 'danger' : r.status === 'Late' ? 'warning' : 'info'}>{r.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardLayout>
  );
}

// ===== STUDENT RESULTS =====
export function StudentResults() {
  const { student, marks, exams, subjects, cls } = useStudent();
  const myExams = exams.filter(e => e.classId === student.classId);
  const examGroups = useMemo(() => {
    const groups: Record<string, typeof myExams> = {};
    myExams.forEach(e => {
      const key = `${e.name}-${e.term}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(e);
    });
    return groups;
  }, [myExams]);

  const handleDownload = (examName: string, examMarks: typeof marks) => {
    const subjectNames = new Map(subjects.map(s => [s.id, s.name]));
    generateResultCard(student, examMarks, examName, subjectNames);
  };

  return (
    <DashboardLayout>
      <PageHeader title="My Results" subtitle="Examination results and performance" />
      {Object.entries(examGroups).map(([key, groupExams]) => {
        const examMarks = groupExams.flatMap(e => marks.filter(m => m.examId === e.id && m.studentId === student.id));
        if (examMarks.length === 0) return null;
        const totalObtained = examMarks.reduce((s, m) => s + m.obtained, 0);
        const totalMarks = examMarks.reduce((s, m) => s + m.totalMarks, 0);
        const pct = Math.round((totalObtained / totalMarks) * 100);
        const grade = pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B+' : pct >= 60 ? 'B' : pct >= 50 ? 'C' : pct >= 40 ? 'D' : 'F';

        return (
          <Card key={key} className="mb-4">
            <div className="p-4 border-b flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-800">{groupExams[0].name}</h3>
                <p className="text-sm text-gray-500">Total: {totalObtained}/{totalMarks} | {pct}% | Grade: {grade}</p>
              </div>
              <Button size="sm" onClick={() => handleDownload(groupExams[0].name, examMarks)}>
                <Download size={14} className="mr-1" /> Result Card
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Subject</th>
                    <th className="text-center px-4 py-3 font-medium text-gray-600">Total</th>
                    <th className="text-center px-4 py-3 font-medium text-gray-600">Obtained</th>
                    <th className="text-center px-4 py-3 font-medium text-gray-600">Percentage</th>
                    <th className="text-center px-4 py-3 font-medium text-gray-600">Grade</th>
                    <th className="text-center px-4 py-3 font-medium text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {examMarks.map(m => {
                    const subjectPct = Math.round((m.obtained / m.totalMarks) * 100);
                    const subjectGrade = subjectPct >= 90 ? 'A+' : subjectPct >= 80 ? 'A' : subjectPct >= 70 ? 'B+' : subjectPct >= 60 ? 'B' : subjectPct >= 50 ? 'C' : subjectPct >= 40 ? 'D' : 'F';
                    return (
                      <tr key={m.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{subjects.find(s => s.id === m.subjectId)?.name}</td>
                        <td className="px-4 py-3 text-center">{m.totalMarks}</td>
                        <td className="px-4 py-3 text-center">{m.obtained}</td>
                        <td className="px-4 py-3 text-center">{subjectPct}%</td>
                        <td className="px-4 py-3 text-center"><Badge variant={subjectPct >= 40 ? 'success' : 'danger'}>{subjectGrade}</Badge></td>
                        <td className="px-4 py-3 text-center"><Badge variant={subjectPct >= 40 ? 'success' : 'danger'}>{subjectPct >= 40 ? 'Pass' : 'Fail'}</Badge></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        );
      })}
      {Object.values(examGroups).every(g => marks.filter(m => g.some(e => e.id === m.examId) && m.studentId === student.id).length === 0) && (
        <Card className="p-8"><EmptyState message="No results available yet" subMessage="Results will appear here once exams are evaluated." /></Card>
      )}
    </DashboardLayout>
  );
}

// ===== STUDENT FEES =====
export function StudentFees() {
  const { student, fees, cls } = useStudent();
  const myFees = fees.filter(f => f.studentId === student.id);
  const totalAmount = myFees.reduce((s, f) => s + f.amount, 0);
  const totalPaid = myFees.reduce((s, f) => s + f.paid, 0);
  const totalDue = totalAmount - totalPaid;

  const handleDownloadChallan = (fee: typeof myFees[0]) => {
    generateFeeChallan(student, fee);
  };

  return (
    <DashboardLayout>
      <PageHeader title="Fee Challans" subtitle="Fee payment history and challans" />

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-xl text-center border border-green-100">
          <p className="text-2xl font-bold text-green-600">Rs. {totalPaid.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Total Paid</p>
        </div>
        <div className="bg-red-50 p-4 rounded-xl text-center border border-red-100">
          <p className="text-2xl font-bold text-red-600">Rs. {totalDue.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Outstanding</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-xl text-center border border-blue-100">
          <p className="text-2xl font-bold text-blue-600">Rs. {totalAmount.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Total Fees</p>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Month</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Amount</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Paid</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Balance</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {myFees.map(f => (
                <tr key={f.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{f.month} {f.year}</td>
                  <td className="px-4 py-3 text-right">Rs. {f.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-green-600">Rs. {f.paid.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-red-600">Rs. {(f.amount - f.paid).toLocaleString()}</td>
                  <td className="px-4 py-3 text-center"><Badge variant={f.status === 'Paid' ? 'success' : f.status === 'Partial' ? 'warning' : 'danger'}>{f.status}</Badge></td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => handleDownloadChallan(f)} className="text-xs text-blue-600 hover:underline flex items-center gap-1 mx-auto">
                      <Download size={12} /> Challan
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardLayout>
  );
}

// ===== STUDENT NOTIFICATIONS =====
export function StudentNotifications() {
  const { notifications } = useStudent();
  const relevant = notifications.filter(n => n.isPublic || n.targetRole === 'student' || n.targetRole === 'all');

  return (
    <DashboardLayout>
      <PageHeader title="Notifications" subtitle={`${relevant.length} notifications`} />
      <div className="space-y-3">
        {relevant.map(n => (
          <Card key={n.id} className="p-4 hover:shadow-sm transition">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Bell size={18} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{n.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{n.message}</p>
                <p className="text-xs text-gray-400 mt-2">{n.date}</p>
              </div>
            </div>
          </Card>
        ))}
        {relevant.length === 0 && <Card className="p-8"><EmptyState message="No notifications" subMessage="You're all caught up!" /></Card>}
      </div>
    </DashboardLayout>
  );
}
