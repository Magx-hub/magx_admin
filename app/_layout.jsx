// app/_layout.jsx
import { Tabs } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { SQLiteProvider } from 'expo-sqlite';
import { initDatabase } from '../utils/database';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, NAV_UTILS } from '../constants/base';
import { useFonts, ArimaMadurai_100Thin, ArimaMadurai_200ExtraLight, ArimaMadurai_300Light, ArimaMadurai_400Regular, 
  ArimaMadurai_500Medium,  ArimaMadurai_700Bold, ArimaMadurai_800ExtraBold, ArimaMadurai_900Black,
} from '@expo-google-fonts/arima-madurai';

SplashScreen.preventAutoHideAsync();

async function onInit(db) {
  try {
    await initDatabase(db);
  } catch (e) {
    console.error('DB init error in provider onInit:', e);
    throw e;
  }
}

export default function RootLayout() {
  const [loaded] = useFonts({ 
    ArimaMadurai_100Thin, 
    ArimaMadurai_200ExtraLight, 
    ArimaMadurai_300Light, 
    ArimaMadurai_400Regular, 
    ArimaMadurai_500Medium, 
    ArimaMadurai_700Bold, 
    ArimaMadurai_800ExtraBold, 
    ArimaMadurai_900Black
  });

  useEffect(() => {
    async function hide() {
      try {
        // If additional startup work is needed, do it here.
      } finally {
        await SplashScreen.hideAsync();
      }
    }
    if (loaded) hide();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <SQLiteProvider databaseName="magmax_admin.db" onInit={onInit}>
      <Tabs
        screenOptions={{
          headerShown: false,
          ...NAV_UTILS.tabBarOptions,
          tabBarIconStyle: {
            marginBottom: -3,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}


          // options={{
          //   title: 'Dashboard',
          //   tabBarLabel: () => null, // Hides the label
          //   tabBarIcon: ({ color, size }) => (
          //     <Ionicons name="home" size={size} color={color} />
          //   ),
          // }}
        />
        <Tabs.Screen
          name="(teacher)/index"
          options={{
            title: 'Teachers',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="people" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="(attendance)/index"
          options={{
            title: 'Attendance',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="calendar" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="(allowance)"
          options={{
            title: 'Allowance',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="card" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="(students)/index"
          options={{
            title: 'Students',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="(canteen)/index"
          options={{
            title: 'Canteen',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="fast-food" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="+not-found"
          options={{
            href: null, // hides it from the tab bar
          }}
        />
      </Tabs>
    </SQLiteProvider>
  );
}