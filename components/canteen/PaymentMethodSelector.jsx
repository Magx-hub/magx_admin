import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../../constants/base';

export default function PaymentMethodSelector({ paymentMethod, onPaymentMethodChange }) {
  const paymentMethods = [
    { id: 'cash', title: 'Cash', icon: 'cash' },
    { id: 'mobile_money', title: 'Mobile Money', icon: 'phone-portrait' },
    { id: 'card', title: 'Card', icon: 'card' },
  ];

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Payment Method</Text>
      <View style={styles.paymentMethodContainer}>
        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.paymentMethodButton,
              paymentMethod === method.id && styles.paymentMethodButtonActive
            ]}
            onPress={() => onPaymentMethodChange(method.id)}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={method.icon}
              size={20} 
              color={paymentMethod === method.id ? COLORS.white : COLORS.gray} 
            />
            <Text style={[
              styles.paymentMethodText,
              paymentMethod === method.id && styles.paymentMethodTextActive
            ]}>
              {method.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  paymentMethodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentMethodButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.padding_sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.borderRadius,
    marginHorizontal: 4,
  },
  paymentMethodButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  paymentMethodText: {
    ...FONTS.h6_regular,
    color: COLORS.gray,
    marginLeft: SIZES.margin_sm,
  },
  paymentMethodTextActive: {
    color: COLORS.white,
  },
});
