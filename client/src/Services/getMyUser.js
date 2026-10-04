import { apiUrl } from "../Api/apiUrl";

export const getMyUser = async (token) => {
  
  const response = await fetch(`${apiUrl}/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  if (response.status === 401 || response.status === 403) {
    return { success: false, unauthorized: true, status: response.status };
  }

  try {
    return await response.json();
  } catch {
    return { success: false, status: response.status };
  }
};
