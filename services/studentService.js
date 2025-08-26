
import { getDatabaseInstance, waitForDatabase } from '../utils/database';

// ===========================================
// STUDENT CRUD OPERATIONS
// ===========================================

export const addStudent = async (fullname, department, gender) => {
  try {
    // console.log('addStudent called with:', { fullname, department, gender });
    const db = await waitForDatabase();
    if (!db) {
      throw new Error('Database not available');
    }
    const result = await db.runAsync(
      'INSERT INTO students (fullname, department, gender) VALUES (?, ?, ?)',
      [fullname, department, gender]
    );
    // console.log('Student added successfully, ID:', result.insertId);
    return result.insertId;
  } catch (error) {
    // console.error('Error adding student:', error);
    throw error;
  }
};

export const getStudents = async () => {
  try {
    // console.log('getStudents: Waiting for database...');
    const db = await waitForDatabase();
    // console.log('getStudents: Database ready, fetching students...');
    
    const students = await db.getAllAsync(
      'SELECT * FROM students ORDER BY fullname ASC'
    );

    // console.log('getStudents: Found', students?.length || 0, 'students');
    return students || [];
  } catch (error) {
    // console.error('Error getting students:', error);
    throw error;
  }
};

export const getStudentById = async (id) => {
  try {
    const db = getDatabaseInstance();
    const student = await db.getFirstAsync(
      'SELECT * FROM students WHERE id = ?',
      [id]
    );
    return student;
  } catch (error) {
    //console.error('Error getting student by ID:', error);
    throw error;
  }
};

export const updateStudent = async (id, fullname, department, gender) => {
  try {
    const db = getDatabaseInstance();
    const result = await db.runAsync(
  'UPDATE students SET fullname=?, department=?, gender=?, updatedAt=? WHERE id=?',
  [fullname, department, gender, new Date().toISOString(), id]
);
    return result.changes > 0;
  } catch (error) {
    //console.error('Error updating student:', error);
    throw error;
  }
};

export const deleteStudent = async (id) => {
  try {
    const db = getDatabaseInstance();
    
    // First delete related attendance records
    await db.runAsync('DELETE FROM attendance WHERE studentId = ?', [id]);
    
    // Then delete the student
    const result = await db.runAsync('DELETE FROM students WHERE id = ?', [id]);
    
    return result.changes > 0;
  } catch (error) {
    // console.error('Error deleting student:', error);
    throw error;
  }
};

// ===========================================
// STUDENT BUSINESS LOGIC & UTILITIES
// ===========================================

export const getStudentsByDepartment = async (department) => {
  try {
    const db = getDatabaseInstance();
    const students = await db.getAllAsync(
      'SELECT * FROM students WHERE department = ? ORDER BY fullname ASC',
      [department]
    );
    return students;
  } catch (error) {
    // console.error('Error getting students by department:', error);
    throw error;
  }
};

export const searchStudents = async (searchTerm) => {
  try {
    const db = getDatabaseInstance();
    const students = await db.getAllAsync(
      'SELECT * FROM students WHERE fullname LIKE ? OR department LIKE ? ORDER BY fullname ASC',
      [`%${searchTerm}%`, `%${searchTerm}%`]
    );
    return students;
  } catch (error) {
    // console.error('Error searching students:', error);
    throw error;
  }
};

export const getStudentStats = async () => {
  try {
    const db = getDatabaseInstance();
    const stats = await db.getFirstAsync(`
      SELECT 
        COUNT(*) as totalStudents,
        COUNT(DISTINCT department) as totalDepartments
      FROM students
    `);
    return stats;
  } catch (error) {
    // console.error('Error getting student statistics:', error);
    throw error;
  }
};

export const getDepartmentStats = async () => {
  try {
    const db = getDatabaseInstance();
    const stats = await db.getAllAsync(`
      SELECT 
        department,
        COUNT(*) as studentCount
      FROM students 
      GROUP BY department 
      ORDER BY studentCount DESC
    `);
    return stats;
  } catch (error) {
    // console.error('Error getting department statistics:', error);
    throw error;
  }
};

export const getGenderStats = async () => {
  try {
    const db = getDatabaseInstance();
    const stats = await db.getAllAsync(`
      SELECT 
        gender,
        COUNT(*) as count
      FROM students 
      GROUP BY gender 
      ORDER BY count DESC
    `);
    return stats;
  } catch (error) {
    // console.error('Error getting gender statistics:', error);
    throw error;
  }
};

export const getStudentSummary = async () => {
  try {
    const db = getDatabaseInstance();
    const summary = await db.getFirstAsync(`
      SELECT 
        COUNT(*) as totalStudents,
        SUM(CASE WHEN gender = 'Male' THEN 1 ELSE 0 END) as maleCount,
        SUM(CASE WHEN gender = 'Female' THEN 1 ELSE 0 END) as femaleCount,
        COUNT(DISTINCT department) as totalDepartments
      FROM students
    `);
    return summary;
  } catch (error) {
    // console.error('Error getting student summary:', error);
    throw error;
  }
};
