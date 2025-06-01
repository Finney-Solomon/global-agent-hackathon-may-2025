import { Tabs } from 'expo-router';
import { Chrome as Home, BookOpen, Lightbulb } from 'lucide-react-native';


import { Redirect } from 'expo-router';

import { useAppSelector } from '@/hooks/hooks';

export default function TabLayout() {
  const { isProfileComplete } = useAppSelector((state)  => state.user);

  // If profile is not complete, redirect to setup
  if (!isProfileComplete) {
    return <Redirect href="/setup" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#7C3AED', // Primary purple
        tabBarInactiveTintColor: '#64748B', // Slate gray
        tabBarStyle: {
          elevation: 0,
          shadowOpacity: 0,
          borderTopWidth: 1,
          borderTopColor: '#E2E8F0',
          height: 60,
          paddingBottom: 10,
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: '#292929FF',
        },
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Custom Learning Journey – Powered by AI',
          tabBarIcon: ({ color, size }) => <BookOpen size={size} color={color} />,
          tabBarLabel: 'Learn',
        }}
      />
      <Tabs.Screen
        name="quiz"
        options={{
          title: 'AI-Powered Quiz Center',
          tabBarIcon: ({ color, size }) => <Lightbulb size={size} color={color} />,
          tabBarLabel: 'Quiz',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          tabBarLabel: 'Profile',
        }}
      />
    </Tabs>
  );
}