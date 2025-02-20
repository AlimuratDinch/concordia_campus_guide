import React from "react";
import { Modal, View, Text, Pressable, StyleSheet, Linking } from "react-native";

interface FeedbackPopUpProps {
  visible: boolean;
  onClose: () => void;
}

const FeedbackPopUp: React.FC<FeedbackPopUpProps> = ({ visible, onClose }) => {
    const openFeedbackForm = () => {
      Linking.openURL("https://forms.gle/NFwW7AJbRAujc7EJ6");
      onClose(); // Close the popup after opening the link
    };
  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <Text style={styles.popupText}>We value your feedback!</Text>
          <Text style={styles.popupText2}>Please Fill out the following survey!</Text>
          <Pressable style={styles.feedbackButton} onPress={openFeedbackForm}>
            <Text style={styles.buttonText}>Give Feedback</Text>
          </Pressable>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.buttonText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  popupText: {
    marginBottom: 15,
    fontSize: 30,
  },
  popupText2: {
    marginBottom: 15,
    fontSize: 20,
  },
  feedbackButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: "#FF3B30",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
  },
});

export default FeedbackPopUp;
