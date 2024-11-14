export const shortenText = (str: string, substringLengthStart: number, substringLengthEnd?: number): string => {
    return `${str?.substring(0, substringLengthStart)}...${str?.substring(
      str?.length - (substringLengthEnd ?? substringLengthStart)
    )}`;
  };