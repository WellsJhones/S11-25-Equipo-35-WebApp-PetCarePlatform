import { useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-toast-message";

import { useAuth } from "../Context/AuthContext";
import { getMyUser } from "../Services/getMyUser";
import { getPetsUser } from "../Services/getPetsUser";
import {
  getUserReminders,
  createReminder,
  updateReminder,
  toggleReminderComplete,
  deleteReminder,
} from "../Services/reminderService";

export const CATEGORIES = [
  { id: "VET", label: "Vet Visit", icon: "medical-services", color: "#E74C3C" },
  {
    id: "MEDICATION",
    label: "Medication",
    icon: "medication",
    color: "#8E44AD",
  },
  { id: "VACCINE", label: "Vaccine", icon: "vaccines", color: "#2980B9" },
  { id: "FEEDING", label: "Feeding", icon: "restaurant", color: "#D35400" },
  {
    id: "WALK",
    label: "Walk / Exercise",
    icon: "directions-walk",
    color: "#27AE60",
  },
  { id: "GROOMING", label: "Grooming", icon: "content-cut", color: "#16A085" },
  { id: "OTHER", label: "Other", icon: "event", color: "#628141" },
];

const UI_TO_BACKEND_TYPE = {
  VET: "APPOINTMENT",
  MEDICATION: "MEDICATION",
  VACCINE: "VACCINATION",
  FEEDING: "FEEDING",
  WALK: "EXERCISE",
  GROOMING: "GROOMING",
  OTHER: "OTHER",
};

const BACKEND_TO_UI_TYPE = {
  APPOINTMENT: "VET",
  MEDICATION: "MEDICATION",
  VACCINATION: "VACCINE",
  FEEDING: "FEEDING",
  EXERCISE: "WALK",
  GROOMING: "GROOMING",
  OTHER: "OTHER",
  DEWORMING: "MEDICATION",
};

export const useSchedule = () => {
  const { token } = useAuth();
  const [pets, setPets] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [selectedPetFilter, setSelectedPetFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("UPCOMING"); // "UPCOMING" | "COMPLETED" | "ALL"
  const [reminders, setReminders] = useState({});
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingReminderId, setEditingReminderId] = useState(null);
  const [editingReminderDate, setEditingReminderDate] = useState(null);

  // New Event Form State
  const [formPetId, setFormPetId] = useState("");
  const [formType, setFormType] = useState("VET");
  const [formTitle, setFormTitle] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formTime, setFormTime] = useState("09:00");
  const [formNotes, setFormNotes] = useState("");

  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  const loadData = async () => {
    try {
      setLoading(true);

      if (token) {
        const userRes = await getMyUser(token);
        if (userRes?.data?.id) {
          const uid = userRes.data.id;
          setCurrentUserId(uid);

          // 1. Fetch user's pets
          const userPets = await getPetsUser(token, uid);
          if (Array.isArray(userPets)) {
            setPets(userPets);
            if (userPets.length > 0 && !formPetId) {
              setFormPetId(String(userPets[0].id));
            }
          }

          // 2. Fetch reminders from PostgreSQL Database
          try {
            const dbReminders = await getUserReminders(token, uid);
            if (Array.isArray(dbReminders)) {
              const reminderMap = {};
              dbReminders.forEach((r) => {
                const dateKey = r.dueDate;
                if (!reminderMap[dateKey]) reminderMap[dateKey] = [];
                reminderMap[dateKey].push({
                  id: String(r.id),
                  dbId: r.id,
                  title: r.title,
                  type: BACKEND_TO_UI_TYPE[r.reminderType] || "OTHER",
                  petId: String(r.petId),
                  petName: r.petName || "Pet",
                  date: r.dueDate,
                  time: r.dueTime ? r.dueTime.substring(0, 5) : "09:00",
                  notes: r.description || "",
                  isCompleted: !!r.isCompleted,
                  createdAt: r.createdAt,
                });
              });

              setReminders(reminderMap);
              await AsyncStorage.setItem(
                "reminders",
                JSON.stringify(reminderMap),
              );
              return;
            }
          } catch (dbErr) {
            console.log(
              "Could not load from DB, falling back to local storage:",
              dbErr,
            );
          }
        }
      }

      // 3. Fallback to local storage if offline / DB unreachable
      const stored = await AsyncStorage.getItem("reminders");
      if (stored) {
        setReminders(JSON.parse(stored));
      }
    } catch (error) {
      console.log("Error loading schedule data:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [token]),
  );

  const saveRemindersToStorage = async (updated) => {
    try {
      await AsyncStorage.setItem("reminders", JSON.stringify(updated));
      setReminders(updated);
    } catch (error) {
      console.log("Error saving reminders:", error);
    }
  };

  const resetForm = (presetDate = getTodayDate()) => {
    setFormTitle("");
    setFormNotes("");
    setFormTime("09:00");
    setFormDate(presetDate);
    setFormType("VET");
    if (pets.length > 0) {
      setFormPetId(String(pets[0].id));
    }
  };

  const handleAddEvent = async () => {
    if (!formTitle.trim()) {
      Toast.show({
        type: "error",
        text1: "Required Field",
        text2: "Please enter an activity title.",
      });
      return;
    }

    const eventDate = formDate.trim() || getTodayDate();
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(eventDate)) {
      Toast.show({
        type: "error",
        text1: "Invalid Date",
        text2: "Date must be in YYYY-MM-DD format.",
      });
      return;
    }

    let targetPetId =
      formPetId && formPetId !== "ALL"
        ? formPetId
        : pets.length > 0
          ? pets[0].id
          : null;

    let petName = "All Pets";
    if (targetPetId) {
      const found = pets.find((p) => String(p.id) === String(targetPetId));
      if (found) petName = found.name;
    }

    const isEditing = !!editingReminderId;
    const originalDate = editingReminderDate;

    // 1. Save to Database
    let savedDbItem = null;
    if (currentUserId && targetPetId) {
      try {
        const timeWithSeconds =
          formTime.trim().length === 5
            ? `${formTime.trim()}:00`
            : formTime.trim();

        const requestPayload = {
          userId: currentUserId,
          petId: Number(targetPetId),
          reminderType: UI_TO_BACKEND_TYPE[formType] || "OTHER",
          title: formTitle.trim(),
          description: formNotes.trim() || null,
          dueDate: eventDate,
          dueTime: timeWithSeconds,
          isRecurring: false,
        };

        if (isEditing && editingReminderId) {
          const reminderId = Number(editingReminderId);
          if (!Number.isNaN(reminderId)) {
            savedDbItem = await updateReminder(
              token,
              reminderId,
              requestPayload,
            );
          }
        } else {
          savedDbItem = await createReminder(token, requestPayload);
        }
      } catch (err) {
        console.log("Failed to save reminder in DB, persisting locally:", err);
      }
    }

    // 2. Update local state & AsyncStorage
    const updated = { ...reminders };
    const eventId = isEditing
      ? String(editingReminderId)
      : savedDbItem
        ? String(savedDbItem.id)
        : Date.now().toString();

    if (isEditing && originalDate && originalDate !== eventDate) {
      if (updated[originalDate]) {
        updated[originalDate] = updated[originalDate].filter(
          (item) => String(item.id) !== String(editingReminderId),
        );
        if (updated[originalDate].length === 0) {
          delete updated[originalDate];
        }
      }
    } else if (isEditing && originalDate) {
      updated[originalDate] = (updated[originalDate] || []).filter(
        (item) => String(item.id) !== String(editingReminderId),
      );
      if (updated[originalDate].length === 0) {
        delete updated[originalDate];
      }
    }

    const nextEvent = {
      id: eventId,
      dbId: savedDbItem?.id ?? (isEditing ? editingReminderId : null),
      title: formTitle.trim(),
      type: formType,
      petId: targetPetId ? String(targetPetId) : "ALL",
      petName,
      date: eventDate,
      time: formTime.trim() || "09:00",
      notes: formNotes.trim() || "",
      isCompleted: isEditing
        ? (reminders[originalDate]?.find(
            (item) => String(item.id) === String(editingReminderId),
          )?.isCompleted ?? false)
        : false,
      createdAt: isEditing
        ? (reminders[originalDate]?.find(
            (item) => String(item.id) === String(editingReminderId),
          )?.createdAt ?? new Date().toISOString())
        : new Date().toISOString(),
    };

    if (!updated[eventDate]) {
      updated[eventDate] = [];
    }
    updated[eventDate].push(nextEvent);

    await saveRemindersToStorage(updated);

    Toast.show({
      type: "success",
      text1: isEditing ? "Schedule Updated" : "Saved to Database!",
      text2: `${formTitle.trim()} scheduled for ${eventDate}.`,
    });

    setEditingReminderId(null);
    setEditingReminderDate(null);
    resetForm();
    setModalVisible(false);
  };

  const toggleComplete = async (date, id) => {
    const targetItem = reminders[date]?.find((ev) => ev.id === id);
    if (targetItem?.dbId) {
      try {
        await toggleReminderComplete(token, targetItem.dbId);
      } catch (err) {
        console.log("Error toggling completion in DB:", err);
      }
    }

    const updated = { ...reminders };
    if (updated[date]) {
      updated[date] = updated[date].map((item) => {
        if (item.id === id) {
          return { ...item, isCompleted: !item.isCompleted };
        }
        return item;
      });
      await saveRemindersToStorage(updated);
    }
  };

  const deleteEvent = async (date, id) => {
    const targetItem = reminders[date]?.find((ev) => ev.id === id);
    if (targetItem?.dbId) {
      try {
        await deleteReminder(token, targetItem.dbId);
      } catch (err) {
        console.log("Error deleting reminder from DB:", err);
      }
    }

    const updated = { ...reminders };
    if (updated[date]) {
      updated[date] = updated[date].filter((item) => item.id !== id);
      if (updated[date].length === 0) {
        delete updated[date];
      }
      await saveRemindersToStorage(updated);
      Toast.show({
        type: "info",
        text1: "Removed",
        text2: "Activity deleted from database.",
      });
    }
  };

  const getFilteredEvents = () => {
    const allEvents = [];
    Object.keys(reminders).forEach((date) => {
      const list = reminders[date] || [];
      list.forEach((ev) => {
        allEvents.push({ ...ev, date });
      });
    });

    return allEvents
      .filter((ev) => {
        if (selectedPetFilter !== "ALL") {
          if (String(ev.petId) !== String(selectedPetFilter)) return false;
        }
        if (statusFilter === "UPCOMING") {
          return !ev.isCompleted;
        }
        if (statusFilter === "COMPLETED") {
          return ev.isCompleted;
        }
        return true;
      })
      .sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date);
        if (dateCompare !== 0) return dateCompare;
        return (a.time || "").localeCompare(b.time || "");
      });
  };

  const openCreateModal = (presetDate = null) => {
    setEditingReminderId(null);
    setEditingReminderDate(null);
    setFormType("VET");
    setFormDate(presetDate || getTodayDate());
    if (pets.length > 0) {
      setFormPetId(String(pets[0].id));
    }
    setFormTitle("");
    setFormNotes("");
    setFormTime("09:00");
    setModalVisible(true);
  };

  const openEditModal = (event) => {
    setEditingReminderId(event.dbId ?? event.id);
    setEditingReminderDate(event.date);
    setFormPetId(String(event.petId || pets[0]?.id || "ALL"));
    setFormType(event.type || "VET");
    setFormTitle(event.title || "");
    setFormDate(event.date || getTodayDate());
    setFormTime(event.time || "09:00");
    setFormNotes(event.notes || "");
    setModalVisible(true);
  };

  return {
    pets,
    loading,
    selectedPetFilter,
    setSelectedPetFilter,
    statusFilter,
    setStatusFilter,
    modalVisible,
    setModalVisible,
    formPetId,
    setFormPetId,
    formType,
    setFormType,
    formTitle,
    setFormTitle,
    formDate,
    setFormDate,
    formTime,
    setFormTime,
    formNotes,
    setFormNotes,
    filteredEvents: getFilteredEvents(),
    handleAddEvent,
    toggleComplete,
    deleteEvent,
    openCreateModal,
    openEditModal,
    editingReminderId,
    getTodayDate,
  };
};
