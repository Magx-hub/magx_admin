import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import { getDatabaseInstance } from './database';

// ===========================================
// EXCEL EXPORT UTILITIES
// ===========================================

export const exportAllDataToExcel = async () => {
  try {
    const db = getDatabaseInstance();
    
    // Get all data from different tables
    const teachers = await db.getAllAsync('SELECT * FROM teachers ORDER BY fullname ASC');
    const students = await db.getAllAsync('SELECT * FROM students ORDER BY fullname ASC');
    const attendance = await db.getAllAsync(`
      SELECT 
        a.*,
        t.fullname as teacherName,
        t.department as teacherDepartment
      FROM attendance a
      LEFT JOIN teachers t ON a.teacherId = t.id
      ORDER BY a.createdAt DESC, t.fullname ASC
    `);
    const calculations = await db.getAllAsync('SELECT * FROM calculations ORDER BY createdAt DESC');
    const dailyPayments = await db.getAllAsync('SELECT * FROM dailyPayments ORDER BY createdAt DESC');

    // Generate Excel content
    const excelContent = generateExcelContent({
      teachers,
      students,
      attendance,
      calculations,
      dailyPayments
    });

    // Create file
    const fileName = `school_data_backup_${new Date().toISOString().split('T')[0]}.html`;
    const fileUri = `${FileSystem.documentDirectory}${fileName}`;
    
    await FileSystem.writeAsStringAsync(fileUri, excelContent, {
      encoding: FileSystem.EncodingType.UTF8
    });

    return fileUri;
  } catch (error) {
    console.error('Error exporting data to Excel:', error);
    throw new Error('Failed to export data');
  }
};

