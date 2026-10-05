import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { getMyUser } from "../Services/getMyUser";
import { useAuth } from "../Context/AuthContext";
import { apiUrl } from "../Api/apiUrl";

const updateUserProfile = async (token, payload) => {
  const response = await fetch(`${apiUrl}/users/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({ success: false }));

  if (!response.ok) {
    throw data;
  }

  return data;
};

export const useEdithProfile = () => {
  const navigation = useNavigation();
  const { token, logout } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (token) {
          const response = await getMyUser(token);
          if (response?.success && response.data) {
            setUser(response.data);
          } else if (
            response?.unauthorized ||
            response?.status === 401 ||
            response?.status === 403
          ) {
            logout();
          } else {
            throw new Error("Failed to fetch user data");
          }
        }
      } catch (error) {
        console.log("Error fetching user:", error);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: " error loading user data",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        profilePictureUrl: user.profilePictureUrl || "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    try {
      setSaving(true);

      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone || null,
        profilePictureUrl:
          data.profilePictureUrl && data.profilePictureUrl.trim().length > 0
            ? data.profilePictureUrl.trim()
            : null,
      };

      const response = await updateUserProfile(token, payload);

      if (response?.success && response.data) {
        setUser(response.data);
      }

      Toast.show({
        type: "success",
        text1: "Profile Updated",
        text2: "Your profile has been updated successfully",
      });

      navigation.goBack();
    } catch (error) {
      console.log("Error submitting:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error?.message || "An error occurred while saving your profile",
      });
    } finally {
      setSaving(false);
    }
  };

  return {
    control,
    handleSubmit,
    errors,
    user,
    loading,
    saving,
    onSubmit,
    Controller,
    navigation,
  };
};
