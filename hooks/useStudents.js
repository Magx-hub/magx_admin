
import { useState, useCallback, useEffect } from 'react';
import * as studentService from '../services/studentService';

export const useStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ totalStudents: 0, totalDepartments: 0 });
  const [departmentStats, setDepartmentStats] = useState([]);
  const [genderStats, setGenderStats] = useState([]);
  const [studentSummary, setStudentSummary] = useState({
    totalStudents: 0,
    maleCount: 0,
    femaleCount: 0,
    totalDepartments: 0
  });

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

  const fetchStudents = useCallback(async () => {
    const data = await handleAsync(studentService.getStudents);
    if (data) {
      setStudents(data);
    }
  }, [handleAsync]);

  const fetchStudentStats = useCallback(async () => {
    const data = await handleAsync(studentService.getStudentStats);
    if (data) {
      setStats(data);
    }
  }, [handleAsync]);

  const fetchDepartmentStats = useCallback(async () => {
    const data = await handleAsync(studentService.getDepartmentStats);
    if (data) {
      setDepartmentStats(data);
    }
  }, [handleAsync]);

  const fetchGenderStats = useCallback(async () => {
    const data = await handleAsync(studentService.getGenderStats);
    if (data) {
      setGenderStats(data);
    }
  }, [handleAsync]);

  const fetchStudentSummary = useCallback(async () => {
    const data = await handleAsync(studentService.getStudentSummary);
    if (data) {
      setStudentSummary(data);
    }
  }, [handleAsync]);

  const addStudent = useCallback(async (fullname, department, gender) => {
    console.log('useStudents.addStudent called with:', { fullname, department, gender });
    const newStudentId = await handleAsync(() => studentService.addStudent(fullname, department, gender));
    if (newStudentId) {
      // Manually refresh the data without dependency on fetchStudents
      const data = await handleAsync(studentService.getStudents);
      if (data) {
        setStudents(data);
      }
    }
    return newStudentId;
  }, [handleAsync]);

  const updateStudent = useCallback(async (id, fullname, department, gender) => {
    const success = await handleAsync(() => studentService.updateStudent(id, fullname, department, gender));
    if (success) {
      // Manually refresh the data without dependency on fetchStudents
      const data = await handleAsync(studentService.getStudents);
      if (data) {
        setStudents(data);
      }
    }
    return success;
  }, [handleAsync]);

  const deleteStudent = useCallback(async (id) => {
    const success = await handleAsync(() => studentService.deleteStudent(id));
    if (success) {
      setStudents(prev => prev.filter(s => s.id !== id));
    }
    return success;
  }, [handleAsync]);

  const searchStudents = useCallback(async (searchTerm) => {
    const data = await handleAsync(() => studentService.searchStudents(searchTerm));
    if (data) {
      setStudents(data);
    }
  }, [handleAsync]);

  // Initial data fetch - only run once on mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Give database some time to initialize if needed
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Fetch all data in parallel
        await Promise.all([
          fetchStudents(),
          fetchStudentStats(),
          fetchDepartmentStats(),
          fetchGenderStats(),
          fetchStudentSummary()
        ]);
      } catch (error) {
        console.error('Error initializing student data:', error);
      }
    };
    
    initializeData();
  }, []); // Empty dependency array - only run once

  return {
    students,
    loading,
    error,
    stats,
    departmentStats,
    genderStats,
    studentSummary,
    fetchStudents,
    addStudent,
    updateStudent,
    deleteStudent,
    searchStudents,
    fetchStudentStats,
    fetchDepartmentStats,
    fetchGenderStats,
    fetchStudentSummary,
  };
};
