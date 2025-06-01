import {
 DarkTheme,
 DefaultTheme,
 ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { Provider } from "react-redux";
import { store } from "@/store/store";

export default function RootLayout() {
 const colorScheme = useColorScheme();
 const [loaded] = useFonts({
  SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
 });

 if (!loaded) {
  return null;
 }

 return (
  <Provider store={store}>
   <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
    <Stack>
    <Stack.Screen name="welcome" options={{ headerShown: false }} />
    <Stack.Screen name="setup" options={{ headerShown: true ,  title: 'Setup Your Learning Profiley – Powered by AI',}} />
     <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
     <Stack.Screen name="+not-found" />
    </Stack>
    <StatusBar style="auto" />
   </ThemeProvider>
  </Provider>
 );
}
