
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

const GENDERS = ['Male', 'Female'];

const StudentForm = ({ 
  initialData = null, 
  onSubmit, 
  onCancel, 
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    fullname: '',
    department: '',
    gender: ''
  });
  const [errors, setErrors] = useState({});
  const [showDepartments, setShowDepartments] = useState(false);
  const [showGenders, setShowGenders] = useState(false);

  // Initialize form with existing data for editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        fullname: initialData.fullname || '',
        department: initialData.department || '',
        gender: initialData.gender || ''
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

    if (!formData.gender.trim()) {
      newErrors.gender = 'Gender is required';
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
        setFormData({ fullname: '', department: '', gender: '' });
        setErrors({});
      }
    } catch (error) {
      console.error('Form submission error:', error);
      Alert.alert('Error', error.message || 'Failed to save student');
    }
  };

  // Handle department selection
  const selectDepartment = (department) => {
    setFormData(prev => ({ ...prev, department }));
    setShowDepartments(false);
    setErrors(prev => ({ ...prev, department: null }));
  };

  // Handle gender selection
  const selectGender = (gender) => {
    setFormData(prev => ({ ...prev, gender }));
    setShowGenders(false);
    setErrors(prev => ({ ...prev, gender: null }));
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
              {initialData ? 'Edit Student' : 'Add New Student'}
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
              placeholder="Enter student\'s full name"
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
                styles.selectInput,
                errors.department && { borderColor: COLORS.error }
              ]}
              onPress={() => setShowDepartments(!showDepartments)}
              activeOpacity={0.8}
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
              <View style={styles.dropdownOverlay}>
                <View style={styles.dropdownMenu}>
                  <ScrollView>
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
                  </ScrollView>
                </View>
              </View>
            )}
          </View>

          {/* Gender Selector */}
          <View style={STYLES.inputContainer}>
            <Text style={STYLES.inputLabel}>Gender *</Text>
            <TouchableOpacity
              style={[
                STYLES.textInput,
                styles.selectInput,
                errors.gender && { borderColor: COLORS.error }
              ]}
              onPress={() => setShowGenders(!showGenders)}
              activeOpacity={0.8}
            >
              <Text style={[
                FONTS.h5_regular,
                { color: formData.gender ? COLORS.textPrimary : COLORS.placeholder }
              ]}>
                {formData.gender || 'Select Gender'}
              </Text>
              <Ionicons
                name={showGenders ? "chevron-up" : "chevron-down"}
                size={20}
                color={COLORS.gray}
              />
            </TouchableOpacity>
            {errors.gender && (
              <Text style={styles.errorText}>{errors.gender}</Text>
            )}

            {showGenders && (
              <View style={styles.dropdownOverlay}>
                <View style={styles.dropdownMenu}>
                  <ScrollView>
                    {GENDERS.map((gender) => (
                      <TouchableOpacity
                        key={gender}
                        style={[
                          styles.option,
                          formData.gender === gender && styles.selectedOption
                        ]}
                        onPress={() => selectGender(gender)}
                      >
                        <Text style={[
                          styles.optionText,
                          formData.gender === gender && styles.selectedOptionText
                        ]}>
                          {gender}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View style={STYLES.formButtons}>
            <TouchableOpacity
              style={[STYLES.buttonDanger, { flex: 1 }]}
              onPress={onCancel}
            >
              <Text style={STYLES.buttonText}>Cancel</Text>
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
                {loading ? 'Saving...' : (initialData ? 'Update' : 'Add Student')}
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
    // padding: SIZES.padding,
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
  selectInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: SIZES.padding_sm,
    backgroundColor: COLORS.primaryLight,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: SIZES.borderRadius_md,
    marginBottom: 2,
    elevation: 1,
  },
  dropdownOverlay: {
    position: 'absolute',
    top: SIZES.inputHeight + 8,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: 'transparent',
  },
  dropdownMenu: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadius_md,
    borderWidth: 1,
    borderColor: COLORS.primary,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
    maxHeight: 220,
    marginHorizontal: 0,
    paddingVertical: 4,
  },
  option: {
    padding: 14,
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
    color: COLORS.primary,
    fontWeight: '600',
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    marginTop: 5,
  },
});

export default StudentForm;
