// services/canteenService.js
import { getDatabaseInstance } from '../utils/database';

// ===========================================
// FEE STRUCTURE MANAGEMENT
// ===========================================

// Get current fee structure for a department
export const getCurrentFeeStructure = async (department) => {
  try {
    const db = getDatabaseInstance();
    
    const feeStructure = await db.getFirstAsync(`
      SELECT * FROM feeStructure 
      WHERE department = ? 
      ORDER BY effectiveDate DESC 
      LIMIT 1
    `, [department]);
    
    return feeStructure;
  } catch (error) {
    // console.error('Error getting fee structure:', error);
    throw error;
  }
};

// Get all fee structures
export const getAllFeeStructures = async () => {
  try {
    const db = getDatabaseInstance();
    
    const feeStructures = await db.getAllAsync(`
      SELECT * FROM feeStructure 
      ORDER BY department ASC, effectiveDate DESC
    `);
    
    return feeStructures;
  } catch (error) {
    // console.error('Error getting all fee structures:', error);
    throw error;
  }
};

// Add new fee structure
export const addFeeStructure = async (feeData) => {
  try {
    const db = getDatabaseInstance();
    
    const { department, classesFee, breakfastFee, effectiveDate } = feeData;
    
    const result = await db.runAsync(`
      INSERT INTO feeStructure (department, classesFee, breakfastFee, effectiveDate)
      VALUES (?, ?, ?, ?)
    `, [department, classesFee, breakfastFee, effectiveDate]);
    
    return result.lastInsertRowId;
  } catch (error) {
    // console.error('Error adding fee structure:', error);
    throw error;
  }
};

// Update fee structure
export const updateFeeStructure = async (id, feeData) => {
  try {
    const db = getDatabaseInstance();
    
    const { department, classesFee, breakfastFee, effectiveDate } = feeData;
    
    const result = await db.runAsync(`
      UPDATE feeStructure 
      SET department = ?, classesFee = ?, breakfastFee = ?, effectiveDate = ?
      WHERE id = ?
    `, [department, classesFee, breakfastFee, effectiveDate, id]);
    
    return result.changes > 0;
  } catch (error) {
    // console.error('Error updating fee structure:', error);
    throw error;
  }
};

// Delete fee structure
export const deleteFeeStructure = async (id) => {
  try {
    const db = getDatabaseInstance();
    
    const result = await db.runAsync('DELETE FROM feeStructure WHERE id = ?', [id]);
    
    return result.changes > 0;
  } catch (error) {
    //console.error('Error deleting fee structure:', error);
    throw error;
  }
};

// ===========================================
// DAILY PAYMENTS MANAGEMENT
// ===========================================

