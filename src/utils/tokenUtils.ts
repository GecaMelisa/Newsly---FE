/**
 * Extracts the user's email from the JWT stored in localStorage.
 */
export const getUserEmailFromToken = (): string | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return decoded.sub || null; // Assuming `sub` contains the user's email
  } catch (error) {
    console.error("Failed to decode token", error);
    return null;
  }
};

/**
 * Extracts the user's ID from the JWT stored in localStorage.
 */
export const getUserIdFromToken = (): number | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = token.split(".")[1]; // Extract the payload part of the JWT
    const decoded = JSON.parse(atob(payload)); // Decode Base64 payload
    return decoded.user_id || null; // Assuming `user_id` contains the user's ID
  } catch (error) {
    console.error("Failed to decode token", error);
    return null;
  }
};
