import { apiUrl } from "../Api/apiUrl";

export const getUserReminders = async (token, userId) => {
  const response = await fetch(`${apiUrl}/reminders/user/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || "Failed to load reminders from database");
  }
  return data?.data || [];
};

export const createReminder = async (token, reminderData) => {
  const response = await fetch(`${apiUrl}/reminders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(reminderData),
    credentials: "include",
  });

  const data = await response.json();
  if (!response.ok) {
    const errorMsg =
      data?.message || data?.errors || "Failed to create reminder";
    throw new Error(
      typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg),
    );
  }
  return data?.data;
};

export const updateReminder = async (token, reminderId, reminderData) => {
  const response = await fetch(`${apiUrl}/reminders/${reminderId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(reminderData),
    credentials: "include",
  });

  const data = await response.json();
  if (!response.ok) {
    const errorMsg =
      data?.message || data?.errors || "Failed to update reminder";
    throw new Error(
      typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg),
    );
  }

  return data?.data;
};

export const toggleReminderComplete = async (token, reminderId) => {
  const response = await fetch(
    `${apiUrl}/reminders/${reminderId}/toggle-complete`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    },
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || "Failed to update reminder status");
  }
  return data?.data;
};

export const deleteReminder = async (token, reminderId) => {
  const response = await fetch(`${apiUrl}/reminders/${reminderId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || "Failed to delete reminder");
  }
  return true;
};
