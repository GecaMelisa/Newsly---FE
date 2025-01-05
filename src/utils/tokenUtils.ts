export const getUserIdFromToken = (): number | null => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Token not found in local storage.");
    return null;
  }

  try {
    const payloadBase64 = token.split(".")[1];
    const payload = JSON.parse(
      atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/"))
    );
    return payload.user_id;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export const getUserEmailFromToken = (): string | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return decoded.sub;
  } catch (error) {
    console.error("Failed to decode token", error);
    return null;
  }
};

export const removeToken = () => {
  localStorage.removeItem("token");
};
