import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { DashboardLayout, Card, StatCard, PageHeader, Button, Modal, Input, Select, Badge, EmptyState, Toast } from '../components/UI';
import { Plus, Save, Download, Upload, DollarSign, TrendingUp, AlertCircle, CreditCard } from 'lucide-react';
import { generateAttendanceReport, generateSalarySlip } from '../utils/pdf';

// ===== TIMETABLE =====
export function AdminTimetable() {
  const { timetable, subjects, teachers, classes } = useApp();
  const [selectedClass, setSelectedClass] = useState(classes[0]?.id || '');
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const times = ['08:00 - 08:45', '08:50 - 09:35', '09:40 - 10:25', '10:45 - 11:30', '11:35 - 12:20', '12:25 - 01:10'];

  const filtered = timetable.filter(t => t.classId === selectedClass);
  const getEntry = (day: string, time: string) => filtered.find(t => t.day === day && t.time === time);

  return (
    <DashboardLayout>
      <PageHeader title="Timetable" subtitle="Class-wise timetable management" />
      <Card className="p-4 mb-4">
        <Select label="Select Class" value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
          {classes.map(c => <option key={c.id} value={c.id}>{c.name} {c.section}</option>)}
        </Select>
      </Card>
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
                    const entry = getEntry(day, time);
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

// ===== ATTENDANCE =====
export function AdminAttendance() {
  const { attendance, students, classes, saveAttendance } = useApp();
  const [selectedClass, setSelectedClass] = useState(classes[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState<Record<string, 'Present' | 'Absent' | 'Late' | 'Leave'>>({});
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [saved, setSaved] = useState(false);

  const classStudents = students.filter(s => s.classId === selectedClass && s.status === 'Active');

  React.useEffect(() => {
    const existing = attendance.filter(a => a.classId === selectedClass && a.date === selectedDate);
    const data: Record<string, 'Present' | 'Absent' | 'Late' | 'Leave'> = {};
    existing.forEach(a => { data[a.studentId] = a.status; });
    classStudents.forEach(s => { if (!data[s.id]) data[s.id] = 'Present'; });
    setAttendanceData(data);
    setSaved(false);
  }, [selectedClass, selectedDate]);

  const handleSave = () => {
    const records = Object.entries(attendanceData).map(([studentId, status]) => ({ studentId, status }));
    saveAttendance(selectedClass, selectedDate, records);
    setToast({ message: 'Attendance saved successfully!', type: 'success' });
    setSaved(true);
  };

  const stats = {
    present: Object.values(attendanceData).filter(s => s === 'Present').length,
    absent: Object.values(attendanceData).filter(s => s === 'Absent').length,
    late: Object.values(attendanceData).filter(s => s === 'Late').length,
    leave: Object.values(attendanceData).filter(s => s === 'Leave').length,
  };

  return (
    <DashboardLayout>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <PageHeader title="Attendance" subtitle="Mark and manage class attendance" />

      <Card className="p-4 mb-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <Select label="Select Class" value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
            {classes.map(c => <option key={c.id} value={c.id}>{c.name} {c.section}</option>)}
          </Select>
          <Input label="Select Date" type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
        </div>
      </Card>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div className="bg-green-50 p-3 rounded-lg text-center"><p className="text-2xl font-bold text-green-600">{stats.present}</p><p className="text-xs text-gray-500">Present</p></div>
        <div className="bg-red-50 p-3 rounded-lg text-center"><p className="text-2xl font-bold text-red-600">{stats.absent}</p><p className="text-xs text-gray-500">Absent</p></div>
        <div className="bg-yellow-50 p-3 rounded-lg text-center"><p className="text-2xl font-bold text-yellow-600">{stats.late}</p><p className="text-xs text-gray-500">Late</p></div>
        <div className="bg-blue-50 p-3 rounded-lg text-center"><p className="text-2xl font-bold text-blue-600">{stats.leave}</p><p className="text-xs text-gray-500">Leave</p></div>
      </div>

      <Card>
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold text-gray-700">Students ({classStudents.length})</h3>
          <Button onClick={handleSave} size="sm"><Save size={14} className="mr-1" /> Save Attendance</Button>
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
                      <input type="radio" name={`att-${s.id}`} checked={attendanceData[s.id] === status} onChange={() => { setAttendanceData({ ...attendanceData, [s.id]: status }); setSaved(false); }}
                        className="w-4 h-4 text-green-600 focus:ring-green-500" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {classStudents.length === 0 && <EmptyState message="No students in this class" />}
        </div>
      </Card>
      {saved && <p className="text-sm text-green-600 mt-3 text-center">✓ Attendance saved successfully for {selectedDate}</p>}
    </DashboardLayout>
  );
}

// ===== EXAMS =====
export function AdminExams() {
  const { exams, classes, subjects, addExam } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', classId: '', subjectId: '', date: '', totalMarks: 100, passingMarks: 40, term: 'Mid-Term' });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleAdd = () => {
    if (!form.name || !form.classId || !form.subjectId) return;
    addExam(form);
    setToast({ message: 'Exam created successfully.', type: 'success' });
    setModalOpen(false);
  };

  return (
    <DashboardLayout>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <PageHeader title="Examinations" subtitle={`${exams.length} exams configured`} action={<Button onClick={() => setModalOpen(true)}><Plus size={16} className="mr-1" /> Create Exam</Button>} />
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Exam Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Class</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Subject</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Total Marks</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Term</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {exams.map(e => (
                <tr key={e.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{e.name}</td>
                  <td className="px-4 py-3">{classes.find(c => c.id === e.classId)?.name} {classes.find(c => c.id === e.classId)?.section}</td>
                  <td className="px-4 py-3">{subjects.find(s => s.id === e.subjectId)?.name}</td>
                  <td className="px-4 py-3">{e.date}</td>
                  <td className="px-4 py-3">{e.totalMarks}</td>
                  <td className="px-4 py-3"><Badge variant="info">{e.term}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create New Exam">
        <div className="space-y-4">
          <Input label="Exam Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g., Final Examination 2026" />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Class" value={form.classId} onChange={e => setForm({ ...form, classId: e.target.value })}>
              <option value="">Select</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name} {c.section}</option>)}
            </Select>
            <Select label="Subject" value={form.subjectId} onChange={e => setForm({ ...form, subjectId: e.target.value })}>
              <option value="">Select</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </Select>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input label="Date" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
            <Input label="Total Marks" type="number" value={form.totalMarks} onChange={e => setForm({ ...form, totalMarks: Number(e.target.value) })} />
            <Input label="Passing Marks" type="number" value={form.passingMarks} onChange={e => setForm({ ...form, passingMarks: Number(e.target.value) })} />
          </div>
          <Select label="Term" value={form.term} onChange={e => setForm({ ...form, term: e.target.value })}>
            <option value="Mid-Term">Mid-Term</option><option value="Final">Final</option><option value="Monthly">Monthly</option>
          </Select>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button onClick={handleAdd}>Create Exam</Button>
        </div>
      </Modal>
    </DashboardLayout>
  );
}

// ===== RESULTS =====
export function AdminResults() {
  const { marks, exams, students, subjects, classes } = useApp();
  const [selectedExam, setSelectedExam] = useState(exams[0]?.id || '');
  const exam = exams.find(e => e.id === selectedExam);
  const examMarks = marks.filter(m => m.examId === selectedExam);

  return (
    <DashboardLayout>
      <PageHeader title="Results" subtitle="View examination results" />
      <Card className="p-4 mb-4">
        <Select label="Select Exam" value={selectedExam} onChange={e => setSelectedExam(e.target.value)}>
          {exams.map(e => <option key={e.id} value={e.id}>{e.name} - {subjects.find(s => s.id === e.subjectId)?.name} ({classes.find(c => c.id === e.classId)?.name})</option>)}
        </Select>
      </Card>
      {exam && (
        <Card>
          <div className="p-4 border-b bg-gray-50">
            <p className="font-semibold text-gray-700">{exam.name}</p>
            <p className="text-sm text-gray-500">{subjects.find(s => s.id === exam.subjectId)?.name} | Total: {exam.totalMarks} | Passing: {exam.passingMarks}</p>
          </div>
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
                      <td className="px-4 py-3 font-medium">{student?.name || m.studentId}</td>
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
            {examMarks.length === 0 && <EmptyState message="No marks entered for this exam" subMessage="Teacher needs to enter marks first" />}
          </div>
        </Card>
      )}
    </DashboardLayout>
  );
}

// ===== FINANCE =====
export function AdminFinance() {
  const { fees, salaries, students, teachers, updateFeePayment, updateSalaryStatus } = useApp();
  const [tab, setTab] = useState<'fees' | 'salaries'>('fees');
  const [paymentModal, setPaymentModal] = useState<string | null>(null);
  const [payAmount, setPayAmount] = useState(0);
  const [payMethod, setPayMethod] = useState<'Cash' | 'Bank' | 'Online Transfer'>('Cash');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const totalCollection = fees.reduce((s, f) => s + f.paid, 0);
  const totalOutstanding = fees.reduce((s, f) => s + (f.amount - f.paid), 0);
  const paidSalaries = salaries.filter(s => s.status === 'Paid').reduce((s, r) => s + r.netSalary, 0);
  const pendingSalaries = salaries.filter(s => s.status === 'Pending').reduce((s, r) => s + r.netSalary, 0);

  const handlePayment = () => {
    if (paymentModal && payAmount > 0) {
      updateFeePayment(paymentModal, payAmount, payMethod);
      setToast({ message: 'Payment recorded successfully.', type: 'success' });
      setPaymentModal(null);
      setPayAmount(0);
    }
  };

  return (
    <DashboardLayout>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <PageHeader title="Finance" subtitle="Fee collection and salary management" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Fee Collection" value={`Rs. ${(totalCollection / 1000).toFixed(0)}K`} icon={<DollarSign size={20} className="text-green-600" />} color="bg-green-100" />
        <StatCard title="Outstanding" value={`Rs. ${(totalOutstanding / 1000).toFixed(0)}K`} icon={<AlertCircle size={20} className="text-red-600" />} color="bg-red-100" />
        <StatCard title="Salaries Paid" value={`Rs. ${(paidSalaries / 1000).toFixed(0)}K`} icon={<TrendingUp size={20} className="text-blue-600" />} color="bg-blue-100" />
        <StatCard title="Pending Salaries" value={`Rs. ${(pendingSalaries / 1000).toFixed(0)}K`} icon={<CreditCard size={20} className="text-yellow-600" />} color="bg-yellow-100" />
      </div>

      <div className="flex gap-2 mb-4">
        <button onClick={() => setTab('fees')} className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === 'fees' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'}`}>Student Fees</button>
        <button onClick={() => setTab('salaries')} className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === 'salaries' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'}`}>Salaries</button>
      </div>

      {tab === 'fees' && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Student</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Month</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Amount</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Paid</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Balance</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {fees.slice(0, 30).map(f => {
                  const student = students.find(s => s.id === f.studentId);
                  return (
                    <tr key={f.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{student?.name || f.studentId}</td>
                      <td className="px-4 py-3">{f.month} {f.year}</td>
                      <td className="px-4 py-3 text-right">Rs. {f.amount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right text-green-600">Rs. {f.paid.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right text-red-600">Rs. {(f.amount - f.paid).toLocaleString()}</td>
                      <td className="px-4 py-3 text-center"><Badge variant={f.status === 'Paid' ? 'success' : f.status === 'Partial' ? 'warning' : 'danger'}>{f.status}</Badge></td>
                      <td className="px-4 py-3 text-center">
                        {f.status !== 'Paid' && <button onClick={() => { setPaymentModal(f.id); setPayAmount(f.amount - f.paid); }} className="text-xs text-green-600 hover:underline">Record Payment</button>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === 'salaries' && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Employee</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Month</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Base</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Allowances</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Deductions</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Net Salary</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {salaries.map(s => {
                  const teacher = teachers.find(t => t.id === s.teacherId);
                  return (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{teacher?.name || s.teacherId}</td>
                      <td className="px-4 py-3">{s.month} {s.year}</td>
                      <td className="px-4 py-3 text-right">Rs. {s.baseSalary.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right text-green-600">Rs. {s.allowances.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right text-red-600">Rs. {s.deductions.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-medium">Rs. {s.netSalary.toLocaleString()}</td>
                      <td className="px-4 py-3 text-center"><Badge variant={s.status === 'Paid' ? 'success' : 'warning'}>{s.status}</Badge></td>
                      <td className="px-4 py-3 text-center">
                        {s.status === 'Pending' && <button onClick={() => { updateSalaryStatus(s.id, 'Paid'); setToast({ message: 'Salary marked as paid.', type: 'success' }); }} className="text-xs text-green-600 hover:underline">Mark Paid</button>}
                        <button onClick={() => generateSalarySlip(teacher?.name || 'Unknown', s)} className="text-xs text-blue-600 hover:underline ml-2">Slip</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal isOpen={!!paymentModal} onClose={() => setPaymentModal(null)} title="Record Fee Payment">
        <div className="space-y-4">
          <Input label="Amount (Rs.)" type="number" value={payAmount} onChange={e => setPayAmount(Number(e.target.value))} />
          <Select label="Payment Method" value={payMethod} onChange={e => setPayMethod(e.target.value as any)}>
            <option value="Cash">Cash</option>
            <option value="Bank">Bank Transfer</option>
            <option value="Online Transfer">Online Transfer</option>
          </Select>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="secondary" onClick={() => setPaymentModal(null)}>Cancel</Button>
          <Button onClick={handlePayment}>Record Payment</Button>
        </div>
      </Modal>
    </DashboardLayout>
  );
}

// ===== NOTIFICATIONS =====
export function AdminNotifications() {
  const { notifications, addNotification } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', message: '', date: new Date().toISOString().split('T')[0], expiry: '', isPublic: true, targetRole: 'all' as const });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleAdd = () => {
    if (!form.title || !form.message) return;
    addNotification(form);
    setToast({ message: 'Notification published.', type: 'success' });
    setModalOpen(false);
    setForm({ title: '', message: '', date: new Date().toISOString().split('T')[0], expiry: '', isPublic: true, targetRole: 'all' });
  };

  return (
    <DashboardLayout>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <PageHeader title="Notifications" subtitle={`${notifications.length} notifications`} action={<Button onClick={() => setModalOpen(true)}><Plus size={16} className="mr-1" /> New Notification</Button>} />
      <div className="space-y-3">
        {notifications.map(n => (
          <Card key={n.id} className="p-4 hover:shadow-sm transition">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-800">{n.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{n.message}</p>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs text-gray-400">{n.date}</span>
                  {n.isPublic && <Badge variant="info">Public</Badge>}
                  {n.targetRole !== 'all' && <Badge variant="default">{n.targetRole}</Badge>}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create Notification">
        <div className="space-y-4">
          <Input label="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={4} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Date" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
            <Input label="Expiry Date" type="date" value={form.expiry} onChange={e => setForm({ ...form, expiry: e.target.value })} />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isPublic} onChange={e => setForm({ ...form, isPublic: e.target.checked })} className="rounded" /> Public</label>
            <Select label="Target" value={form.targetRole} onChange={e => setForm({ ...form, targetRole: e.target.value as any })}>
              <option value="all">All</option><option value="teacher">Teachers</option><option value="student">Students</option>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button onClick={handleAdd}>Publish</Button>
        </div>
      </Modal>
    </DashboardLayout>
  );
}

// ===== REPORTS =====
export function AdminReports() {
  const { students, teachers, classes, attendance, fees, marks, exams } = useApp();
  const [reportType, setReportType] = useState('attendance');
  const [selectedClass, setSelectedClass] = useState('');
  const [dateFrom, setDateFrom] = useState('2026-01-01');
  const [dateTo, setDateTo] = useState('2026-03-31');

  const getReportData = () => {
    if (reportType === 'attendance') {
      const classStudents = selectedClass ? students.filter(s => s.classId === selectedClass && s.status === 'Active') : students.filter(s => s.status === 'Active');
      return classStudents.map(s => {
        const records = attendance.filter(a => a.studentId === s.id && a.date >= dateFrom && a.date <= dateTo);
        const present = records.filter(r => r.status === 'Present').length;
        const absent = records.filter(r => r.status === 'Absent').length;
        const late = records.filter(r => r.status === 'Late').length;
        const leave = records.filter(r => r.status === 'Leave').length;
        const total = records.length;
        const pct = total > 0 ? Math.round(((present + late) / total) * 100) : 0;
        return { name: s.name, regNo: s.regNo, present, absent, late, leave, total, pct };
      });
    }
    return [];
  };

  const handleDownload = () => {
    const data = getReportData();
    if (data.length > 0) {
      generateAttendanceReport('Class Report', data.map(d => ({ id: d.regNo, studentId: d.regNo, classId: selectedClass, date: '', status: 'Present' as const })), selectedClass ? classes.find(c => c.id === selectedClass)?.name || '' : 'All Classes');
    }
  };

  return (
    <DashboardLayout>
      <PageHeader title="Reports" subtitle="Generate and download reports" />
      <Card className="p-4 mb-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Select label="Report Type" value={reportType} onChange={e => setReportType(e.target.value)}>
            <option value="attendance">Attendance Report</option>
            <option value="students">Student Report</option>
            <option value="results">Result Report</option>
            <option value="fees">Fee Collection Report</option>
          </Select>
          <Select label="Class" value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
            <option value="">All Classes</option>
            {classes.map(c => <option key={c.id} value={c.id}>{c.name} {c.section}</option>)}
          </Select>
          <Input label="From" type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
          <Input label="To" type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
        </div>
        <div className="mt-3 flex gap-2">
          <Button onClick={handleDownload} size="sm"><Download size={14} className="mr-1" /> Download PDF</Button>
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
                <th className="text-center px-4 py-3 font-medium text-gray-600">Leave</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Total</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Percentage</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {getReportData().map((d, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{d.name}</td>
                  <td className="px-4 py-3 text-center text-green-600">{d.present}</td>
                  <td className="px-4 py-3 text-center text-red-600">{d.absent}</td>
                  <td className="px-4 py-3 text-center text-yellow-600">{d.late}</td>
                  <td className="px-4 py-3 text-center text-blue-600">{d.leave}</td>
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
