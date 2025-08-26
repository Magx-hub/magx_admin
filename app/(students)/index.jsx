
import React, { useState } from 'react';
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
import { useStudents } from '../../hooks/useStudents';
import StudentForm from '../../components/students/StudentForm';
import StudentList from '../../components/students/StudentList';
import StudentTabs from '../../components/students/StudentTabs';
import StudentSummary from '../../components/students/StudentSummary';
import BackupButton from '../../components/BackupButton';
import { COLORS, SIZES, FONTS, STYLES } from '../../constants/base';

const StudentsScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('students');

  const {
    students,
    loading,
    error,
    studentSummary,
    departmentStats,
    addStudent,
    updateStudent,
    deleteStudent,
    fetchStudents,
    fetchStudentSummary,
    fetchDepartmentStats
  } = useStudents();

  // Handle form submission (create or update)
  const handleFormSubmit = async (formData) => {
    if (!formData.fullname || !formData.department || !formData.gender) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }
    try {
      if (editingStudent) {
        await updateStudent(editingStudent.id, formData.fullname, formData.department, formData.gender);
        Alert.alert('Success', 'Student updated successfully');
      } else {
        await addStudent(formData.fullname, formData.department, formData.gender);
        Alert.alert('Success', 'Student added successfully');
      }
      
      // Refresh summary data after adding/updating student
      await Promise.all([
        fetchStudentSummary(),
        fetchDepartmentStats()
      ]);
      
      closeModal();
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to save student');
    }
  };

  // Handle student edit
  const handleEdit = (student) => {
    setEditingStudent(student);
    setModalVisible(true);
  };

  // Handle student delete
  const handleDelete = async (studentId) => {
    try {
      await deleteStudent(studentId);
      
      // Refresh summary data after deleting student
      await Promise.all([
        fetchStudentSummary(),
        fetchDepartmentStats()
      ]);
      
      Alert.alert('Success', 'Student deleted successfully');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to delete student');
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      if (activeTab === 'students') {
        await fetchStudents();
      } else {
        await Promise.all([
          fetchStudentSummary(),
          fetchDepartmentStats()
        ]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Open modal for adding new student
  const openAddModal = () => {
    setEditingStudent(null);
    setModalVisible(true);
  };

  // Close modal and reset state
  const closeModal = () => {
    setModalVisible(false);
    setEditingStudent(null);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <StatusBar backgroundColor={COLORS.accent} barStyle="light-content" />
      
      {/* Header */}
      <View style={STYLES.header}>
        <Text style={STYLES.headerTitle}>Students</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {activeTab === 'students' && (
            <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
              <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
          )}
          <BackupButton />
        </View>
      </View>

      {/* Tabs */}
      <StudentTabs activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Content */}
      {activeTab === 'students' ? (
        <StudentList
          students={students}
          loading={loading}
          error={error}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRefresh={handleRefresh}
          refreshing={refreshing}
        />
      ) : (
        <StudentSummary
          studentSummary={studentSummary}
          departmentStats={departmentStats}
        />
      )}


      {/* Form Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
      >
        <StudentForm
          initialData={editingStudent}
          onSubmit={handleFormSubmit}
          onCancel={closeModal}
          loading={loading}
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

export default StudentsScreen;
