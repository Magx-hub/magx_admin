import { getDatabaseInstance } from '../utils/database';

// ===========================================
// UTILITY FUNCTIONS
// ===========================================

// Calculate total JHS students
export const calculateTotalJHSStudents = (allowanceData) => {
  const { basic7JHS, basic8JHS, basic9JHS } = allowanceData;
  return (basic7JHS || 0) + (basic8JHS || 0) + (basic9JHS || 0);
};

// Calculate total general students
export const calculateTotalGeneralStudents = (allowanceData) => {
  const {
    creche, nursery1, nursery2, kg1, kg2,
    basic1, basic2, basic3, basic4, basic5, basic6,
    basic7General, basic8General, basic9General
  } = allowanceData;
  
  return (creche || 0) + (nursery1 || 0) + (nursery2 || 0) + (kg1 || 0) + (kg2 || 0) +
         (basic1 || 0) + (basic2 || 0) + (basic3 || 0) + (basic4 || 0) + (basic5 || 0) +
         (basic6 || 0) + (basic7General || 0) + (basic8General || 0) + (basic9General || 0);
};

// Validate allowance data
export const validateAllowanceData = (allowanceData) => {
  const errors = [];
  
  if (!allowanceData.weekNumber || allowanceData.weekNumber < 1 || allowanceData.weekNumber > 52) {
    errors.push('Week number must be between 1 and 52');
  }
  
  if (!allowanceData.numberOfTeachers || allowanceData.numberOfTeachers < 0) {
    errors.push('Number of teachers must be a positive number');
  }
  
  if (!allowanceData.numberOfJHSTeachers || allowanceData.numberOfJHSTeachers < 0) {
    errors.push('Number of JHS teachers must be a positive number');
  }
  
  if (!allowanceData.totalSum || allowanceData.totalSum <= 0) {
    errors.push('Total sum must be greater than 0');
  }
  
  return errors;
};

// Format currency for display
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    minimumFractionDigits: 2
  }).format(amount || 0);
};

// Calculate allowance per teacher
export const calculateTeacherAllowance = (totalAmount, numberOfTeachers, deductions = 0) => {
  if (numberOfTeachers <= 0) return 0;
  const netAmount = totalAmount - deductions;
  return Math.max(0, netAmount / numberOfTeachers);
};

// ===========================================
// BUSINESS LOGIC FUNCTIONS
// ===========================================

// Check if week already exists
export const weekExists = async (weekNumber) => {
  try {
    const db = getDatabaseInstance();
    const existing = await db.getFirstAsync(
      'SELECT id FROM calculations WHERE weekNumber = ?',
      [weekNumber]
    );
    return !!existing;
  } catch (error) {
    // console.error('Error checking if week exists:', error);
    throw error;
  }
};

// Get allowance summary statistics
export const getAllowanceSummary = async () => {
  try {
    const db = getDatabaseInstance();
    
    const summary = await db.getFirstAsync(`
      SELECT 
        COUNT(*) as totalRecords,
        AVG(totalSum) as avgTotalSum,
        MAX(totalSum) as maxTotalSum,
        MIN(totalSum) as minTotalSum,
        AVG(eachTeacher) as avgTeacherAllowance,
        AVG(eachJHSTeacher) as avgJHSTeacherAllowance
      FROM calculations
    `);
    
    return summary;
  } catch (error) {
    // console.error('Error getting allowance summary:', error);
    throw error;
  }
};

// Get records within date range
export const getAllowanceRecordsByRange = async (startWeek, endWeek) => {
  try {
    const db = getDatabaseInstance();
    
    const records = await db.getAllAsync(
      'SELECT * FROM calculations WHERE weekNumber BETWEEN ? AND ? ORDER BY weekNumber ASC',
      [startWeek, endWeek]
    );
    
    return records;
  } catch (error) {
    // console.error('Error getting records by range:', error);
    throw error;
  }
};

// Calculate total deductions
export const calculateTotalDeductions = (allowanceData) => {
  const { welfare, office, kitchen } = allowanceData;
  return (welfare || 0) + (office || 0) + (kitchen || 0);
};

