import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { GraduationCap, BookOpen, Users, Shield, ChevronRight, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Bell } from 'lucide-react';
import { Button, Input, Card } from '../components/UI';

// ===== LANDING PAGE =====
export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="text-green-600" size={32} />
            <div>
              <h1 className="font-bold text-gray-800 text-lg leading-tight">Greenfield Grammar</h1>
              <p className="text-xs text-gray-500">School Management System</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <a href="#home" className="hover:text-green-600">Home</a>
            <a href="#about" className="hover:text-green-600">About</a>
            <a href="#announcements" className="hover:text-green-600">Announcements</a>
            <a href="#contact" className="hover:text-green-600">Contact</a>
          </nav>
          <Link to="/login" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition">
            Login
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section id="home" className="relative bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30"></div>
        <div className="max-w-7xl mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-6">Smart School Administration Platform</span>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Smarter School<br />Management.
            </h1>
            <p className="text-lg md:text-xl text-green-100 mb-8 max-w-xl">
              Everything your school needs in one platform. Manage students, teachers, attendance, examinations, fees, and more — all in a single, powerful system.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/login" className="bg-white text-green-700 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition flex items-center gap-2">
                Explore Demo <ChevronRight size={18} />
              </Link>
              <a href="#about" className="border-2 border-white/50 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Complete School Management Solution</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Our platform provides everything a modern school needs to operate efficiently and deliver excellent education.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Users size={24} />, title: 'Student Management', desc: 'Complete student lifecycle from admission to graduation.' },
              { icon: <BookOpen size={24} />, title: 'Academic Module', desc: 'Timetable, attendance, exams, and results management.' },
              { icon: <Shield size={24} />, title: 'Finance & Fees', desc: 'Fee collection, challans, salary management, and reports.' },
              { icon: <Bell size={24} />, title: 'Communication', desc: 'Notifications, announcements, and parent engagement.' },
            ].map((f, i) => (
              <Card key={i} className="p-6 hover:shadow-md transition">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-4">{f.icon}</div>
                <h3 className="font-semibold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">About Greenfield Grammar School</h2>
              <p className="text-gray-600 mb-4">Greenfield Grammar School is a premier educational institution committed to academic excellence and holistic development. Established with a vision to provide quality education, we combine traditional values with modern teaching methodologies.</p>
              <p className="text-gray-600 mb-6">Our school offers comprehensive programs from Grade 6 to Grade 10, with a focus on science, technology, and character building. With state-of-the-art facilities and experienced faculty, we prepare students for future challenges.</p>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">486</p>
                  <p className="text-xs text-gray-500">Students</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">32</p>
                  <p className="text-xs text-gray-500">Teachers</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">18</p>
                  <p className="text-xs text-gray-500">Classes</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-8">
              <h3 className="font-bold text-gray-800 mb-4">Our Facilities</h3>
              <ul className="space-y-3">
                {['Modern Science Laboratories', 'Computer Lab with 50+ Systems', 'Well-Stocked Library', 'Sports Complex', 'Auditorium (500 capacity)', 'Medical Room', 'Transportation Service', 'Cafeteria'].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>{f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Announcements */}
      <section id="announcements" className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Latest Announcements</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Parent-Teacher Meeting', date: 'March 25, 2026', desc: 'All parents are invited to attend the quarterly parent-teacher meeting to discuss student progress.' },
              { title: 'Annual Sports Day', date: 'April 5, 2026', desc: 'Join us for the annual sports day featuring track events, team sports, and prize distribution ceremony.' },
              { title: 'Mid-Term Examination Schedule', date: 'March 15-22, 2026', desc: 'Mid-term examinations will be held from March 15. Detailed date sheet available at school office.' },
              { title: 'School Holiday Notice', date: 'March 23, 2026', desc: 'School will remain closed on March 23 in observance of Pakistan Day. Classes resume March 24.' },
              { title: 'New Computer Lab', date: 'March 20, 2026', desc: 'We are proud to announce the inauguration of our new state-of-the-art computer laboratory.' },
              { title: 'Science Fair 2026', date: 'Registration Open', desc: 'Annual Science Fair registrations are now open. Submit your innovative projects before March 30.' },
            ].map((a, i) => (
              <Card key={i} className="p-5 hover:shadow-md transition">
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">{a.date}</span>
                <h3 className="font-semibold text-gray-800 mt-3 mb-2">{a.title}</h3>
                <p className="text-sm text-gray-500">{a.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Contact Us</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="p-6 text-center">
              <Phone className="mx-auto text-green-600 mb-3" size={24} />
              <h3 className="font-semibold text-gray-800 mb-1">Phone</h3>
              <p className="text-sm text-gray-500">+92-42-35761234</p>
              <p className="text-sm text-gray-500">+92-300-1234567</p>
            </Card>
            <Card className="p-6 text-center">
              <Mail className="mx-auto text-green-600 mb-3" size={24} />
              <h3 className="font-semibold text-gray-800 mb-1">Email</h3>
              <p className="text-sm text-gray-500">info@greenfield.edu.pk</p>
              <p className="text-sm text-gray-500">admissions@greenfield.edu.pk</p>
            </Card>
            <Card className="p-6 text-center">
              <MapPin className="mx-auto text-green-600 mb-3" size={24} />
              <h3 className="font-semibold text-gray-800 mb-1">Address</h3>
              <p className="text-sm text-gray-500">123 Education Avenue</p>
              <p className="text-sm text-gray-500">Gulberg III, Lahore</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap size={24} className="text-green-400" />
                <span className="font-bold">Greenfield Grammar</span>
              </div>
              <p className="text-sm text-gray-400">Smart School Administration Platform. Empowering education through technology.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#home" className="hover:text-white">Home</a></li>
                <li><a href="#about" className="hover:text-white">About</a></li>
                <li><a href="#announcements" className="hover:text-white">Announcements</a></li>
                <li><Link to="/login" className="hover:text-white">Login Portal</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Academics</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Grade 6-8 (Middle School)</li>
                <li>Grade 9-10 (Secondary)</li>
                <li>Science Program</li>
                <li>Computer Science</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Connect</h4>
              <div className="flex gap-3">
                <a href="#" className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-green-600 transition"><Facebook size={16} /></a>
                <a href="#" className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-green-600 transition"><Twitter size={16} /></a>
                <a href="#" className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-green-600 transition"><Instagram size={16} /></a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
            <p>© 2026 Greenfield Grammar School. All rights reserved.</p>
            <p className="mt-1 text-xs">This is a demonstration website using sample data.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ===== LOGIN PAGE =====
export function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);

  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 800));
    const user = login(email, password);
    if (user) {
      navigate(user.role === 'admin' ? '/admin' : user.role === 'teacher' ? '/teacher' : '/student');
    } else {
      setError('Invalid credentials. Please check and try again.');
    }
    setLoading(false);
  };

  const quickLogin = (role: 'admin' | 'teacher' | 'student') => {
    const creds = { admin: ['admin@demo.school', 'admin123'], teacher: ['teacher@demo.school', 'teacher123'], student: ['student@demo.school', 'student123'] };
    setEmail(creds[role][0]);
    setPassword(creds[role][1]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2">
            <GraduationCap className="text-green-600" size={40} />
          </Link>
          <h1 className="text-xl font-bold text-gray-800 mt-2">Greenfield Grammar School</h1>
          <p className="text-sm text-gray-500">School Management System</p>
        </div>

        <Card className="p-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-5">
            <p className="text-xs text-yellow-700 text-center font-medium">⚡ DEMO ENVIRONMENT — Sample data only</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" required />
            <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" required />
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="rounded border-gray-300" />
                Remember me
              </label>
            </div>
            {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 border-t pt-5">
            <p className="text-xs text-gray-500 text-center mb-3">Quick Demo Access</p>
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => quickLogin('admin')} className="px-3 py-2 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium hover:bg-purple-100 transition border border-purple-200">
                👤 Admin
              </button>
              <button onClick={() => quickLogin('teacher')} className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 transition border border-blue-200">
                👨‍🏫 Teacher
              </button>
              <button onClick={() => quickLogin('student')} className="px-3 py-2 bg-orange-50 text-orange-700 rounded-lg text-xs font-medium hover:bg-orange-100 transition border border-orange-200">
                🎓 Student
              </button>
            </div>
          </div>

          <div className="mt-5 bg-gray-50 rounded-lg p-3">
            <p className="text-xs font-medium text-gray-600 mb-2">Demo Credentials:</p>
            <div className="space-y-1.5 text-xs text-gray-500">
              <p><span className="font-medium text-purple-600">Admin:</span> admin@demo.school / admin123</p>
              <p><span className="font-medium text-blue-600">Teacher:</span> teacher@demo.school / teacher123</p>
              <p><span className="font-medium text-orange-600">Student:</span> student@demo.school / student123</p>
            </div>
          </div>
        </Card>

        <p className="text-center text-xs text-gray-400 mt-4">
          <Link to="/" className="hover:text-green-600">← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}
