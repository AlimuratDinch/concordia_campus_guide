import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export default function Schedule() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i;
    const minutes = i % 2 === 0 ? "00" : "30";
    return `${hour}:${minutes}`; 
  });

  const getCurrentWeek = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1);
    const weekDays = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDays.push({
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        date: date.getDate(),
        fullDate: date.toISOString(),
      });
    }
    return weekDays;
  };

  const weekDays = getCurrentWeek();

  const fetchCalendarEvents = async (accessToken) => {
    try {
      console.log("Fetching Google Calendar events...");
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${weekDays[0].fullDate}&timeMax=${weekDays[6].fullDate}&orderBy=startTime&singleEvents=true`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const data = await response.json();
      setEvents(data.items || []); 
    } catch (error) {
      console.error("Error fetching calendar events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GoogleSignin.getTokens().then((tokens) => fetchCalendarEvents(tokens.accessToken));
  }, []);

  return (
    <ScrollView horizontal>
      <View style={styles.container}>
       
        <View style={[styles.header, { backgroundColor: "#912338" }]}> 
          <Text style={styles.month}>{new Date().toLocaleDateString("en-US", { month: "long" })}</Text>
          <View style={styles.weekRow}>
            {weekDays.map((day) => (
              <View key={day.date} style={styles.dayBox}>
                <Text style={styles.dayText}>{day.date}</Text>
                <Text style={styles.dayName}>{day.day}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.schedule}>
          
          <View style={styles.timeColumn}>
            {timeSlots.map((time, index) => (
              <View key={index} style={styles.timeSlot}>
                <Text style={styles.timeText}>{time}</Text>
              </View>
            ))}
          </View>

          <ScrollView>
            <View style={styles.weekContainer}>
              {weekDays.map((day, dayIndex) => (
                <View key={dayIndex} style={styles.dayColumn}>
                  {events.map((event) => (
                    <TouchableOpacity
                      key={event.id}
                      style={styles.eventBlock}
                      onPress={() => Alert.alert("Event Details", event.summary)}
                    >
                      <Text style={styles.eventText}>{event.summary}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "column" },
  header: { padding: 10, alignItems: "center" },
  month: { fontSize: 20, fontWeight: "bold" },
  weekRow: { flexDirection: "row", justifyContent: "space-around" },
  dayBox: { padding: 5 },
  dayText: { fontSize: 16, fontWeight: "bold" },
  dayName: { fontSize: 12 },
  schedule: { flexDirection: "row" },
  timeColumn: { width: 50 }, 
  timeSlot: { height: 30 }, 
  timeText: { fontSize: 14 },
  weekContainer: { flexDirection: "row" },
  dayColumn: { width: 100 },
  eventBlock: {
    position: "absolute",
    backgroundColor: "green",
    padding: 5,
  },
  eventText: { color: "white" },
});