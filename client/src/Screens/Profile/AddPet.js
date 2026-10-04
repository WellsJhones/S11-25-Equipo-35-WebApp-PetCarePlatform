import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Toast from "react-native-toast-message";

import Layout from "../../Components/Layout";
import { useAuth } from "../../Context/AuthContext";
import { createPet } from "../../Services/createPet";
import { getMyUser } from "../../Services/getMyUser";
import { styles } from "../../Styles/AddPet";

const SPECIES_OPTIONS = [
  { label: "🐶 Dog", value: "DOG" },
  { label: "🐱 Cat", value: "CAT" },
  { label: "🐦 Bird", value: "BIRD" },
  { label: "🐰 Rabbit", value: "RABBIT" },
  { label: "🐹 Hamster", value: "HAMSTER" },
  { label: "🐾 Other", value: "OTHER" },
];

const GENDER_OPTIONS = [
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE" },
];

export default function AddPet({ route, navigation }) {
  const { token } = useAuth();
  const [saving, setSaving] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("DOG");
  const [breed, setBreed] = useState("");
  const [gender, setGender] = useState("MALE");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState("KG");
  const [color, setColor] = useState("");
  const [healthNotes, setHealthNotes] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = "Pet name is required";
    }

    if (weight.trim()) {
      const parsedWeight = parseFloat(weight);
      if (isNaN(parsedWeight) || parsedWeight <= 0) {
        newErrors.weight = "Weight must be a positive number";
      }
    }

    if (dateOfBirth.trim()) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(dateOfBirth.trim())) {
        newErrors.dateOfBirth = "Date must be YYYY-MM-DD";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      setSaving(true);

      let targetUserId = route.params?.userId;
      if (!targetUserId) {
        const userRes = await getMyUser(token);
        targetUserId = userRes?.data?.id;
      }

      if (!targetUserId) {
        throw new Error("Unable to identify current user");
      }

      const petPayload = {
        name: name.trim(),
        species,
        breed: breed.trim() || null,
        gender: gender || null,
        dateOfBirth: dateOfBirth.trim() || null,
        weight: weight.trim() ? parseFloat(weight.trim()) : null,
        weightUnit: weight.trim() ? weightUnit : null,
        color: color.trim() || null,
        healthNotes: healthNotes.trim() || null,
      };

      await createPet(token, targetUserId, petPayload);

      Toast.show({
        type: "success",
        text1: "Pet Added!",
        text2: `${name} has been added successfully.`,
      });

      navigation.goBack();
    } catch (error) {
      console.log("Error creating pet:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "Failed to add pet",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={26} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Add Pet</Text>
            <View style={{ width: 26 }} />
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Species Selector */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Species *</Text>
              <View style={styles.chipContainer}>
                {SPECIES_OPTIONS.map((item) => {
                  const isSelected = species === item.value;
                  return (
                    <TouchableOpacity
                      key={item.value}
                      style={[styles.chip, isSelected && styles.chipActive]}
                      onPress={() => setSpecies(item.value)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          isSelected && styles.chipTextActive,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Pet Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Pet Name *</Text>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                placeholder="e.g. Max, Bella"
                placeholderTextColor="#999"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (errors.name) setErrors({ ...errors, name: null });
                }}
              />
              {errors.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}
            </View>

            {/* Breed */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Breed</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Golden Retriever, Siamese"
                placeholderTextColor="#999"
                value={breed}
                onChangeText={setBreed}
              />
            </View>

            {/* Gender */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Gender</Text>
              <View style={styles.chipContainer}>
                {GENDER_OPTIONS.map((item) => {
                  const isSelected = gender === item.value;
                  return (
                    <TouchableOpacity
                      key={item.value}
                      style={[styles.chip, isSelected && styles.chipActive]}
                      onPress={() => setGender(item.value)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          isSelected && styles.chipTextActive,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Weight and Unit */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Weight</Text>
              <View style={styles.rowInputs}>
                <View style={styles.flexHalf}>
                  <TextInput
                    style={[styles.input, errors.weight && styles.inputError]}
                    placeholder="e.g. 12.5"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    value={weight}
                    onChangeText={(text) => {
                      setWeight(text);
                      if (errors.weight) setErrors({ ...errors, weight: null });
                    }}
                  />
                </View>
                <View style={styles.unitSelector}>
                  {["KG", "LB"].map((unit) => {
                    const isSelected = weightUnit === unit;
                    return (
                      <TouchableOpacity
                        key={unit}
                        style={[
                          styles.unitButton,
                          isSelected && styles.unitButtonActive,
                        ]}
                        onPress={() => setWeightUnit(unit)}
                      >
                        <Text
                          style={[
                            styles.unitText,
                            isSelected && styles.unitTextActive,
                          ]}
                        >
                          {unit}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
              {errors.weight && (
                <Text style={styles.errorText}>{errors.weight}</Text>
              )}
            </View>

            {/* Date of Birth */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Date of Birth (YYYY-MM-DD)</Text>
              <TextInput
                style={[styles.input, errors.dateOfBirth && styles.inputError]}
                placeholder="2022-05-15"
                placeholderTextColor="#999"
                value={dateOfBirth}
                onChangeText={(text) => {
                  setDateOfBirth(text);
                  if (errors.dateOfBirth)
                    setErrors({ ...errors, dateOfBirth: null });
                }}
              />
              {errors.dateOfBirth && (
                <Text style={styles.errorText}>{errors.dateOfBirth}</Text>
              )}
            </View>

            {/* Color */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Color</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Brown, White, Black"
                placeholderTextColor="#999"
                value={color}
                onChangeText={setColor}
              />
            </View>

            {/* Health Notes */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Health Notes / Allergies</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Any special medical conditions, diet notes, etc."
                placeholderTextColor="#999"
                multiline
                numberOfLines={3}
                value={healthNotes}
                onChangeText={setHealthNotes}
              />
            </View>

            {/* Save Button */}
            <TouchableOpacity
              style={[styles.saveButton, saving && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Add Pet</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Layout>
  );
}
