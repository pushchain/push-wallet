import { FC } from "react";
import { IconWrapper } from "../IconWrapper";
import { IconProps } from "../Icons.types";

const Download: FC<IconProps> = (allProps) => {
    const { svgProps: props, ...restProps } = allProps;
    return (
        <IconWrapper
            componentName="Download"
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
                        d="M4.09753 12.6829L12 20.5854L19.9024 12.6829"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M11.9999 1.26831L11.9999 20.1464"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M1 22.7317H23"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                    />
                </svg>
            }
            {...restProps}
        />
    );
};

export default Download;
