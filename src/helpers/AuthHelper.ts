import { GlobalAction } from "../context/GlobalContext";
import api from "../services/api";

export const extractStateFromUrl = () => {
  const params = new URLSearchParams(location.search);
  return params.get("state");
};

export const fetchJwtUsingState = async ({
  stateParam,
}: {
  stateParam: string;
}) => {
  try {
    const response = await api.get("/auth/jwt", {
      params: { state: stateParam },
    });

    const { token } = response.data;
    if (!token) throw new Error("Token not found in response");

    return token;
  } catch (err) {
    console.error("Error fetching JWT:", err);
    return null;
  }
};
