import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Controller } from "react-hook-form";

import { registerLogic } from "../Hooks/registerLogic";
import { styles } from "../Styles/Register";

import perito from "../assets/ImgTop.png";
import Gtito from "../assets/imgBottom.png";
import Logo from "../assets/logo.png";

export default function SignUpScreen() {
  const {
    onSubmit,
    errors,
    showPass,
    setShowPass,
    control,
    handleSubmit,
    navigation,
  } = registerLogic();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Image source={perito} style={styles.topImage} />
        <Image source={Logo} style={styles.logo} resizeMode="contain" />

        <View style={styles.form}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join our pet-loving community!</Text>

          <Text style={styles.label}>Name</Text>
          <View style={styles.row}>
            <Controller
              control={control}
              name="firstName"
              rules={{ required: "First name is required" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[
                    styles.input,
                    styles.halfInput,
                    errors.firstName && styles.errorInput,
                  ]}
                  placeholder="First name"
                  placeholderTextColor="#8A8A8A"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />

            <Controller
              control={control}
              name="lastName"
              rules={{ required: "Last name is required" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[
                    styles.input,
                    styles.halfInput,
                    errors.lastName && styles.errorInput,
                  ]}
                  placeholder="Last name"
                  placeholderTextColor="#8A8A8A"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
          </View>

          {(errors.firstName || errors.lastName) && (
            <Text style={styles.errorMsg}>
              {errors.firstName?.message || errors.lastName?.message}
            </Text>
          )}

          <Text style={styles.label}>Email</Text>
          <Controller
            control={control}
            name="email"
            rules={{
              required: "Email is required",
              pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" },
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.input, errors.email && styles.errorInput]}
                placeholder="Enter your email"
                placeholderTextColor="#8A8A8A"
                value={value}
                onChangeText={onChange}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            )}
          />
          {errors.email && (
            <Text style={styles.errorMsg}>{errors.email.message}</Text>
          )}

          <Text style={styles.label}>Phone</Text>
          <Controller
            control={control}
            name="phone"
            rules={{
              required: "Phone is required",
              pattern: { value: /^[0-9+\- ]{6,20}$/, message: "Invalid phone" },
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.input, errors.phone && styles.errorInput]}
                placeholder="Enter your phone"
                placeholderTextColor="#8A8A8A"
                value={value}
                onChangeText={onChange}
                keyboardType="phone-pad"
              />
            )}
          />
          {errors.phone && (
            <Text style={styles.errorMsg}>{errors.phone.message}</Text>
          )}

          <Text style={styles.label}>Password</Text>
          <View style={[styles.inputRow, errors.password && styles.errorInput]}>
            <Controller
              control={control}
              name="password"
              rules={{
                required: "Password is required",
                minLength: { value: 6, message: "Min 6 characters" },
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.inputRowText}
                  placeholder="Create a password"
                  secureTextEntry={!showPass}
                  placeholderTextColor="#8A8A8A"
                  value={value}
                  onChangeText={onChange}
                  autoCapitalize="none"
                />
              )}
            />

            <TouchableOpacity onPress={() => setShowPass(!showPass)}>
              <Text style={styles.eye}>👁️</Text>
            </TouchableOpacity>
          </View>

          {errors.password && (
            <Text style={styles.errorMsg}>{errors.password.message}</Text>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit(onSubmit)}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          <Text style={styles.bottomText}>
            Already have an account?{" "}
            <Text
              style={styles.signIn}
              onPress={() => navigation.navigate("Login")}
            >
              Sign In
            </Text>
          </Text>
        </View>

        <Image source={Gtito} style={styles.bottomImage} resizeMode="contain" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
