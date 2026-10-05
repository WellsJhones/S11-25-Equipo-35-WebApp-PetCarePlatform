import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";

import Layout from "../Components/Layout";
import { useSchedule, CATEGORIES } from "../Hooks/useSchedule";
import { styles } from "../Styles/ScheduleScreen";

export default function FeedingScreen() {
  const {
    pets,
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
    filteredEvents,
    handleAddEvent,
    toggleComplete,
    deleteEvent,
    openEditModal,
    getTodayDate,
  } = useSchedule();

  const feedingEvents = filteredEvents.filter((ev) => ev.type === "FEEDING");

  const getCategoryConfig = (type) => {
    return (
      CATEGORIES.find((c) => c.id === type) || {
        id: "FEEDING",
        label: "Feeding",
        icon: "restaurant",
        color: "#D35400",
      }
    );
  };

  const openFeedingModal = () => {
    setFormType("FEEDING");
    setFormDate(getTodayDate());
    setFormTitle("");
    setFormNotes("");
    setFormTime("09:00");
    if (pets.length > 0) {
      setFormPetId(String(pets[0].id));
    }
    setModalVisible(true);
  };

  return (
    <Layout>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Feeding</Text>
            <Text style={styles.headerSubtitle}>Meal and food reminders</Text>
          </View>
          <TouchableOpacity
            style={styles.addEventButton}
            onPress={openFeedingModal}
          >
            <Ionicons name="add" size={18} color="#fff" />
            <Text style={styles.addEventButtonText}>New</Text>
          </TouchableOpacity>
        </View>

        {feedingEvents.length === 0 ? (
          <View style={{ paddingVertical: 40, alignItems: "center" }}>
            <MaterialIcons name="restaurant" size={42} color="#ea9b56" />
            <Text style={{ marginTop: 12, color: "#666", fontSize: 16 }}>
              No feeding reminders yet
            </Text>
          </View>
        ) : (
          feedingEvents.map((ev) => {
            const cat = getCategoryConfig(ev.type);
            return (
              <View
                key={`${ev.date}-${ev.id}`}
                style={[styles.card, ev.isCompleted && styles.cardCompleted]}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.categoryBadge}>
                    <View
                      style={[
                        styles.categoryIconBg,
                        { backgroundColor: `${cat.color}22` },
                      ]}
                    >
                      <MaterialIcons
                        name={cat.icon}
                        size={18}
                        color={cat.color}
                      />
                    </View>
                    <Text style={styles.categoryLabel}>{cat.label}</Text>
                  </View>
                  <View style={styles.timeBadge}>
                    <Text style={styles.timeText}>
                      📅 {ev.date} • {ev.time}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardBody}>
                  <Text
                    style={[
                      styles.eventTitle,
                      ev.isCompleted && styles.eventTitleCompleted,
                    ]}
                  >
                    {ev.title}
                  </Text>
                  {ev.notes ? (
                    <Text style={styles.eventNotes}>{ev.notes}</Text>
                  ) : null}
                </View>

                <View style={styles.cardFooter}>
                  <View style={styles.petTag}>
                    <Text style={styles.petTagText}>🐾 {ev.petName}</Text>
                  </View>

                  <View style={styles.cardActions}>
                    <TouchableOpacity
                      style={styles.completeButton}
                      onPress={() => toggleComplete(ev.date, ev.id)}
                    >
                      <Ionicons
                        name={
                          ev.isCompleted
                            ? "checkmark-circle"
                            : "ellipse-outline"
                        }
                        size={22}
                        color={ev.isCompleted ? "#27AE60" : "#888"}
                      />
                      <Text
                        style={{
                          fontSize: 12,
                          color: ev.isCompleted ? "#27AE60" : "#666",
                          fontWeight: "500",
                        }}
                      >
                        {ev.isCompleted ? "Done" : "Mark Done"}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => openEditModal(ev)}>
                      <MaterialIcons name="edit" size={18} color="#ea9b56" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => deleteEvent(ev.date, ev.id)}
                    >
                      <AntDesign name="delete" size={18} color="#e74c3c" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Feeding Reminder</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Select Pet</Text>
                <View style={styles.categoryGrid}>
                  {pets.map((p) => {
                    const isSelected = String(formPetId) === String(p.id);
                    return (
                      <TouchableOpacity
                        key={p.id}
                        style={[
                          styles.categoryItem,
                          isSelected && styles.categoryItemActive,
                        ]}
                        onPress={() => setFormPetId(String(p.id))}
                      >
                        <Text
                          style={[
                            styles.categoryItemText,
                            isSelected && styles.categoryItemTextActive,
                          ]}
                        >
                          {p.species === "CAT" ? "🐱" : "🐶"} {p.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Meal Title *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Breakfast, Dinner, Wet food"
                  placeholderTextColor="#999"
                  value={formTitle}
                  onChangeText={setFormTitle}
                />
              </View>

              <View style={styles.rowInputs}>
                <View style={[styles.inputGroup, styles.flexHalf]}>
                  <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="2026-10-04"
                    placeholderTextColor="#999"
                    value={formDate}
                    onChangeText={setFormDate}
                  />
                </View>
                <View style={[styles.inputGroup, styles.flexHalf]}>
                  <Text style={styles.label}>Time (HH:MM)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="09:00"
                    placeholderTextColor="#999"
                    value={formTime}
                    onChangeText={setFormTime}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Notes</Text>
                <TextInput
                  style={[
                    styles.input,
                    { height: 60, textAlignVertical: "top" },
                  ]}
                  placeholder="e.g. Feed after walk, dry food only"
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={2}
                  value={formNotes}
                  onChangeText={setFormNotes}
                />
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.submitBtn}
                  onPress={handleAddEvent}
                >
                  <Text style={styles.submitBtnText}>Save Feeding</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </Layout>
  );
}
