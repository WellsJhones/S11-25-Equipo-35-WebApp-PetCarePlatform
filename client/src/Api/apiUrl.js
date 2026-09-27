import { Platform } from "react-native";

// Set to true to connect to your local Spring Boot server (port 8080)
const USE_LOCAL = true;

// Your machine's LAN IP allows Expo Go on mobile and emulators to reach your backend
const LOCAL_IP = "192.168.18.31";

const getBaseUrl = () => {
  if (!USE_LOCAL) {
    return "https://mypetcloud.onrender.com/api";
  }
  if (Platform.OS === "web") {
    return "http://localhost:8080/api";
  }
  return `http://${LOCAL_IP}:8080/api`;
};

export const apiUrl = getBaseUrl();
