import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import DetailScreen from './screens/DetailScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import MyPageScreen from './screens/MyPageScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="JobHome" 
        component={HomeScreen} 
        options={{ title: '요양보호사 구인구직' }}
      />
      <Stack.Screen 
        name="JobDetail" 
        component={DetailScreen} 
        options={{ title: '공고 상세' }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen 
          name="홈" 
          component={HomeStack} 
          options={{ tabBarIcon: () => null }} 
        />
        <Tab.Screen 
          name="찜목록" 
          component={FavoritesScreen} 
          options={{ headerShown: true, tabBarIcon: () => null }} 
        />
        <Tab.Screen 
          name="마이페이지" 
          component={MyPageScreen} 
          options={{ headerShown: true, tabBarIcon: () => null }} 
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
