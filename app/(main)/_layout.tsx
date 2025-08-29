import { Stack } from "expo-router";

export default function MainLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="book-appointment" />
      <Stack.Screen name="doctor-detail" />
      <Stack.Screen name="doctors" />
      <Stack.Screen name="search" />
      <Stack.Screen name="appointment-detail" />
    </Stack>
  );
}
