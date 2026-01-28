// import { Stack } from 'expo-router';
// import { View, Text } from 'react-native';
// import React from 'react';

// export default function RootLayout() {
//   console.log('RootLayout starting...');
  
//   try {
//     return (
//       <Stack>
//         <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//         <Stack.Screen name="index" options={{ headerShown: false }} />
//       </Stack>
//     );
//   } catch (error) {
//     console.error('RootLayout error:', error);
//     return (
//       <View>
//         <Text>Error in RootLayout</Text>
//       </View>
//     );
//   }
// }
import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { theme } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '@/contexts/AuthContext';
import React from 'react';

export default function RootLayout() {
  console.log('RootLayout rendering...');
  
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <PaperProvider theme={theme}>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: theme.colors.surface,
              },
              headerTintColor: theme.colors.onSurface,
              headerShadowVisible: false,
              contentStyle: {
                backgroundColor: theme.colors.background,
              },
            }}
          >
            <Stack.Screen 
              name="index" 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="(auth)" 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="(tabs)" 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="details/[id]" 
              options={{ 
                title: 'Details',
                presentation: 'modal' 
              }} 
            />
          </Stack>
        </PaperProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
