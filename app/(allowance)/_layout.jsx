// app/(allowance)/_layout.jsx
import { Stack } from 'expo-router';
import { COLORS, NAV_UTILS } from '../../constants/base';

export default function AllowanceLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        ...NAV_UTILS.headerOptions
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Friday Allowance',
        }}
      />
      <Stack.Screen
        name="calculator"
        options={{
          title: 'Calculate Allowance',
        }}
      />
      <Stack.Screen
        name="history"
        options={{
          title: 'Payment History',
        }}
      />
      <Stack.Screen
        name="reports"
        options={{
          title: 'Generate Reports',
        }}
      />
    </Stack>
  );
}
