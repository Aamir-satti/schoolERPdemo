import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Student, Mark, FeeRecord, SalaryRecord, AttendanceRecord } from '../types';

const SCHOOL_NAME = 'Greenfield Grammar School';
const SCHOOL_ADDRESS = '123 Education Avenue, Gulberg III, Lahore';
const SCHOOL_PHONE = '+92-42-35761234';

function addHeader(doc: jsPDF) {
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(SCHOOL_NAME, 105, 20, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(SCHOOL_ADDRESS, 105, 28, { align: 'center' });
  doc.text(`Phone: ${SCHOOL_PHONE}`, 105, 34, { align: 'center' });
  doc.setDrawColor(0, 100, 0);
  doc.setLineWidth(0.5);
  doc.line(14, 38, 196, 38);
}

export function generateResultCard(student: Student, marksData: Mark[], examName: string, subjectNames: Map<string, string>) {
  const doc = new jsPDF();
  addHeader(doc);

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Academic Result Card', 105, 48, { align: 'center' });
  doc.setFontSize(11);
  doc.text(examName, 105, 56, { align: 'center' });

  // Student info
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const infoY = 68;
  doc.text(`Student Name: ${student.name}`, 14, infoY);
  doc.text(`Registration No: ${student.regNo}`, 14, infoY + 7);
  doc.text(`Class: ${student.classId} - ${student.section}`, 110, infoY);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 110, infoY + 7);

  // Marks table
  const tableData = marksData.map(m => {
    const pct = Math.round((m.obtained / m.totalMarks) * 100);
    const grade = pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B+' : pct >= 60 ? 'B' : pct >= 50 ? 'C' : pct >= 40 ? 'D' : 'F';
    return [
      subjectNames.get(m.subjectId) || m.subjectId,
      m.totalMarks.toString(),
      m.obtained.toString(),
      `${pct}%`,
      grade,
      pct >= 40 ? 'Pass' : 'Fail'
    ];
  });

  autoTable(doc, {
    startY: 90,
    head: [['Subject', 'Total Marks', 'Obtained', 'Percentage', 'Grade', 'Status']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [0, 100, 0] },
    styles: { fontSize: 9 },
  });

  // Summary
  const totalObtained = marksData.reduce((s, m) => s + m.obtained, 0);
  const totalMarks = marksData.reduce((s, m) => s + m.totalMarks, 0);
  const overallPct = Math.round((totalObtained / totalMarks) * 100);
  const overallGrade = overallPct >= 90 ? 'A+' : overallPct >= 80 ? 'A' : overallPct >= 70 ? 'B+' : overallPct >= 60 ? 'B' : overallPct >= 50 ? 'C' : overallPct >= 40 ? 'D' : 'F';

  const finalY = (doc as any).lastAutoTable.finalY + 15;
  doc.setFontSize(10);
  doc.text(`Total: ${totalObtained}/${totalMarks}`, 14, finalY);
  doc.text(`Percentage: ${overallPct}%`, 14, finalY + 7);
  doc.text(`Grade: ${overallGrade}`, 14, finalY + 14);
  doc.text(`Result: ${overallPct >= 40 ? 'PASSED' : 'FAILED'}`, 14, finalY + 21);

  // Footer
  doc.setFontSize(8);
  doc.text('DEMO - This is a demonstration document', 105, 280, { align: 'center' });

  doc.save(`Result_${student.name.replace(/\s/g, '_')}.pdf`);
}

export function generateFeeChallan(student: Student, fee: FeeRecord) {
  const doc = new jsPDF();
  addHeader(doc);

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Fee Challan', 105, 48, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const y = 62;
  doc.text(`Student Name: ${student.name}`, 14, y);
  doc.text(`Registration No: ${student.regNo}`, 14, y + 7);
  doc.text(`Class: ${student.classId} - ${student.section}`, 110, y);
  doc.text(`Month: ${fee.month} ${fee.year}`, 110, y + 7);
  doc.text(`Due Date: ${fee.dueDate}`, 14, y + 14);
  doc.text(`Status: ${fee.status}`, 110, y + 14);

  autoTable(doc, {
    startY: y + 25,
    head: [['Description', 'Amount (Rs.)']],
    body: [
      ['Tuition Fee', '7,000'],
      ['Lab Charges', '1,500'],
      ['Sports Fee', '500'],
      ['Exam Fee', '1,000'],
      ['Total Amount', fee.amount.toLocaleString()],
      ['Amount Paid', fee.paid.toLocaleString()],
      ['Balance Due', (fee.amount - fee.paid).toLocaleString()],
    ],
    theme: 'grid',
    headStyles: { fillColor: [0, 100, 0] },
    styles: { fontSize: 10 },
  });

  doc.setFontSize(8);
  doc.text('DEMO - This is a demonstration document', 105, 280, { align: 'center' });
  doc.save(`Challan_${student.name.replace(/\s/g, '_')}_${fee.month}.pdf`);
}

export function generateAttendanceReport(studentName: string, records: AttendanceRecord[], className: string) {
  const doc = new jsPDF();
  addHeader(doc);

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Attendance Report', 105, 48, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Student: ${studentName}`, 14, 60);
  doc.text(`Class: ${className}`, 14, 67);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 74);

  const present = records.filter(r => r.status === 'Present').length;
  const absent = records.filter(r => r.status === 'Absent').length;
  const late = records.filter(r => r.status === 'Late').length;
  const leave = records.filter(r => r.status === 'Leave').length;
  const total = records.length;
  const pct = total > 0 ? Math.round(((present + late) / total) * 100) : 0;

  autoTable(doc, {
    startY: 82,
    head: [['Metric', 'Count']],
    body: [
      ['Total Working Days', total.toString()],
      ['Present', present.toString()],
      ['Absent', absent.toString()],
      ['Late', late.toString()],
      ['Leave', leave.toString()],
      ['Attendance Percentage', `${pct}%`],
    ],
    theme: 'grid',
    headStyles: { fillColor: [0, 100, 0] },
    styles: { fontSize: 10 },
  });

  doc.setFontSize(8);
  doc.text('DEMO - This is a demonstration document', 105, 280, { align: 'center' });
  doc.save(`Attendance_${studentName.replace(/\s/g, '_')}.pdf`);
}

export function generateSalarySlip(teacherName: string, salary: SalaryRecord) {
  const doc = new jsPDF();
  addHeader(doc);

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Salary Slip', 105, 48, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Employee: ${teacherName}`, 14, 62);
  doc.text(`Month: ${salary.month} ${salary.year}`, 14, 69);
  doc.text(`Status: ${salary.status}`, 14, 76);

  autoTable(doc, {
    startY: 84,
    head: [['Description', 'Amount (Rs.)']],
    body: [
      ['Basic Salary', salary.baseSalary.toLocaleString()],
      ['Allowances', salary.allowances.toLocaleString()],
      ['Deductions', `-${salary.deductions.toLocaleString()}`],
      ['', ''],
      ['Net Salary', salary.netSalary.toLocaleString()],
    ],
    theme: 'grid',
    headStyles: { fillColor: [0, 100, 0] },
    styles: { fontSize: 10 },
  });

  doc.setFontSize(8);
  doc.text('DEMO - This is a demonstration document', 105, 280, { align: 'center' });
  doc.save(`Salary_${teacherName.replace(/\s/g, '_')}_${salary.month}.pdf`);
}