// ===========================================
// ENHANCED CRUD OPERATIONS
// ===========================================

export const addAllowanceRecord = async (allowanceData) => {
  try {
    // Validate data first
    const validationErrors = validateAllowanceData(allowanceData);
    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }
    
    // Check if week already exists
    const exists = await weekExists(allowanceData.weekNumber);
    if (exists) {
      throw new Error(`Record for week ${allowanceData.weekNumber} already exists`);
    }
    
    const db = getDatabaseInstance();
    
    const {
      weekNumber, creche, nursery1, nursery2, kg1, kg2,
      basic1, basic2, basic3, basic4, basic5, basic6,
      basic7General, basic7JHS, basic8General, basic8JHS,
      basic9General, basic9JHS, numberOfTeachers, numberOfJHSTeachers,
      totalSum, welfare, balanceAfterWelfare, office, balanceAfterOffice,
      kitchen, balanceAfterKitchen, eachTeacher, jhsTeachersClasses, eachJHSTeacher
    } = allowanceData;
    
    const result = await db.runAsync(
      `INSERT INTO calculations (
        weekNumber, creche, nursery1, nursery2, kg1, kg2,
        basic1, basic2, basic3, basic4, basic5, basic6,
        basic7General, basic7JHS, basic8General, basic8JHS,
        basic9General, basic9JHS, numberOfTeachers, numberOfJHSTeachers,
        totalSum, welfare, balanceAfterWelfare, office, balanceAfterOffice,
        kitchen, balanceAfterKitchen, eachTeacher, jhsTeachersClasses, eachJHSTeacher,
        createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        weekNumber, creche, nursery1, nursery2, kg1, kg2,
        basic1, basic2, basic3, basic4, basic5, basic6,
        basic7General, basic7JHS, basic8General, basic8JHS,
        basic9General, basic9JHS, numberOfTeachers, numberOfJHSTeachers,
        totalSum, welfare, balanceAfterWelfare, office, balanceAfterOffice,
        kitchen, balanceAfterKitchen, eachTeacher, jhsTeachersClasses, eachJHSTeacher,
        new Date().toISOString()
      ]
    );
    
    return result.lastInsertRowId;
  } catch (error) {
    // console.error('Error saving calculation:', error);
    throw error;
  }
};

export const getAllowanceRecords = async (limit = null, offset = 0) => {
  try {
    const db = getDatabaseInstance();
    
    let query = 'SELECT * FROM calculations ORDER BY weekNumber DESC';
    const params = [];
    
    if (limit) {
      query += ' LIMIT ? OFFSET ?';
      params.push(limit, offset);
    }
    
    const calculations = await db.getAllAsync(query, params);
    
    return calculations;
  } catch (error) {
    // console.error('Error getting calculations:', error);
    throw error;
  }
};

export const getAllowanceRecordByWeek = async (weekNumber) => {
  try {
    const db = getDatabaseInstance();
    
    const calculation = await db.getFirstAsync(
      'SELECT * FROM calculations WHERE weekNumber = ?',
      [weekNumber]
    );
    
    return calculation;
  } catch (error) {
    // console.error('Error getting allowance record by week:', error);
    throw error;
  }
};

export const updateAllowanceRecord = async (id, allowanceData) => {
  try {
    // Validate data first
    const validationErrors = validateAllowanceData(allowanceData);
    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }
    
    const db = getDatabaseInstance();
    
    const {
      weekNumber, creche, nursery1, nursery2, kg1, kg2,
      basic1, basic2, basic3, basic4, basic5, basic6,
      basic7General, basic7JHS, basic8General, basic8JHS,
      basic9General, basic9JHS, numberOfTeachers, numberOfJHSTeachers,
      totalSum, welfare, balanceAfterWelfare, office, balanceAfterOffice,
      kitchen, balanceAfterKitchen, eachTeacher, jhsTeachersClasses, eachJHSTeacher
    } = allowanceData;
    
    const result = await db.runAsync(
      `UPDATE calculations SET 
        weekNumber = ?, creche = ?, nursery1 = ?, nursery2 = ?, kg1 = ?, kg2 = ?,
        basic1 = ?, basic2 = ?, basic3 = ?, basic4 = ?, basic5 = ?, basic6 = ?,
        basic7General = ?, basic7JHS = ?, basic8General = ?, basic8JHS = ?,
        basic9General = ?, basic9JHS = ?, numberOfTeachers = ?, numberOfJHSTeachers = ?,
        totalSum = ?, welfare = ?, balanceAfterWelfare = ?, office = ?, balanceAfterOffice = ?,
        kitchen = ?, balanceAfterKitchen = ?, eachTeacher = ?, jhsTeachersClasses = ?, 
        eachJHSTeacher = ?
      WHERE id = ?`,
      [
        weekNumber, creche, nursery1, nursery2, kg1, kg2,
        basic1, basic2, basic3, basic4, basic5, basic6,
        basic7General, basic7JHS, basic8General, basic8JHS,
        basic9General, basic9JHS, numberOfTeachers, numberOfJHSTeachers,
        totalSum, welfare, balanceAfterWelfare, office, balanceAfterOffice,
        kitchen, balanceAfterKitchen, eachTeacher, jhsTeachersClasses, eachJHSTeacher,
        id
      ]
    );
    
    return result.changes > 0;
  } catch (error) {
    // console.error('Error updating allowance record:', error);
    throw error;
  }
};

export const deleteAllowanceRecord = async (id) => {
  try {
    const db = getDatabaseInstance();
    
    const result = await db.runAsync('DELETE FROM calculations WHERE id = ?', [id]);
    
    return result.changes > 0;
  } catch (error) {
    // console.error('Error deleting allowance record:', error);
    throw error;
  }
};

// ===========================================
// REPORTING FUNCTIONS
// ===========================================

// Get welfare records with week number, welfare amount, and date paid
export const getWelfareRecords = async (limit = null, offset = 0) => {
  try {
    // console.log('getWelfareRecords called with limit:', limit, 'offset:', offset);
    
    const db = getDatabaseInstance();
    
    let query = `
      SELECT 
        weekNumber,
        welfare,
        createdAt
      FROM calculations 
      WHERE welfare > 0 
      ORDER BY weekNumber DESC
    `;
    const params = [];
    
    if (limit) {
      query += ' LIMIT ? OFFSET ?';
      params.push(limit, offset);
    }
    
    const welfareRecords = await db.getAllAsync(query, params);
    // console.log('Database welfare records:', welfareRecords.length, 'found');
    
    // Format the date for display
    const formattedRecords = welfareRecords.map(record => {
      let datePaid = 'N/A';
      if (record.createdAt) {
        try {
          const date = new Date(record.createdAt);
          if (!isNaN(date.getTime())) {
            datePaid = date.toLocaleDateString();
          }
        } catch (e) {
          // console.log('Error parsing date:', record.createdAt, e);
        }
      }
      
      return {
        ...record,
        datePaid
      };
    });
    
    // console.log('Formatted welfare records:', formattedRecords);
    return formattedRecords;
  } catch (error) {
    // console.error('Error getting welfare records:', error);
    throw error;
  }
};

// Generate weekly report
export const generateWeeklyReport = async (weekNumber) => {
  try {
    const record = await getAllowanceRecordByWeek(weekNumber);
    if (!record) return null;
    
    const totalJHSStudents = calculateTotalJHSStudents(record);
    const totalGeneralStudents = calculateTotalGeneralStudents(record);
    const totalDeductions = calculateTotalDeductions(record);
    
    return {
      ...record,
      totalJHSStudents,
      totalGeneralStudents,
      totalDeductions,
      formattedTotalSum: formatCurrency(record.totalSum),
      formattedEachTeacher: formatCurrency(record.eachTeacher),
      formattedEachJHSTeacher: formatCurrency(record.eachJHSTeacher)
    };
  } catch (error) {
    // console.error('Error generating weekly report:', error);
    throw error;
  }
};
