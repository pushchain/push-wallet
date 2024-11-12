import { FC } from "react";
import { IllustrationWrapper } from "../IllustrationWrapper";
import { IllustrationProps } from "../Illustrations.types";

const Google: FC<IllustrationProps> = (allProps) => {
  const { svgProps: props, ...restProps } = allProps;
  return (
    <IllustrationWrapper
      componentName="Google"
      illustration={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={restProps?.width ?? '24'}
          height={restProps?.height ?? '24'}
          viewBox="0 0 24 24"
          fill="none"
          {...props}
        >
          <path
            d="M23.52 12.2727C23.52 11.4218 23.4436 10.6036 23.3018 9.81818H12V14.4654H18.4582C18.1745 15.96 17.3236 17.2254 16.0473 18.0764V21.0982H19.9418C22.2109 19.0036 23.52 15.9273 23.52 12.2727Z"
            fill="#4285F4"
          />
          <path
            d="M12 24C15.24 24 17.9564 22.9309 19.9418 21.0981L16.0473 18.0763C14.9782 18.7963 13.6146 19.2327 12 19.2327C8.88002 19.2327 6.22911 17.1272 5.28002 14.2909H1.28729V17.389C3.26184 21.3054 7.30911 24 12 24Z"
            fill="#34A853"
          />
          <path
            d="M5.28 14.28C5.04 13.56 4.89818 12.7964 4.89818 12C4.89818 11.2036 5.04 10.44 5.28 9.72001V6.62183H1.28727C0.469091 8.23637 0 10.0582 0 12C0 13.9418 0.469091 15.7636 1.28727 17.3782L4.39636 14.9564L5.28 14.28Z"
            fill="#FBBC05"
          />
          <path
            d="M12.0002 4.77818C13.7675 4.77818 15.3384 5.38909 16.5929 6.56727L20.0293 3.13091C17.9457 1.18909 15.2402 0 12.0002 0C7.30929 0 3.26202 2.69455 1.28748 6.62182L5.2802 9.72C6.22929 6.88364 8.8802 4.77818 12.0002 4.77818Z"
            fill="#EA4335"
          />
        </svg>
      }
      {...restProps}
    />
  );
};

export default Google;
