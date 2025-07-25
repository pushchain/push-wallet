import { FC } from "react";
import { IconWrapper } from "../IconWrapper";
import { IconProps } from "../Icons.types";

const PushChainFilled: FC<IconProps> = (allProps) => {
    const { svgProps: props, ...restProps } = allProps;
    return (
        <IconWrapper
            componentName="PushChainFilled"
            icon={
                <svg
                    width="inherit"
                    height="inherit"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    {...props}
                >
                    <g clip-path="url(#clip0_8547_11034)">
                        <path
                            d="M0 8C0 3.58172 3.58172 0 8 0H12C16.4183 0 20 3.58172 20 8V12C20 16.4183 16.4183 20 12 20H8C3.58172 20 0 16.4183 0 12V8Z"
                            fill="#313338"
                        />
                        <g clip-path="url(#clip1_8547_11034)">
                            <path
                                d="M6.4752 15C6.21291 15 6 14.774 6 14.497V8.1796C6 7.90195 6.21291 7.67658 6.4752 7.67658H7.96392C8.26682 7.67658 8.51266 7.41636 8.51266 7.09572V5.50302C8.51266 5.22595 8.72556 5 8.98786 5H13.2877C13.6806 5 14.0005 5.33864 14.0005 5.75453V9.53938C14.0005 9.81645 13.7876 10.0424 13.5253 10.0424H12.0366C11.7337 10.0424 11.4879 10.3026 11.4879 10.6233V12.1991C11.4879 12.4762 11.275 12.7021 11.0127 12.7021H9.06139C8.75849 12.7021 8.51266 12.9624 8.51266 13.283V14.4976C8.51266 14.7746 8.29975 15.0006 8.03745 15.0006H6.4752V15ZM9.06139 7.65973C8.75849 7.65973 8.51266 7.91996 8.51266 8.24059V9.46155C8.51266 9.78218 8.75849 10.0424 9.06139 10.0424H10.9392C11.2421 10.0424 11.4879 9.78218 11.4879 9.46155V8.24059C11.4879 7.91996 11.2421 7.65973 10.9392 7.65973H9.06139Z"
                                fill="#B0B3B9"
                            />
                        </g>
                    </g>
                    <defs>
                        <clipPath id="clip0_8547_11034">
                            <path
                                d="M0 8C0 3.58172 3.58172 0 8 0H12C16.4183 0 20 3.58172 20 8V12C20 16.4183 16.4183 20 12 20H8C3.58172 20 0 16.4183 0 12V8Z"
                                fill="white"
                            />
                        </clipPath>
                        <clipPath id="clip1_8547_11034">
                            <rect
                                width="8"
                                height="10"
                                fill="white"
                                transform="translate(6 5)"
                            />
                        </clipPath>
                    </defs>
                </svg>
            }
            {...restProps}
        />
    );
};

export default PushChainFilled;
