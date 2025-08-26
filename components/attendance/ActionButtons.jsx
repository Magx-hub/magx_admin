import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../../constants/base';

export default function ActionButtons({ 
  onReset, 
  onGenerate, 
  canGenerate, 
  generatingReport 
}) {
  return (
    <View style={styles.actions}>
      <TouchableOpacity
        style={styles.resetButton}
        onPress={onReset}
        activeOpacity={0.7}
      >
        <Ionicons name="refresh" size={20} color={COLORS.gray} />
        <Text style={styles.resetButtonText}>Reset</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.generateButton,
          (!canGenerate || generatingReport) && styles.generateButtonDisabled
        ]}
        onPress={onGenerate}
        disabled={!canGenerate || generatingReport}
        activeOpacity={0.7}
      >
        {generatingReport ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Ionicons name="document-text" size={20} color="#fff" />
        )}
        <Text style={styles.generateButtonText}>
          {generatingReport ? 'Generating...' : 'Generate Report'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  resetButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
    backgroundColor: '#fff',
    gap: 8,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#495057',
  },
  generateButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: COLORS.accent,
    gap: 8,
  },
  generateButtonDisabled: {
    backgroundColor: '#6c757d',
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

