import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { DashboardLayout, Card, StatCard, PageHeader, Button, Modal, Input, Select, Badge, EmptyState, Toast } from '../components/UI';
import { Users, BookOpen, Calendar, CheckCircle, Upload, Save, Download } from 'lucide-react';
import { generateAttendanceReport } from '../utils/pdf';

// ===== TEACHER DASHBOARD =====
export function TeacherDashboard() {
  const { user, students, teachers, classes, timetable, attendance, subjects } = useApp();
  const teacher = teachers.find(t => t.email === user?.email) || teachers[0];
  const myClasses = classes.filter(c => teacher.classes.includes(c.id));
  const myStudents = students.filter(s => teacher.classes.includes(s.classId) && s.status === 'Active');
  const today = new Date().toISOString().split('T')[0];
  const todayEntries = timetable.filter(t => t.teacherId === teacher.id && t.day === ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()]);
  const nextClass = todayEntries[0];

  const todayAtt = attendance.filter(a => a.date === today && myClasses.some(c => c.id === a.classId));
  const presentToday = todayAtt.filter(a => a.status === 'Present' || a.status === 'Late').length;
  const attPct = todayAtt.length > 0 ? Math.round((presentToday / todayAtt.length) * 100) : 0;

  return (
    <DashboardLayout>
      <PageHeader title="Teacher Dashboard" subtitle={`Welcome, ${teacher.name}`} />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="My Classes" value={myClasses.length} icon={<BookOpen size={20} className="text-blue-600" />} color="bg-blue-100" />
        <StatCard title="My Students" value={myStudents.length} icon={<Users size={20} className="text-green-600" />} color="bg-green-100" />
        <StatCard title="Today's Attendance" value={`${attPct}%`} icon={<CheckCircle size={20} className="text-emerald-600" />} color="bg-emerald-100" />
        <StatCard title="Subjects" value={teacher.subject} icon={<Calendar size={20} className="text-purple-600" />} color="bg-purple-100" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Today's Schedule</h3>
          {todayEntries.length > 0 ? (
            <div className="space-y-3">
              {todayEntries.map(e => (
                <div key={e.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 font-bold text-xs">{e.time.split(' - ')[0]}</div>
                  <div>
                    <p className="font-medium text-gray-800">{subjects.find(s => s.id === e.subjectId)?.name}</p>
                    <p className="text-sm text-gray-500">{classes.find(c => c.id === e.classId)?.name} {classes.find(c => c.id === e.classId)?.section} • {e.room}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message="No classes scheduled for today" />
          )}
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold text-gray-800 mb-4">My Classes Overview</h3>
          <div className="space-y-3">
            {myClasses.map(c => {
              const count = students.filter(s => s.classId === c.id && s.status === 'Active').length;
              return (
                <div key={c.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{c.name} - {c.section}</p>
                    <p className="text-sm text-gray-500">{c.room}</p>
                  </div>
                  <Badge variant="info">{count} students</Badge>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

// ===== TEACHER CLASSES =====
export function TeacherClasses() {
  const { user, teachers, classes, students, subjects } = useApp();
  const teacher = teachers.find(t => t.email === user?.email) || teachers[0];
  const myClasses = classes.filter(c => teacher.classes.includes(c.id));

  return (
    <DashboardLayout>
      <PageHeader title="My Classes" subtitle={`${myClasses.length} classes assigned`} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {myClasses.map(c => {
          const count = students.filter(s => s.classId === c.id && s.status === 'Active').length;
          const classSubjects = subjects.filter(s => c.subjects.includes(s.id));
          return (
            <Card key={c.id} className="p-5">
              <h3 className="font-bold text-lg text-gray-800">{c.name} - {c.section}</h3>
              <p className="text-sm text-gray-500 mt-1">Room: {c.room}</p>
              <p className="text-sm text-gray-500">Students: {count}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {classSubjects.map(s => <Badge key={s.id} variant="default">{s.name}</Badge>)}
              </div>
            </Card>
          );
        })}
      </div>
    </DashboardLayout>
  );
}

// ===== TEACHER STUDENTS =====
export function TeacherStudents() {
  const { user, teachers, students, classes } = useApp();
  const teacher = teachers.find(t => t.email === user?.email) || teachers[0];
  const [selectedClass, setSelectedClass] = useState(teacher.classes[0] || '');
  const classStudents = students.filter(s => s.classId === selectedClass && s.status === 'Active');

  return (
    <DashboardLayout>
      <PageHeader title="Students" subtitle={`${classStudents.length} students`} />
      <Card className="p-4 mb-4">
        <Select label="Select Class" value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
          {teacher.classes.map(cId => { const c = classes.find(cl => cl.id === cId); return <option key={cId} value={cId}>{c?.name} {c?.section}</option>; })}
        </Select>
      </Card>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Reg No</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Gender</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Parent</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Phone</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {classStudents.map(s => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">{s.regNo}</td>
                  <td className="px-4 py-3 font-medium">{s.name}</td>
                  <td className="px-4 py-3 hidden md:table-cell">{s.gender}</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-gray-600">{s.parentName}</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-gray-600">{s.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {classStudents.length === 0 && <EmptyState message="No students in this class" />}
        </div>
      </Card>
    </DashboardLayout>
  );
}

// ===== TEACHER TIMETABLE =====
export function TeacherTimetable() {
  const { user, teachers, timetable, subjects, classes } = useApp();
  const teacher = teachers.find(t => t.email === user?.email) || teachers[0];
  const myEntries = timetable.filter(t => t.teacherId === teacher.id);
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const times = ['08:00 - 08:45', '08:50 - 09:35', '09:40 - 10:25', '10:45 - 11:30', '11:35 - 12:20', '12:25 - 01:10'];

  return (
    <DashboardLayout>
      <PageHeader title="My Timetable" subtitle={`${teacher.name}'s weekly schedule`} />
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-blue-50">
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
                            <p className="font-medium text-blue-700 text-xs">{classes.find(c => c.id === entry.classId)?.name}-{classes.find(c => c.id === entry.classId)?.section}</p>
                            <p className="text-xs text-gray-500">{entry.room}</p>
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

// ===== TEACHER ATTENDANCE =====
export function TeacherAttendance() {
  const { user, teachers, students, classes, attendance, saveAttendance } = useApp();
  const teacher = teachers.find(t => t.email === user?.email) || teachers[0];
  const [selectedClass, setSelectedClass] = useState(teacher.classes[0] || '');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState<Record<string, 'Present' | 'Absent' | 'Late' | 'Leave'>>({});
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const classStudents = students.filter(s => s.classId === selectedClass && s.status === 'Active');

  React.useEffect(() => {
    const existing = attendance.filter(a => a.classId === selectedClass && a.date === selectedDate);
    const data: Record<string, 'Present' | 'Absent' | 'Late' | 'Leave'> = {};
    existing.forEach(a => { data[a.studentId] = a.status; });
    classStudents.forEach(s => { if (!data[s.id]) data[s.id] = 'Present'; });
    setAttendanceData(data);
  }, [selectedClass, selectedDate]);

  const handleSave = () => {
    const records = Object.entries(attendanceData).map(([studentId, status]) => ({ studentId, status }));
    saveAttendance(selectedClass, selectedDate, records);
    setToast({ message: 'Attendance saved successfully!', type: 'success' });
  };

  const markAll = (status: 'Present' | 'Absent') => {
    const data = { ...attendanceData };
    classStudents.forEach(s => { data[s.id] = status; });
    setAttendanceData(data);
  };

  return (
    <DashboardLayout>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <PageHeader title="Mark Attendance" subtitle="Record daily student attendance" />

      <Card className="p-4 mb-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <Select label="Class" value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
            {teacher.classes.map(cId => { const c = classes.find(cl => cl.id === cId); return <option key={cId} value={cId}>{c?.name} {c?.section}</option>; })}
          </Select>
          <Input label="Date" type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
        </div>
        <div className="flex gap-2 mt-3">
          <Button size="sm" variant="secondary" onClick={() => markAll('Present')}>Mark All Present</Button>
          <Button size="sm" variant="secondary" onClick={() => markAll('Absent')}>Mark All Absent</Button>
        </div>
      </Card>

      <Card>
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold text-gray-700">{classStudents.length} Students</h3>
          <Button onClick={handleSave} size="sm"><Save size={14} className="mr-1" /> Save</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">#</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Student</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Present</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Absent</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Late</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Leave</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {classStudents.map((s, idx) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-400">{idx + 1}</td>
                  <td className="px-4 py-3 font-medium">{s.name}</td>
                  {(['Present', 'Absent', 'Late', 'Leave'] as const).map(status => (
                    <td key={status} className="px-4 py-3 text-center">
                      <input type="radio" name={`att-${s.id}`} checked={attendanceData[s.id] === status} onChange={() => setAttendanceData({ ...attendanceData, [s.id]: status })}
                        className={`w-4 h-4 ${status === 'Present' ? 'text-green-600' : status === 'Absent' ? 'text-red-600' : 'text-yellow-600'} focus:ring-2`} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardLayout>
  );
}

// ===== TEACHER MARKS ENTRY =====
export function TeacherMarks() {
  const { user, teachers, students, classes, subjects, exams, marks, saveMarks } = useApp();
  const teacher = teachers.find(t => t.email === user?.email) || teachers[0];
  const myExams = exams.filter(e => teacher.classes.includes(e.classId));
  const [selectedExam, setSelectedExam] = useState(myExams[0]?.id || '');
  const [marksData, setMarksData] = useState<Record<string, number>>({});
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [csvModal, setCsvModal] = useState(false);

  const exam = myExams.find(e => e.id === selectedExam);
  const examStudents = exam ? students.filter(s => s.classId === exam.classId && s.status === 'Active') : [];
  const existingMarks = marks.filter(m => m.examId === selectedExam);

  React.useEffect(() => {
    const data: Record<string, number> = {};
    examStudents.forEach(s => {
      const existing = existingMarks.find(m => m.studentId === s.id);
      data[s.id] = existing?.obtained || 0;
    });
    setMarksData(data);
  }, [selectedExam]);

  const handleSave = () => {
    if (!exam) return;
    const data = examStudents.map(s => ({ studentId: s.id, subjectId: exam.subjectId, obtained: marksData[s.id] || 0, totalMarks: exam.totalMarks }));
    saveMarks(selectedExam, data);
    setToast({ message: 'Marks saved successfully!', type: 'success' });
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const lines = text.split('\n').slice(1);
      const data = { ...marksData };
      let imported = 0;
      lines.forEach(line => {
        const parts = line.split(',');
        if (parts.length >= 2) {
          const studentId = parts[0].trim();
          const obtained = parseInt(parts[1].trim());
          if (studentId && !isNaN(obtained)) {
            data[studentId] = obtained;
            imported++;
          }
        }
      });
      setMarksData(data);
      setToast({ message: `Imported ${imported} records from CSV.`, type: 'success' });
      setCsvModal(false);
    };
    reader.readAsText(file);
  };

  return (
    <DashboardLayout>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <PageHeader title="Enter Marks" subtitle="Record examination marks" action={
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => setCsvModal(true)}><Upload size={14} className="mr-1" /> CSV Upload</Button>
          <Button size="sm" onClick={handleSave}><Save size={14} className="mr-1" /> Save Marks</Button>
        </div>
      } />

      <Card className="p-4 mb-4">
        <Select label="Select Exam" value={selectedExam} onChange={e => setSelectedExam(e.target.value)}>
          {myExams.map(e => <option key={e.id} value={e.id}>{e.name} - {subjects.find(s => s.id === e.subjectId)?.name}</option>)}
        </Select>
      </Card>

      {exam && (
        <Card>
          <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-700">{exam.name}</p>
              <p className="text-sm text-gray-500">Total Marks: {exam.totalMarks} | Passing: {exam.passingMarks}</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">#</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Student</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">Total Marks</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">Obtained</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">%</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {examStudents.map((s, idx) => {
                  const obtained = marksData[s.id] || 0;
                  const pct = Math.round((obtained / exam.totalMarks) * 100);
                  const grade = pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B+' : pct >= 60 ? 'B' : pct >= 50 ? 'C' : pct >= 40 ? 'D' : 'F';
                  return (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-400">{idx + 1}</td>
                      <td className="px-4 py-3 font-medium">{s.name}</td>
                      <td className="px-4 py-3 text-center">{exam.totalMarks}</td>
                      <td className="px-4 py-3 text-center">
                        <input type="number" min={0} max={exam.totalMarks} value={obtained} onChange={e => setMarksData({ ...marksData, [s.id]: Math.min(Number(e.target.value), exam.totalMarks) })}
                          className="w-20 px-2 py-1 border rounded text-center text-sm focus:ring-2 focus:ring-green-500 outline-none" />
                      </td>
                      <td className="px-4 py-3 text-center">{pct}%</td>
                      <td className="px-4 py-3 text-center"><Badge variant={pct >= 40 ? 'success' : 'danger'}>{grade}</Badge></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal isOpen={csvModal} onClose={() => setCsvModal(false)} title="Upload Marks via CSV">
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Expected CSV Format:</p>
            <pre className="text-xs bg-white p-3 rounded border font-mono">student_id,marks{'\n'}ST001,78{'\n'}ST002,84{'\n'}ST003,91</pre>
          </div>
          <Input label="Upload CSV File" type="file" accept=".csv" onChange={handleCsvUpload} />
          <p className="text-xs text-gray-500">The CSV should contain student IDs and their obtained marks.</p>
        </div>
      </Modal>
    </DashboardLayout>
  );
}

// ===== TEACHER RESULTS =====
export function TeacherResults() {
  const { user, teachers, students, classes, subjects, exams, marks } = useApp();
  const teacher = teachers.find(t => t.email === user?.email) || teachers[0];
  const myExams = exams.filter(e => teacher.classes.includes(e.classId));
  const [selectedExam, setSelectedExam] = useState(myExams[0]?.id || '');
  const exam = myExams.find(e => e.id === selectedExam);
  const examMarks = marks.filter(m => m.examId === selectedExam);

  return (
    <DashboardLayout>
      <PageHeader title="Results" subtitle="View examination results" />
      <Card className="p-4 mb-4">
        <Select label="Select Exam" value={selectedExam} onChange={e => setSelectedExam(e.target.value)}>
          {myExams.map(e => <option key={e.id} value={e.id}>{e.name} - {subjects.find(s => s.id === e.subjectId)?.name}</option>)}
        </Select>
      </Card>
      {exam && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Student</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">Obtained</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">Total</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">Percentage</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">Grade</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {examMarks.map(m => {
                  const student = students.find(s => s.id === m.studentId);
                  const pct = Math.round((m.obtained / m.totalMarks) * 100);
                  const grade = pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B+' : pct >= 60 ? 'B' : pct >= 50 ? 'C' : pct >= 40 ? 'D' : 'F';
                  return (
                    <tr key={m.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{student?.name}</td>
                      <td className="px-4 py-3 text-center">{m.obtained}</td>
                      <td className="px-4 py-3 text-center">{m.totalMarks}</td>
                      <td className="px-4 py-3 text-center">{pct}%</td>
                      <td className="px-4 py-3 text-center"><Badge variant={pct >= 40 ? 'success' : 'danger'}>{grade}</Badge></td>
                      <td className="px-4 py-3 text-center"><Badge variant={pct >= exam.passingMarks ? 'success' : 'danger'}>{pct >= exam.passingMarks ? 'Pass' : 'Fail'}</Badge></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {examMarks.length === 0 && <EmptyState message="No marks entered yet" />}
          </div>
        </Card>
      )}
    </DashboardLayout>
  );
}

// ===== TEACHER REPORTS =====
export function TeacherReports() {
  const { user, teachers, students, classes, attendance } = useApp();
  const teacher = teachers.find(t => t.email === user?.email) || teachers[0];
  const [selectedClass, setSelectedClass] = useState(teacher.classes[0] || '');
  const classStudents = students.filter(s => s.classId === selectedClass && s.status === 'Active');
  const cls = classes.find(c => c.id === selectedClass);

  const reportData = classStudents.map(s => {
    const records = attendance.filter(a => a.studentId === s.id);
    const present = records.filter(r => r.status === 'Present').length;
    const absent = records.filter(r => r.status === 'Absent').length;
    const late = records.filter(r => r.status === 'Late').length;
    const total = records.length;
    const pct = total > 0 ? Math.round(((present + late) / total) * 100) : 0;
    return { name: s.name, present, absent, late, total, pct };
  });

  const handleDownload = () => {
    generateAttendanceReport('Class Attendance', attendance.filter(a => a.classId === selectedClass), cls?.name || '');
  };

  return (
    <DashboardLayout>
      <PageHeader title="Reports" subtitle="Attendance and performance reports" />
      <Card className="p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <Select label="Class" value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
            {teacher.classes.map(cId => { const c = classes.find(cl => cl.id === cId); return <option key={cId} value={cId}>{c?.name} {c?.section}</option>; })}
          </Select>
          <Button size="sm" onClick={handleDownload}><Download size={14} className="mr-1" /> Download PDF</Button>
        </div>
      </Card>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Student</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Present</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Absent</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Late</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Total</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Percentage</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {reportData.map((d, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{d.name}</td>
                  <td className="px-4 py-3 text-center text-green-600">{d.present}</td>
                  <td className="px-4 py-3 text-center text-red-600">{d.absent}</td>
                  <td className="px-4 py-3 text-center text-yellow-600">{d.late}</td>
                  <td className="px-4 py-3 text-center">{d.total}</td>
                  <td className="px-4 py-3 text-center"><Badge variant={d.pct >= 75 ? 'success' : d.pct >= 50 ? 'warning' : 'danger'}>{d.pct}%</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardLayout>
  );
}
