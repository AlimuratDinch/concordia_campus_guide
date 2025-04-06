import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Imported icons
import { router } from 'expo-router'; // Import expo-router
import Schedule from './schedule';

const IconLabel = ({ name, title, subtitle, onPress }: {
  name: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.campusItem} onPress={onPress}>
    <View style={styles.campusIconContainer}>
      <Ionicons name={name} size={24} color="#912338" />
    </View>
    <View style={styles.campusItemContent}>
      <Text style={styles.campusItemTitle}>{title}</Text>
      {subtitle && <Text style={styles.campusItemSubtitle}>{subtitle}</Text>}
    </View>
  </TouchableOpacity>
);

const ConcordiaApp = () => {
  const [activeTab, setActiveTab] = useState('Home');

  // Function to handle box clicks
  const handleBoxClick = (url: string) => {
    Linking.openURL(url).catch((err) => console.error('Failed to open URL:', err));
  };

  // Function to handle feedback button click
  const handleFeedbackClick = () => {
    Linking.openURL('https://docs.google.com/forms/d/e/1FAIpQLSc3F1eKmxtNqUfX1wGC1Xy12aHMG0lWooP6bDsQiDrLMGexYA/viewform').catch((err) =>
      console.error('Failed to open URL:', err)
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Home':
        return (
          <>
            {/* IMAGE */}
            <View style={styles.imageContainer}>
              <Image
                testID="concordia-logo"
                source={require('../assets/concordia-logo.jpg')}
                style={styles.image}
                resizeMode="contain"
              />
            </View>

            {/* FEATURED NEWS */}
            <Text style={styles.sectionTitle}>Featured News</Text>
            <TouchableOpacity
              style={styles.featuredItem}
              onPress={() => handleBoxClick('https://www.concordia.ca/cunews/main/stories/2025/03/19/discover-concordia-s-expertise-at-acfas-2025.html')}
            >
              <Image
                source={require('../assets/news1.jpg')}
                style={styles.featuredImage}
                resizeMode="cover"
              />
              <Text style={styles.featuredText}>
                Concordia University will showcase its expertise at the ACFAS 2025 conference, highlighting innovative research and academic contributions.
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.featuredItem}
              onPress={() => handleBoxClick('https://www.concordia.ca/news/stories/2025/03/19/concordia-marks-10th-consecutive-year-as-a-montreal-top-employer.html')}
            >
              <Image
                source={require('../assets/news2.jpg')}
                style={styles.featuredImage}
                resizeMode="cover"
              />
              <Text style={styles.featuredText}>
                Concordia marks 10th consecutive year as a Montreal Top Employer!
              </Text>
            </TouchableOpacity>

            {/* FEATURED EVENTS */}
            <Text style={styles.sectionTitle}>Featured Events</Text>
            <TouchableOpacity
              style={styles.featuredItem}
              onPress={() => handleBoxClick('https://www.concordia.ca/cuevents/offices/provost/iso/2025/03/21/explore-montreal--underground-city-tour.html')}
            >
              <Image
                source={require('../assets/events1.jpg')}
                style={styles.featuredImage}
                resizeMode="cover"
              />
              <Text style={styles.featuredText}>
                Explore Montréal: Underground city tour
              </Text>
            </TouchableOpacity>

            {/* FEEDBACK BOX */}
            <TouchableOpacity style={styles.feedbackBox} onPress={handleFeedbackClick}>
              <Text style={styles.feedbackText}>📝 Share your feedback</Text>
            </TouchableOpacity>
          </>
        );
        case 'Campus':
            return (
              <View style={styles.campusContainer}>
                {/* SGW SECTION */}
                <Text style={styles.campusHeader}>Sir George Williams Campus</Text>
                <View style={styles.campusSection}>
                  <IconLabel name="map" title="SGW Campus map" subtitle="Buildings, departments and services" onPress={() => router.push('/CampusMap')} />
                  <IconLabel name="business" title="SGW buildings (WIP)" onPress={() => router.push('/')} />
                  <IconLabel name="car" title="Parking map (WIP)" onPress={() => router.push('/')} />
                  <IconLabel name="bicycle" title="Bike rack map (WIP)" onPress={() => router.push('/')} />
                  <IconLabel name="map" title="Indoor Map" onPress={() => router.push('/indoorMapScreen')} />
                </View>
                
                {/* LOY SECTION */}
                <Text style={styles.campusHeader}>Loyola Campus</Text>
                <View style={styles.campusSection}>
                  <IconLabel name="map" title="LOY Campus map" subtitle="Buildings, departments and services" onPress={() => router.push('/CampusMap')} />
                  <IconLabel name="business" title="LOY buildings (WIP)" onPress={() => router.push('/')} />
                  <IconLabel name="car" title="Parking map (WIP)" onPress={() => router.push('/')} />
                  <IconLabel name="bicycle" title="Bike rack map (WIP)" onPress={() => router.push('/')} />
                </View>
                
                {/* SHUTTLE BUS SECTION */}
                <Text style={styles.campusHeader}>Shuttle bus</Text>
                <View style={styles.shuttleSection}>
                  <TouchableOpacity style={styles.shuttleItem} onPress={() => router.push('/shuttleInfo')}>
                    <View style={styles.shuttleIconContainer}>
                      <Ionicons name="bus" size={24} color="#912338" />
                    </View>
                    <Text style={styles.shuttleItemTitle}>Shuttle Information</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.shuttleItem} onPress={() => router.push('/shuttleMap')}>
                    <View style={styles.shuttleIconContainer}>
                      <Ionicons name="location" size={24} color="#912338" />
                    </View>
                    <Text style={styles.shuttleItemTitle}>Shuttle Tracker</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
            case 'Schedule':
              return (
                <View style={{ flex: 1 }}>
                  <Schedule />
                </View>
              );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.contentContainer}>
        {renderContent()}
      </ScrollView>

      {/* NAV BAR */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Home')} testID='tab-home'>
          <Ionicons
            name={activeTab === 'Home' ? 'home' : 'home-outline'}
            size={24}
            color={activeTab === 'Home' ? '#7A1E29' : '#555'}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Campus')} testID='tab-campus'>
          <Ionicons
            name={activeTab === 'Campus' ? 'school' : 'school-outline'}
            size={24}
            color={activeTab === 'Campus' ? '#7A1E29' : '#555'}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Schedule')} testID='tab-schedule'>
          <Ionicons
            name={activeTab === 'Schedule' ? 'time' : 'time-outline'}
            size={24}
            color={activeTab === 'Schedule' ? '#7A1E29' : '#555'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7A1E29',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 350,
    height: 100,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#ffffff',
  },
  featuredItem: {
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
    backgroundColor: '#f8f8f8',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featuredImage: {
    width: '100%',
    height: 150,
  },
  featuredText: {
    fontSize: 16,
    padding: 12,
    color: '#333',
  },
  feedbackBox: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginHorizontal: 85,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  feedbackText: {
    fontSize: 16,
    color: '#7A1E29',
    fontWeight: 'bold',
  },
  campusView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    padding: 10,
    backgroundColor: '#912338',
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#f8f8f8',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  tabContent: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 20,
  },
  campusContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  campusHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#f0f0f0',
    color: '#333',
  },
  campusSection: {
    backgroundColor: '#fff',
    marginBottom: 15,
    paddingVertical: 5,
  },
  campusItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  campusIconContainer: {
    marginRight: 15,
    width: 24,
  },
  campusItemContent: {
    flex: 1,
  },
  campusItemTitle: {
    fontSize: 16,
    color: '#333',
  },
  campusItemSubtitle: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },
  shuttleSection: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    marginBottom: 15,
  },
  shuttleItem: {
    flex: 1,
    alignItems: 'center',
    padding: 15,
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',
  },
  shuttleIconContainer: {
    marginBottom: 10,
  },
  shuttleItemTitle: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  scheduleContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#912338',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  backButton: {
    padding: 5,
  },
  scheduleTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  weekSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4C5760',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  weekSelectorIcon: {
    marginRight: 5,
  },
  weekSelectorText: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
  todayButton: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  todayButtonText: {
    color: '#333',
    fontSize: 14,
  },
  daysHeader: {
    flexDirection: 'row',
    backgroundColor: '#4C5760',
    borderBottomColor: '#3A444D',
    borderBottomWidth: 1,
  },
  dayColumn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderLeftColor: '#3A444D',
    borderLeftWidth: 0.5,
    borderRightColor: '#3A444D',
    borderRightWidth: 0.5,
  },
  dayNumber: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dayName: {
    color: '#fff',
    fontSize: 12,
  },
  timetableContainer: {
    flex: 1,
  },
  timetable: {
    flexDirection: 'row',
    flex: 1,
  },
  timeColumn: {
    width: 50,
    backgroundColor: '#f0f0f0',
  },
  timeSlot: {
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  timeText: {
    fontSize: 12,
    color: '#555',
  },
  classesGrid: {
    flex: 1,
    flexDirection: 'row',
  },
  daySchedule: {
    flex: 1,
    position: 'relative',
    borderLeftColor: '#eee',
    borderLeftWidth: 1,
  },
  emptySlot: {
    height: 70,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  classBlock: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#4A8B54',
    padding: 5,
    margin: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  classCode: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  classType: {
    color: '#fff',
    fontSize: 10,
  },
});

export default ConcordiaApp;