import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import Layout from "../../Components/Layout";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import defaultAvatar from "../../assets/logo.png";
import defaultPet from "../../assets/paw.png";

import { useProfile } from "../../Hooks/useProfile";
import { styles } from "../../Styles/ProfileUser";

export default function ProfileUser() {
  const { user, pets, loading, userData, hasPets, navigation, logout } =
    useProfile();

  if (loading && !user) {
    return (
      <Layout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ea9b56" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </Layout>
    );
  }

  if (!userData) {
    return (
      <Layout>
        <View style={styles.loadingContainer}>
          <MaterialIcons name="person-off" size={60} color="#ea9b56" />
          <Text style={styles.loadingText}>No user information available</Text>
          <Text
            style={{
              color: "#777",
              marginTop: 8,
              textAlign: "center",
              paddingHorizontal: 30,
              fontSize: 14,
            }}
          >
            Your session may have expired or the server could not be reached.
          </Text>
          {logout && (
            <TouchableOpacity
              style={{
                marginTop: 24,
                backgroundColor: "#c0392b",
                paddingVertical: 12,
                paddingHorizontal: 28,
                borderRadius: 10,
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
              onPress={logout}
            >
              <MaterialIcons name="logout" size={20} color="#fff" />
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
                Log Out
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </Layout>
    );
  }

  return (
    <Layout>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Ionicons
            name="chevron-back"
            size={24}
            color="black"
            onPress={() => navigation.navigate("Home")}
          />
          <Text>
            <Text style={styles.name}>{userData.firstName}</Text> Profile
          </Text>
          <View style={styles.headerActions}>
            <FontAwesome6
              name="edit"
              size={20}
              color="black"
              style={{ marginRight: 16 }}
              onPress={() => navigation.navigate("EditProfile")}
            />
            {logout && (
              <MaterialIcons
                name="logout"
                size={24}
                color="#c0392b"
                onPress={logout}
              />
            )}
          </View>
        </View>

        <View style={styles.sectionImage}>
          <Image
            source={
              userData.profilePictureUrl
                ? { uri: userData.profilePictureUrl }
                : defaultAvatar
            }
            style={styles.profileImage}
            resizeMode="cover"
          />
          <Text style={styles.nameImage}>
            {userData.firstName} {userData.lastName}
          </Text>
        </View>

        <View style={styles.sectionInfo}>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{userData.email}</Text>
          </View>
          <View>
            <Text style={styles.label}>Phone</Text>
            <Text style={styles.value}>{userData.phone || "No phone"}</Text>
          </View>
        </View>

        <View style={styles.sectionPets}>
          <Text style={styles.textPets}>My pets</Text>

          <View style={styles.petsContainer}>
            {hasPets
              ? pets.map((pet, index) => {
                  const petImg = pet?.imageUrl || pet?.profilePictureUrl;
                  return (
                    <TouchableOpacity
                      key={pet?.id || index}
                      style={styles.petItem}
                      activeOpacity={0.75}
                      accessibilityRole="button"
                      accessibilityLabel={`Edit ${pet?.name || "pet"}`}
                      onPress={() =>
                        navigation.navigate("AddPet", {
                          userId: userData?.id,
                          pet,
                        })
                      }
                    >
                      <View style={styles.petImageContainer}>
                        {petImg &&
                        typeof petImg === "string" &&
                        petImg.trim().length > 0 ? (
                          <Image
                            source={{ uri: petImg }}
                            style={styles.profilePets}
                            resizeMode="cover"
                          />
                        ) : (
                          <Image
                            source={defaultPet}
                            style={styles.profilePets}
                            resizeMode="cover"
                          />
                        )}
                        <View style={styles.petEditBadge}>
                          <FontAwesome6 name="edit" size={12} color="#fff" />
                        </View>
                      </View>
                      <Text style={styles.namePets}>{pet?.name || "Pet"}</Text>
                    </TouchableOpacity>
                  );
                })
              : null}
            {(!hasPets || pets.length < 3) && (
              <TouchableOpacity
                style={styles.addPetItem}
                onPress={() =>
                  navigation.navigate("AddPet", { userId: userData?.id })
                }
              >
                <View style={styles.addPets}>
                  <FontAwesome6 name="add" size={24} color="#628141" />
                </View>
                <Text style={styles.addPetText}>Add pet</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </Layout>
  );
}
