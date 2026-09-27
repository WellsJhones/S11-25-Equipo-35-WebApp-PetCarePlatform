import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getMyUser } from "../Services/getMyUser";
import { useAuth } from "../Context/AuthContext";
import { Alert } from "react-native";

export const useCalendarRecord = () => {
  const { token } = useAuth();
  const [username, setUsername] = useState();
  const [selectedDate, setSelectedDate] = useState("");
  const [reminders, setReminders] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [newReminder, setNewReminder] = useState({
    title: "",
    time: "08:00",
    medication: "",
  });

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  useEffect(() => {
    setSelectedDate(getCurrentDate());
    loadReminders();
  }, []);

  useEffect(() => {
    if (token) {
      const fetchUsername = async () => {
        try {
          const user = await getMyUser(token);
          if (user?.data?.firstName) {
            setUsername(user.data.firstName);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      fetchUsername();
    }
  }, [token]);

  const loadReminders = async () => {
    try {
      const savedReminders = await AsyncStorage.getItem("reminders");
      if (savedReminders) {
        setReminders(JSON.parse(savedReminders));
      }
    } catch (error) {
      console.error("Error loading reminders:", error);
    }
  };

  const saveReminders = async (updatedReminders) => {
    try {
      await AsyncStorage.setItem("reminders", JSON.stringify(updatedReminders));
    } catch (error) {
      console.error("Error saving reminders:", error);
    }
  };

  const getMarkedDates = () => {
    const marked = {
      [getCurrentDate()]: {
        selected: true,
        selectedColor: "#3a5539ff",
        selectedTextColor: "white",
        today: true,
      },
    };

    Object.keys(reminders).forEach((date) => {
      if (date !== getCurrentDate()) {
        marked[date] = {
          selected: false,
          marked: true,
          dotColor: "#FF6B6B",
        };
      }
    });

    return marked;
  };

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const handleAddReminder = () => {
    if (!newReminder.title.trim()) {
      Alert.alert("Error", "Please enter a title for the reminder.");
      return;
    }

    const updatedReminders = { ...reminders };
    if (!updatedReminders[selectedDate]) {
      updatedReminders[selectedDate] = [];
    }

    updatedReminders[selectedDate].push({
      ...newReminder,
      id: Date.now().toString(),
    });

    setReminders(updatedReminders);
    saveReminders(updatedReminders);
    setModalVisible(false);
    setNewReminder({ title: "", time: "08:00", medication: "" });
  };

  const handleDeleteReminder = (date, id) => {
    Alert.alert(
      "Delete Reminder",
      "Are you sure you want to delete this reminder?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const updatedReminders = { ...reminders };
            updatedReminders[date] = updatedReminders[date].filter(
              (reminder) => reminder.id !== id,
            );

            if (updatedReminders[date].length === 0) {
              delete updatedReminders[date];
            }

            setReminders(updatedReminders);
            saveReminders(updatedReminders);
          },
        },
      ],
    );
  };

  const getRemindersForSelectedDate = () => {
    return reminders[selectedDate] || [];
  };

  return {
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
  };
};
