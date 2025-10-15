import { FC } from "react";
import { IconWrapper } from "../IconWrapper";
import { IconProps } from "../Icons.types";

const IconLeading: FC<IconProps> = (allProps) => {
    const { svgProps: props, ...restProps } = allProps;
    return (
        <IconWrapper
            componentName="IconLeading"
            icon={
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="inherit"
                    height="inherit"
                    viewBox="0 0 24 24"
                    fill="none"
                    {...props}
                >
                    <path
                        d="M12 22.8418C18.0751 22.8418 23 17.9169 23 11.8418C23 5.76666 18.0751 0.841797 12 0.841797C5.92487 0.841797 1 5.76666 1 11.8418C1 17.9169 5.92487 22.8418 12 22.8418Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        stroke-miterlimit="10"
                    />
                    <path
                        d="M15.6668 8.1748H8.3335V15.5081H15.6668V8.1748Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>

            }
            {...restProps}
        />
    );
};

export default IconLeading;
