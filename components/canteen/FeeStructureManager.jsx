import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../../constants/base';
import { useCanteen } from '../../hooks/useCanteen';
import FeeStructureItem from './FeeStructureItem';
import FeeStructureModal from './FeeStructureModal';
import EmptyState from './EmptyState';

export default function FeeStructureManager() {
  const {
    feeStructures,
    loadingFeeStructures,
    addNewFeeStructure,
    updateExistingFeeStructure,
    deleteExistingFeeStructure,
    fetchFeeStructures,
  } = useCanteen();

  // State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStructure, setEditingStructure] = useState(null);
  const [formData, setFormData] = useState({
    department: '',
    classesFee: '',
    breakfastFee: '',
    effectiveDate: new Date().toISOString().split('T')[0],
  });

  // Load fee structures on mount
  useEffect(() => {
    fetchFeeStructures();
  }, [fetchFeeStructures]);

  // Reset form
  const resetForm = () => {
    setFormData({
      department: '',
      classesFee: '',
      breakfastFee: '',
      effectiveDate: new Date().toISOString().split('T')[0],
    });
    setEditingStructure(null);
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validation
    if (!formData.department.trim()) {
      Alert.alert('Error', 'Please enter department name');
      return;
    }
    if (!formData.classesFee || parseFloat(formData.classesFee) <= 0) {
      Alert.alert('Error', 'Please enter a valid classes fee');
      return;
    }
    if (!formData.breakfastFee || parseFloat(formData.breakfastFee) <= 0) {
      Alert.alert('Error', 'Please enter a valid breakfast fee');
      return;
    }
    if (!formData.effectiveDate) {
      Alert.alert('Error', 'Please select effective date');
      return;
    }

    try {
      if (editingStructure) {
        // Update existing
        await updateExistingFeeStructure(editingStructure.id, {
          department: formData.department.trim(),
          classesFee: parseFloat(formData.classesFee),
          breakfastFee: parseFloat(formData.breakfastFee),
          effectiveDate: formData.effectiveDate,
        });
        Alert.alert('Success', 'Fee structure updated successfully');
      } else {
        // Add new
        await addNewFeeStructure({
          department: formData.department.trim(),
          classesFee: parseFloat(formData.classesFee),
          breakfastFee: parseFloat(formData.breakfastFee),
          effectiveDate: formData.effectiveDate,
        });
        Alert.alert('Success', 'Fee structure added successfully');
      }
      
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving fee structure:', error);
      Alert.alert('Error', error.message || 'Failed to save fee structure');
    }
  };

  // Handle edit
  const handleEdit = (structure) => {
    setEditingStructure(structure);
    setFormData({
      department: structure.department,
      classesFee: structure.classesFee.toString(),
      breakfastFee: structure.breakfastFee.toString(),
      effectiveDate: structure.effectiveDate,
    });
    setShowAddModal(true);
  };

  // Handle delete
  const handleDelete = (structure) => {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete the fee structure for ${structure.department}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteExistingFeeStructure(structure.id);
              Alert.alert('Success', 'Fee structure deleted successfully');
            } catch (error) {
              console.error('Error deleting fee structure:', error);
              Alert.alert('Error', 'Failed to delete fee structure');
            }
          },
        },
      ]
    );
  };

  // Handle close modal
  const handleCloseModal = () => {
    setShowAddModal(false);
    resetForm();
  };

  return (
    <View style={styles.container}>
      {/* Header Actions */}
      <View style={styles.headerActions}>
        <Text style={styles.sectionTitle}>Fee Structures</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={20} color={COLORS.white} />
          <Text style={styles.addButtonText}>Add New</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loadingFeeStructures ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading fee structures...</Text>
          </View>
        ) : feeStructures.length === 0 ? (
          <EmptyState onAddNew={() => setShowAddModal(true)} />
        ) : (
          <View style={styles.structuresList}>
            {feeStructures.map((structure, index) => (
              <FeeStructureItem
                key={structure.id}
                structure={structure}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Add/Edit Modal */}
      <FeeStructureModal
        visible={showAddModal}
        editingStructure={editingStructure}
        formData={formData}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        onClose={handleCloseModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray_light,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sectionTitle: {
    ...FONTS.h5_bold,
    color: COLORS.accent,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.success,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding_sm,
    borderRadius: SIZES.borderRadius,
  },
  addButtonText: {
    ...FONTS.h6_bold,
    color: COLORS.white,
    marginLeft: SIZES.margin_sm,
  },
  content: {
    flex: 1,
    padding: SIZES.padding,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding * 2,
  },
  loadingText: {
    ...FONTS.h6_regular,
    color: COLORS.gray,
  },
  structuresList: {
    gap: SIZES.margin,
  },
});
