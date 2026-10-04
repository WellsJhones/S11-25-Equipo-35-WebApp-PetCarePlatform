import { apiUrl } from "../Api/apiUrl";

export const createPet = async (token, userId, petData) => {
  const response = await fetch(`${apiUrl}/user/${userId}/pets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(petData),
    credentials: "include",
  });

  const data = await response.json();
  if (!response.ok) {
    const errorMsg =
      data?.message ||
      data?.errors ||
      (typeof data === "string" ? data : "Failed to create pet");
    throw new Error(
      typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg),
    );
  }

  return data;
};

export const updatePet = async (token, userId, petId, petData) => {
  const response = await fetch(`${apiUrl}/user/${userId}/pets/${petId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(petData),
    credentials: "include",
  });

  const data = await response.json();
  if (!response.ok) {
    const errorMsg =
      data?.message ||
      data?.errors ||
      (typeof data === "string" ? data : "Failed to update pet");
    throw new Error(
      typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg),
    );
  }

  return data;
};
