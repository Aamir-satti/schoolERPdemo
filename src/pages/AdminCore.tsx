import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { DashboardLayout, Card, StatCard, PageHeader, Button, Modal, Input, Select, Badge, EmptyState, Toast } from '../components/UI';
import { Users, GraduationCap, BookOpen, DollarSign, TrendingUp, AlertCircle, Plus, Edit, Trash2, Eye, Search, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Student, Teacher } from '../types';

// ===== ADMIN DASHBOARD =====
export function AdminDashboard() {
  const { students, teachers, classes, attendance, fees, activities } = useApp();
  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.filter(a => a.date === today);
  const presentToday = todayAttendance.filter(a => a.status === 'Present' || a.status === 'Late').length;
  const attendancePct = todayAttendance.length > 0 ? Math.round((presentToday / todayAttendance.length) * 100) : 94;
  const totalFees = fees.reduce((s, f) => s + f.amount, 0);
  const collectedFees = fees.reduce((s, f) => s + f.paid, 0);
  const outstanding = totalFees - collectedFees;

  const classDistribution = classes.map(c => ({ name: `${c.name}-${c.section}`, count: students.filter(s => s.classId === c.id).length }));
  const attendanceTrend = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const ds = d.toISOString().split('T')[0];
    const dayAtt = attendance.filter(a => a.date === ds);
    const present = dayAtt.filter(a => a.status === 'Present' || a.status === 'Late').length;
    return { day: d.toLocaleDateString('en', { weekday: 'short' }), rate: dayAtt.length > 0 ? Math.round((present / dayAtt.length) * 100) : 0 };
  });

  const COLORS = ['#16a34a', '#2563eb', '#9333ea', '#ea580c', '#0891b2'];

  return (
    <DashboardLayout>
      <PageHeader title="Admin Dashboard" subtitle="Welcome back, Dr. Rashid Mehmood" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <StatCard title="Total Students" value={students.filter(s => s.status === 'Active').length} icon={<Users size={20} className="text-blue-600" />} color="bg-blue-100" />
        <StatCard title="Total Teachers" value={teachers.filter(t => t.status === 'Active').length} icon={<GraduationCap size={20} className="text-purple-600" />} color="bg-purple-100" />
        <StatCard title="Total Classes" value={classes.length} icon={<BookOpen size={20} className="text-green-600" />} color="bg-green-100" />
        <StatCard title="Attendance Today" value={`${attendancePct}%`} icon={<TrendingUp size={20} className="text-emerald-600" />} color="bg-emerald-100" />
        <StatCard title="Fees Collected" value={`Rs. ${(collectedFees / 1000).toFixed(0)}K`} icon={<DollarSign size={20} className="text-yellow-600" />} color="bg-yellow-100" />
        <StatCard title="Outstanding" value={`Rs. ${(outstanding / 1000).toFixed(0)}K`} icon={<AlertCircle size={20} className="text-red-600" />} color="bg-red-100" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <Card className="p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Attendance Trend (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={attendanceTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" fontSize={12} />
              <YAxis domain={[0, 100]} fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="rate" stroke="#16a34a" strokeWidth={2} dot={{ fill: '#16a34a' }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Student Distribution by Class</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={classDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={11} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="count" fill="#16a34a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-5 lg:col-span-2">
          <h3 className="font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {activities.slice(0, 8).map(a => (
              <div key={a.id} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${a.type === 'student' ? 'bg-blue-500' : a.type === 'attendance' ? 'bg-green-500' : a.type === 'exam' ? 'bg-purple-500' : a.type === 'fee' ? 'bg-yellow-500' : 'bg-gray-500'}`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 truncate">{a.message}</p>
                  <p className="text-xs text-gray-400">{a.timestamp} • {a.user}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Fee Overview</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={[{ name: 'Collected', value: collectedFees }, { name: 'Outstanding', value: outstanding }]} cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="value">
                <Cell fill="#16a34a" />
                <Cell fill="#ef4444" />
              </Pie>
              <Tooltip formatter={(v: number) => `Rs. ${(v / 1000).toFixed(0)}K`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            <span className="flex items-center gap-1 text-xs"><span className="w-3 h-3 bg-green-600 rounded-full"></span>Collected</span>
            <span className="flex items-center gap-1 text-xs"><span className="w-3 h-3 bg-red-500 rounded-full"></span>Outstanding</span>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

// ===== STUDENTS MANAGEMENT =====
export function AdminStudents() {
  const { students, classes, teachers, addStudent, updateStudent, deleteStudent } = useApp();
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [viewStudent, setViewStudent] = useState<Student | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [form, setForm] = useState({ name: '', classId: '', section: 'A', gender: 'Male' as 'Male' | 'Female', parentName: '', phone: '', email: '', dateOfBirth: '', address: '' });

  const filtered = useMemo(() => {
    return students.filter(s => {
      if (s.status === 'Inactive') return false;
      if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.regNo.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterClass && s.classId !== filterClass) return false;
      return true;
    });
  }, [students, search, filterClass]);

  const openAdd = () => { setEditStudent(null); setForm({ name: '', classId: classes[0]?.id || '', section: 'A', gender: 'Male', parentName: '', phone: '', email: '', dateOfBirth: '', address: '' }); setModalOpen(true); };
  const openEdit = (s: Student) => { setEditStudent(s); setForm({ name: s.name, classId: s.classId, section: s.section, gender: s.gender, parentName: s.parentName, phone: s.phone, email: s.email, dateOfBirth: s.dateOfBirth, address: s.address }); setModalOpen(true); };

  const handleSave = () => {
    if (!form.name || !form.classId) return;
    if (editStudent) {
      updateStudent(editStudent.id, form);
      setToast({ message: 'Student updated successfully.', type: 'success' });
    } else {
      addStudent({ ...form, status: 'Active', admissionDate: new Date().toISOString().split('T')[0] });
      setToast({ message: 'Student added successfully.', type: 'success' });
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteStudent(id);
    setToast({ message: 'Student deactivated.', type: 'success' });
  };

  const getClassName = (id: string) => { const c = classes.find(c => c.id === id); return c ? `${c.name} ${c.section}` : id; };

  return (
    <DashboardLayout>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <PageHeader title="Students" subtitle={`${filtered.length} students found`} action={<Button onClick={openAdd}><Plus size={16} className="mr-1" /> Add Student</Button>} />

      <Card className="p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or reg no..." className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" />
          </div>
          <select value={filterClass} onChange={e => setFilterClass(e.target.value)} className="px-3 py-2 border rounded-lg text-sm bg-white">
            <option value="">All Classes</option>
            {classes.map(c => <option key={c.id} value={c.id}>{c.name} {c.section}</option>)}
          </select>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Reg No</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Class</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Parent</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Phone</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">{s.regNo}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{s.name}</td>
                  <td className="px-4 py-3 hidden md:table-cell">{getClassName(s.classId)}</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-gray-600">{s.parentName}</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-gray-600">{s.phone}</td>
                  <td className="px-4 py-3"><Badge variant="success">{s.status}</Badge></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => setViewStudent(s)} className="p-1.5 hover:bg-blue-50 rounded text-blue-600"><Eye size={14} /></button>
                      <button onClick={() => openEdit(s)} className="p-1.5 hover:bg-yellow-50 rounded text-yellow-600"><Edit size={14} /></button>
                      <button onClick={() => handleDelete(s.id)} className="p-1.5 hover:bg-red-50 rounded text-red-600"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <EmptyState message="No students found" subMessage="Try adjusting your search or filter" />}
        </div>
      </Card>

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editStudent ? 'Edit Student' : 'Add New Student'}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Student name" />
          <Select label="Class" value={form.classId} onChange={e => setForm({ ...form, classId: e.target.value })}>
            {classes.map(c => <option key={c.id} value={c.id}>{c.name} {c.section}</option>)}
          </Select>
          <Select label="Section" value={form.section} onChange={e => setForm({ ...form, section: e.target.value })}>
            <option value="A">A</option><option value="B">B</option><option value="C">C</option>
          </Select>
          <Select label="Gender" value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value as 'Male' | 'Female' })}>
            <option value="Male">Male</option><option value="Female">Female</option>
          </Select>
          <Input label="Parent/Guardian" value={form.parentName} onChange={e => setForm({ ...form, parentName: e.target.value })} />
          <Input label="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          <Input label="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <Input label="Date of Birth" type="date" value={form.dateOfBirth} onChange={e => setForm({ ...form, dateOfBirth: e.target.value })} />
          <div className="md:col-span-2">
            <Input label="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>{editStudent ? 'Update' : 'Add'} Student</Button>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={!!viewStudent} onClose={() => setViewStudent(null)} title="Student Details">
        {viewStudent && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-500">Reg No:</span> <span className="font-medium">{viewStudent.regNo}</span></div>
              <div><span className="text-gray-500">Name:</span> <span className="font-medium">{viewStudent.name}</span></div>
              <div><span className="text-gray-500">Class:</span> <span className="font-medium">{getClassName(viewStudent.classId)}</span></div>
              <div><span className="text-gray-500">Gender:</span> <span className="font-medium">{viewStudent.gender}</span></div>
              <div><span className="text-gray-500">Parent:</span> <span className="font-medium">{viewStudent.parentName}</span></div>
              <div><span className="text-gray-500">Phone:</span> <span className="font-medium">{viewStudent.phone}</span></div>
              <div><span className="text-gray-500">Email:</span> <span className="font-medium">{viewStudent.email}</span></div>
              <div><span className="text-gray-500">DOB:</span> <span className="font-medium">{viewStudent.dateOfBirth}</span></div>
              <div className="col-span-2"><span className="text-gray-500">Address:</span> <span className="font-medium">{viewStudent.address}</span></div>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}

// ===== TEACHERS MANAGEMENT =====
export function AdminTeachers() {
  const { teachers, subjects, classes, addTeacher, updateTeacher } = useApp();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTeacher, setEditTeacher] = useState<Teacher | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [form, setForm] = useState({ name: '', subject: '', classes: [] as string[], phone: '', email: '', qualification: '', baseSalary: 0, allowances: 0, deductions: 0 });

  const filtered = teachers.filter(t => t.status === 'Active' && (!search || t.name.toLowerCase().includes(search.toLowerCase())));

  const openAdd = () => { setEditTeacher(null); setForm({ name: '', subject: subjects[0]?.name || '', classes: [], phone: '', email: '', qualification: '', baseSalary: 0, allowances: 0, deductions: 0 }); setModalOpen(true); };
  const openEdit = (t: Teacher) => { setEditTeacher(t); setForm({ name: t.name, subject: t.subject, classes: t.classes, phone: t.phone, email: t.email, qualification: t.qualification, baseSalary: t.baseSalary, allowances: t.allowances, deductions: t.deductions }); setModalOpen(true); };

  const handleSave = () => {
    if (!form.name || !form.subject) return;
    if (editTeacher) {
      updateTeacher(editTeacher.id, form);
      setToast({ message: 'Teacher updated successfully.', type: 'success' });
    } else {
      addTeacher({ ...form, joiningDate: new Date().toISOString().split('T')[0], status: 'Active' });
      setToast({ message: 'Teacher added successfully.', type: 'success' });
    }
    setModalOpen(false);
  };

  return (
    <DashboardLayout>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <PageHeader title="Teachers" subtitle={`${filtered.length} teachers`} action={<Button onClick={openAdd}><Plus size={16} className="mr-1" /> Add Teacher</Button>} />

      <Card className="p-4 mb-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search teachers..." className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" />
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">ID</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Subject</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Phone</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Joining Date</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(t => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">{t.employeeId}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{t.name}</td>
                  <td className="px-4 py-3 hidden md:table-cell">{t.subject}</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-gray-600">{t.phone}</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-gray-600">{t.joiningDate}</td>
                  <td className="px-4 py-3"><Badge variant="success">{t.status}</Badge></td>
                  <td className="px-4 py-3">
                    <button onClick={() => openEdit(t)} className="p-1.5 hover:bg-yellow-50 rounded text-yellow-600"><Edit size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editTeacher ? 'Edit Teacher' : 'Add New Teacher'}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <Select label="Subject" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}>
            {subjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
          </Select>
          <Input label="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          <Input label="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <Input label="Qualification" value={form.qualification} onChange={e => setForm({ ...form, qualification: e.target.value })} />
          <Input label="Base Salary" type="number" value={form.baseSalary} onChange={e => setForm({ ...form, baseSalary: Number(e.target.value) })} />
          <Input label="Allowances" type="number" value={form.allowances} onChange={e => setForm({ ...form, allowances: Number(e.target.value) })} />
          <Input label="Deductions" type="number" value={form.deductions} onChange={e => setForm({ ...form, deductions: Number(e.target.value) })} />
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>{editTeacher ? 'Update' : 'Add'} Teacher</Button>
        </div>
      </Modal>
    </DashboardLayout>
  );
}

// ===== CLASSES MANAGEMENT =====
export function AdminClasses() {
  const { classes, teachers, students, subjects, addClass } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [viewClass, setViewClass] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', section: 'A', teacherId: '', subjects: [] as string[], room: '' });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleAdd = () => {
    if (!form.name || !form.teacherId) return;
    addClass({ ...form, studentCount: 0 });
    setToast({ message: 'Class added successfully.', type: 'success' });
    setModalOpen(false);
  };

  const viewCls = classes.find(c => c.id === viewClass);
  const classStudents = viewClass ? students.filter(s => s.classId === viewClass && s.status === 'Active') : [];

  return (
    <DashboardLayout>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <PageHeader title="Classes" subtitle={`${classes.length} classes`} action={<Button onClick={() => setModalOpen(true)}><Plus size={16} className="mr-1" /> Add Class</Button>} />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map(c => {
          const teacher = teachers.find(t => t.id === c.teacherId);
          const count = students.filter(s => s.classId === c.id && s.status === 'Active').length;
          return (
            <Card key={c.id} className="p-5 hover:shadow-md transition cursor-pointer" >
              <div className="flex items-start justify-between" onClick={() => setViewClass(c.id)}>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">{c.name} - {c.section}</h3>
                  <p className="text-sm text-gray-500 mt-1">Class Teacher: {teacher?.name || 'N/A'}</p>
                  <p className="text-sm text-gray-500">Room: {c.room}</p>
                  <p className="text-sm text-gray-500">Students: {count}</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 font-bold text-sm">{count}</div>
              </div>
            </Card>
          );
        })}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add New Class">
        <div className="space-y-4">
          <Input label="Class Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g., Grade 11" />
          <Select label="Section" value={form.section} onChange={e => setForm({ ...form, section: e.target.value })}>
            <option value="A">A</option><option value="B">B</option><option value="C">C</option>
          </Select>
          <Select label="Class Teacher" value={form.teacherId} onChange={e => setForm({ ...form, teacherId: e.target.value })}>
            <option value="">Select teacher</option>
            {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </Select>
          <Input label="Room" value={form.room} onChange={e => setForm({ ...form, room: e.target.value })} placeholder="e.g., Room 201" />
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button onClick={handleAdd}>Add Class</Button>
        </div>
      </Modal>

      <Modal isOpen={!!viewClass} onClose={() => setViewClass(null)} title={`${viewCls?.name} - ${viewCls?.section}`} size="lg">
        {viewCls && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-sm">
              <div className="bg-gray-50 p-3 rounded"><span className="text-gray-500">Teacher:</span><br /><span className="font-medium">{teachers.find(t => t.id === viewCls.teacherId)?.name}</span></div>
              <div className="bg-gray-50 p-3 rounded"><span className="text-gray-500">Room:</span><br /><span className="font-medium">{viewCls.room}</span></div>
              <div className="bg-gray-50 p-3 rounded"><span className="text-gray-500">Students:</span><br /><span className="font-medium">{classStudents.length}</span></div>
              <div className="bg-gray-50 p-3 rounded"><span className="text-gray-500">Subjects:</span><br /><span className="font-medium">{viewCls.subjects.length}</span></div>
            </div>
            <h4 className="font-semibold text-gray-700 mb-2">Students in this class:</h4>
            <table className="w-full text-sm">
              <thead className="bg-gray-50"><tr><th className="text-left px-3 py-2">Reg No</th><th className="text-left px-3 py-2">Name</th><th className="text-left px-3 py-2">Gender</th></tr></thead>
              <tbody className="divide-y">
                {classStudents.map(s => (
                  <tr key={s.id}><td className="px-3 py-2 font-mono text-xs">{s.regNo}</td><td className="px-3 py-2">{s.name}</td><td className="px-3 py-2">{s.gender}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}

// ===== SUBJECTS MANAGEMENT =====
export function AdminSubjects() {
  const { subjects, teachers, classes } = useApp();
  return (
    <DashboardLayout>
      <PageHeader title="Subjects" subtitle={`${subjects.length} subjects configured`} />
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Code</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Subject</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Teacher</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Classes</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {subjects.map(s => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono">{s.code}</td>
                  <td className="px-4 py-3 font-medium">{s.name}</td>
                  <td className="px-4 py-3">{teachers.find(t => t.id === s.teacherId)?.name || 'N/A'}</td>
                  <td className="px-4 py-3">{s.classes.map(cId => classes.find(c => c.id === cId)?.name).filter(Boolean).join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardLayout>
  );
}
