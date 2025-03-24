import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export default function Schedule() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const timeSlots = Array.from({ length: 31 }, (_, i) => {
    const hour = 8 + Math.floor(i / 2);
    const minutes = i % 2 === 0 ? "00" : "30";
    return `${hour}:${minutes}`;
  });

  // Get current week's dates
  const getCurrentWeek = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday
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

  // Function to fetch calendar events
interface Event {
    id: string;
    summary: string;
    location?: string;
    start: {
        dateTime: string;
    };
    end: {
        dateTime: string;
    };
}

interface WeekDay {
    day: string;
    date: number;
    fullDate: string;
}

const fetchCalendarEvents = async (accessToken: string) => {
    try {
        console.log("Fetching Google Calendar events...");
        const response = await fetch(
            `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(weekDays[0].fullDate)}&timeMax=${encodeURIComponent(weekDays[6].fullDate)}&orderBy=startTime&singleEvents=true`,
            {
                headers: { Authorization: `Bearer ${accessToken}` },
            }
        );
        if (!response.ok) {
            console.error("Error fetching calendar events");
            return;
        }

        const data: { items: Event[] } = await response.json();
        if (data.items) {
            setEvents(data.items);
        }
    } catch (error) {
        console.error("Error fetching calendar events:", error);
    } finally {
        setLoading(false);
    }
};

  // Function to sign in and get events
  const getAccessTokenAndFetchEvents = async () => {
    try {
      const userInfo = await GoogleSignin.signInSilently();
      if (userInfo) {
        setIsSignedIn(true);
        const tokens = await GoogleSignin.getTokens();
        fetchCalendarEvents(tokens.accessToken);
      }
    } catch (error) {
      console.error("Error signing in:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAccessTokenAndFetchEvents();
  }, []);

  // Convert event time to index position in timeSlots array
const getEventPosition = (dateTime: string): number => {
    const eventDate = new Date(dateTime);
    const hours = eventDate.getHours();
    const minutes = eventDate.getMinutes();
    return (hours - 8) * 2 + (minutes >= 30 ? 1 : 0);
};

  return (
    <View style={{ flex: 1 }}>
      <ScrollView horizontal>
        <View style={{ flexDirection: 'column', flex: 1 }}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.month}>
              {new Date().toLocaleDateString("en-US", { month: "long" })}
            </Text>
            <View style={styles.weekRow}>
              {weekDays.map((day) => (
                <View key={day.date} style={styles.dayBox}>
                  <Text style={styles.dayText}>{day.date}</Text>
                  <Text style={styles.dayName}>{day.day}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Schedule Grid with vertical scroll */}
          <ScrollView style={{ maxHeight: 640 }} contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.schedule}>
              {/* Time Column */}
              <View style={styles.timeColumn}>
                {timeSlots.map((time, index) => (
                  <View key={index} style={styles.timeSlot}>
                    <Text style={styles.timeText}>{time}</Text>
                  </View>
                ))}
              </View>

              {/* Days Columns */}
              <View style={styles.weekContainer}>
                {weekDays.map((day, dayIndex) => (
                  <View key={dayIndex} style={styles.dayColumn}>
                    {timeSlots.map((_, slotIndex) => (
                      <View key={slotIndex} style={styles.timeBlock} />
                    ))}

                    {/* Events */}
                    {events
                      .filter(
                        (event) =>
                          new Date(event.start.dateTime).toDateString() ===
                          new Date(day.fullDate).toDateString()
                      )
                      .map((event) => {
                        const startIndex = getEventPosition(event.start.dateTime);
                        const endIndex = getEventPosition(event.end.dateTime);
                        return (
                          <TouchableOpacity
                            key={event.id}
                            style={[
                              styles.eventBlock,
                              {
                                top: startIndex * 40,
                                height: (endIndex - startIndex) * 40,
                              },
                            ]}
                            onPress={() =>
                              Alert.alert(
                                "Event Details",
                                `${event.summary}\n${event.location || "No location"}`
                              )
                            }
                          >
                            <Text style={styles.eventText}>{event.summary}</Text>
                          </TouchableOpacity>
                        );
                      })}
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "column", backgroundColor: "#f5f5f5" },

  // Header
  header: { padding: 10, backgroundColor: "#666666", alignItems: "center" },
  month: { fontSize: 20, fontWeight: "bold", },
  weekRow: { flexDirection: "row", justifyContent: "space-around", width: "100%" ,color: "white"},
  dayBox: { alignItems: "center", padding: 5 },
  dayText: { fontSize: 16, fontWeight: "bold", color: "white" },
  dayName: { fontSize: 12, color: "white" },

  // Schedule Grid
  schedule: { flexDirection: "row", padding: 10, backgroundColor: "#f5f5f5" },
  timeColumn: { width: 60, alignItems: "center" },
  timeSlot: { height: 40, justifyContent: "center" },
  timeText: { fontSize: 14 },

  weekContainer: { flexDirection: "row" },
  dayColumn: { width: 90, borderRightWidth: 1, borderColor: "#ccc" },
  timeBlock: { height: 40, borderBottomWidth: 1, borderColor: "#ccc" },

  // Event Blocks
  eventBlock: {
    position: "absolute",
    left: 5,
    right: 5,
    backgroundColor: "#388e3c",
    borderRadius: 5,
    padding: 5,
    justifyContent: "center",
  },
  eventText: { color: "white", fontSize: 12, textAlign: "center" },
});

