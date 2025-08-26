
import { useState, useCallback } from 'react';
import * as attendanceService from '../services/attendanceService';
import { useTeachers } from './useTeachers';

export const useAttendance = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [dailyStats, setDailyStats] = useState(null);
  const [weeklyStats, setWeeklyStats] = useState([]);
  const [stats, setStats] = useState({
    attendanceRate: 0,
    currentWeek: 3,
    totalWeeks: 16,
    presentToday: 0,
    totalTeachers: 0
  });

  // Get teachers from useTeachers hook
  const { teachers, loading: teachersLoading, error: teachersError } = useTeachers();

  const handleAsync = useCallback(async (asyncFunction) => {
    setLoading(true);
    setError(null);
    try {
      return await asyncFunction();
    } catch (err) {
      console.error('Database operation error:', err);
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const addAttendance = useCallback(async (record) => {
    const newRecordId = await handleAsync(() => attendanceService.addAttendanceRecord(record));
    if (newRecordId) {
      await getAttendance(); // Refresh list
    }
    return newRecordId;
  }, [handleAsync]);

  const getAttendance = useCallback(async (filters) => {
    const records = await handleAsync(() => attendanceService.getAttendanceRecords(filters));
    if (records) {
      setAttendanceRecords(records);
    }
  }, [handleAsync]);

  const getAttendanceById = useCallback(async (id) => {
    return await handleAsync(() => attendanceService.getAttendanceById(id));
  }, [handleAsync]);

  const updateAttendance = useCallback(async (id, updates) => {
    const success = await handleAsync(() => attendanceService.updateAttendanceRecord(id, updates));
    if (success) {
      await getAttendance(); // Refresh list
    }
    return success;
  }, [handleAsync]);

  const deleteAttendance = useCallback(async (id) => {
    const success = await handleAsync(() => attendanceService.deleteAttendanceRecord(id));
    if (success) {
      setAttendanceRecords(prev => prev.filter(rec => rec.id !== id));
    }
    return success;
  }, [handleAsync]);

  const getDailyStats = useCallback(async (date) => {
    const stats = await handleAsync(() => attendanceService.getDailyAttendanceStats(date));
    if (stats) {
      setDailyStats(stats);
    }
  }, [handleAsync]);

  const getWeeklyStats = useCallback(async (weekNum) => {
    const stats = await handleAsync(() => attendanceService.getWeeklyAttendanceStats(weekNum));
    if (stats) {
      setWeeklyStats(stats);
    }
  }, [handleAsync]);

  const searchAttendance = useCallback(async (searchTerm) => {
    const records = await handleAsync(() => attendanceService.searchAttendance(searchTerm));
    if (records) {
      setAttendanceRecords(records);
    }
  }, [handleAsync]);

  const searchAttendanceAdvanced = useCallback(async (filters) => {
    const records = await handleAsync(() => attendanceService.searchAttendanceAdvanced(filters));
    if (records) {
      setAttendanceRecords(records);
    }
  }, [handleAsync]);

  const getLatestAttendancePerTeacher = useCallback(async () => {
    const records = await handleAsync(() => attendanceService.getLatestAttendancePerTeacher());
    if (records) {
      setAttendanceRecords(records);
    }
  }, [handleAsync]);

  const getAllTeachersAttendanceSummary = useCallback(async () => {
    const summaries = await handleAsync(() => attendanceService.getAllTeachersAttendanceSummary());
    return summaries;
  }, [handleAsync]);

  const getTeacherAttendanceSummaryById = useCallback(async (teacherId) => {
    const summary = await handleAsync(() => attendanceService.getTeacherAttendanceSummaryById(teacherId));
    return summary;
  }, [handleAsync]);

  const getAttendanceByDateRange = useCallback(async (startDate, endDate, filters = {}) => {
    return await handleAsync(() => attendanceService.getAttendanceByDateRange(startDate, endDate, filters));
  }, [handleAsync]);

  const getWeeklyAttendanceStats = useCallback(async (weekNum) => {
    return await handleAsync(() => attendanceService.getWeeklyAttendanceStats(weekNum));
  }, [handleAsync]);

  // Add fetchAttendances function for compatibility
  const fetchAttendances = useCallback(async () => {
    return await getAttendance();
  }, [getAttendance]);

  return {
    loading,
    error,
    attendanceRecords,
    // Add attendances alias for compatibility
    attendances: attendanceRecords,
    dailyStats,
    weeklyStats,
    stats,
    addAttendance,
    getAttendance,
    getAttendanceById,
    updateAttendance,
    deleteAttendance,
    getDailyStats,
    getWeeklyStats,
    getAttendanceByDateRange,
    getWeeklyAttendanceStats,
    searchAttendance,
    searchAttendanceAdvanced,
    getLatestAttendancePerTeacher,
    getAllTeachersAttendanceSummary,
    getTeacherAttendanceSummaryById,
    fetchAttendances,
    // Add teachers data
    teachers,
    teachersLoading,
    teachersError,
  };
};
