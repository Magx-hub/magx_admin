import { getDatabaseInstance } from '../utils/database';

// ===========================================
// TEACHER CRUD OPERATIONS
// ===========================================

export const addTeacher = async (fullname, department) => {
  try {
    // console.log('addTeacher called with:', { fullname, department });
    const db = getDatabaseInstance();
    const result = await db.runAsync(
      'INSERT INTO teachers (fullname, department) VALUES (?, ?)',
      [fullname, department]
    );
    // console.log('Teacher added successfully, ID:', result.insertId);
    return result.insertId;
  } catch (error) {
    // console.error('Error adding teacher:', error);
    throw error;
  }
};

export const getTeachers = async () => {
  try {
    const db = getDatabaseInstance();
    const teachers = await db.getAllAsync(
      'SELECT * FROM teachers ORDER BY fullname ASC'
    );
    return teachers;
  } catch (error) {
    // console.error('Error getting teachers:', error);
    throw error;
  }
};

export const getTeacherById = async (id) => {
  try {
    const db = getDatabaseInstance();
    const teacher = await db.getFirstAsync(
      'SELECT * FROM teachers WHERE id = ?',
      [id]
    );
    return teacher;
  } catch (error) {
    // console.error('Error getting teacher by ID:', error);
    throw error;
  }
};

export const updateTeacher = async (id, fullname, department) => {
  try {
    const db = getDatabaseInstance();
    const result = await db.runAsync(
  'UPDATE teachers SET fullname=?, department=?, updatedAt=? WHERE id=?',
  [fullname, department, new Date().toISOString(), id]
);
    return result.changes > 0;
  } catch (error) {
    // console.error('Error updating teacher:', error);
    throw error;
  }
};

export const deleteTeacher = async (id) => {
  try {
    const db = getDatabaseInstance();
    
    // First delete related attendance records
    await db.runAsync('DELETE FROM attendance WHERE teacherId = ?', [id]);
    
    // Then delete the teacher
    const result = await db.runAsync('DELETE FROM teachers WHERE id = ?', [id]);
    
    return result.changes > 0;
  } catch (error) {
    // console.error('Error deleting teacher:', error);
    throw error;
  }
};

// ===========================================
// TEACHER BUSINESS LOGIC & UTILITIES
// ===========================================

export const getTeachersByDepartment = async (department) => {
  try {
    const db = getDatabaseInstance();
    const teachers = await db.getAllAsync(
      'SELECT * FROM teachers WHERE department = ? ORDER BY fullname ASC',
      [department]
    );
    return teachers;
  } catch (error) {
    // console.error('Error getting teachers by department:', error);
    throw error;
  }
};

export const searchTeachers = async (searchTerm) => {
  try {
    const db = getDatabaseInstance();
    const teachers = await db.getAllAsync(
      'SELECT * FROM teachers WHERE fullname LIKE ? OR department LIKE ? ORDER BY fullname ASC',
      [`%${searchTerm}%`, `%${searchTerm}%`]
    );
    return teachers;
  } catch (error) {
    // console.error('Error searching teachers:', error);
    throw error;
  }
};

export const getTeacherStats = async () => {
  try {
    const db = getDatabaseInstance();
    const stats = await db.getFirstAsync(`
      SELECT 
        COUNT(*) as totalTeachers,
        COUNT(DISTINCT department) as totalDepartments
      FROM teachers
    `);
    return stats;
  } catch (error) {
    // console.error('Error getting teacher statistics:', error);
    throw error;
  }
};

export const getDepartmentStats = async () => {
  try {
    const db = getDatabaseInstance();
    const stats = await db.getAllAsync(`
      SELECT 
        department,
        COUNT(*) as teacherCount
      FROM teachers 
      GROUP BY department 
      ORDER BY teacherCount DESC
    `);
    return stats;
  } catch (error) {
    // console.error('Error getting department statistics:', error);
    throw error;
  }
};