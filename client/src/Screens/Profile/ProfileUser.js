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
          <Text style={styles.loadingText}>No user information available</Text>
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
            source={{
              uri:
                userData.profilePictureUrl ||
                "https://wallpapers.com/images/featured/imagenes-de-perfil-geniales-4co57dtwk64fb7lv.jpg",
            }}
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
              ? pets.map((pet, index) => (
                  <View key={index} style={styles.petItem}>
                    <Image
                      source={{
                        uri:
                          pet.imageUrl ||
                          pet.profilePictureUrl ||
                          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPpl5XpGvsbCgINnrVk9m9UIVJcqUWQuchIA&s",
                      }}
                      style={styles.profilePets}
                      resizeMode="cover"
                    />
                    <Text style={styles.namePets}>{pet.name}</Text>
                  </View>
                ))
              : null}
            {(!hasPets || pets.length < 3) && (
              <TouchableOpacity style={styles.addPetItem}>
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
