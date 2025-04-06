import React, { useState } from "react";
import { StyleSheet, Button, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Hall8Map from "./Hall8Map";
import Hall9Map from "./Hall9Map";
import { PathFinder } from "./PathAlgorithmDev";
import IndoorSearch, { GraphNode } from "./IndoorSearch";

const IndoorMapScreen = () => {
  const [showHall8, setShowHall8] = useState(true);
  const [path, setPath] = useState<string[]>([]);

const Rawnodes: GraphNode[] = [
     // HALL 8th Floor
         { id: "806-01", type: "classroom", x: 490, y: 280, floor: "8", adjacent: ["H1-MU"] },
         { id: "806-02", type: "classroom", x: 490, y: 318, floor: "8", adjacent: ["H1-MU"] },
         { id: "806-03", type: "classroom", x: 490, y: 355, floor: "8", adjacent: ["H1-MU"] },
         // Left column
         { id: "867", type: "classroom", x: 135, y: 140, floor: "8", adjacent: ["H2-LC"] },
         { id: "865", type: "classroom", x: 110, y: 175, floor: "8", adjacent: ["H2-LC"] },
         { id: "863", type: "classroom", x: 135, y: 230, floor: "8", adjacent: ["H2-LC"] },
         { id: "861", type: "classroom", x: 135, y: 330, floor: "8", adjacent: ["H3-MU"] },
         { id: "859", type: "classroom", x: 135, y: 420, floor: "8", adjacent: ["H3-HE"] },
         { id: "857", type: "classroom", x: 135, y: 510, floor: "8", adjacent: ["H3-M"] },
         { id: "855", type: "classroom", x: 135, y: 600, floor: "8", adjacent: ["H3-ML"] },
         { id: "853", type: "classroom", x: 135, y: 700, floor: "8", adjacent: ["H3-ML"] },
         { id: "851-01", type: "classroom", x: 135, y: 780, floor: "8", adjacent: ["H2.1-LC2"] },
         { id: "851-02", type: "classroom", x: 90, y: 770, floor: "8", adjacent: ["H2.1-LC2"] },
         { id: "851-03", type: "classroom", x: 70, y: 810, floor: "8", adjacent: ["H2.1-LC2"] },
         { id: "849", type: "classroom", x: 120, y: 840, floor: "8", adjacent: ["H2.1-LC2"] },
         // Top Row
         { id: "801", type: "classroom", x: 190, y: 170, floor: "8", adjacent: ["H2-LC"] },
         { id: "803", type: "classroom", x: 290, y: 170, floor: "8", adjacent: ["H2-ML"] },
         { id: "805", type: "classroom", x: 350, y: 170, floor: "8", adjacent: ["H2-ML"] },
         { id: "807", type: "classroom", x: 470, y: 170, floor: "8", adjacent: ["H1-H2"] },
         { id: "811", type: "classroom", x: 640, y: 170, floor: "8", adjacent: ["H1-H2"] },
         { id: "813", type: "classroom", x: 740, y: 170, floor: "8", adjacent: ["H2-MR"] },
         { id: "815", type: "classroom", x: 835, y: 170, floor: "8", adjacent: ["H2-CR"] },
         { id: "817", type: "classroom", x: 890, y: 170, floor: "8", adjacent: ["H2-CR"] },
         // Right Column
         { id: "819", type: "classroom", x: 890, y: 240, floor: "8", adjacent: ["H2-CR"] },
         { id: "821", type: "classroom", x: 890, y: 335, floor: "8", adjacent: ["H4-MU"] },
         { id: "823", type: "classroom", x: 890, y: 430, floor: "8", adjacent: ["H4-MU"] },
         { id: "825", type: "classroom", x: 890, y: 520, floor: "8", adjacent: ["H4-M"] },
         { id: "827", type: "classroom", x: 890, y: 610, floor: "8", adjacent: ["H4-ML"] },
         { id: "829", type: "classroom", x: 890, y: 700, floor: "8", adjacent: ["H4-ML"] },
         { id: "831", type: "classroom", x: 890, y: 840, floor: "8", adjacent: ["H2.1-CR2"] },
         // Bottom Row
         { id: "833", type: "classroom", x: 830, y: 840, floor: "8", adjacent: ["H2.1-CR2"] },
         { id: "835", type: "classroom", x: 740, y: 840, floor: "8", adjacent: ["H2.1-MR2"] },
         { id: "837", type: "classroom", x: 640, y: 840, floor: "8", adjacent: ["H1-H2.1"] },
         { id: "841", type: "classroom", x: 470, y: 840, floor: "8", adjacent: ["H1-H2.1"] },
         { id: "843", type: "classroom", x: 380, y: 840, floor: "8", adjacent: ["H2.1-ML2"] },
         { id: "845", type: "classroom", x: 290, y: 840, floor: "8", adjacent: ["H2.1-ML2"] },
         { id: "847", type: "classroom", x: 200, y: 840, floor: "8", adjacent: ["H2.1-LC2"] },
         { id: "860", type: "classroom", x: 270, y: 440, floor: "8", adjacent: ["HE-1"] },
         { id: "862", type: "classroom", x: 380, y: 440, floor: "8", adjacent: ["HE-2"] },
         { id: "840", type: "classroom", x: 440, y: 440, floor: "8", adjacent: ["HE-3"] },
         { id: "854", type: "classroom", x: 230, y: 600, floor: "8", adjacent: ["H3-ML"] },
         { id: "852", type: "classroom", x: 230, y: 660, floor: "8", adjacent: ["870", "H3-ML"] },
         { id: "870", type: "classroom", x: 300, y: 660, floor: "8", adjacent: ["852"] },
         { id: "842", type: "classroom", x: 400, y: 660, floor: "8", adjacent: ["H2.1-ML2"] },
         { id: "881", type: "classroom", x: 380, y: 760, floor: "8", adjacent: ["H2.1-ML2"] },
         { id: "838", type: "classroom", x: 500, y: 750, floor: "8", adjacent: ["H1-H2.1"] },
         { id: "892", type: "classroom", x: 420, y: 360, floor: "8", adjacent: ["HE-2"] },
         { id: "832", type: "classroom", x: 640, y: 760, floor: "8", adjacent: ["H1-H2.1"] },
         { id: "822", type: "classroom", x: 800, y: 610, floor: "8", adjacent: ["H4-ML"] },
         { id: "820-1", type: "classroom", x: 770, y: 410, floor: "8", adjacent: ["H4-MU"] },
         { id: "820-2", type: "classroom", x: 770, y: 530, floor: "8", adjacent: ["H4-M"] },
         { id: "886", type: "classroom", x: 800, y: 360, floor: "8", adjacent: ["H4-MU"] },
         // Stairs & Escalators
         { id: "stairs-HE", type: "stairs", x: 260, y: 350, floor: "8", adjacent: ["HE-1"] },
         { id: "stairs-H2.1-1", type: "stairs", x: 300, y: 760, floor: "8", adjacent: ["H2.1-ML2"] },
         { id: "stairs-H2.1-2", type: "stairs", x: 720, y: 760, floor: "8", adjacent: ["H2.1-MR2"] },
         { id: "stairs-H1", type: "stairs", x: 720, y: 260, floor: "8", adjacent: ["H2-MR"] },
         { id: "H8-elevators", type: "elevators", x: 350, y: 350, floor: "8", adjacent: ["HE-2"] },
         { id: "H8-escalators", type: "escalators", x: 480, y: 520, floor: "8", adjacent: ["H1-ML"] },
         // Bathrooms (8th Floor)
         { id: "H8-Bathroom-M", type: "Bathroom", x: 620, y: 260, floor: "8", adjacent: ["H1-H2"] },
         { id: "H8-Bathroom-F", type: "Bathroom", x: 350, y: 260, floor: "8", adjacent: ["H2-ML"] },
         // HALL 9th Floor
         // Bathrooms
         { id: "Bathroom-F", type: "Bathroom", x: 350, y: 265, floor: "9", adjacent: ["35"] },
         { id: "Bathroom-M", type: "Bathroom", x: 650, y: 265, floor: "9", adjacent: ["32"] },
         // Classrooms top left
         { id: "967", type: "classroom", x: 70, y: 170, floor: "9", adjacent: ["37"] },
         { id: "965", type: "classroom", x: 70, y: 350, floor: "9", adjacent: ["38"] },
         { id: "963", type: "classroom", x: 70, y: 450, floor: "9", adjacent: ["39"] },
         { id: "903", type: "classroom", x: 200, y: 135, floor: "9", adjacent: ["37"] },
         { id: "907", type: "classroom", x: 375, y: 135, floor: "9", adjacent: ["36"] },
         { id: "909", type: "classroom", x: 550, y: 135, floor: "9", adjacent: ["33"] },
         { id: "911", type: "classroom", x: 650, y: 135, floor: "9", adjacent: ["32"] },
         { id: "913", type: "classroom", x: 725, y: 135, floor: "9", adjacent: ["31"] },
         { id: "915", type: "classroom", x: 825, y: 135, floor: "9", adjacent: ["30"] },
         // Classrooms right side
         { id: "917", type: "classroom", x: 930, y: 135, floor: "9", adjacent: ["30"] },
         { id: "908", type: "classroom", x: 485, y: 350, floor: "9", adjacent: ["4"] },
         { id: "980", type: "classroom", x: 570, y: 390, floor: "9", adjacent: ["4"] },
         { id: "992", type: "classroom", x: 425, y: 360, floor: "9", adjacent: ["3"] },
         { id: "919", type: "classroom", x: 930, y: 235, floor: "9", adjacent: ["30"] },
         { id: "921", type: "classroom", x: 930, y: 345, floor: "9", adjacent: ["28"] },
         { id: "923", type: "classroom", x: 930, y: 450, floor: "9", adjacent: ["27"] },
         { id: "990", type: "classroom", x: 720, y: 350, floor: "9", adjacent: ["31"] },
         { id: "986", type: "classroom", x: 775, y: 350, floor: "9", adjacent: ["28"] },
         { id: "920", type: "classroom", x: 700, y: 470, floor: "9", adjacent: ["27"] },
         { id: "925", type: "classroom", x: 930, y: 565, floor: "9", adjacent: ["26"] },
         { id: "927", type: "classroom", x: 930, y: 700, floor: "9", adjacent: ["10"] },
         { id: "929", type: "classroom", x: 930, y: 850, floor: "9", adjacent: ["10"] },
         { id: "933", type: "classroom", x: 750, y: 900, floor: "9", adjacent: ["9"] },
         { id: "932", type: "classroom", x: 740, y: 810, floor: "9", adjacent: ["9"] },
         { id: "928", type: "classroom", x: 790, y: 810, floor: "9", adjacent: ["9"] },
         { id: "937", type: "classroom", x: 560, y: 810, floor: "9", adjacent: ["7"] },
         { id: "906", type: "classroom", x: 485, y: 260, floor: "9", adjacent: ["33"] },
         // Classrooms center left
         { id: "941", type: "classroom", x: 420, y: 950, floor: "9", adjacent: ["7"] },
         { id: "960", type: "classroom", x: 440, y: 470, floor: "9", adjacent: ["5"] },
         { id: "962", type: "classroom", x: 370, y: 470, floor: "9", adjacent: ["2"] },
         { id: "964", type: "classroom", x: 270, y: 470, floor: "9", adjacent: ["1"] },
         { id: "968", type: "classroom", x: 230, y: 610, floor: "9", adjacent: ["6"] },
         { id: "966", type: "classroom", x: 370, y: 610, floor: "9", adjacent: ["6"] },
         { id: "981", type: "classroom", x: 360, y: 760, floor: "9", adjacent: ["7"] },
         { id: "945", type: "classroom", x: 300, y: 800, floor: "9", adjacent: ["7"] },
         { id: "943", type: "classroom", x: 330, y: 860, floor: "9", adjacent: ["7"] },
         // Stairs & Escalators
         { id: "H9-stairs-0", type: "stairs", x: 260, y: 350, floor: "9", adjacent: ["1"] },
         { id: "H9-stairs-1", type: "stairs", x: 300, y: 730, floor: "9", adjacent: ["7"] },
         { id: "H9-stairs-2", type: "stairs", x: 715, y: 740, floor: "9", adjacent: ["9"] },
         { id: "H9-elevators", type: "elevators", x: 350, y: 350, floor: "9", adjacent: ["2"] },
         { id: "H9-escalators", type: "escalators", x: 480, y: 550, floor: "9", adjacent: ["6"] },
         // Hallways
         { id: "1", type: "hallway", x: 260, y: 400, floor: "9", adjacent: ["2", "H9-stairs-0", "964"] },
         { id: "2", type: "hallway", x: 350, y: 400, floor: "9", adjacent: ["1", "H9-elevators", "962"] },
         { id: "3", type: "hallway", x: 425, y: 400, floor: "9", adjacent: ["2", "4", "992", "960"] },
         { id: "4", type: "hallway", x: 520, y: 400, floor: "9", adjacent: ["3", "5", "908", "980"] },
         { id: "5", type: "hallway", x: 520, y: 470, floor: "9", adjacent: ["4", "6", "960"] },
         { id: "6", type: "hallway", x: 520, y: 550, floor: "9", adjacent: ["5", "7", "H9-escalators"] },
         { id: "7", type: "hallway", x: 520, y: 640, floor: "9", adjacent: ["6", "8", "937"] },
         { id: "8", type: "hallway", x: 620, y: 640, floor: "9", adjacent: ["7", "9"] },
         { id: "9", type: "hallway", x: 720, y: 640, floor: "9", adjacent: ["8", "10", "H9-stairs-2"] },
         { id: "10", type: "hallway", x: 800, y: 640, floor: "9", adjacent: ["9", "26", "927"] },
         { id: "26", type: "hallway", x: 810, y: 550, floor: "9", adjacent: ["10", "27", "925"] },
         { id: "27", type: "hallway", x: 840, y: 470, floor: "9", adjacent: ["26", "28", "920", "923"] },
         { id: "28", type: "hallway", x: 840, y: 370, floor: "9", adjacent: ["27", "29", "921", "986"] },
         { id: "29", type: "hallway", x: 840, y: 290, floor: "9", adjacent: ["28", "30", "986"] },
         { id: "30", type: "hallway", x: 840, y: 230, floor: "9", adjacent: ["29", "919", "917", "915"] },
         { id: "31", type: "hallway", x: 740, y: 230, floor: "9", adjacent: ["30", "32", "913", "990"] },
         { id: "32", type: "hallway", x: 640, y: 230, floor: "9", adjacent: ["31", "33", "Bathroom-M", "911"] },
         { id: "33", type: "hallway", x: 540, y: 230, floor: "9", adjacent: ["32", "34", "906", "909"] },
         { id: "34", type: "hallway", x: 440, y: 230, floor: "9", adjacent: ["33", "35"] },
         { id: "35", type: "hallway", x: 340, y: 230, floor: "9", adjacent: ["34", "36", "Bathroom-F"] },
         { id: "36", type: "hallway", x: 240, y: 230, floor: "9", adjacent: ["35", "37"] },
         { id: "37", type: "hallway", x: 180, y: 230, floor: "9", adjacent: ["36", "38", "903", "967"] },
         { id: "38", type: "hallway", x: 180, y: 330, floor: "9", adjacent: ["37", "39", "965"] },
         { id: "39", type: "hallway", x: 180, y: 400, floor: "9", adjacent: ["38", "1", "963"] },
         { id: "40", type: "hallway", x: 530, y: 300, floor: "9", adjacent: ["4", "33"] },
  ];

  const toggleMap = () => {
    setShowHall8(!showHall8);
  };

    const handleSearch = (startNode: string | null, endNode: string | null, travelType: string) => {
    if (!startNode || !endNode) {
      console.log("Please select start and end nodes.");
      setPath([]);
      return;
    }

    const computedPath = PathFinder(startNode, endNode, travelType); // Use PathFinder
    if (computedPath) {
      setPath(computedPath);
      console.log("Computed Path:", computedPath);
    } else {
      setPath([]);
      console.log("No path found.");
    }
  };

return (
  <SafeAreaView style={{ flex: 1 }}>
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button
          title={`Switch to Hall ${showHall8 ? "9" : "8"}`.toUpperCase()}
          onPress={toggleMap}
        />
      </View>
      <IndoorSearch nodes={Rawnodes} onSearch={handleSearch} />
      {showHall8 ? <Hall8Map path={path} style={styles.map} /> : <Hall9Map path={path} style={styles.map} />}
    </View>
  </SafeAreaView>
);
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
  },
  buttonContainer: {
    position: "absolute",
    top: 20,
    zIndex: 1,
  },
  map: {
    width: '100%', // Ensure the map takes the full width of the container
    height: '80%', // Adjust height as needed to make it bigger
  },
});

export default IndoorMapScreen;