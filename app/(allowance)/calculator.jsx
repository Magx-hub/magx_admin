// app/(allowance)/calculator.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Animated,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS, STYLES } from '../../constants/base';
import { useAllowance } from '../../hooks/useAllowance';

export default function Calculator() {
  const [weekNumber, setWeekNumber] = useState('');
  const [classes, setClasses] = useState({
    creche: '',
    nursery1: '',
    nursery2: '',
    kg1: '',
    kg2: '',
    basic1: '',
    basic2: '',
    basic3: '',
    basic4: '',
    basic5: '',
    basic6: '',
    basic7General: '',
    basic7JHS: '',
    basic8General: '',
    basic8JHS: '',
    basic9General: '',
    basic9JHS: '',
  });
  const [numberOfTeachers, setNumberOfTeachers] = useState('');
  const [numberOfJHSTeachers, setNumberOfJHSTeachers] = useState('');
  const [result, setResult] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(1));
  const { addAllowance, loading, error } = useAllowance();

  const classLabels = {
    creche: 'Creche',
    nursery1: 'Nursery 1',
    nursery2: 'Nursery 2',
    kg1: 'KG 1',
    kg2: 'KG 2',
    basic1: 'Basic 1',
    basic2: 'Basic 2',
    basic3: 'Basic 3',
    basic4: 'Basic 4',
    basic5: 'Basic 5',
    basic6: 'Basic 6',
    basic7General: 'Basic 7 (General)',
    basic7JHS: 'Basic 7 (JHS)',
    basic8General: 'Basic 8 (General)',
    basic8JHS: 'Basic 8 (JHS)',
    basic9General: 'Basic 9 (General)',
    basic9JHS: 'Basic 9 (JHS)',
  };


  const calculate = () => {
  // Validation
  if (!weekNumber || parseInt(weekNumber) < 1 || parseInt(weekNumber) > 16) {
    Alert.alert('Error', 'Please enter a valid week number (1-16)');
    return;
  }
  if (!numberOfTeachers || parseInt(numberOfTeachers) <= 0) {
    Alert.alert('Error', 'Please enter a valid number of teachers');
    return;
  }
  if (!numberOfJHSTeachers || parseInt(numberOfJHSTeachers) <= 0) {
    Alert.alert('Error', 'Please enter a valid number of JHS teachers');
    return;
  }

  // Convert all class values to numbers
  const classValues = {};
  for (const [key, value] of Object.entries(classes)) {
    classValues[key] = parseFloat(value) || 0;
  }

  // ✅ CORRECTED: Only General classes go into main fund
  const generalClasses = [
    'creche',
    'nursery1',
    'nursery2',
    'kg1',
    'kg2',
    'basic1',
    'basic2',
    'basic3',
    'basic4',
    'basic5',
    'basic6',
    'basic7General',
    'basic8General',
    'basic9General',
  ];

  const totalSum = generalClasses.reduce(
    (sum, key) => sum + classValues[key],
    0
  );

  const welfare = 100;
  const balanceAfterWelfare = totalSum - welfare;
  const office = balanceAfterWelfare * 0.05;
  const balanceAfterOffice = balanceAfterWelfare - office;
  const kitchen = balanceAfterOffice * 0.05;
  const balanceAfterKitchen = balanceAfterOffice - kitchen;
  const eachTeacher = balanceAfterKitchen / parseInt(numberOfTeachers);

  // JHS-specific calculation
  const jhsTeachersClasses = classValues.basic7JHS + classValues.basic8JHS + classValues.basic9JHS;
  const eachJHSTeacher = jhsTeachersClasses / parseInt(numberOfJHSTeachers);

  const calculationResult = {
    weekNumber: parseInt(weekNumber),
    classes: classValues,
    numberOfTeachers: parseInt(numberOfTeachers),
    numberOfJHSTeachers: parseInt(numberOfJHSTeachers),
    totalSum,
    welfare,
    balanceAfterWelfare,
    office,
    balanceAfterOffice,
    kitchen,
    balanceAfterKitchen,
    eachTeacher,
    jhsTeachersClasses,
    eachJHSTeacher,
  };

  setResult(calculationResult);
  saveCalculation(calculationResult);

  // Animate result
  Animated.timing(fadeAnim, {
    toValue: 0,
    duration: 300,
    useNativeDriver: true,
  }).start(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  });
};

  const saveCalculation = async (calculation) => {
    try {
      // Flatten the classes object into individual properties for database storage
      const flatCalculation = {
        ...calculation,
        creche: calculation.classes.creche,
        nursery1: calculation.classes.nursery1,
        nursery2: calculation.classes.nursery2,
        kg1: calculation.classes.kg1,
        kg2: calculation.classes.kg2,
        basic1: calculation.classes.basic1,
        basic2: calculation.classes.basic2,
        basic3: calculation.classes.basic3,
        basic4: calculation.classes.basic4,
        basic5: calculation.classes.basic5,
        basic6: calculation.classes.basic6,
        basic7General: calculation.classes.basic7General,
        basic7JHS: calculation.classes.basic7JHS,
        basic8General: calculation.classes.basic8General,
        basic8JHS: calculation.classes.basic8JHS,
        basic9General: calculation.classes.basic9General,
        basic9JHS: calculation.classes.basic9JHS,
      };
      
      // Remove the classes object since we've flattened it
      delete flatCalculation.classes;
      
      const savedId = await addAllowance(flatCalculation);
      if (savedId) {
        Alert.alert('Success', 'Calculation saved successfully!');
      }
    } catch (error) {
      console.error('Error saving calculation:', error);
      Alert.alert('Error', `Failed to save calculation: ${error.message}`);
    }
  };

  const clearForm = () => {
    setWeekNumber('');
    setClasses({
      creche: '',
      nursery1: '',
      nursery2: '',
      kg1: '',
      kg2: '',
      basic1: '',
      basic2: '',
      basic3: '',
      basic4: '',
      basic5: '',
      basic6: '',
      basic7General: '',
      basic7JHS: '',
      basic8General: '',
      basic8JHS: '',
      basic9General: '',
      basic9JHS: '',
    });
    setNumberOfTeachers('');
    setNumberOfJHSTeachers('');
    setResult(null);
  };

  const updateClass = (key, value) => {
    setClasses(prev => ({ ...prev, [key]: value }));
  };

  return (
    <KeyboardAvoidingView
      style={STYLES.screenContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Week Number */}
        <View style={STYLES.section}>
          <Text style={STYLES.sectionTitle}>Week Information</Text>
          <View style={STYLES.inputContainer}>
            <Text style={STYLES.inputLabel}>Week Number (1-16)</Text>
            <TextInput
              style={STYLES.textInput}
              value={weekNumber}
              onChangeText={setWeekNumber}
              keyboardType="numeric"
              placeholder="Enter week number"
              placeholderTextColor={COLORS.placeholder}
            />
          </View>
        </View>

        {/* Class Amounts */}
        <View style={STYLES.section}>
          <Text style={STYLES.sectionTitle}>Class Amounts (GH₵)</Text>
          {Object.entries(classLabels).map(([key, label]) => (
            <View key={key} style={STYLES.inputContainer}>
              <Text style={STYLES.inputLabel}>{label}</Text>
              <TextInput
                style={STYLES.textInput}
                value={classes[key]}
                onChangeText={(value) => updateClass(key, value)}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor={COLORS.placeholder}
              />
            </View>
          ))}
        </View>

        {/* Teachers */}
        <View style={STYLES.section}>
          <Text style={STYLES.sectionTitle}>Teachers</Text>
          <View style={STYLES.inputContainer}>
            <Text style={STYLES.inputLabel}>Number of Teachers</Text>
            <TextInput
              style={STYLES.textInput}
              value={numberOfTeachers}
              onChangeText={setNumberOfTeachers}
              keyboardType="numeric"
              placeholder="Enter number of teachers"
              placeholderTextColor={COLORS.placeholder}
            />
          </View>
          <View style={STYLES.inputContainer}>
            <Text style={STYLES.inputLabel}>Number of JHS Teachers</Text>
            <TextInput
              style={STYLES.textInput}
              value={numberOfJHSTeachers}
              onChangeText={setNumberOfJHSTeachers}
              keyboardType="numeric"
              placeholder="Enter number of JHS teachers"
              placeholderTextColor={COLORS.placeholder}
            />
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.verticalButtons}>
          <TouchableOpacity 
            style={[STYLES.buttonPrimary, styles.fullWidthButton]} 
            onPress={calculate}
          >
            <Ionicons name="calculator-outline" size={SIZES.icon_sm} color={COLORS.white} style={{ marginRight: 12 }} />
            <Text style={[STYLES.buttonText, {fontSize: SIZES.fontMd}]}>Calculate Results</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[STYLES.buttonSecondary, styles.fullWidthButton, styles.clearButtonTopMargin]} 
            onPress={clearForm}
          >
            <Ionicons name="refresh-outline" size={SIZES.icon_sm} color={COLORS.white} style={{ marginRight: 12 }} />
            <Text style={[STYLES.buttonText, {fontSize: SIZES.fontMd}]}>Reset Form</Text>
          </TouchableOpacity>
        </View>

        {/* Results */}
        {result && (
          <Animated.View style={[styles.resultSection, { opacity: fadeAnim }]}>
            <Text style={STYLES.sectionTitle}>Calculation Results</Text>
            
            <View style={STYLES.card}>
              <Text style={styles.resultTitle}>Week {result.weekNumber} Summary</Text>
              <View style={STYLES.divider} />
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Total Sum:</Text>
                <Text style={styles.resultValue}>GH₵{result.totalSum.toFixed(2)}</Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Welfare Deduction:</Text>
                <Text style={styles.resultValue}>-GH₵{result.welfare.toFixed(2)}</Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Office (5%):</Text>
                <Text style={styles.resultValue}>-GH₵{result.office.toFixed(2)}</Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Kitchen (5%):</Text>
                <Text style={styles.resultValue}>-GH₵{result.kitchen.toFixed(2)}</Text>
              </View>
              <View style={[styles.resultRow, styles.finalRow]}>
                <Text style={styles.resultLabelBold}>Balance After Deductions:</Text>
                <Text style={styles.finalValue}>GH₵{result.balanceAfterKitchen.toFixed(2)}</Text>
              </View>
            </View>

            <View style={STYLES.card}>
              <Text style={styles.resultTitle}>Per Teacher Breakdown</Text>
              <View style={STYLES.divider} />
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Each Teacher ({result.numberOfTeachers} total):</Text>
                <Text style={styles.finalValue}>GH₵{result.eachTeacher.toFixed(2)}</Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>JHS Classes Total:</Text>
                <Text style={styles.resultValue}>GH₵{result.jhsTeachersClasses.toFixed(2)}</Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Each JHS Teacher ({result.numberOfJHSTeachers} total):</Text>
                <Text style={styles.finalValue}>GH₵{result.eachJHSTeacher.toFixed(2)}</Text>
              </View>
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.padding,
    gap: SIZES.margin_sm,
    marginBottom: SIZES.margin,
  },
  resultSection: {
    margin: SIZES.margin,
  },
  resultTitle: {
    ...FONTS.h5_regular,
    fontWeight: '600',
    marginBottom: SIZES.margin_sm,
    color: COLORS.accent,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.margin_sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  finalRow: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.accent,
    backgroundColor: COLORS.secondary_light,
    marginHorizontal: -SIZES.padding_sm,
    paddingHorizontal: SIZES.padding_sm,
    borderRadius: SIZES.borderRadius,
  },
  resultLabel: {
    ...FONTS.h6_regular,
    color: COLORS.gray_dark,
    flex: 1,
  },
  resultLabelBold: {
    ...FONTS.h6_regular,
    fontWeight: '600',
    color: COLORS.accent,
    flex: 1,
  },
  resultValue: {
    ...FONTS.h6_regular,
    fontWeight: '500',
    color: COLORS.gray,
  },
  finalValue: {
    ...FONTS.h5_regular,
    fontWeight: '600',
    color: COLORS.accent,
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

  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  gradientButton: {
    overflow: 'hidden',
    borderRadius: 12,
  },
  gradientBackground: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  outlineButton: {
    borderWidth: 2,
    borderColor: COLORS.accent,
    backgroundColor: 'transparent',
  },
  buttonTextWithShadow: {
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

});
