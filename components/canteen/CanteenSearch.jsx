import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { COLORS, SIZES } from '../../constants/base';
import { useCanteen } from '../../hooks/useCanteen';
import { useStudents } from '../../hooks/useStudents';
import SearchTypeSelector from './SearchTypeSelector';
import StudentSearch from './StudentSearch';
import DateSearch from './DateSearch';
import GeneralSearch from './GeneralSearch';
import SearchActions from './SearchActions';
import SearchResults from './SearchResults';

export default function CanteenSearch() {
  const { students, fetchStudents } = useStudents();
  const { fetchStudentPayments, fetchPaymentHistory } = useCanteen();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState('student'); // 'student', 'date', 'general'

  // Load students on mount
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Set default dates
  useEffect(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    
    setStartDate(firstDay.toISOString().split('T')[0]);
    setEndDate(today.toISOString().split('T')[0]);
  }, []);

  // Filter students based on search query
  const filteredStudents = students.filter(student =>
    student.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle student selection
  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    setSearchQuery(student.fullname);
    setSearchType('student');
  };

  // Perform search
  const performSearch = async () => {
    if (!searchQuery.trim() && !startDate && !endDate) {
      Alert.alert('Error', 'Please enter search criteria or select date range');
      return;
    }

    try {
      setLoading(true);
      let results = [];

      if (searchType === 'student' && selectedStudent) {
        // Search by student
        results = await fetchStudentPayments(selectedStudent.id, startDate, endDate);
      } else if (searchType === 'date' && startDate && endDate) {
        // Search by date range
        results = await fetchPaymentHistory(startDate, endDate);
      } else if (searchType === 'general' && searchQuery.trim()) {
        // General search - search in payment history
        const allResults = await fetchPaymentHistory(startDate || '2020-01-01', endDate || new Date().toISOString().split('T')[0]);
        results = allResults.filter(payment =>
          payment.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          payment.studentDepartment.toLowerCase().includes(searchQuery.toLowerCase()) ||
          payment.paymentMethod?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          payment.notes?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setSearchResults(results);
    } catch (error) {
      console.error('Error performing search:', error);
      Alert.alert('Error', 'Failed to perform search');
    } finally {
      setLoading(false);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setSelectedStudent(null);
    setSearchResults([]);
    setSearchType('general');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Type Selector */}
        <SearchTypeSelector
          searchType={searchType}
          onSearchTypeChange={setSearchType}
        />
        
        {/* Search Sections */}
        {searchType === 'student' && (
          <StudentSearch
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            filteredStudents={filteredStudents}
            onStudentSelect={handleStudentSelect}
            selectedStudent={selectedStudent}
            onRemoveStudent={() => setSelectedStudent(null)}
          />
        )}
        {searchType === 'date' && (
          <DateSearch
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
        )}
        {searchType === 'general' && (
          <GeneralSearch
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
          />
        )}
        
        {/* Search Actions */}
        <SearchActions
          onSearch={performSearch}
          onClear={clearSearch}
          loading={loading}
        />
        
        {/* Search Results */}
        <SearchResults searchResults={searchResults} />
      </ScrollView>
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
    padding: SIZES.padding,
  },
});
