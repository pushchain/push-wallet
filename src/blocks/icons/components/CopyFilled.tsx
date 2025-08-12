import { FC } from "react";
import { IconWrapper } from "../IconWrapper";
import { IconProps } from "../Icons.types";

const CopyFilled: FC<IconProps> = (allProps) => {
    const { svgProps: props, ...restProps } = allProps;
    return (
        <IconWrapper
            componentName="CopyFilled"
            icon={
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="inherit"
                    height="inherit"
                    viewBox="0 0 12 12"
                    fill="none"
                    {...props}
                >
                    <rect
                        x="0.5"
                        y="4.16663"
                        width="7.33333"
                        height="7.33337"
                        rx="0.7"
                        fill="currentColor"
                    />
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M4.86699 0.5C4.48039 0.5 4.16699 0.8134 4.16699 1.2V2.90652H8.07454C8.62683 2.90652 9.07454 3.35424 9.07454 3.90652V7.83337H10.8003C11.1869 7.83337 11.5003 7.51997 11.5003 7.13337V1.2C11.5003 0.813401 11.1869 0.5 10.8003 0.5H4.86699Z"
                        fill="currentColor"
                    />
                </svg>
            }
            {...restProps}
        />
    );
};

export default CopyFilled;
