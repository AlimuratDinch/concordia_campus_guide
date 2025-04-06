import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

interface Event {
  id: string;
  summary: string;
  location?: string;
  start: { dateTime: string };
  end: { dateTime: string };
}

interface WeekDay {
  day: string;
  date: number;
  fullDate: string;
}

export default function Schedule() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);

  const timeSlots = Array.from({ length: 31 }, (_, i) => {
    const hour = 8 + Math.floor(i / 2);
    const minutes = i % 2 === 0 ? "00" : "30";
    return `${hour}:${minutes}`;
  });

  const getCurrentWeek = (): WeekDay[] => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Start on Monday

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return {
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        date: date.getDate(),
        fullDate: date.toISOString(),
      };
    });
  };

  const weekDays = getCurrentWeek();

  const isSameDay = (date1: string, date2: string): boolean => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const getEventPosition = (dateTime: string): number => {
    const eventDate = new Date(dateTime);
    const hours = eventDate.getHours();
    const minutes = eventDate.getMinutes();
    return (hours - 8) * 2 + (minutes >= 30 ? 1 : 0);
  };

  const fetchCalendarEvents = async (accessToken: string) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(
          weekDays[0].fullDate
        )}&timeMax=${encodeURIComponent(
          weekDays[6].fullDate
        )}&orderBy=startTime&singleEvents=true`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (!response.ok) throw new Error("Error fetching events");

      const data: { items: Event[] } = await response.json();
      if (data.items) setEvents(data.items);
    } catch (error) {
      console.error("Calendar fetch failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAccessTokenAndFetchEvents = async () => {
    try {
      const userInfo = await GoogleSignin.signInSilently();
      if (userInfo) {
        setIsSignedIn(true);
        const tokens = await GoogleSignin.getTokens();
        fetchCalendarEvents(tokens.accessToken);
      }
    } catch (error) {
      console.error("Google Sign-In error:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAccessTokenAndFetchEvents();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#388e3c" />
        <Text>Loading schedule...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView horizontal>
        <View style={{ flexDirection: "column", flex: 1 }}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.month}>
              {new Date().toLocaleDateString("en-US", { month: "long" })}
            </Text>
            <View style={styles.weekRow}>
              {weekDays.map((day) => (
                <View key={day.fullDate} style={styles.dayBox}>
                  <Text style={styles.dayText}>{day.date}</Text>
                  <Text style={styles.dayName}>{day.day}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Schedule Grid */}
          <ScrollView style={{ maxHeight: 640 }} contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.schedule}>
              {/* Time Column */}
              <View style={styles.timeColumn}>
                {timeSlots.map((time) => (
                  <View key={time} style={styles.timeSlot}>
                    <Text style={styles.timeText}>{time}</Text>
                  </View>
                ))}
              </View>

              {/* Day Columns */}
              <View style={styles.weekContainer}>
                {weekDays.map((day) => (
                  <View key={day.fullDate} style={styles.dayColumn}>
                    {timeSlots.map((_, slotIndex) => (
                      <View key={slotIndex} style={styles.timeBlock} />
                    ))}

                    {/* Events */}
                    {events
                      .filter((event) =>
                        isSameDay(event.start.dateTime, day.fullDate)
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
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    padding: 10,
    backgroundColor: "#666666",
    alignItems: "center",
  },
  month: {
    fontSize: 20,
    fontWeight: "bold",
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  dayBox: {
    alignItems: "center",
    padding: 5,
  },
  dayText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  dayName: {
    fontSize: 12,
    color: "white",
  },
  schedule: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  timeColumn: {
    width: 60,
    alignItems: "center",
  },
  timeSlot: {
    height: 40,
    justifyContent: "center",
  },
  timeText: {
    fontSize: 14,
  },
  weekContainer: {
    flexDirection: "row",
  },
  dayColumn: {
    width: 90,
    borderRightWidth: 1,
    borderColor: "#ccc",
    position: "relative",
  },
  timeBlock: {
    height: 40,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  eventBlock: {
    position: "absolute",
    left: 5,
    right: 5,
    backgroundColor: "#388e3c",
    borderRadius: 5,
    padding: 5,
    justifyContent: "center",
  },
  eventText: {
    color: "white",
    fontSize: 12,
    textAlign: "center",
  },
});
