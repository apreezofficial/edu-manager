import fs from 'fs';
import path from 'path';

// Define DB directory within the Next.js project
const DB_DIR = path.join(process.cwd(), 'data');
const STUDENTS_FILE = path.join(DB_DIR, 'students.json');
const RESULTS_FILE = path.join(DB_DIR, 'results.json');
const STAFF_FILE = path.join(DB_DIR, 'staff.json');

// Interface types
export interface Student {
  id: number;
  full_name: string;
  admission_number: string;
  class_level: string;
  active: number;
}

export interface Result {
  id: string;
  admissionNumber: string;
  term: string;
  subject: string;
  score: string;
  grade: string;
  remarks: string;
  date: string;
}

// Staff has a list of subjects linked to them
export interface Staff {
  id: number;
  name: string;
  role: string;
  email: string;
  staff_number: string;
  subjects: string[]; // Taught subjects
}

// Helper to ensure database files exist with default data
function initDb() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  // default students
  if (!fs.existsSync(STUDENTS_FILE)) {
    const defaultStudents: Student[] = [
      { id: 1, full_name: "Ada Lovelace", admission_number: "DKS/2024/001", class_level: "Primary 1", active: 1 },
      { id: 2, full_name: "Boris Khan", admission_number: "DKS/2024/002", class_level: "Primary 2", active: 1 },
      { id: 3, full_name: "Chloe Ng", admission_number: "DKS/2024/003", class_level: "Primary 3", active: 1 }
    ];
    fs.writeFileSync(STUDENTS_FILE, JSON.stringify(defaultStudents, null, 2), 'utf8');
  }

  // default staff (with subjects linked of more than one subject)
  if (!fs.existsSync(STAFF_FILE)) {
    const defaultStaff: Staff[] = [
      { id: 1, name: "Mr Ajayi Reuben Opeyemi", role: "Proprietor", email: "", staff_number: "STF0001", subjects: ["Mathematics", "Computer Studies"] },
      { id: 2, name: "Mrs Ajayi Tosin", role: "Head of Administration", email: "", staff_number: "STF0002", subjects: ["English Language", "Social Studies"] },
      { id: 3, name: "Mrs Bankole Tomilade", role: "Supervisor", email: "", staff_number: "STF0003", subjects: ["Basic Science", "CRS"] },
      { id: 4, name: "Mrs Adedigba Esther", role: "HOD for Social and Prevocational Study", email: "", staff_number: "STF0004", subjects: ["Social Studies", "Physical Education"] },
      { id: 5, name: "Mrs Ajayi Oluwaseun", role: "Director for Phonetic", email: "", staff_number: "STF0005", subjects: ["English Language"] },
      { id: 6, name: "Mr Olalekan Wasiu", role: "Director of Coding and Robotics", email: "", staff_number: "STF0006", subjects: ["Computer Studies"] },
      { id: 7, name: "Admin", role: "Administrator", email: "", staff_number: "ADMIN", subjects: ["Mathematics", "English Language", "Basic Science", "Social Studies", "Yoruba", "CRS", "Physical Education", "Creative Arts", "Computer Studies"] }
    ];
    fs.writeFileSync(STAFF_FILE, JSON.stringify(defaultStaff, null, 2), 'utf8');
  }

  // default results
  if (!fs.existsSync(RESULTS_FILE)) {
    const defaultResults: Result[] = [
      { id: "1", admissionNumber: "DKS/2024/001", term: "First Term", subject: "Mathematics", score: "95", grade: "A", remarks: "Excellent", date: "2024-09-01" },
      { id: "2", admissionNumber: "DKS/2024/002", term: "First Term", subject: "Basic Science", score: "88", grade: "B", remarks: "Very Good", date: "2024-09-02" },
      { id: "3", admissionNumber: "DKS/2024/003", term: "First Term", subject: "English Language", score: "92", grade: "A", remarks: "Excellent", date: "2024-09-03" }
    ];
    fs.writeFileSync(RESULTS_FILE, JSON.stringify(defaultResults, null, 2), 'utf8');
  }
}

// Readers
export function getStudents(): Student[] {
  initDb();
  try {
    const content = fs.readFileSync(STUDENTS_FILE, 'utf8');
    return JSON.parse(content) as Student[];
  } catch (e) {
    return [];
  }
}

export function saveStudents(students: Student[]) {
  initDb();
  fs.writeFileSync(STUDENTS_FILE, JSON.stringify(students, null, 2), 'utf8');
}

export function getRawResults(): Result[] {
  initDb();
  try {
    const content = fs.readFileSync(RESULTS_FILE, 'utf8');
    return JSON.parse(content) as Result[];
  } catch (e) {
    return [];
  }
}

export function saveResults(results: Result[]) {
  initDb();
  fs.writeFileSync(RESULTS_FILE, JSON.stringify(results, null, 2), 'utf8');
}

export function getStaff(): Staff[] {
  initDb();
  try {
    const content = fs.readFileSync(STAFF_FILE, 'utf8');
    return JSON.parse(content) as Staff[];
  } catch (e) {
    return [];
  }
}

export function saveStaff(staffList: Staff[]) {
  initDb();
  fs.writeFileSync(STAFF_FILE, JSON.stringify(staffList, null, 2), 'utf8');
}

// Logic / Joins
export function getResultsJoined(): (Result & { student: string; classLevel: string })[] {
  const results = getRawResults();
  const students = getStudents();

  // Create student mapping by admission number for fast lookup
  const studentMap = new Map<string, Student>();
  students.forEach(s => {
    studentMap.set(s.admission_number.toUpperCase().trim(), s);
  });

  return results.map(r => {
    const student = studentMap.get(r.admissionNumber.toUpperCase().trim());
    return {
      ...r,
      student: student ? student.full_name : "Unknown Student",
      classLevel: student ? student.class_level : "Unknown Class"
    };
  });
}
