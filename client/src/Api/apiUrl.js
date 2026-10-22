import { Platform } from "react-native";

// Set to true to connect to your local Spring Boot server (port 8080)
const USE_LOCAL = true;

// Your machine's LAN IP allows Expo Go on mobile and emulators to reach your backend
const LOCAL_IP = "192.168.18.31";

const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  if (!USE_LOCAL) {
    return "https://mypetcloud.onrender.com/api";
  }
  if (Platform.OS === "web") {
    if (typeof window !== "undefined" && window.location && window.location.origin) {
      // In local Expo web dev server (port 8081 / 19006), talk to backend port 8080 directly
      if (window.location.port === "8081" || window.location.port === "19006") {
        return "http://localhost:8080/api";
      }
      // In Docker Nginx / production web, use the same origin so Nginx proxies /api
      return `${window.location.origin}/api`;
    }
    return "http://localhost:8080/api";
  }
  return `http://${LOCAL_IP}:8080/api`;
};

export const apiUrl = getBaseUrl();
