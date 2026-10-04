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
    pets,
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
            selectedDayBackgroundColor: "#628141",
            selectedDayTextColor: "#ffffff",
            todayTextColor: "#628141",
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
          <Text style={styles.remindersTitle}>
            {selectedDate === getCurrentDate()
              ? "Today's Reminders"
              : `Reminders for ${selectedDate}`}
          </Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              setNewReminder((prev) => ({
                ...prev,
                date: selectedDate || getCurrentDate(),
                petId: pets && pets.length > 0 ? String(pets[0].id) : null,
              }));
              setModalVisible(true);
            }}
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
                  {reminder.petName ? (
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#628141",
                        fontWeight: "600",
                        marginBottom: 2,
                      }}
                    >
                      🐾 {reminder.petName}
                    </Text>
                  ) : null}
                  {reminder.medication ? (
                    <Text style={styles.reminderMedication}>
                      {reminder.medication}
                    </Text>
                  ) : null}
                  <Text style={styles.reminderTime}>
                    {reminder.time}
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
            <Text style={styles.modalTitle}>Add Reminder</Text>

            {/* Date Picker / Field */}
            <View style={{ marginBottom: 12 }}>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "600",
                  color: "#555",
                  marginBottom: 4,
                }}
              >
                Date (YYYY-MM-DD)
              </Text>
              <TextInput
                style={styles.input}
                value={newReminder.date || selectedDate}
                onChangeText={(text) =>
                  setNewReminder({ ...newReminder, date: text })
                }
                placeholder="YYYY-MM-DD"
              />
            </View>

            {/* Pet selector (if user has pets) */}
            {pets && pets.length > 0 && (
              <View style={{ marginBottom: 12 }}>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "600",
                    color: "#555",
                    marginBottom: 6,
                  }}
                >
                  Select Pet
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 6,
                  }}
                >
                  {pets.map((p) => {
                    const isSelected =
                      String(newReminder.petId || (pets[0]?.id)) ===
                      String(p.id);
                    return (
                      <TouchableOpacity
                        key={p.id}
                        style={{
                          paddingVertical: 5,
                          paddingHorizontal: 12,
                          borderRadius: 14,
                          borderWidth: 1,
                          borderColor: isSelected ? "#628141" : "#ddd",
                          backgroundColor: isSelected ? "#628141" : "#f7f7f6",
                        }}
                        onPress={() =>
                          setNewReminder({
                            ...newReminder,
                            petId: String(p.id),
                          })
                        }
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: "600",
                            color: isSelected ? "#fff" : "#555",
                          }}
                        >
                          {p.species === "CAT" ? "🐱" : "🐶"} {p.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            <TextInput
              style={styles.input}
              placeholder="Title of Reminder *"
              value={newReminder.title}
              onChangeText={(text) =>
                setNewReminder({ ...newReminder, title: text })
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Medication / Details (optional)"
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
