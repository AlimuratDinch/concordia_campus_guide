import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="SGW_Map"
        options={{
          headerTitle: "SGW map",
        }}
      />
      <Stack.Screen 
        name="Loyola_Map"
        options={{
          headerTitle: "Loyola map",
        }}
      />
      <Stack.Screen 
        name="CampusMap"
        options={{
          headerTitle: "Campus map",
        }}
      />
    </Stack>
  );
}
