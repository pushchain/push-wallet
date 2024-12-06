export const centerMaskWalletAddress = (address: string) => {
  if (address) {
    const start = address.substring(0, 7);
    const end = address.substring(address.length - 7);
    return start + "..." + end;
  }
  return "";
};

export const handleCopy = async (
  text: string,
  onCopy?: (flag: boolean) => void
) => {
  try {
    await navigator.clipboard.writeText(text);
    onCopy?.(true);
    setTimeout(() => onCopy?.(false), 2000); // Reset the copied state after 2 seconds
  } catch (err) {
    console.error("Failed to copy text: ", err);
  }
};

export const removeAppStateFromURL = () => {
  const url = new URL(window.location.href);
  url.searchParams.delete("app");
  window.history.replaceState({}, document.title, url.toString());
};
