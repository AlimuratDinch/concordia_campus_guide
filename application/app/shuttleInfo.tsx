import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MTHURS_LOY, MTHURS_SGW, FRI_LOY, FRI_SGW } from '../constants/shuttleSchedule'

const ShuttleInfo: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* Title */}
          <Text style={styles.title}>Concordia Shuttle Bus</Text>

          {/* Bus Stops */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Bus Stops</Text>
            <Text style={styles.text}>
              • <Text style={styles.boldText}>Sir George Williams (SGW):</Text> Henry F. Hall Building front doors, 1455 De Maisonneuve Blvd. W.
            </Text>
            <Text style={styles.text}>
              • <Text style={styles.boldText}>Loyola (LOY):</Text> Loyola Chapel, 7137 Sherbrooke St. W.
            </Text>
          </View>

          {/* Departures */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Departures</Text>

            {/* Row 1: Monday–Thursday & Friday */}
            <View style={styles.dayRow}>
              {/* Monday–Thursday */}
              <View style={styles.dayBlock} testID='monday-thursday-block'>
                <Text style={styles.dayTitle}>Monday – Thursday</Text>
                <View style={styles.headerRow}>
                  <Text style={styles.headerCell}>LOY</Text>
                  <Text style={styles.headerCell}>SGW</Text>
                </View>
                {MTHURS_LOY.map((timeLOY, index) => (
                  <View style={styles.tableRow} key={`mthurs-${index}`}>
                    <Text style={styles.tableCell}>{timeLOY}</Text>
                    <Text style={styles.tableCell}>
                      {MTHURS_SGW[index] || ''}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Friday */}
              <View style={styles.dayBlock} testID='friday-block'>
                <Text style={styles.dayTitle}>Friday</Text>
                <View style={styles.headerRow}>
                  <Text style={styles.headerCell}>LOY</Text>
                  <Text style={styles.headerCell}>SGW</Text>
                </View>
                {FRI_LOY.map((timeLOY, index) => (
                  <View style={styles.tableRow} key={`fri-${index}`}>
                    <Text style={styles.tableCell}>{timeLOY}</Text>
                    <Text style={styles.tableCell}>
                      {FRI_SGW[index] || ''}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Regulations */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Regulations</Text>
            <Text style={styles.text}>
              • Must show valid Concordia ID (students, faculty, staff)
            </Text>
            <Text style={styles.text}>
              • No smoking, vaping, or open food/drinks on the bus
            </Text>
            <Text style={styles.text}>• Only service animals permitted</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ShuttleInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#912338',
  },
  scrollContent: {
    paddingBottom: 16,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    color: '#912338',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  text: {
    fontSize: 15,
    color: '#333333',
    marginBottom: 4,
  },
  boldText: {
    fontWeight: 'bold',
  },

  // -------- Table Departures -----------
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dayBlock: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: '#f7f7f7',
    borderRadius: 6,
    overflow: 'hidden',
  },
  dayTitle: {
    backgroundColor: '#eee',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 6,
    color: '#333',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#ddd',
  },
  headerCell: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});
