import { useToastMessages } from "../Utils/useToastMessages";
import { postRegister } from "../Services/postRegister";
import { useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { useAuth } from "../Context/AuthContext";

export const registerLogic = () => {
  const [showPass, setShowPass] = useState(false);
  const navigation = useNavigation();
  const { login } = useAuth();
  const { registerSuccess, registerError, emailInUse } = useToastMessages();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await postRegister(data);
      console.log("Register response:", response);

      if (!response || response.success === false) {
        if (response?.message?.toLowerCase().includes("email")) {
          emailInUse();
        } else {
          registerError(response?.message || "Registration failed");
        }
        return;
      }

      registerSuccess();

      // Log in with the received accessToken so RootStack switches to MyTabs (homepage)
      if (response.data?.accessToken) {
        await login(response.data.accessToken);
      } else {
        setTimeout(() => {
          navigation.navigate("Login");
        }, 1500);
      }
    } catch (error) {
      console.log("Register error:", error);
      if (error?.message?.toLowerCase().includes("email")) {
        emailInUse();
      } else {
        registerError(error?.message || "Registration failed");
      }
    }
  };

  return {
    control,
    handleSubmit,
    onSubmit,
    errors,
    showPass,
    setShowPass,
    navigation,
  };
};
