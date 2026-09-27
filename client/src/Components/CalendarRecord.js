import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { Calendar } from "react-native-calendars";
import Icon from "react-native-vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { useCalendarRecord } from "../Hooks/useCalendarRecord";
import { styles } from "../Styles/CalendarRecord";

const CalendarReminderScreen = () => {
  const {
    username,
    selectedDate,
    modalVisible,
    newReminder,
    getMarkedDates,
    handleDayPress,
    handleAddReminder,
    handleDeleteReminder,
    getRemindersForSelectedDate,
    setModalVisible,
    setNewReminder,
    getCurrentDate,
  } = useCalendarRecord();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>
          Welcome{username ? ` ${username}` : ""}
        </Text>
      </View>
      <View style={styles.calendarContainer}>
        <Calendar
          current={getCurrentDate()}
          onDayPress={handleDayPress}
          markedDates={getMarkedDates()}
          theme={{
            backgroundColor: "#ffffff",
            calendarBackground: "#ffffff",
            textSectionTitleColor: "#020202ff",
            selectedDayBackgroundColor: "#4ae263ff",
            selectedDayTextColor: "#ffffff",
            todayTextColor: "#000000ff",
            dayTextColor: "#000000ff",
            textDisabledColor: "#d9e1e8",
            monthTextColor: "#383838ff",
            arrowColor: "#376143ff",
            "stylesheet.calendar.header": {
              week: {
                marginTop: 5,
                flexDirection: "row",
                justifyContent: "space-around",
              },
            },
          }}
          style={styles.calendar}
        />
      </View>
      <View style={styles.remindersContainer}>
        <View style={styles.remindersHeader}>
          <Text style={styles.remindersTitle}>Today's Reminders</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.remindersList}>
          {getRemindersForSelectedDate().length === 0 ? (
            <View style={styles.noReminders}>
              <Icon name="notifications" size={50} color="#ccc" />
              <Text style={styles.noRemindersText}>
                There are no reminders for this date
              </Text>
            </View>
          ) : (
            getRemindersForSelectedDate().map((reminder) => (
              <View key={reminder.id} style={styles.reminderItem}>
                <View style={styles.reminderIcon}>
                  <MaterialIcons
                    name="remember-me"
                    size={30}
                    color="black"
                    backgroundColor={"#B7C75D"}
                    paddingHorizontal="8"
                    paddingVertical="16"
                    borderRadius={5}
                  />
                </View>
                <View style={styles.reminderContent}>
                  <Text style={styles.reminderTitle}>{reminder.title}</Text>
                  {reminder.medication ? (
                    <Text style={styles.reminderMedication}>
                      {reminder.medication}
                    </Text>
                  ) : null}
                  <Text style={styles.reminderTime}>
                    {reminder.time} - {reminder.time.substring(0, 2) + ":05H"}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    handleDeleteReminder(selectedDate, reminder.id)
                  }
                  style={styles.deleteButton}
                >
                  <AntDesign name="delete" size={24} color="red" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>add reminder</Text>

            <TextInput
              style={styles.input}
              placeholder="Títle of Reminder"
              value={newReminder.title}
              onChangeText={(text) =>
                setNewReminder({ ...newReminder, title: text })
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Medication (optional)"
              value={newReminder.medication}
              onChangeText={(text) =>
                setNewReminder({ ...newReminder, medication: text })
              }
            />

            <View style={styles.timeContainer}>
              <Text style={styles.timeLabel}>Hour:</Text>
              <TextInput
                style={styles.timeInput}
                value={newReminder.time}
                onChangeText={(text) =>
                  setNewReminder({ ...newReminder, time: text })
                }
                placeholder="HH:MM"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddReminder}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CalendarReminderScreen;
