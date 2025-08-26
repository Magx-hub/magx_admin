import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Text,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../../constants/base';
import { useCanteen } from '../../hooks/useCanteen';
import StudentPicker from './StudentPicker';
import SelectedStudentCard from './SelectedStudentCard';
import FeeDetails from './FeeDetails';
import PaymentMethodSelector from './PaymentMethodSelector';

export default function PaymentForm({ students = [] }) {
  const { 
    recordNewDailyPayment, 
    calculateFeeForStudent,
    getCurrentFeeStructureForDepartment,
    currentDate 
  } = useCanteen();

  // Debug logging
  console.log('PaymentForm - students received as props:', students?.length || 0);

  // Form state
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [classesFee, setClassesFee] = useState(0);
  const [breakfastFee, setBreakfastFee] = useState(0);
  const [otherFee, setOtherFee] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  // UI state
  const [showStudentPicker, setShowStudentPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle student selection
  const handleStudentSelect = async (student) => {
    try {
      setSelectedStudent(student);
      setShowStudentPicker(false);
      setSearchQuery('');

      // Get current fee structure for the student's department
      const feeStructure = await getCurrentFeeStructureForDepartment(student.department);
      
      if (feeStructure) {
        setClassesFee(feeStructure.classesFee);
        setBreakfastFee(feeStructure.breakfastFee);
      } else {
        Alert.alert(
          'No Fee Structure',
          `No fee structure found for department: ${student.department}. Please set up fees first.`
        );
      }
    } catch (error) {
      console.error('Error selecting student:', error);
      Alert.alert('Error', 'Failed to load fee structure for this student.');
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!selectedStudent) {
      Alert.alert('Error', 'Please select a student');
      return;
    }

    if (classesFee <= 0 || breakfastFee <= 0) {
      Alert.alert('Error', 'Classes fee and breakfast fee are required');
      return;
    }

    try {
      setLoading(true);
      
      const paymentData = {
        studentId: selectedStudent.id,
        classesFee: parseFloat(classesFee),
        breakfastFee: parseFloat(breakfastFee),
        otherFee: parseFloat(otherFee || 0),
        paymentMethod,
        notes: notes.trim(),
        paymentDate: currentDate
      };

      await recordNewDailyPayment(paymentData);
      
      Alert.alert(
        'Success',
        `Payment recorded successfully for ${selectedStudent.fullname}`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setSelectedStudent(null);
              setClassesFee(0);
              setBreakfastFee(0);
              setOtherFee(0);
              setPaymentMethod('cash');
              setNotes('');
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error recording payment:', error);
      Alert.alert('Error', error.message || 'Failed to record payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Student Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Student</Text>
          
          {!selectedStudent ? (
            <TouchableOpacity
              style={styles.selectStudentButton}
              onPress={() => setShowStudentPicker(true)}
              activeOpacity={0.7}
            >
              <Ionicons name="person-add" size={24} color={COLORS.primary} />
              <Text style={styles.selectStudentText}>Choose Student</Text>
            </TouchableOpacity>
          ) : (
            <SelectedStudentCard
              student={selectedStudent}
              onRemove={() => setSelectedStudent(null)}
            />
          )}
        </View>

        {/* Fee Details */}
        <FeeDetails
          classesFee={classesFee}
          breakfastFee={breakfastFee}
          otherFee={otherFee}
          onClassesFeeChange={setClassesFee}
          onBreakfastFeeChange={setBreakfastFee}
          onOtherFeeChange={setOtherFee}
        />

        {/* Payment Method */}
        <PaymentMethodSelector
          paymentMethod={paymentMethod}
          onPaymentMethodChange={setPaymentMethod}
        />

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes (Optional)</Text>
          <TextInput
            style={styles.notesInput}
            value={notes}
            onChangeText={setNotes}
            placeholder="Add any additional notes..."
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            (!selectedStudent || loading) && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={!selectedStudent || loading}
          activeOpacity={0.7}
        >
          {loading ? (
            <Text style={styles.submitButtonText}>Recording Payment...</Text>
          ) : (
            <Text style={styles.submitButtonText}>Record Payment</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Student Picker Modal */}
      {showStudentPicker && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Student</Text>
            </View>
            <StudentPicker
              students={students}
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
              onStudentSelect={handleStudentSelect}
              onClose={() => setShowStudentPicker(false)}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray_light,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: SIZES.padding,
  },
  section: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadius_md,
    padding: SIZES.padding,
    marginBottom: SIZES.margin,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    ...FONTS.h5_bold,
    color: COLORS.accent,
    marginBottom: SIZES.margin,
  },
  selectStudentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.padding,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    borderRadius: SIZES.borderRadius,
    backgroundColor: COLORS.gray_light,
  },
  selectStudentText: {
    ...FONTS.h6_regular,
    color: COLORS.gray,
    marginLeft: SIZES.margin_sm,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.borderRadius,
    padding: SIZES.padding_sm,
    minHeight: 80,
    ...FONTS.h6_regular,
  },
  submitButton: {
    backgroundColor: COLORS.success,
    padding: SIZES.padding,
    borderRadius: SIZES.borderRadius_md,
    alignItems: 'center',
    marginTop: SIZES.margin,
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.gray,
  },
  submitButtonText: {
    ...FONTS.h6_bold,
    color: COLORS.white,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadius_md,
    width: '90%',
    maxHeight: '80%',
    minHeight: 300,
    flex: 1,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    justifyContent: 'flex-start',
  },
  modalHeader: {
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    ...FONTS.h5_bold,
    color: COLORS.accent,
    textAlign: 'center',
  },
});