const generateExcelContent = (data) => {
  const { teachers, students, attendance, calculations, dailyPayments } = data;
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>School Management System - Data Backup</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 10px; }
        .section { margin-bottom: 40px; page-break-inside: avoid; }
        .section-title { 
          background-color: #4CAF50; 
          color: white; 
          padding: 10px; 
          margin-bottom: 15px; 
          border-radius: 5px;
          font-size: 18px;
          font-weight: bold;
        }
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin-bottom: 20px;
          font-size: 12px;
        }
        th, td { 
          border: 1px solid #ddd; 
          padding: 8px; 
          text-align: left; 
        }
        th { 
          background-color: #f2f2f2; 
          font-weight: bold; 
        }
        .summary { 
          background-color: #f9f9f9; 
          padding: 15px; 
          border-radius: 5px; 
          margin-bottom: 20px;
        }
        .summary h3 { margin-top: 0; color: #333; }
        .summary-item { margin: 5px 0; }
        @media print {
          .section { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>School Management System</h1>
        <h2>Complete Data Backup</h2>
        <p>Generated on: ${new Date().toLocaleString()}</p>
      </div>

      <!-- Summary Section -->
      <div class="summary">
        <h3>Data Summary</h3>
        <div class="summary-item"><strong>Total Teachers:</strong> ${teachers.length}</div>
        <div class="summary-item"><strong>Total Students:</strong> ${students.length}</div>
        <div class="summary-item"><strong>Total Attendance Records:</strong> ${attendance.length}</div>
        <div class="summary-item"><strong>Total Allowance Records:</strong> ${calculations.length}</div>
        <div class="summary-item"><strong>Total Canteen Records:</strong> ${dailyPayments.length}</div>
      </div>

      <!-- Teachers Section -->
      <div class="section">
        <div class="section-title">Teachers Data (${teachers.length} records)</div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Department</th>
              <th>Gender</th>
              <th>Created At</th>
              <th>Updated At</th>
            </tr>
          </thead>
          <tbody>
            ${teachers.map(teacher => `
              <tr>
                <td>${teacher.id || ''}</td>
                <td>${teacher.fullname || ''}</td>
                <td>${teacher.department || ''}</td>
                <td>${teacher.gender || ''}</td>
                <td>${teacher.createdAt || ''}</td>
                <td>${teacher.updatedAt || ''}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Students Section -->
      <div class="section">
        <div class="section-title">Students Data (${students.length} records)</div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Department</th>
              <th>Gender</th>
              <th>Created At</th>
              <th>Updated At</th>
            </tr>
          </thead>
          <tbody>
            ${students.map(student => `
              <tr>
                <td>${student.id || ''}</td>
                <td>${student.fullname || ''}</td>
                <td>${student.department || ''}</td>
                <td>${student.gender || ''}</td>
                <td>${student.createdAt || ''}</td>
                <td>${student.updatedAt || ''}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Attendance Section -->
      <div class="section">
        <div class="section-title">Attendance Data (${attendance.length} records)</div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Teacher Name</th>
              <th>Department</th>
              <th>Date</th>
              <th>Status</th>
              <th>Check In Time</th>
              <th>Check Out Time</th>
              <th>Work Hours</th>
              <th>Week Number</th>
            </tr>
          </thead>
          <tbody>
            ${attendance.map(record => `
              <tr>
                <td>${record.id || ''}</td>
                <td>${record.teacherName || ''}</td>
                <td>${record.teacherDepartment || ''}</td>
                <td>${record.date || ''}</td>
                <td>${record.status || ''}</td>
                <td>${record.checkInTime || ''}</td>
                <td>${record.checkOutTime || ''}</td>
                <td>${record.workHours || ''}</td>
                <td>${record.weekNum || ''}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Allowance Section -->
      <div class="section">
        <div class="section-title">Allowance Data (${calculations.length} records)</div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Total Sum</th>
              <th>Week Number</th>
              <th>Welfare</th>
              <th>Each Teacher</th>
              <th>JHS Teacher</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            ${calculations.map(record => `
              <tr>
                <td>${record.id || ''}</td>
                <td>${record.totalSum || ''}</td>
                <td>${record.weekNumber || ''}</td>
                <td>${record.welfare || ''}</td>
                <td>${record.eachTeacher || ''}</td>
                <td>${record.eachJHSTeacher || ''}</td>
                <td>${record.createdAt || ''}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Canteen Section -->
      <div class="section">
        <div class="section-title">Canteen Data (${dailyPayments.length} records)</div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Student Name</th>
              <th>Department</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Payment Method</th>
              <th>Description</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            ${dailyPayments.map(record => `
              <tr>
                <td>${record.id || ''}</td>
                <td>${record.studentName || ''}</td>
                <td>${record.department || ''}</td>
                <td>${record.paymentDate || ''}</td>
                <td>${record.amount || ''}</td>
                <td>${record.paymentMethod || ''}</td>
                <td>${record.description || ''}</td>
                <td>${record.createdAt || ''}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div style="margin-top: 40px; text-align: center; color: #666; font-size: 12px;">
        <p>This backup was generated automatically by the MagMax School Management System</p>
        <p>Keep this file safe for data recovery purposes</p>
      </div>
    </body>
    </html>
  `;

  return htmlContent;
};

// ===========================================
// SHARING UTILITIES
// ===========================================

export const shareDataToWhatsApp = async () => {
  try {
    // Generate the Excel file
    const fileUri = await exportAllDataToExcel();
    
    // Check if sharing is available
    if (!(await Sharing.isAvailableAsync())) {
      throw new Error('Sharing is not available on this device');
    }

    // Share the file
    await Sharing.shareAsync(fileUri, {
      mimeType: 'text/html',
      dialogTitle: 'Share School Data Backup',
      UTI: 'public.html'
    });

    return { success: true, message: 'Data shared successfully' };
  } catch (error) {
    console.error('Error sharing data:', error);
    throw new Error('Failed to share data: ' + error.message);
  }
};

export const exportAndShareData = async () => {
  try {
    const result = await shareDataToWhatsApp();
    return result;
  } catch (error) {
    console.error('Error in export and share:', error);
    throw error;
  }
};

// ===========================================
// BACKUP UTILITIES
// ===========================================

export const createBackup = async () => {
  try {
    const fileUri = await exportAllDataToExcel();
    
    // You can also save to a specific backup location
    const backupFileName = `backup_${new Date().toISOString().replace(/[:.]/g, '-')}.html`;
    const backupUri = `${FileSystem.documentDirectory}backups/${backupFileName}`;
    
    // Ensure backup directory exists
    const backupDir = `${FileSystem.documentDirectory}backups/`;
    const dirInfo = await FileSystem.getInfoAsync(backupDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(backupDir, { intermediates: true });
    }
    
    // Copy file to backup location
    await FileSystem.copyAsync({
      from: fileUri,
      to: backupUri
    });

    return {
      success: true,
      message: 'Backup created successfully',
      fileUri: backupUri,
      fileName: backupFileName
    };
  } catch (error) {
    console.error('Error creating backup:', error);
    throw new Error('Failed to create backup: ' + error.message);
  }
};

export const getBackupFiles = async () => {
  try {
    const backupDir = `${FileSystem.documentDirectory}backups/`;
    const dirInfo = await FileSystem.getInfoAsync(backupDir);
    
    if (!dirInfo.exists) {
      return [];
    }

    const files = await FileSystem.readDirectoryAsync(backupDir);
    const backupFiles = [];

    for (const file of files) {
      if (file.endsWith('.html')) {
        const fileInfo = await FileSystem.getInfoAsync(`${backupDir}${file}`);
        backupFiles.push({
          name: file,
          uri: fileInfo.uri,
          size: fileInfo.size,
          modificationTime: fileInfo.modificationTime
        });
      }
    }

    return backupFiles.sort((a, b) => b.modificationTime - a.modificationTime);
  } catch (error) {
    console.error('Error getting backup files:', error);
    return [];
  }
};
