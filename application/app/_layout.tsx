import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="CampusMap"
        options={{
          headerTitle: "Campus map",
        }}
      />
      <Stack.Screen
        name="LoginPage"
        options={{
          headerTitle: "Login",
        }}
      />
    </Stack>
  );
}
