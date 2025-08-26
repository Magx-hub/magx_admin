// app/(tabs)/reports.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS, STYLES } from '../../constants/base';
import { useAllowance } from '../../hooks/useAllowance';

export default function Reports() {
  const [calculations, setCalculations] = useState([]);
  const [selectedWeeks, setSelectedWeeks] = useState([]);
  const { allowances, fetchAllowances } = useAllowance();

  useEffect(() => {
    loadCalculations();
  }, []);

  useEffect(() => {
    if (allowances.length > 0) {
      setCalculations(allowances.sort((a, b) => a.weekNumber - b.weekNumber));
    }
  }, [allowances]);

  const loadCalculations = async () => {
    try {
      await fetchAllowances();
    } catch (error) {
      console.error('Error loading calculations:', error);
    }
  };

  const toggleWeekSelection = (weekNumber) => {
    setSelectedWeeks(prev => 
      prev.includes(weekNumber)
        ? prev.filter(w => w !== weekNumber)
        : [...prev, weekNumber]
    );
  };

  const selectAllWeeks = () => {
    if (selectedWeeks.length === calculations.length) {
      setSelectedWeeks([]);
    } else {
      setSelectedWeeks(calculations.map(calc => calc.weekNumber));
    }
  };

  const generateHTMLReport = (selectedCalculations) => {
    const totalAmount = selectedCalculations.reduce((sum, calc) => sum + calc.totalSum, 0);
    const totalTeachers = selectedCalculations.reduce((sum, calc) => sum + calc.numberOfTeachers, 0);
    const averagePerWeek = totalAmount / selectedCalculations.length;

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Friday Allowance Report</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .summary { background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
            .summary-item { display: inline-block; margin: 10px 20px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #007AFF; color: white; }
            .amount { text-align: right; }
            .total-row { background-color: #f0f8ff; font-weight: bold; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>Friday Allowance Report</h1>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>

        <div class="summary">
            <h2>Summary</h2>
            <div class="summary-item">
                <strong>Total Weeks:</strong> ${selectedCalculations.length}
            </div>
            <div class="summary-item">
                <strong>Total Amount:</strong> GH₵${totalAmount.toFixed(2)}
            </div>
            <div class="summary-item">
                <strong>Average per Week:</strong> GH₵${averagePerWeek.toFixed(2)}
            </div>
            <div class="summary-item">
                <strong>Total Teachers:</strong> ${totalTeachers}
            </div>
        </div>

        <h2>Weekly Breakdown</h2>
        <table>
            <thead>
                <tr>
                    <th>Week</th>
                    <th>Date</th>
                    <th class="amount">Total Sum</th>
                    <th class="amount">Welfare</th>
                    <th class="amount">Office</th>
                    <th class="amount">Kitchen</th>
                    <th class="amount">Balance</th>
                    <th>Teachers</th>
                    <th class="amount">Per Teacher</th>
                </tr>
            </thead>
            <tbody>
                ${selectedCalculations.map(calc => `
                    <tr>
                        <td>Week ${calc.weekNumber}</td>
                        <td>${(() => {
                          if (calc.createdAt) {
                            try {
                              const date = new Date(calc.createdAt);
                              if (!isNaN(date.getTime())) {
                                return date.toLocaleDateString();
                              }
                            } catch (e) {
                              console.log('Error parsing date:', calc.createdAt, e);
                            }
                          }
                          return 'N/A';
                        })()}</td>
                        <td class="amount">GH₵${calc.totalSum.toFixed(2)}</td>
                        <td class="amount">GH₵${calc.welfare.toFixed(2)}</td>
                        <td class="amount">GH₵${calc.office.toFixed(2)}</td>
                        <td class="amount">GH₵${calc.kitchen.toFixed(2)}</td>
                        <td class="amount">GH₵${calc.balanceAfterKitchen.toFixed(2)}</td>
                        <td>${calc.numberOfTeachers}</td>
                        <td class="amount">GH₵${calc.eachTeacher.toFixed(2)}</td>
                    </tr>
                `).join('')}
                <tr class="total-row">
                    <td colspan="2">TOTALS</td>
                    <td class="amount">GH₵${totalAmount.toFixed(2)}</td>
                    <td class="amount">GH₵${selectedCalculations.reduce((sum, calc) => sum + calc.welfare, 0).toFixed(2)}</td>
                    <td class="amount">GH₵${selectedCalculations.reduce((sum, calc) => sum + calc.office, 0).toFixed(2)}</td>
                    <td class="amount">GH₵${selectedCalculations.reduce((sum, calc) => sum + calc.kitchen, 0).toFixed(2)}</td>
                    <td class="amount">GH₵${selectedCalculations.reduce((sum, calc) => sum + calc.balanceAfterKitchen, 0).toFixed(2)}</td>
                    <td>${totalTeachers}</td>
                    <td class="amount">-</td>
                </tr>
            </tbody>
        </table>

        <div class="footer">
            <p>Generated by Friday Allowance Calculator</p>
        </div>
    </body>
    </html>
    `;
  };

  const generatePDFReport = async () => {
    if (selectedWeeks.length === 0) {
      Alert.alert('Error', 'Please select at least one week to generate report');
      return;
    }

    try {
      const selectedCalculations = calculations.filter(calc => 
        selectedWeeks.includes(calc.weekNumber)
      );

      const html = generateHTMLReport(selectedCalculations);
      
      const { uri } = await Print.printToFileAsync({ 
        html,
        base64: false 
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Share Friday Allowance Report'
        });
      } else {
        Alert.alert('Success', 'PDF generated successfully');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert('Error', 'Failed to generate PDF report');
    }
  };

  const shareTextReport = async () => {
    if (selectedWeeks.length === 0) {
      Alert.alert('Error', 'Please select at least one week to share report');
      return;
    }

    try {
      const selectedCalculations = calculations.filter(calc => 
        selectedWeeks.includes(calc.weekNumber)
      );

      const totalAmount = selectedCalculations.reduce((sum, calc) => sum + calc.totalSum, 0);
      const totalTeachers = selectedCalculations.reduce((sum, calc) => sum + calc.numberOfTeachers, 0);

      let reportText = `FRIDAY ALLOWANCE REPORT\n`;
      reportText += `Generated: ${new Date().toLocaleDateString()}\n\n`;
      reportText += `SUMMARY:\n`;
      reportText += `Total Weeks: ${selectedCalculations.length}\n`;
      reportText += `Total Amount: GH₵${totalAmount.toFixed(2)}\n`;
      reportText += `Average per Week: GH₵${(totalAmount / selectedCalculations.length).toFixed(2)}\n`;
      reportText += `Total Teachers: ${totalTeachers}\n\n`;
      
      reportText += `WEEKLY BREAKDOWN:\n`;
      selectedCalculations.forEach(calc => {
        const weekDate = (() => {
          if (calc.createdAt) {
            try {
              const date = new Date(calc.createdAt);
              if (!isNaN(date.getTime())) {
                return date.toLocaleDateString();
              }
            } catch (e) {
              console.log('Error parsing date:', calc.createdAt, e);
            }
          }
          return 'N/A';
        })();
        
        reportText += `Week ${calc.weekNumber} (${weekDate}):\n`;
        reportText += `  Total: GH₵${calc.totalSum.toFixed(2)} | Balance: GH₵${calc.balanceAfterKitchen.toFixed(2)}\n`;
        reportText += `  Teachers: ${calc.numberOfTeachers} | Per Teacher: GH₵${calc.eachTeacher.toFixed(2)}\n\n`;
      });

      await Share.share({
        message: reportText,
        title: 'Friday Allowance Report'
      });
    } catch (error) {
      console.error('Error sharing report:', error);
      Alert.alert('Error', 'Failed to share report');
    }
  };

  if (calculations.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
        <StatusBar backgroundColor={COLORS.accent} barStyle="light-content" />
        <View style={styles.emptyContainer}>
          <Ionicons name="document-text-outline" size={64} color={COLORS.gray_light} />
          <Text style={styles.emptyTitle}>No Data Available</Text>
          <Text style={styles.emptySubtitle}>Create some calculations first to generate reports</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <StatusBar backgroundColor={COLORS.accent} barStyle="light-content" />
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Generate Reports</Text>
          <Text style={styles.headerSubtitle}>Select weeks to include in your report</Text>
        </View>

        {/* Selection Controls */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity style={styles.selectAllButton} onPress={selectAllWeeks}>
            <Text style={styles.selectAllText}>
              {selectedWeeks.length === calculations.length ? 'Deselect All' : 'Select All'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.selectedCount}>
            {selectedWeeks.length} of {calculations.length} weeks selected
          </Text>
        </View>

        {/* Week Selection */}
        <View style={styles.weekSelectionContainer}>
          {calculations.map((calc) => (
            <TouchableOpacity
              key={calc.weekNumber}
              style={[
                styles.weekItem,
                selectedWeeks.includes(calc.weekNumber) && styles.selectedWeekItem
              ]}
              onPress={() => toggleWeekSelection(calc.weekNumber)}
            >
              <View style={styles.weekHeader}>
                <Text style={[
                  styles.weekNumber,
                  selectedWeeks.includes(calc.weekNumber) && styles.selectedWeekText
                ]}>
                  Week {calc.weekNumber}
                </Text>
                <Text style={[
                  styles.weekDate,
                  selectedWeeks.includes(calc.weekNumber) && styles.selectedWeekText
                ]}>
                  {(() => {
                    if (calc.createdAt) {
                      try {
                        const date = new Date(calc.createdAt);
                        if (!isNaN(date.getTime())) {
                          return date.toLocaleDateString();
                        }
                      } catch (e) {
                        console.log('Error parsing date:', calc.createdAt, e);
                      }
                    }
                    return 'N/A';
                  })()}
                </Text>
              </View>
              <View style={styles.weekDetails}>
                <Text style={[
                  styles.weekAmount,
                  selectedWeeks.includes(calc.weekNumber) && styles.selectedWeekText
                ]}>
                  GH₵{calc.totalSum.toFixed(2)}
                </Text>
                <Text style={[
                  styles.weekTeachers,
                  selectedWeeks.includes(calc.weekNumber) && styles.selectedWeekText
                ]}>
                  {calc.numberOfTeachers} Teachers
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Generate Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={[styles.generateButton, styles.pdfButton]} 
            onPress={generatePDFReport}
          >
            <Text style={styles.generateButtonText}>📄 Generate PDF Report</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.generateButton, styles.shareButton]} 
            onPress={shareTextReport}
          >
            <Text style={styles.generateButtonText}>📤 Share Text Report</Text>
          </TouchableOpacity>
        </View>

        {/* Summary */}
        {selectedWeeks.length > 0 && (
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Selected Weeks Summary</Text>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Total Amount</Text>
                <Text style={styles.summaryValue}>
                  GH₵{calculations
                    .filter(calc => selectedWeeks.includes(calc.weekNumber))
                    .reduce((sum, calc) => sum + calc.totalSum, 0)
                    .toFixed(2)}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Average per Week</Text>
                <Text style={styles.summaryValue}>
                  GH₵{selectedWeeks.length > 0 ? (calculations
                    .filter(calc => selectedWeeks.includes(calc.weekNumber))
                    .reduce((sum, calc) => sum + calc.totalSum, 0) / selectedWeeks.length)
                    .toFixed(2) : '0.00'}
                </Text>
              </View>
            </View>
          </View>
        )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#C7C7CC',
    textAlign: 'center',
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#8E8E93',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    marginTop: 8,
  },
  selectAllButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  selectAllText: {
    color: 'white',
    fontWeight: '500',
  },
  selectedCount: {
    fontSize: 14,
    color: '#8E8E93',
  },
  weekSelectionContainer: {
    padding: 16,
  },
  weekItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  selectedWeekItem: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  weekNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  weekDate: {
    fontSize: 14,
    color: '#8E8E93',
  },
  weekDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weekAmount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#007AFF',
  },
  weekTeachers: {
    fontSize: 14,
    color: '#8E8E93',
  },
  selectedWeekText: {
    color: '#007AFF',
  },
  buttonsContainer: {
    padding: 16,
    gap: 12,
  },
  generateButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  pdfButton: {
    backgroundColor: '#007AFF',
  },
  shareButton: {
    backgroundColor: '#34C759',
  },
  generateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  summaryContainer: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#1C1C1E',
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
  },
});