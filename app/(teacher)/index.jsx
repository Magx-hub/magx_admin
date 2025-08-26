// ============================================================================
// app/(teacher)/index.jsx
// ============================================================================

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
import { useTeachers } from '../../hooks/useTeachers';
import TeacherForm from '../../components/teacher/TeacherForm';
import TeacherList from '../../components/teacher/TeacherList';
import { COLORS, SIZES, FONTS, STYLES } from '../../constants/base';

const TeachersScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const {
    teachers,
    loading,
    error,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    fetchTeachers
  } = useTeachers();

  // Handle form submission (create or update)
  const handleFormSubmit = async (formData) => {
    if (!formData.fullname || !formData.department) {
      Alert.alert('Error', 'Please enter both name and department.');
      return;
    }
    try {
      if (editingTeacher) {
        await updateTeacher(editingTeacher.id, formData.fullname, formData.department);
        Alert.alert('Success', 'Teacher updated successfully');
      } else {
        await addTeacher(formData.fullname, formData.department);
        Alert.alert('Success', 'Teacher added successfully');
      }
      closeModal();
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to save teacher');
    }
  };

  // Handle teacher edit
  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setModalVisible(true);
  };

  // Handle teacher delete
  const handleDelete = async (teacherId) => {
    try {
      await deleteTeacher(teacherId);
      Alert.alert('Success', 'Teacher deleted successfully');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to delete teacher');
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchTeachers();
    } catch (error) {
      Alert.alert('Error', 'Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };

  // Open modal for adding new teacher
  const openAddModal = () => {
    setEditingTeacher(null);
    setModalVisible(true);
  };

  // Close modal and reset state
  const closeModal = () => {
    setModalVisible(false);
    setEditingTeacher(null);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <StatusBar backgroundColor={COLORS.accent} barStyle="light-content" />
      
      {/* Header */}
      <View style={STYLES.header}>
        <Text style={STYLES.headerTitle}>Teachers</Text>
        <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Teachers List */}
      <TeacherList
        teachers={teachers}
        loading={loading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />


      {/* Form Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
      >
        <TeacherForm
          initialData={editingTeacher}
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

export default TeachersScreen;