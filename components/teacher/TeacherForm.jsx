// ============================================================================
// components/TeacherForm.jsx
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

const DEPARTMENTS = [
  'Creche',
  'Nursery',
  'Kindergarten',
  'Basic 1',
  'Basic 2',
  'Basic 3',
  'Basic 4',
  'Basic 5',
  'Basic 6',
  'Basic 7',
  'Basic 8',
  'Basic 9'
];

const TeacherForm = ({ 
  initialData = null, 
  onSubmit, 
  onCancel, 
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    fullname: '',
    department: ''
  });
  const [errors, setErrors] = useState({});
  const [showDepartments, setShowDepartments] = useState(false);

  // Initialize form with existing data for editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        fullname: initialData.fullname || '',
        department: initialData.department || ''
      });
    }
  }, [initialData]);

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullname.trim()) {
      newErrors.fullname = 'Full name is required';
    } else if (formData.fullname.trim().length < 2) {
      newErrors.fullname = 'Full name must be at least 2 characters';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    console.log('Form submission - formData:', formData);
    
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors and try again.');
      return;
    }

    try {
      console.log('Submitting form with data:', formData);
      await onSubmit(formData);
      // Reset form after successful submission (only for new entries)
      if (!initialData) {
        setFormData({ fullname: '', department: '' });
        setErrors({});
      }
    } catch (error) {
      console.error('Form submission error:', error);
      Alert.alert('Error', error.message || 'Failed to save teacher');
    }
  };

  // Handle department selection
  const selectDepartment = (department) => {
    setFormData(prev => ({ ...prev, department }));
    setShowDepartments(false);
    setErrors(prev => ({ ...prev, department: null }));
  };

  return (
    <KeyboardAvoidingView 
      style={STYLES.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={STYLES.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={FONTS.h3_semibold}>
              {initialData ? 'Edit Teacher' : 'Add New Teacher'}
            </Text>
            <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={COLORS.gray} />
            </TouchableOpacity>
          </View>

          {/* Full Name Input */}
          <View style={STYLES.inputContainer}>
            <Text style={STYLES.inputLabel}>Full Name *</Text>
            <TextInput
              style={[
                STYLES.textInput,
                errors.fullname && { borderColor: COLORS.error }
              ]}
              value={formData.fullname}
              onChangeText={(text) => {
                setFormData(prev => ({ ...prev, fullname: text }));
                setErrors(prev => ({ ...prev, fullname: null }));
              }}
              placeholder="Enter teacher's full name"
              placeholderTextColor={COLORS.placeholder}
              autoCapitalize="words"
              autoCorrect={false}
            />
            {errors.fullname && (
              <Text style={styles.errorText}>{errors.fullname}</Text>
            )}
          </View>

          {/* Department Selector */}
          <View style={STYLES.inputContainer}>
            <Text style={STYLES.inputLabel}>Department *</Text>
            <TouchableOpacity
              style={[
                STYLES.textInput,
                { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
                errors.department && { borderColor: COLORS.error }
              ]}
              onPress={() => setShowDepartments(!showDepartments)}
            >
              <Text style={[
                FONTS.h5_regular,
                { color: formData.department ? COLORS.textPrimary : COLORS.placeholder }
              ]}>
                {formData.department || 'Select Department'}
              </Text>
              <Ionicons 
                name={showDepartments ? "chevron-up" : "chevron-down"} 
                size={20} 
                color={COLORS.gray} 
              />
            </TouchableOpacity>
            {errors.department && (
              <Text style={styles.errorText}>{errors.department}</Text>
            )}

            {/* Department Options */}
            {showDepartments && (
              <View style={styles.optionsContainer}>
                {DEPARTMENTS.map((dept) => (
                  <TouchableOpacity
                    key={dept}
                    style={[
                      styles.option,
                      formData.department === dept && styles.selectedOption
                    ]}
                    onPress={() => selectDepartment(dept)}
                  >
                    <Text style={[
                      styles.optionText,
                      formData.department === dept && styles.selectedOptionText
                    ]}>
                      {dept}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View style={STYLES.formButtons}>
            <TouchableOpacity
              style={[STYLES.buttonSecondary, { flex: 1 }]}
              onPress={onCancel}
            >
              <Text style={STYLES.buttonTextSecondary}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                STYLES.buttonPrimary,
                { flex: 1 },
                loading && { backgroundColor: COLORS.gray }
              ]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={STYLES.buttonText}>
                {loading ? 'Saving...' : (initialData ? 'Update' : 'Add Teacher')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: SIZES.padding,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.margin,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  closeButton: {
    padding: 5,
  },
  optionsContainer: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.borderRadius,
    backgroundColor: COLORS.white,
    maxHeight: 200,
  },
  option: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  selectedOption: {
    backgroundColor: COLORS.primaryLight,
  },
  optionText: {
    ...FONTS.h5_regular,
    color: COLORS.textPrimary,
  },
  selectedOptionText: {
    ...FONTS.h5_regular,
    color: COLORS.accent,
    fontWeight: '500',
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    marginTop: 5,
  },
});

export default TeacherForm;