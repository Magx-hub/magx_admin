
import { useState, useCallback, useEffect } from 'react';
import * as allowanceService from '../services/allowanceService';

export const useAllowance = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allowances, setAllowances] = useState([]);
  const [summary, setSummary] = useState(null);

  const handleAsync = useCallback(async (asyncFunction) => {
    setLoading(true);
    setError(null);
    try {
      return await asyncFunction();
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllowances = useCallback(async (limit, offset) => {
    const data = await handleAsync(() => allowanceService.getAllowanceRecords(limit, offset));
    if (data) {
      setAllowances(data);
    }
  }, [handleAsync]);

  const addAllowance = useCallback(async (data) => {
    const newAllowanceId = await handleAsync(() => allowanceService.addAllowanceRecord(data));
    if (newAllowanceId) {
      await fetchAllowances();
      return newAllowanceId;
    }
    return null;
  }, [handleAsync, fetchAllowances]);

  const updateAllowance = useCallback(async (id, data) => {
    const success = await handleAsync(() => allowanceService.updateAllowanceRecord(id, data));
    if (success) {
      await fetchAllowances();
    }
    return success;
  }, [handleAsync, fetchAllowances]);

  const deleteAllowance = useCallback(async (id) => {
    const success = await handleAsync(() => allowanceService.deleteAllowanceRecord(id));
    if (success) {
      setAllowances(prev => prev.filter(a => a.id !== id));
    }
    return success;
  }, [handleAsync]);
  
  const getSummary = useCallback(async () => {
    const data = await handleAsync(allowanceService.getAllowanceSummary);
    if (data) {
      setSummary(data);
    }
  }, [handleAsync]);

  const fetchWelfareRecords = useCallback(async (limit, offset) => {
    return await handleAsync(() => allowanceService.getWelfareRecords(limit, offset));
  }, [handleAsync]);

  useEffect(() => {
      fetchAllowances();
      getSummary();
  }, [fetchAllowances, getSummary]);

  return {
    loading,
    error,
    allowances,
    summary,
    addAllowance,
    fetchAllowances,
    updateAllowance,
    deleteAllowance,
    getSummary,
    fetchWelfareRecords,
  };
};
