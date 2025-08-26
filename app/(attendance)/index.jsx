
// ============================================================================
// app/(attendance)/index.jsx
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Modal,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAttendance } from '../../hooks/useAttendance';
import AttendanceForm from '../../components/attendance/AttendanceForm';
import TeacherAttendanceSummary from '../../components/attendance/TeacherAttendanceSummary';
import { COLORS, SIZES, FONTS, STYLES } from '../../constants/base';

const AttendanceScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const {
    attendances,
    loading,
    error,
    addAttendance,
    updateAttendance,
    deleteAttendance,
    fetchAttendances,
    getAllTeachersAttendanceSummary,
    getAttendanceByDateRange,
    getWeeklyAttendanceStats,
    teachers
  } = useAttendance();

  useEffect(() => {
    fetchAttendances();
  }, []);

  // Handle form submission (create or update)
  const handleFormSubmit = async (formData) => {
    try {
      if (editingAttendance) {
        await updateAttendance(editingAttendance.id, formData);
        Alert.alert('Success', 'Attendance record updated successfully');
      } else {
        await addAttendance(formData);
        Alert.alert('Success', 'Attendance record added successfully');
      }
      closeModal();
    } catch (error) {
      throw error;
    }
  };

  // Handle attendance edit
  const handleEdit = (attendance) => {
    setEditingAttendance(attendance);
    setModalVisible(true);
  };

  // Handle attendance delete
  const handleDelete = async (attendanceId) => {
    try {
      await deleteAttendance(attendanceId);
      Alert.alert('Success', 'Attendance record deleted successfully');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to delete record');
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchAttendances();
    } catch (error) {
      Alert.alert('Error', 'Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    console.log('Tab changed to:', tab);
    // You can add additional logic here if needed
  };

  // Open modal for adding new attendance
  const openAddModal = () => {
    setEditingAttendance(null);
    setModalVisible(true);
  };

  // Close modal and reset state
  const closeModal = () => {
    setModalVisible(false);
    setEditingAttendance(null);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <StatusBar backgroundColor={COLORS.accent} barStyle="light-content" />
      
      {/* Header */}
      <View style={STYLES.header}>
        <Text style={STYLES.headerTitle}>Attendance</Text>
        <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Attendance List with Summaries */}
      <TeacherAttendanceSummary
        attendances={attendances}
        loading={loading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        getAllTeachersAttendanceSummary={getAllTeachersAttendanceSummary}
        getAttendanceByDateRange={getAttendanceByDateRange}
        getWeeklyAttendanceStats={getWeeklyAttendanceStats}
        teachers={teachers}
        onTabChange={handleTabChange}
      />


      {/* Form Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
      >
        <AttendanceForm
          initialData={editingAttendance}
          onSubmit={handleFormSubmit}
          onCancel={closeModal}
          loading={loading}
          teachers={teachers}
        />
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AttendanceScreen;
