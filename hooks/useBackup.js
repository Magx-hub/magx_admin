import { useState, useCallback } from 'react';
import { 
  exportAllDataToExcel, 
  shareDataToWhatsApp, 
  createBackup, 
  getBackupFiles 
} from '../utils/excelExporter';

export const useBackup = () => {
  const [loading, setLoading] = useState(false);
  const [backupFiles, setBackupFiles] = useState([]);
  const [loadingBackups, setLoadingBackups] = useState(false);

  const exportAndShare = useCallback(async () => {
    setLoading(true);
    try {
      const result = await shareDataToWhatsApp();
      return { success: true, message: 'Data exported and shared successfully!' };
    } catch (error) {
      console.error('Error exporting and sharing:', error);
      return { success: false, message: error.message || 'Failed to export and share data' };
    } finally {
      setLoading(false);
    }
  }, []);

  const createLocalBackup = useCallback(async () => {
    setLoading(true);
    try {
      const result = await createBackup();
      await loadBackupFiles(); // Refresh the backup list
      return { success: true, message: 'Backup created successfully!', data: result };
    } catch (error) {
      console.error('Error creating backup:', error);
      return { success: false, message: error.message || 'Failed to create backup' };
    } finally {
      setLoading(false);
    }
  }, []);

  const exportOnly = useCallback(async () => {
    setLoading(true);
    try {
      const fileUri = await exportAllDataToExcel();
      return { success: true, message: 'Data exported successfully!', fileUri };
    } catch (error) {
      console.error('Error exporting data:', error);
      return { success: false, message: error.message || 'Failed to export data' };
    } finally {
      setLoading(false);
    }
  }, []);

  const loadBackupFiles = useCallback(async () => {
    setLoadingBackups(true);
    try {
      const files = await getBackupFiles();
      setBackupFiles(files);
      return files;
    } catch (error) {
      console.error('Error loading backup files:', error);
      return [];
    } finally {
      setLoadingBackups(false);
    }
  }, []);

  const formatFileSize = useCallback((bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  const formatDate = useCallback((timestamp) => {
    return new Date(timestamp).toLocaleString();
  }, []);

  return {
    loading,
    backupFiles,
    loadingBackups,
    exportAndShare,
    createLocalBackup,
    exportOnly,
    loadBackupFiles,
    formatFileSize,
    formatDate,
  };
};
