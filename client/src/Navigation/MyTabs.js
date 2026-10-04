import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, StyleSheet, Image } from "react-native";

import HomeScreen from "../Screens/Homee";
import ProfileUser from "../Screens/Profile/ProfileUser";
import EditProfile from "../Screens/Profile/EdithProfile";
import AddPet from "../Screens/Profile/AddPet";
import ScheduleScreen from "../Screens/Schedule/ScheduleScreen";

import HomeLog from "../assets/tabs/Home.png";
import Group from "../assets/tabs/Group.png";
import Feeding from "../assets/tabs/Feedingt.png";
import ProfileLog from "../assets/tabs/profile.png";

const Tab = createBottomTabNavigator();
const ProfileStack = createNativeStackNavigator();

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <ProfileStack.Screen name="ProfileMain" component={ProfileUser} />
      <ProfileStack.Screen name="EditProfile" component={EditProfile} />
      <ProfileStack.Screen name="AddPet" component={AddPet} />
    </ProfileStack.Navigator>
  );
}

export default function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: focused ? "#628141" : "transparent" },
              ]}
            >
              <Image
                source={HomeLog}
                style={{
                  width: 24,
                  height: 24,
                  tintColor: focused ? "#0d0d0dff" : "#484848ff",
                }}
              />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Schedule"
        component={ScheduleScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: focused ? "#628141" : "transparent" },
              ]}
            >
              <Image
                source={Group}
                style={{
                  width: 24,
                  height: 24,
                  tintColor: focused ? "#000000ff" : "#484848ff",
                }}
              />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Feeding"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: focused ? "#628141" : "transparent" },
              ]}
            >
              <Image
                source={Feeding}
                style={{
                  width: 24,
                  height: 24,
                  tintColor: focused ? "#000000ff" : "#484848ff",
                }}
              />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileStackScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: focused ? "#628141" : "transparent" },
              ]}
            >
              <Image
                source={ProfileLog}
                style={{
                  width: 24,
                  height: 24,
                  tintColor: focused ? "#000000ff" : "#484848ff",
                }}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 80,
    paddingTop: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  iconContainer: {
    width: 50,
    height: 40,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
});
