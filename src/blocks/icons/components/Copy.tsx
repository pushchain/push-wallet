import { FC } from "react";
import { IconWrapper } from "../IconWrapper";
import { IconProps } from "../Icons.types";

const Copy: FC<IconProps> = (allProps) => {
  const { svgProps: props, ...restProps } = allProps;
  return (
    <IconWrapper
      componentName="Copy"
      icon={
        // <svg
        //   xmlns="http://www.w3.org/2000/svg"
        //   width="inherit"
        //   height="inherit"
        //   viewBox="0 0 12 12"
        //   fill="none"
        //   {...props}
        // >
        //   <rect
        //     x="0.5"
        //     y="4.16663"
        //     width="7.33333"
        //     height="7.33337"
        //     rx="0.7"
        //     fill="currentColor"
        //   />
        //   <path
        //     fill-rule="evenodd"
        //     clip-rule="evenodd"
        //     d="M4.86699 0.5C4.48039 0.5 4.16699 0.8134 4.16699 1.2V2.90652H8.07454C8.62683 2.90652 9.07454 3.35424 9.07454 3.90652V7.83337H10.8003C11.1869 7.83337 11.5003 7.51997 11.5003 7.13337V1.2C11.5003 0.813401 11.1869 0.5 10.8003 0.5H4.86699Z"
        //     fill="currentColor"
        //   />
        // </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="inherit"
          height="inherit"
          viewBox="0 0 18 18"
          fill="none"
          {...props}
        >
          <g clipPath="url(#clip0_27939_16524)">
            <path
              d="M12.75 12.75H15C16.2426 12.75 17.25 11.7426 17.25 10.5V3C17.25 1.75736 16.2426 0.75 15 0.75H7.5C6.25736 0.75 5.25 1.75736 5.25 3V5.25"
              stroke="#CF59E2"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10.5 5.25H3C1.75736 5.25 0.75 6.25736 0.75 7.5V15C0.75 16.2426 1.75736 17.25 3 17.25H10.5C11.7426 17.25 12.75 16.2426 12.75 15V7.5C12.75 6.25736 11.7426 5.25 10.5 5.25Z"
              stroke="#CF59E2"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
          <defs>
            <clipPath id="clip0_27939_16524">
              <rect width="18" height="18" fill="white" />
            </clipPath>
          </defs>
        </svg>
      }
      {...restProps}
    />
  );
};

export default Copy;
