import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES, FONTS } from '../../constants/base';

export default function SearchResults({ searchResults }) {
  if (searchResults.length === 0) return null;

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const totalAmount = searchResults.reduce((sum, result) => sum + (result.totalFee || 0), 0);
  const totalPayments = searchResults.length;

  return (
    <View style={styles.resultsSection}>
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsTitle}>Search Results</Text>
        <Text style={styles.resultsSubtitle}>
          {totalPayments} payments • {formatCurrency(totalAmount)}
        </Text>
      </View>

      <View style={styles.resultsList}>
        {searchResults.map((result, index) => (
          <View key={index} style={styles.resultItem}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultStudentName}>{result.studentName}</Text>
              <Text style={styles.resultAmount}>{formatCurrency(result.totalFee)}</Text>
            </View>
            
            <Text style={styles.resultDepartment}>{result.studentDepartment}</Text>
            
            <View style={styles.resultDetails}>
              <Text style={styles.resultDetail}>
                Classes: {formatCurrency(result.classesFee)}
              </Text>
              <Text style={styles.resultDetail}>
                Breakfast: {formatCurrency(result.breakfastFee)}
              </Text>
              {result.otherFee > 0 && (
                <Text style={styles.resultDetail}>
                  Other: {formatCurrency(result.otherFee)}
                </Text>
              )}
              <Text style={styles.resultDetail}>
                Method: {result.paymentMethod || 'N/A'}
              </Text>
              <Text style={styles.resultDetail}>
                Date: {formatDate(result.paymentDate)}
              </Text>
            </View>
            
            {result.notes && (
              <Text style={styles.resultNotes}>Notes: {result.notes}</Text>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  resultsSection: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadius_md,
    padding: SIZES.padding,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultsHeader: {
    marginBottom: SIZES.margin,
  },
  resultsTitle: {
    ...FONTS.h5_bold,
    color: COLORS.accent,
    marginBottom: 4,
  },
  resultsSubtitle: {
    ...FONTS.h6_regular,
    color: COLORS.gray,
  },
  resultsList: {
    gap: SIZES.margin_sm,
  },
  resultItem: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: SIZES.padding_sm,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  resultStudentName: {
    ...FONTS.h6_bold,
    color: COLORS.textPrimary,
  },
  resultAmount: {
    ...FONTS.h6_bold,
    color: COLORS.success,
  },
  resultDepartment: {
    ...FONTS.h6_regular,
    color: COLORS.gray,
    marginBottom: 4,
  },
  resultDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.margin_sm,
    marginBottom: 4,
  },
  resultDetail: {
    ...FONTS.h6_regular,
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  resultNotes: {
    ...FONTS.h6_regular,
    color: COLORS.textSecondary,
    fontSize: 12,
    fontStyle: 'italic',
  },
});
