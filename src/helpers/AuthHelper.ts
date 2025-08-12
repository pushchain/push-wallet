import api from "../services/api";

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
    throw new Error('Error fetching JWT')
  }
};

export const extractAndCleanStateFromUrl = () => {
  const params = new URLSearchParams(location.search);

  // When appconnection request comes then the url has ?app
  const connectedAppURL = params.get("app");
  if (connectedAppURL) {
    const appUrlObj = new URL(connectedAppURL);
    const state = appUrlObj.searchParams.get("state");

    appUrlObj.searchParams.delete("state");

    const modifiedAppUrl = appUrlObj.toString().replace(/\/$/, "");
    window.history.replaceState({}, "", `?app=${modifiedAppUrl}`);

    return state;
  }

  // When social login or email login comes then the url has ?state=
  const state = params.get("state");
  return state;
};


export const trimText = (text: string, maxWords: number) => {
  return text.split(" ").length > maxWords
    ? text.split(" ").slice(0, maxWords).join(" ") + "..."
    : text;
}