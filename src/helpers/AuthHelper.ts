import api from "../services/api";

export const extractStateFromUrl = () => {
  // URL either has ?app or ?state
  const params = new URLSearchParams(location.search);

  // When appconnection request comes then the url has ?app
  const appUrl = params.get("app");
  console.log("APPP URL", appUrl);

  if (appUrl) {
    const appUrlObj = new URL(appUrl);
    const state = appUrlObj.searchParams.get("state");

    appUrlObj.searchParams.delete("state");

    const modifiedAppUrl = appUrlObj.toString();
    console.log("modifiedAppUrl", modifiedAppUrl);

    history.replaceState(null, "", `?app=${modifiedAppUrl}`);

    console.log("Extracted State:", state);
    return state;
  }

  // When social login or email login comes then the url has ?state=
  const state = params.get("state");
  return state;
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