// Record a daily payment
export const recordDailyPayment = async (paymentData) => {
  try {
    const db = getDatabaseInstance();
    
    const { 
      studentId, 
      classesFee, 
      breakfastFee, 
      otherFee = 0, 
      paymentMethod, 
      notes,
      paymentDate = new Date().toISOString().split('T')[0] // Default to today
    } = paymentData;
    
    // Check if payment already exists for this student on this date
    const existingPayment = await db.getFirstAsync(`
      SELECT id FROM dailyPayments 
      WHERE studentId = ? AND paymentDate = ?
    `, [studentId, paymentDate]);
    
    if (existingPayment) {
      throw new Error(`Payment already exists for student on ${paymentDate}`);
    }
    
    const result = await db.runAsync(`
      INSERT INTO dailyPayments 
      (studentId, paymentDate, classesFee, breakfastFee, otherFee, paymentMethod, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [studentId, paymentDate, classesFee, breakfastFee, otherFee, paymentMethod, notes]);
    
    return result.lastInsertRowId;
  } catch (error) {
    // console.error('Error recording daily payment:', error);
    throw error;
  }
};

// Get daily payments for a specific date
export const getDailyPayments = async (date = null) => {
  try {
    const db = getDatabaseInstance();
    
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    const payments = await db.getAllAsync(`
      SELECT 
        dp.*,
        s.fullname as studentName,
        s.department as studentDepartment
      FROM dailyPayments dp
      JOIN students s ON dp.studentId = s.id
      WHERE dp.paymentDate = ?
      ORDER BY s.fullname ASC
    `, [targetDate]);
    
    return payments;
  } catch (error) {
    // console.error('Error getting daily payments:', error);
    throw error;
  }
};

// Get payments for a specific student
export const getStudentPayments = async (studentId, startDate = null, endDate = null) => {
  try {
    const db = getDatabaseInstance();
    
    let query = `
      SELECT dp.*, s.fullname as studentName, s.department as studentDepartment
      FROM dailyPayments dp
      JOIN students s ON dp.studentId = s.id
      WHERE dp.studentId = ?
    `;
    const params = [studentId];
    
    if (startDate && endDate) {
      query += ' AND dp.paymentDate BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }
    
    query += ' ORDER BY dp.paymentDate DESC';
    
    const payments = await db.getAllAsync(query, params);
    
    return payments;
  } catch (error) {
    // console.error('Error getting student payments:', error);
    throw error;
  }
};

// Update a daily payment
export const updateDailyPayment = async (id, paymentData) => {
  try {
    const db = getDatabaseInstance();
    
    const { 
      classesFee, 
      breakfastFee, 
      otherFee, 
      paymentMethod, 
      notes 
    } = paymentData;
    
    const result = await db.runAsync(`
      UPDATE dailyPayments 
      SET classesFee = ?, breakfastFee = ?, otherFee = ?, 
          paymentMethod = ?, notes = ?, updatedAt = datetime('now', 'localtime')
      WHERE id = ?
    `, [classesFee, breakfastFee, otherFee, paymentMethod, notes, id]);
    
    return result.changes > 0;
  } catch (error) {
    // console.error('Error updating daily payment:', error);
    throw error;
  }
};

// Delete a daily payment
export const deleteDailyPayment = async (id) => {
  try {
    const db = getDatabaseInstance();
    
    const result = await db.runAsync('DELETE FROM dailyPayments WHERE id = ?', [id]);
    
    return result.changes > 0;
  } catch (error) {
    // console.error('Error deleting daily payment:', error);
    throw error;
  }
};

// ===========================================
// REPORTING AND ANALYTICS
// ===========================================

// Get daily summary
export const getDailySummary = async (date = null) => {
  try {
    const db = getDatabaseInstance();
    
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    const summary = await db.getFirstAsync(`
      SELECT 
        COUNT(*) as totalPayments,
        SUM(classesFee) as totalClassesFee,
        SUM(breakfastFee) as totalBreakfastFee,
        SUM(otherFee) as totalOtherFee,
        SUM(totalFee) as totalAmount,
        COUNT(DISTINCT studentId) as uniqueStudents
      FROM dailyPayments 
      WHERE paymentDate = ?
    `, [targetDate]);
    
    return summary;
  } catch (error) {
    // console.error('Error getting daily summary:', error);
    throw error;
  }
};

// Get department-wise summary for a date
export const getDepartmentSummary = async (date = null) => {
  try {
    const db = getDatabaseInstance();
    
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    const summary = await db.getAllAsync(`
      SELECT 
        s.department,
        COUNT(*) as totalPayments,
        SUM(dp.classesFee) as totalClassesFee,
        SUM(dp.breakfastFee) as totalBreakfastFee,
        SUM(dp.otherFee) as totalOtherFee,
        SUM(dp.totalFee) as totalAmount
      FROM dailyPayments dp
      JOIN students s ON dp.studentId = s.id
      WHERE dp.paymentDate = ?
      GROUP BY s.department
      ORDER BY s.department ASC
    `, [targetDate]);
    
    return summary;
  } catch (error) {
    // console.error('Error getting department summary:', error);
    throw error;
  }
};

// Get payment history for date range
export const getPaymentHistory = async (startDate, endDate) => {
  try {
    const db = getDatabaseInstance();
    
    const payments = await db.getAllAsync(`
      SELECT 
        dp.*,
        s.fullname as studentName,
        s.department as studentDepartment
      FROM dailyPayments dp
      JOIN students s ON dp.studentId = s.id
      WHERE dp.paymentDate BETWEEN ? AND ?
      ORDER BY dp.paymentDate DESC, s.fullname ASC
    `, [startDate, endDate]);
    
    return payments;
  } catch (error) {
    // console.error('Error getting payment history:', error);
    throw error;
  }
};

// Get aggregated payment reports
export const getAggregatedPayments = async (groupBy, startDate, endDate) => {
  try {
    const db = getDatabaseInstance();
    let query;
    const params = [startDate, endDate];

    const baseQuery = `
      FROM dailyPayments dp
      JOIN students s ON dp.studentId = s.id
      WHERE dp.paymentDate BETWEEN ? AND ?
    `;

    switch (groupBy) {
      case 'department':
        query = `
          SELECT 
            s.department,
            SUM(dp.totalFee) as totalAmount,
            COUNT(dp.id) as totalPayments
          ${baseQuery}
          GROUP BY s.department
          ORDER BY s.department ASC
        `;
        break;
      case 'day':
        query = `
          SELECT 
            dp.paymentDate,
            SUM(dp.totalFee) as totalAmount,
            COUNT(dp.id) as totalPayments
          ${baseQuery}
          GROUP BY dp.paymentDate
          ORDER BY dp.paymentDate ASC
        `;
        break;
      case 'week':
        query = `
          SELECT 
            strftime('%Y-%W', dp.paymentDate) as week,
            SUM(dp.totalFee) as totalAmount,
            COUNT(dp.id) as totalPayments
          ${baseQuery}
          GROUP BY week
          ORDER BY week ASC
        `;
        break;
      default:
        throw new Error('Invalid groupBy parameter. Use "department", "day", or "week".');
    }

    const result = await db.getAllAsync(query, params);
    return result;
  } catch (error) {
    // console.error(`Error getting aggregated payments by ${groupBy}:`, error);
    throw error;
  }
};

// ===========================================
// UTILITY FUNCTIONS
// ===========================================

// Calculate total fee for a student based on current fee structure
export const calculateStudentFee = async (studentId, otherFee = 0) => {
  try {
    const db = getDatabaseInstance();
    
    // Get student's department
    const student = await db.getFirstAsync(
      'SELECT department FROM students WHERE id = ?',
      [studentId]
    );
    
    if (!student) {
      throw new Error('Student not found');
    }
    
    // Get current fee structure for the department
    const feeStructure = await getCurrentFeeStructure(student.department);
    
    if (!feeStructure) {
      throw new Error(`No fee structure found for department: ${student.department}`);
    }
    
    const totalFee = feeStructure.classesFee + feeStructure.breakfastFee + otherFee;
    
    return {
      studentId,
      department: student.department,
      classesFee: feeStructure.classesFee,
      breakfastFee: feeStructure.breakfastFee,
      otherFee,
      totalFee
    };
  } catch (error) {
    // console.error('Error calculating student fee:', error);
    throw error;
  }
};

// Check if student has paid for today
export const hasStudentPaidToday = async (studentId, date = null) => {
  try {
    const db = getDatabaseInstance();
    
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    const payment = await db.getFirstAsync(`
      SELECT id FROM dailyPayments 
      WHERE studentId = ? AND paymentDate = ?
    `, [studentId, targetDate]);
    
    return !!payment;
  } catch (error) {
    // console.error('Error checking if student has paid:', error);
    throw error;
  }
};