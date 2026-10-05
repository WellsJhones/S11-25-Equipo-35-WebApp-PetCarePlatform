import { NavigationContainer } from "@react-navigation/native";
import RootStack from "./src/Navigation/RootStack";
import Toast from "react-native-toast-message";
import { toastConfig } from "./src/Config/toastConfig";
import { AuthProvider } from "./src/Context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer
        documentTitle={{ formatter: () => "PetCare Platform" }}
      >
        <RootStack />
      </NavigationContainer>
      <Toast config={toastConfig} />
    </AuthProvider>
  );
}
