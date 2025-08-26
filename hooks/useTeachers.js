
import { useState, useCallback, useEffect } from 'react';
import * as teacherService from '../services/teacherService';

export const useTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ totalTeachers: 0, totalDepartments: 0 });
  const [departmentStats, setDepartmentStats] = useState([]);

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

  const fetchTeachers = useCallback(async () => {
    const data = await handleAsync(teacherService.getTeachers);
    if (data) {
      setTeachers(data);
    }
  }, [handleAsync]);

  const addTeacher = useCallback(async (fullname, department) => {
    console.log('useTeachers.addTeacher called with:', { fullname, department });
    const newTeacherId = await handleAsync(() => teacherService.addTeacher(fullname, department));
    if (newTeacherId) {
      await fetchTeachers(); // Refresh the list
    }
    return newTeacherId;
  }, [handleAsync, fetchTeachers]);

  const updateTeacher = useCallback(async (id, fullname, department) => {
    const success = await handleAsync(() => teacherService.updateTeacher(id, fullname, department));
    if (success) {
      await fetchTeachers(); // Refresh the list
    }
    return success;
  }, [handleAsync, fetchTeachers]);

  const deleteTeacher = useCallback(async (id) => {
    const success = await handleAsync(() => teacherService.deleteTeacher(id));
    if (success) {
      setTeachers(prev => prev.filter(t => t.id !== id));
    }
    return success;
  }, [handleAsync]);

  const searchTeachers = useCallback(async (searchTerm) => {
    const data = await handleAsync(() => teacherService.searchTeachers(searchTerm));
    if (data) {
      setTeachers(data);
    }
  }, [handleAsync]);

  const fetchTeacherStats = useCallback(async () => {
    const data = await handleAsync(teacherService.getTeacherStats);
    if (data) {
      setStats(data);
    }
  }, [handleAsync]);

  const fetchDepartmentStats = useCallback(async () => {
    const data = await handleAsync(teacherService.getDepartmentStats);
    if (data) {
      setDepartmentStats(data);
    }
  }, [handleAsync]);

  useEffect(() => {
    fetchTeachers();
    fetchTeacherStats();
    fetchDepartmentStats();
  }, [fetchTeachers, fetchTeacherStats, fetchDepartmentStats]);

  return {
    teachers,
    loading,
    error,
    stats,
    departmentStats,
    fetchTeachers,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    searchTeachers,
    fetchTeacherStats,
    fetchDepartmentStats,
  };
};
