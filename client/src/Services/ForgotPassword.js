import { apiUrl } from "../Api/apiUrl";

export const forgotPasswordService = async (email) => {
  const res = await fetch(
    `${apiUrl}/auth/forgot-password?email=${encodeURIComponent(email)}`,
    {
      method: "POST",
    },
  );

  if (!res.ok) {
    throw new Error("Error al solicitar el restablecimiento");
  }

  const data = await res.json();
  return data;
};
