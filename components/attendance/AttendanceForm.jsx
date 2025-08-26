// ============================================================================
// components/AttendanceForm.jsx
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS, STYLES } from '../../constants/base';

const STATUS_OPTIONS = ['Present', 'Absent', 'Late', 'Half Day'];

const AttendanceForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  loading = false,
  teachers = []
}) => {
  const [formData, setFormData] = useState({
    teacherId: '',
    checkInTime: '',
    checkOutTime: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Present',
    remarks: ''
  });
  const [errors, setErrors] = useState({});
  const [showStatusOptions, setShowStatusOptions] = useState(false);
  const [showTeacherOptions, setShowTeacherOptions] = useState(false);

  // Initialize form with existing data for editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        teacherId: initialData.teacherId || '',
        checkInTime: initialData.checkInTime || '',
        checkOutTime: initialData.checkOutTime || '',
        date: initialData.date || new Date().toISOString().split('T')[0],
        status: initialData.status || 'Present',
        remarks: initialData.remarks || ''
      });
    }
  }, [initialData]);

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (!formData.teacherId) newErrors.teacherId = 'Teacher is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.status) newErrors.status = 'Status is required';
    if (formData.status !== 'Absent' && !formData.checkInTime) {
        newErrors.checkInTime = 'Check-in time is required';
    }
    if (formData.status !== 'Absent' && !formData.checkOutTime) {
        newErrors.checkOutTime = 'Check-out time is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors and try again.');
      return;
    }

    try {
      await onSubmit(formData);
      if (!initialData) {
        setFormData({
            teacherId: '',
            checkInTime: '',
            checkOutTime: '',
            date: new Date().toISOString().split('T')[0],
            status: 'Present',
            remarks: ''
        });
        setErrors({});
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to save attendance');
    }
  };

  const selectStatus = (status) => {
    setFormData(prev => ({ ...prev, status }));
    setShowStatusOptions(false);
    setErrors(prev => ({ ...prev, status: null }));
  };

  const selectTeacher = (teacherId) => {
    setFormData(prev => ({ ...prev, teacherId }));
    setShowTeacherOptions(false);
    setErrors(prev => ({ ...prev, teacherId: null }));
  };

  const getTeacherName = (teacherId) => {
      const teacher = teachers.find(t => t.id === teacherId);
      return teacher ? teacher.fullname : 'Select Teacher';
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.form}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              {initialData ? 'Edit Attendance' : 'Add Attendance'}
            </Text>
            <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Teacher Selector */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Teacher *</Text>
            <TouchableOpacity
              style={[
                styles.selector,
                errors.teacherId && styles.inputError
              ]}
              onPress={() => setShowTeacherOptions(!showTeacherOptions)}
            >
              <Text style={[
                styles.selectorText,
                !formData.teacherId && styles.placeholderText
              ]}>
                {getTeacherName(formData.teacherId)}
              </Text>
              <Ionicons 
                name={showTeacherOptions ? "chevron-up" : "chevron-down"} 
                size={20} 
                color="#666" 
              />
            </TouchableOpacity>
            {errors.teacherId && (
              <Text style={styles.errorText}>{errors.teacherId}</Text>
            )}

            {showTeacherOptions && (
              <View style={styles.optionsContainer}>
                {teachers.map((teacher) => (
                  <TouchableOpacity
                    key={teacher.id}
                    style={[
                      styles.option,
                      formData.teacherId === teacher.id && styles.selectedOption
                    ]}
                    onPress={() => selectTeacher(teacher.id)}
                  >
                    <Text style={[
                      styles.optionText,
                      formData.teacherId === teacher.id && styles.selectedOptionText
                    ]}>
                      {teacher.fullname}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* WeekNumber & Date Input */}
          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.flex]}>
              <Text style={styles.label}>Week Number *</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.weekNum && styles.inputError
                ]}
                value={formData.weekNum}
                onChangeText={(text) => setFormData(prev => ({ ...prev, weekNum: text }))}
                placeholder="Enter Week Number"
                placeholderTextColor="#999"
              />
              {errors.weekNum && (
                <Text style={styles.errorText}>{errors.weekNum}</Text>
              )}
            </View>

            <View style={[styles.inputGroup, styles.flex]}>
              <Text style={styles.label}>Date *</Text>
              <TextInput
                style={[
                    styles.input,
                    errors.date && styles.inputError
                ]}
                value={formData.date}
                onChangeText={(text) => setFormData(prev => ({ ...prev, date: text }))}
                placeholder="YYYY-MM-DD"
              />
              {errors.date && (
                <Text style={styles.errorText}>{errors.date}</Text>
              )}
            </View>
          </View>

          {/* Check-in and Check-out Times */}
          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.flex]}>
              <Text style={styles.label}>Check-in Time</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.checkInTime && styles.inputError
                ]}
                value={formData.checkInTime}
                onChangeText={(text) => setFormData(prev => ({ ...prev, checkInTime: text }))}
                placeholder="HH:MM"
                placeholderTextColor="#999"
              />
              {errors.checkInTime && (
                <Text style={styles.errorText}>{errors.checkInTime}</Text>
              )}
            </View>
            <View style={[styles.inputGroup, styles.flex]}>
              <Text style={styles.label}>Check-out Time</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.checkOutTime && styles.inputError
                ]}
                value={formData.checkOutTime}
                onChangeText={(text) => setFormData(prev => ({ ...prev, checkOutTime: text }))}
                placeholder="HH:MM"
                placeholderTextColor="#999"
              />
              {errors.checkOutTime && (
                <Text style={styles.errorText}>{errors.checkOutTime}</Text>
              )}
            </View>
          </View>

          {/* Status Selector */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Status *</Text>
            <TouchableOpacity
              style={[
                styles.selector,
                errors.status && styles.inputError
              ]}
              onPress={() => setShowStatusOptions(!showStatusOptions)}
            >
              <Text style={styles.selectorText}>
                {formData.status}
              </Text>
              <Ionicons 
                name={showStatusOptions ? "chevron-up" : "chevron-down"} 
                size={20} 
                color="#666" 
              />
            </TouchableOpacity>
            {errors.status && (
              <Text style={styles.errorText}>{errors.status}</Text>
            )}

            {showStatusOptions && (
              <View style={styles.optionsContainer}>
                {STATUS_OPTIONS.map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.option,
                      formData.status === status && styles.selectedOption
                    ]}
                    onPress={() => selectStatus(status)}
                  >
                    <Text style={[
                      styles.optionText,
                      formData.status === status && styles.selectedOptionText
                    ]}>
                      {status}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Remarks Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Remarks</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.remarks}
              onChangeText={(text) => setFormData(prev => ({ ...prev, remarks: text }))}
              placeholder="Add any remarks here..."
              placeholderTextColor="#999"
              multiline
            />
          </View>

          {/* Action Buttons */}
          <View style={STYLES.formButtons}>
            <TouchableOpacity
              style={[STYLES.buttonSecondary, STYLES.formColumn]}
              onPress={onCancel}
            >
              <Text style={STYLES.buttonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                STYLES.buttonPrimary,
                STYLES.formColumn,
                loading && { backgroundColor: COLORS.gray }
              ]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={STYLES.buttonText}>
                {loading ? 'Saving...' : (initialData ? 'Update' : 'Add Record')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray_light,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: SIZES.padding,
  },
  form: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadius_md,
    padding: SIZES.padding,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.margin,
    paddingBottom: SIZES.padding_sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    ...FONTS.h4_bold,
    color: COLORS.textPrimary,
  },
  closeButton: {
    padding: SIZES.padding_sm,
  },
  inputGroup: {
    marginBottom: SIZES.margin,
  },
  label: {
    ...FONTS.h6_regular,
    color: COLORS.textPrimary,
    marginBottom: SIZES.margin_sm,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.borderRadius,
    padding: SIZES.padding_sm,
    fontSize: SIZES.default,
    backgroundColor: COLORS.white,
    ...FONTS.h6_regular,
  },
  textArea: {
      height: 100,
      textAlignVertical: 'top'
  },
  inputError: {
    borderColor: COLORS.error,
  },
  selector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.borderRadius,
    padding: SIZES.padding_sm,
    backgroundColor: COLORS.white,
  },
  selectorText: {
    ...FONTS.h6_regular,
    color: COLORS.textPrimary,
  },
  placeholderText: {
    color: COLORS.placeholder,
  },
  optionsContainer: {
    marginTop: SIZES.margin_sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.borderRadius,
    backgroundColor: COLORS.white,
    maxHeight: 200,
  },
  option: {
    padding: SIZES.padding_sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  selectedOption: {
    backgroundColor: COLORS.primaryLight,
  },
  optionText: {
    ...FONTS.h6_regular,
    color: COLORS.textPrimary,
  },
  selectedOptionText: {
    color: COLORS.primary,
    fontWeight: '500',
  },
  errorText: {
    color: COLORS.error,
    ...FONTS.h6_regular,
    marginTop: SIZES.margin_sm,
  },
  row: {
      flexDirection: 'row',
      gap: SIZES.margin
  },
  flex: {
      flex: 1
  }
});

export default AttendanceForm;