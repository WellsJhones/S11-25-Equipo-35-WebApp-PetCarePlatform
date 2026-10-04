import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { getMyUser } from "../Services/getMyUser";
import { getPetsUser } from "../Services/getPetsUser";
import { useAuth } from "../Context/AuthContext";
import { useNavigation } from "@react-navigation/native";

export const useProfile = () => {
  const [user, setUser] = useState(null);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, logout } = useAuth();
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchData = async () => {
        try {
          if (token) {
            const userData = await getMyUser(token);

            if (isActive && userData?.success === true) {
              setUser(userData);
              const petsData = await getPetsUser(token, userData.data.id);

              if (isActive) {
                if (Array.isArray(petsData) && petsData.length > 0) {
                  setPets(petsData);
                } else {
                  setPets([]);
                }
              }
            } else if (
              isActive &&
              (userData?.unauthorized ||
                userData?.status === 401 ||
                userData?.status === 403)
            ) {
              console.log("Token expired or unauthorized, logging out...");
              await logout();
            }
          }
        } catch (error) {
          console.log("Error loading profile:", error);
        } finally {
          if (isActive) {
            setLoading(false);
          }
        }
      };

      fetchData();

      return () => {
        isActive = false;
      };
    }, [token]),
  );

  const userData = user?.data;
  const hasPets = Array.isArray(pets) && pets.length > 0;

  return { user, pets, loading, userData, hasPets, navigation, logout };
};
