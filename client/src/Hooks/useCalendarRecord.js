import { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

import { useAuth } from "../Context/AuthContext";
import { getMyUser } from "../Services/getMyUser";
import { getPetsUser } from "../Services/getPetsUser";
import {
  getUserReminders,
  createReminder,
  deleteReminder,
} from "../Services/reminderService";

export const useCalendarRecord = () => {
  const { token, logout } = useAuth();
  const [username, setUsername] = useState("");
  const [pets, setPets] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [reminders, setReminders] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [newReminder, setNewReminder] = useState({
    title: "",
    time: "08:00",
    medication: "",
    date: "",
    petId: null,
  });

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  useEffect(() => {
    const today = getCurrentDate();
    setSelectedDate(today);
    setNewReminder((prev) => ({ ...prev, date: today }));
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadReminders();
    }, [token]),
  );

  useEffect(() => {
    if (token) {
      const fetchUserData = async () => {
        try {
          const user = await getMyUser(token);
          if (user?.data?.id) {
            setCurrentUserId(user.data.id);
            if (user.data.firstName) {
              setUsername(user.data.firstName);
            }
            const userPets = await getPetsUser(token, user.data.id);
            if (Array.isArray(userPets)) {
              setPets(userPets);
              if (userPets.length > 0 && !newReminder.petId) {
                setNewReminder((prev) => ({
                  ...prev,
                  petId: String(userPets[0].id),
                }));
              }
            }
          } else if (
            user?.unauthorized ||
            user?.status === 401 ||
            user?.status === 403
          ) {
            logout();
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      fetchUserData();
    }
  }, [token]);

  const loadReminders = async () => {
    try {
      if (token) {
        const user = await getMyUser(token);
        if (user?.data?.id) {
          setCurrentUserId(user.data.id);
          try {
            const dbReminders = await getUserReminders(token, user.data.id);
            if (Array.isArray(dbReminders)) {
              const reminderMap = {};
              dbReminders.forEach((r) => {
                const dateKey = r.dueDate;
                if (!reminderMap[dateKey]) reminderMap[dateKey] = [];
                reminderMap[dateKey].push({
                  id: String(r.id),
                  dbId: r.id,
                  title: r.title,
                  petId: String(r.petId),
                  petName: r.petName || "Pet",
                  date: r.dueDate,
                  time: r.dueTime ? r.dueTime.substring(0, 5) : "08:00",
                  medication: r.description || "",
                  isCompleted: !!r.isCompleted,
                });
              });
              setReminders(reminderMap);
              await AsyncStorage.setItem(
                "reminders",
                JSON.stringify(reminderMap),
              );
              return;
            }
          } catch (e) {
            console.log("Could not load reminders from DB in calendar:", e);
          }
        }
      }

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

  // Visually highlights the clicked day on the calendar!
  const getMarkedDates = () => {
    const marked = {};
    const today = getCurrentDate();

    // 1. Mark dates that have reminders with orange dots
    Object.keys(reminders).forEach((date) => {
      const list = reminders[date] || [];
      if (list.length > 0) {
        marked[date] = {
          marked: true,
          dotColor: "#ea9b56",
        };
      }
    });

    // 2. Mark today's date
    if (today !== selectedDate) {
      marked[today] = {
        ...(marked[today] || {}),
        textColor: "#628141",
      };
    }

    // 3. Highlight the user's selected date with green circle
    if (selectedDate) {
      marked[selectedDate] = {
        ...(marked[selectedDate] || {}),
        selected: true,
        selectedColor: "#628141",
        selectedTextColor: "#ffffff",
      };
    }

    return marked;
  };

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    setNewReminder((prev) => ({ ...prev, date: day.dateString }));
  };

  const handleAddReminder = async () => {
    if (!newReminder.title.trim()) {
      Alert.alert("Error", "Please enter a title for the reminder.");
      return;
    }

    const targetDate = newReminder.date || selectedDate || getCurrentDate();
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(targetDate)) {
      Alert.alert("Error", "Date must be in YYYY-MM-DD format.");
      return;
    }

    let targetPetId = newReminder.petId;
    if (!targetPetId && pets.length > 0) {
      targetPetId = String(pets[0].id);
    }

    let petName = null;
    if (targetPetId) {
      const found = pets.find((p) => String(p.id) === String(targetPetId));
      if (found) petName = found.name;
    }

    // Save to Database
    let createdDb = null;
    if (currentUserId && targetPetId && token) {
      try {
        const timeWithSeconds =
          (newReminder.time || "08:00").length === 5
            ? `${newReminder.time || "08:00"}:00`
            : newReminder.time || "08:00:00";

        createdDb = await createReminder(token, {
          userId: currentUserId,
          petId: Number(targetPetId),
          reminderType: "OTHER",
          title: newReminder.title.trim(),
          description: newReminder.medication?.trim() || null,
          dueDate: targetDate,
          dueTime: timeWithSeconds,
          isRecurring: false,
        });
      } catch (err) {
        console.log("Error saving reminder to DB in calendar:", err);
      }
    }

    const eventId = createdDb ? String(createdDb.id) : Date.now().toString();
    const updatedReminders = { ...reminders };
    if (!updatedReminders[targetDate]) {
      updatedReminders[targetDate] = [];
    }

    updatedReminders[targetDate].push({
      ...newReminder,
      id: eventId,
      dbId: createdDb?.id || null,
      petId: targetPetId ? String(targetPetId) : null,
      petName,
      date: targetDate,
      time: newReminder.time || "08:00",
    });

    setReminders(updatedReminders);
    await saveReminders(updatedReminders);
    setModalVisible(false);
    setNewReminder({
      title: "",
      time: "08:00",
      medication: "",
      date: targetDate,
      petId: targetPetId,
    });
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
          onPress: async () => {
            const targetReminder = reminders[date]?.find((r) => r.id === id);
            if (targetReminder?.dbId && token) {
              try {
                await deleteReminder(token, targetReminder.dbId);
              } catch (err) {
                console.log("Error deleting reminder from DB:", err);
              }
            }

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
  };
};
