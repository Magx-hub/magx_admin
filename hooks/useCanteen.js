import { useState, useEffect, useCallback } from 'react';
import {
  getCurrentFeeStructure,
  getAllFeeStructures,
  addFeeStructure,
  updateFeeStructure,
  deleteFeeStructure,
  recordDailyPayment,
  getDailyPayments,
  getStudentPayments,
  updateDailyPayment,
  deleteDailyPayment,
  getDailySummary,
  getDepartmentSummary,
  getPaymentHistory,
  getAggregatedPayments,
  calculateStudentFee,
  hasStudentPaidToday
} from '../services/canteenService';
import { useStudents } from './useStudents';

export const useCanteen = () => {
  // Get students from useStudents hook (same pattern as useAttendance)
  const { students, loading: studentsLoading, error: studentsError } = useStudents();
  
  // State for fee structures
  const [feeStructures, setFeeStructures] = useState([]);
  const [loadingFeeStructures, setLoadingFeeStructures] = useState(false);
  
  // State for daily payments
  const [dailyPayments, setDailyPayments] = useState([]);
  const [loadingDailyPayments, setLoadingDailyPayments] = useState(false);
  
  // State for current date
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  
  // State for daily summary
  const [dailySummary, setDailySummary] = useState(null);
  const [loadingDailySummary, setLoadingDailySummary] = useState(false);
  
  // State for department summary
  const [departmentSummary, setDepartmentSummary] = useState([]);
  const [loadingDepartmentSummary, setLoadingDepartmentSummary] = useState(false);

  // State for aggregated payments
  const [aggregatedPayments, setAggregatedPayments] = useState([]);
  const [loadingAggregatedPayments, setLoadingAggregatedPayments] = useState(false);

  // ===========================================
  // FEE STRUCTURE MANAGEMENT
  // ===========================================

  // Fetch all fee structures
  const fetchFeeStructures = useCallback(async () => {
    try {
      setLoadingFeeStructures(true);
      const structures = await getAllFeeStructures();
      setFeeStructures(structures);
    } catch (error) {
      // console.error('Error fetching fee structures:', error);
      throw error;
    } finally {
      setLoadingFeeStructures(false);
    }
  }, []);

  // Add new fee structure
  const addNewFeeStructure = useCallback(async (feeData) => {
    try {
      const newId = await addFeeStructure(feeData);
      await fetchFeeStructures(); // Refresh the list
      return newId;
    } catch (error) {
      // console.error('Error adding fee structure:', error);
      throw error;
    }
  }, [fetchFeeStructures]);

  // Update fee structure
  const updateExistingFeeStructure = useCallback(async (id, feeData) => {
    try {
      const success = await updateFeeStructure(id, feeData);
      if (success) {
        await fetchFeeStructures(); // Refresh the list
      }
      return success;
    } catch (error) {
      console.error('Error updating fee structure:', error);
      throw error;
    }
  }, [fetchFeeStructures]);

  // Delete fee structure
  const deleteExistingFeeStructure = useCallback(async (id) => {
    try {
      const success = await deleteFeeStructure(id);
      if (success) {
        await fetchFeeStructures(); // Refresh the list
      }
      return success;
    } catch (error) {
      // console.error('Error deleting fee structure:', error);
      throw error;
    }
  }, [fetchFeeStructures]);

  // Get current fee structure for a department
  const getCurrentFeeStructureForDepartment = useCallback(async (department) => {
    try {
      return await getCurrentFeeStructure(department);
    } catch (error) {
      // console.error('Error getting current fee structure:', error);
      throw error;
    }
  }, []);

  // ===========================================
  // DAILY PAYMENTS MANAGEMENT
  // ===========================================

  // Fetch daily payments for a specific date
  const fetchDailyPayments = useCallback(async (date = null) => {
    try {
      setLoadingDailyPayments(true);
      const targetDate = date || currentDate;
      const payments = await getDailyPayments(targetDate);
      setDailyPayments(payments);
    } catch (error) {
      // console.error('Error fetching daily payments:', error);
      throw error;
    } finally {
      setLoadingDailyPayments(false);
    }
  }, [currentDate]);

  // Record a new daily payment
  const recordNewDailyPayment = useCallback(async (paymentData) => {
    try {
      const newId = await recordDailyPayment(paymentData);
      await fetchDailyPayments(); // Refresh the list
      return newId;
    } catch (error) {
      // console.error('Error recording daily payment:', error);
      throw error;
    }
  }, [fetchDailyPayments]);

  // Update a daily payment
  const updateExistingDailyPayment = useCallback(async (id, paymentData) => {
    try {
      const success = await updateDailyPayment(id, paymentData);
      if (success) {
        await fetchDailyPayments(); // Refresh the list
      }
      return success;
    } catch (error) {
      console.error('Error updating daily payment:', error);
      throw error;
    }
  }, [fetchDailyPayments]);

  // Delete a daily payment
  const deleteExistingDailyPayment = useCallback(async (id) => {
    try {
      const success = await deleteDailyPayment(id);
      if (success) {
        await fetchDailyPayments(); // Refresh the list
      }
      return success;
    } catch (error) {
      console.error('Error deleting daily payment:', error);
      throw error;
    }
  }, [fetchDailyPayments]);

  // Get payments for a specific student
  const fetchStudentPayments = useCallback(async (studentId, startDate = null, endDate = null) => {
    try {
      return await getStudentPayments(studentId, startDate, endDate);
    } catch (error) {
      console.error('Error fetching student payments:', error);
      throw error;
    }
  }, []);

  // ===========================================
  // REPORTING AND ANALYTICS
  // ===========================================

  // Fetch daily summary
  const fetchDailySummary = useCallback(async (date = null) => {
    try {
      setLoadingDailySummary(true);
      const targetDate = date || currentDate;
      const summary = await getDailySummary(targetDate);
      setDailySummary(summary);
    } catch (error) {
      console.error('Error fetching daily summary:', error);
      throw error;
    } finally {
      setLoadingDailySummary(false);
    }
  }, [currentDate]);

  // Fetch department summary
  const fetchDepartmentSummary = useCallback(async (date = null) => {
    try {
      setLoadingDepartmentSummary(true);
      const targetDate = date || currentDate;
      const summary = await getDepartmentSummary(targetDate);
      setDepartmentSummary(summary);
    } catch (error) {
      console.error('Error fetching department summary:', error);
      throw error;
    } finally {
      setLoadingDepartmentSummary(false);
    }
  }, [currentDate]);

  // Get payment history for date range
  const fetchPaymentHistory = useCallback(async (startDate, endDate) => {
    try {
      return await getPaymentHistory(startDate, endDate);
    } catch (error) {
      console.error('Error fetching payment history:', error);
      throw error;
    }
  }, []);

  // ===========================================
  // UTILITY FUNCTIONS
  // ===========================================



// Fetch aggregated payments
const fetchAggregatedPayments = useCallback(async (groupBy, startDate, endDate) => {
  try {
    setLoadingAggregatedPayments(true);
    const result = await getAggregatedPayments(groupBy, startDate, endDate);
    setAggregatedPayments(result);
    return result;
  } catch (error) {
    console.error(`Error fetching aggregated payments for ${groupBy}:`, error);
    setAggregatedPayments([]); // Clear data on error
    throw error;
  } finally {
    setLoadingAggregatedPayments(false);
  }
}, []);

  // ===========================================
  // UTILITY FUNCTIONS
  // ===========================================

  // Calculate student fee
  const calculateFeeForStudent = useCallback(async (studentId, otherFee = 0) => {
    try {
      return await calculateStudentFee(studentId, otherFee);
    } catch (error) {
      console.error('Error calculating student fee:', error);
      throw error;
    }
  }, []);

  // Check if student has paid for today
  const checkStudentPaymentStatus = useCallback(async (studentId, date = null) => {
    try {
      return await hasStudentPaidToday(studentId, date);
    } catch (error) {
      console.error('Error checking student payment status:', error);
      throw error;
    }
  }, []);

  // ===========================================
  // DATE MANAGEMENT
  // ===========================================

  // Change current date
  const changeCurrentDate = useCallback((newDate) => {
    setCurrentDate(newDate);
  }, []);

  // Go to previous day
  const goToPreviousDay = useCallback(() => {
    const prevDate = new Date(currentDate);
    prevDate.setDate(prevDate.getDate() - 1);
    setCurrentDate(prevDate.toISOString().split('T')[0]);
  }, [currentDate]);

  // Go to next day
  const goToNextDay = useCallback(() => {
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 1);
    setCurrentDate(nextDate.toISOString().split('T')[0]);
  }, [currentDate]);

  // Go to today
  const goToToday = useCallback(() => {
    setCurrentDate(new Date().toISOString().split('T')[0]);
  }, []);

  // ===========================================
  // EFFECTS
  // ===========================================

  // Load initial data
  useEffect(() => {
    fetchFeeStructures();
    fetchDailyPayments();
    fetchDailySummary();
    fetchDepartmentSummary();
  }, [fetchFeeStructures, fetchDailyPayments, fetchDailySummary, fetchDepartmentSummary]);

  // Refresh data when date changes
  useEffect(() => {
    fetchDailyPayments();
    fetchDailySummary();
    fetchDepartmentSummary();
  }, [currentDate, fetchDailyPayments, fetchDailySummary, fetchDepartmentSummary]);

  return {
    // State
    feeStructures,
    dailyPayments,
    currentDate,
    dailySummary,
    departmentSummary,
    loadingFeeStructures,
    loadingDailyPayments,
    loadingDailySummary,
    loadingDepartmentSummary,
    aggregatedPayments,
    loadingAggregatedPayments,
    
    // Students data (same pattern as useAttendance with teachers)
    students,
    studentsLoading,
    studentsError,
    
    // Fee Structure Management
    fetchFeeStructures,
    addNewFeeStructure,
    updateExistingFeeStructure,
    deleteExistingFeeStructure,
    getCurrentFeeStructureForDepartment,
    
    // Daily Payments Management
    fetchDailyPayments,
    recordNewDailyPayment,
    updateExistingDailyPayment,
    deleteExistingDailyPayment,
    fetchStudentPayments,
    
    // Reporting and Analytics
    fetchDailySummary,
    fetchDepartmentSummary,
    fetchPaymentHistory,
    fetchAggregatedPayments,
    
    // Utility Functions
    calculateFeeForStudent,
    checkStudentPaymentStatus,
    
    // Date Management
    changeCurrentDate,
    goToPreviousDay,
    goToNextDay,
    goToToday,
  };
};
