import { FC } from "react";
import { IconWrapper } from "../IconWrapper";
import { IconProps } from "../Icons.types";

const Doc: FC<IconProps> = (allProps) => {
    const { svgProps: props, ...restProps } = allProps;
    return (
        <IconWrapper
            componentName="Doc"
            icon={
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="inherit"
                    height="inherit"
                    viewBox="0 0 20 22"
                    fill="none"
                    {...props}
                >
                    <path
                        d="M2.5 1H12.5601C12.8404 1 13.1078 1.11765 13.2973 1.32428L18.2372 6.71326C18.4062 6.89769 18.5 7.13879 18.5 7.38898V20C18.5 20.5523 18.0523 21 17.5 21H2.5C1.94772 21 1.5 20.5523 1.5 20V2C1.5 1.44772 1.94772 1 2.5 1Z"
                        stroke="currentColor"
                        strokeWidth="2"
                    />
                    <path
                        d="M12.5 1V6C12.5 6.55228 12.9477 7 13.5 7H18.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                    <path
                        d="M6.5 11H13.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                    <path
                        d="M6.5 15H13.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                </svg>
            }
            {...restProps}
        />
    );
};

export default Doc;
