import { FC } from "react";
import { IllustrationWrapper } from "../IllustrationWrapper";
import { IllustrationProps } from "../Illustrations.types";

const TwitterSimple: FC<IllustrationProps> = (allProps) => {
  const { svgProps: props, ...restProps } = allProps;
  return (
    <IllustrationWrapper
      componentName="TwitterSimple"
      illustration={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={restProps?.width ?? '22'}
          height={restProps?.height ?? '22'}
          viewBox="0 0 22 22"
          fill="none"
          {...props}
        >
          <path
            d="M13.0955 9.31648L21.2864 0H19.3456L12.2303 8.08768L6.55141 0H0L8.58949 12.2311L0 22H1.94072L9.45009 13.4571L15.4486 22H22L13.0955 9.31648ZM10.4365 12.3385L9.5649 11.1198L2.64059 1.43161H5.62193L11.2117 9.25316L12.0797 10.4719L19.3447 20.6381H16.3634L10.4365 12.3385Z"
            fill="#17181B"
          />
        </svg>
      }
      {...restProps}
    />
  );
};

export default TwitterSimple;
