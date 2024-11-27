import { GlobalAction } from "../context/GlobalContext";
import api from "../services/api";

export const extractStateFromUrl = () => {
  const params = new URLSearchParams(location.search);
  return params.get("state");
};

export const fetchJwtUsingState = async ({
  stateParam,
  dispatch,
}: {
  stateParam: string;
  dispatch: React.Dispatch<GlobalAction>;
}) => {
  try {
    const response = await api.get("/auth/jwt", {
      params: { state: stateParam },
    });

    const { token } = response.data;
    if (!token) throw new Error("Token not found in response");

    dispatch({ type: "SET_JWT", payload: token });
    sessionStorage.setItem("jwt", token);
    return token;

    //   await fetchUserProfile(token);
  } catch (err) {
    console.error("Error fetching JWT:", err);
    return null;
  }
};
