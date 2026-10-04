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

import Layout from "../../Components/Layout";
import { useSchedule, CATEGORIES } from "../../Hooks/useSchedule";
import { styles } from "../../Styles/ScheduleScreen";

export default function ScheduleScreen() {
  const {
    pets,
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
    filteredEvents,
    handleAddEvent,
    toggleComplete,
    deleteEvent,
    openCreateModal,
  } = useSchedule();

  const getCategoryConfig = (type) => {
    return (
      CATEGORIES.find((c) => c.id === type) || {
        id: "OTHER",
        label: "Activity",
        icon: "event",
        color: "#628141",
      }
    );
  };

  return (
    <Layout>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Schedule</Text>
            <Text style={styles.headerSubtitle}>
              Routines, health visits & reminders
            </Text>
          </View>
          <TouchableOpacity
            style={styles.addEventButton}
            onPress={() => openCreateModal()}
          >
            <Ionicons name="add" size={18} color="#fff" />
            <Text style={styles.addEventButtonText}>New</Text>
          </TouchableOpacity>
        </View>

        {/* Pet Filter Pills */}
        <View style={styles.petFilterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[
                styles.petChip,
                selectedPetFilter === "ALL" && styles.petChipActive,
              ]}
              onPress={() => setSelectedPetFilter("ALL")}
            >
              <Text
                style={[
                  styles.petChipText,
                  selectedPetFilter === "ALL" && styles.petChipTextActive,
                ]}
              >
                🐾 All Pets
              </Text>
            </TouchableOpacity>

            {pets.map((pet) => {
              const isSelected = String(selectedPetFilter) === String(pet.id);
              const petEmoji = pet.species === "CAT" ? "🐱" : "🐶";
              return (
                <TouchableOpacity
                  key={pet.id}
                  style={[styles.petChip, isSelected && styles.petChipActive]}
                  onPress={() => setSelectedPetFilter(String(pet.id))}
                >
                  <Text
                    style={[
                      styles.petChipText,
                      isSelected && styles.petChipTextActive,
                    ]}
                  >
                    {petEmoji} {pet.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Status Segmented Tabs */}
        <View style={styles.statusTabs}>
          {[
            { id: "UPCOMING", label: "Upcoming" },
            { id: "COMPLETED", label: "Completed" },
            { id: "ALL", label: "All" },
          ].map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[styles.statusTab, isActive && styles.statusTabActive]}
                onPress={() => setStatusFilter(tab.id)}
              >
                <Text
                  style={[
                    styles.statusTabText,
                    isActive && styles.statusTabTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Schedule List */}
        {filteredEvents.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="event-note" size={54} color="#ea9b56" />
            <Text style={styles.emptyTitle}>No activities found</Text>
            <Text style={styles.emptySubtitle}>
              {statusFilter === "COMPLETED"
                ? "No completed activities in this filter."
                : "Keep your pets healthy and happy by scheduling visits, feeding, or meds!"}
            </Text>
            {statusFilter !== "COMPLETED" && (
              <TouchableOpacity
                style={styles.createEmptyButton}
                onPress={() => openCreateModal()}
              >
                <Text style={styles.createEmptyButtonText}>
                  + Schedule an Activity
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filteredEvents.map((ev) => {
            const cat = getCategoryConfig(ev.type);
            return (
              <View
                key={`${ev.date}-${ev.id}`}
                style={[styles.card, ev.isCompleted && styles.cardCompleted]}
              >
                {/* Card Header: Category & Time */}
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

                {/* Card Body: Title & Notes */}
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

                {/* Card Footer: Pet Tag & Actions */}
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

                    <TouchableOpacity
                      onPress={() => deleteEvent(ev.date, ev.id)}
                      style={{ padding: 4 }}
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

      {/* Add Activity Modal */}
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
              <Text style={styles.modalTitle}>Schedule Activity</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Pet Picker */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Select Pet</Text>
                <View style={styles.categoryGrid}>
                  <TouchableOpacity
                    style={[
                      styles.categoryItem,
                      formPetId === "ALL" && styles.categoryItemActive,
                    ]}
                    onPress={() => setFormPetId("ALL")}
                  >
                    <Text
                      style={[
                        styles.categoryItemText,
                        formPetId === "ALL" && styles.categoryItemTextActive,
                      ]}
                    >
                      🐾 All Pets
                    </Text>
                  </TouchableOpacity>

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

              {/* Category Picker */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Activity Type</Text>
                <View style={styles.categoryGrid}>
                  {CATEGORIES.map((cat) => {
                    const isSelected = formType === cat.id;
                    return (
                      <TouchableOpacity
                        key={cat.id}
                        style={[
                          styles.categoryItem,
                          isSelected && styles.categoryItemActive,
                        ]}
                        onPress={() => setFormType(cat.id)}
                      >
                        <MaterialIcons
                          name={cat.icon}
                          size={16}
                          color={isSelected ? "#628141" : cat.color}
                        />
                        <Text
                          style={[
                            styles.categoryItemText,
                            isSelected && styles.categoryItemTextActive,
                          ]}
                        >
                          {cat.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Title */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Activity Title *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Annual Rabies Vaccine, Heartworm Pill"
                  placeholderTextColor="#999"
                  value={formTitle}
                  onChangeText={setFormTitle}
                />
              </View>

              {/* Date & Time */}
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

              {/* Notes */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Notes / Instructions</Text>
                <TextInput
                  style={[styles.input, { height: 60, textAlignVertical: "top" }]}
                  placeholder="e.g. Bring vaccination booklet, administer after food"
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={2}
                  value={formNotes}
                  onChangeText={setFormNotes}
                />
              </View>

              {/* Actions */}
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
                  <Text style={styles.submitBtnText}>Save Schedule</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </Layout>
  );
}
