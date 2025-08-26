// ============================================================================
// components/allowance/AllowanceForm.jsx
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS, STYLES } from '../../constants/base';

const AllowanceForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState({
    weekNumber: '',
    totalSum: '',
    numberOfTeachers: '',
    numberOfJHSTeachers: '',
    welfare: '',
    office: '',
    kitchen: '',
    // Add other fields as needed, or calculate them on submission
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        weekNumber: initialData.weekNumber?.toString() || '',
        totalSum: initialData.totalSum?.toString() || '',
        numberOfTeachers: initialData.numberOfTeachers?.toString() || '',
        numberOfJHSTeachers: initialData.numberOfJHSTeachers?.toString() || '',
        welfare: initialData.welfare?.toString() || '',
        office: initialData.office?.toString() || '',
        kitchen: initialData.kitchen?.toString() || '',
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.weekNumber) newErrors.weekNumber = 'Week Number is required';
    if (!formData.totalSum) newErrors.totalSum = 'Total Sum is required';
    if (!formData.numberOfTeachers) newErrors.numberOfTeachers = 'Number of Teachers is required';
    if (!formData.numberOfJHSTeachers) newErrors.numberOfJHSTeachers = 'Number of JHS Teachers is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill in all required fields.');
      return;
    }
    // Convert form data to numbers before submission
    const numericFormData = {
        ...formData,
        weekNumber: parseInt(formData.weekNumber, 10),
        totalSum: parseFloat(formData.totalSum),
        numberOfTeachers: parseInt(formData.numberOfTeachers, 10),
        numberOfJHSTeachers: parseInt(formData.numberOfJHSTeachers, 10),
        welfare: parseFloat(formData.welfare) || 0,
        office: parseFloat(formData.office) || 0,
        kitchen: parseFloat(formData.kitchen) || 0,
    };

    // Simplified calculation logic
    const balanceAfterWelfare = numericFormData.totalSum - numericFormData.welfare;
    const balanceAfterOffice = balanceAfterWelfare - numericFormData.office;
    const balanceAfterKitchen = balanceAfterOffice - numericFormData.kitchen;
    const eachTeacher = balanceAfterKitchen / numericFormData.numberOfTeachers;
    const eachJHSTeacher = eachTeacher; // Simplified, adjust as needed

    const finalData = {
        ...numericFormData,
        balanceAfterWelfare,
        balanceAfterOffice,
        balanceAfterKitchen,
        eachTeacher,
        eachJHSTeacher,
        jhsTeachersClasses: 'N/A', // Add a default or calculated value
        creche: 0, nursery1: 0, nursery2: 0, kg1: 0, kg2: 0,
        basic1: 0, basic2: 0, basic3: 0, basic4: 0, basic5: 0, basic6: 0,
        basic7General: 0, basic7JHS: 0, basic8General: 0, basic8JHS: 0,
        basic9General: 0, basic9JHS: 0,
    }

    try {
      await onSubmit(finalData);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to save allowance');
    }
  };

  const handleInputChange = (name, value) => {
      setFormData(prev => ({...prev, [name]: value}));
  }

  return (
    <KeyboardAvoidingView
      style={STYLES.modalContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}>
        <View style={STYLES.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {initialData ? 'Edit Allowance' : 'Add Allowance'}
            </Text>
            <TouchableOpacity onPress={onCancel} style={{padding: SIZES.padding_sm}}>
              <Ionicons name="close" size={SIZES.icon_md} color={COLORS.gray} />
            </TouchableOpacity>
          </View>

          <View style={STYLES.section}>
            <Text style={STYLES.sectionTitle}>Allowance Details</Text>
            <View style={STYLES.inputContainer}>
              <Text style={STYLES.inputLabel}>Week Number *</Text>
              <TextInput
                style={[STYLES.textInput, errors.weekNumber && {borderColor: COLORS.error}]}
                value={formData.weekNumber}
                onChangeText={(text) => handleInputChange('weekNumber', text)}
                placeholder="Enter week number"
                keyboardType="numeric"
              />
              {errors.weekNumber && <Text style={{...FONTS.h6_regular, color: COLORS.error, marginTop: 4}}>{errors.weekNumber}</Text>}
            </View>

            <View style={STYLES.inputContainer}>
              <Text style={STYLES.inputLabel}>Total Sum (GHS) *</Text>
              <TextInput
                style={[STYLES.textInput, errors.totalSum && {borderColor: COLORS.error}]}
                value={formData.totalSum}
                onChangeText={(text) => handleInputChange('totalSum', text)}
                placeholder="Enter total sum"
                keyboardType="numeric"
              />
              {errors.totalSum && <Text style={{...FONTS.h6_regular, color: COLORS.error, marginTop: 4}}>{errors.totalSum}</Text>}
            </View>
          </View>

          <View style={STYLES.section}>
            <Text style={STYLES.sectionTitle}>Teacher Allocation</Text>
            <View style={STYLES.formRow}>
              <View style={STYLES.formColumn}>
                <View style={STYLES.inputContainer}>
                  <Text style={STYLES.inputLabel}>Teachers *</Text>
                  <TextInput
                    style={[STYLES.textInput, errors.numberOfTeachers && {borderColor: COLORS.error}]}
                    value={formData.numberOfTeachers}
                    onChangeText={(text) => handleInputChange('numberOfTeachers', text)}
                    placeholder="Total"
                    keyboardType="numeric"
                  />
                  {errors.numberOfTeachers && <Text style={{...FONTS.h6_regular, color: COLORS.error, marginTop: 4}}>{errors.numberOfTeachers}</Text>}
                </View>
              </View>
              <View style={STYLES.formColumn}>
                <View style={STYLES.inputContainer}>
                  <Text style={STYLES.inputLabel}>JHS Teachers *</Text>
                  <TextInput
                    style={[STYLES.textInput, errors.numberOfJHSTeachers && {borderColor: COLORS.error}]}
                    value={formData.numberOfJHSTeachers}
                    onChangeText={(text) => handleInputChange('numberOfJHSTeachers', text)}
                    placeholder="Total JHS"
                    keyboardType="numeric"
                  />
                  {errors.numberOfJHSTeachers && <Text style={{...FONTS.h6_regular, color: COLORS.error, marginTop: 4}}>{errors.numberOfJHSTeachers}</Text>}
                </View>
              </View>
            </View>
          </View>

          <View style={STYLES.section}>
            <Text style={STYLES.sectionTitle}>Deductions</Text>
            <View style={STYLES.formRow}>
              <View style={STYLES.formColumn}>
                <View style={STYLES.inputContainer}>
                  <Text style={STYLES.inputLabel}>Welfare</Text>
                  <TextInput
                    style={STYLES.textInput}
                    value={formData.welfare}
                    onChangeText={(text) => handleInputChange('welfare', text)}
                    placeholder="Welfare amount"
                    keyboardType="numeric"
                  />
                </View>
              </View>
              <View style={STYLES.formColumn}>
                <View style={STYLES.inputContainer}>
                  <Text style={STYLES.inputLabel}>Office</Text>
                  <TextInput
                    style={STYLES.textInput}
                    value={formData.office}
                    onChangeText={(text) => handleInputChange('office', text)}
                    placeholder="Office amount"
                    keyboardType="numeric"
                  />
                </View>
              </View>
              <View style={STYLES.formColumn}>
                <View style={STYLES.inputContainer}>
                  <Text style={STYLES.inputLabel}>Kitchen</Text>
                  <TextInput
                    style={STYLES.textInput}
                    value={formData.kitchen}
                    onChangeText={(text) => handleInputChange('kitchen', text)}
                    placeholder="Kitchen amount"
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>
          </View>

          <View style={styles.formButtons}>
            <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={onCancel}>
              <Text style={styles.secondaryButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton, loading && { backgroundColor: COLORS.gray }]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.buttonText}>
                  {initialData ? 'Update' : 'Save'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.margin,
    paddingHorizontal: SIZES.padding,
  },
  headerTitle: {
    ...FONTS.h3_semibold,
    color: COLORS.textPrimary,
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SIZES.margin,
    paddingHorizontal: SIZES.padding,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SIZES.padding,
    borderRadius: SIZES.radius,
    borderWidth: 1,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    marginLeft: SIZES.padding_sm,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderColor: COLORS.gray,
    marginRight: SIZES.padding_sm,
  },
  buttonText: {
    ...FONTS.h4_semibold,
    color: COLORS.white,
  },
  secondaryButtonText: {
    ...FONTS.h4_semibold,
    color: COLORS.textSecondary,
  },
});

export default AllowanceForm;
