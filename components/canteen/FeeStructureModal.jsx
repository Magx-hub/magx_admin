import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../../constants/base';

export default function FeeStructureModal({ 
  visible, 
  editingStructure, 
  formData, 
  onInputChange, 
  onSubmit, 
  onClose 
}) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingStructure ? 'Edit Fee Structure' : 'Add Fee Structure'}
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color={COLORS.gray} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Department</Text>
              <TextInput
                style={styles.textInput}
                value={formData.department}
                onChangeText={(text) => onInputChange('department', text)}
                placeholder="Enter department name"
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Classes Fee (GH₵)</Text>
              <TextInput
                style={styles.textInput}
                value={formData.classesFee}
                onChangeText={(text) => onInputChange('classesFee', text)}
                placeholder="0.00"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Breakfast Fee (GH₵)</Text>
              <TextInput
                style={styles.textInput}
                value={formData.breakfastFee}
                onChangeText={(text) => onInputChange('breakfastFee', text)}
                placeholder="0.00"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Effective Date</Text>
              <TextInput
                style={styles.textInput}
                value={formData.effectiveDate}
                onChangeText={(text) => onInputChange('effectiveDate', text)}
                placeholder="YYYY-MM-DD"
              />
            </View>

            <View style={styles.totalPreview}>
              <Text style={styles.totalLabel}>Total Fee:</Text>
              <Text style={styles.totalAmount}>
                GH₵{((parseFloat(formData.classesFee) || 0) + (parseFloat(formData.breakfastFee) || 0)).toFixed(2)}
              </Text>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={onSubmit}
              activeOpacity={0.7}
            >
              <Text style={styles.saveButtonText}>
                {editingStructure ? 'Update' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadius_md,
    width: '90%',
    maxHeight: '80%',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    ...FONTS.h5_bold,
    color: COLORS.accent,
  },
  closeButton: {
    padding: SIZES.padding_sm,
  },
  modalBody: {
    padding: SIZES.padding,
  },
  inputGroup: {
    marginBottom: SIZES.margin,
  },
  inputLabel: {
    ...FONTS.h6_bold,
    color: COLORS.textPrimary,
    marginBottom: SIZES.margin_sm,
  },
  textInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.borderRadius,
    padding: SIZES.padding_sm,
    ...FONTS.h6_regular,
  },
  totalPreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    backgroundColor: COLORS.gray_light,
    borderRadius: SIZES.borderRadius,
    marginTop: SIZES.margin,
  },
  totalLabel: {
    ...FONTS.h6_bold,
    color: COLORS.textPrimary,
  },
  totalAmount: {
    ...FONTS.h5_bold,
    color: COLORS.accent,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SIZES.padding,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  cancelButton: {
    flex: 1,
    padding: SIZES.padding,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.borderRadius,
    alignItems: 'center',
    marginRight: SIZES.margin_sm,
  },
  cancelButtonText: {
    ...FONTS.h6_bold,
    color: COLORS.gray,
  },
  saveButton: {
    flex: 1,
    padding: SIZES.padding,
    backgroundColor: COLORS.success,
    borderRadius: SIZES.borderRadius,
    alignItems: 'center',
    marginLeft: SIZES.margin_sm,
  },
  saveButtonText: {
    ...FONTS.h6_bold,
    color: COLORS.white,
  },
});
