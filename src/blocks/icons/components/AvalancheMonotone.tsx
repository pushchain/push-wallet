import { FC } from 'react';
import { IconWrapper } from '../IconWrapper';
import { IconProps } from '../Icons.types';

const AvalancheMonotone: FC<IconProps> = (allProps) => {
    const { svgProps: props, ...restProps } = allProps;
    return (
        <IconWrapper
            componentName="AvalancheMonotone"
            icon={
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="inherit"
                    height="inherit"
                    viewBox="0 0 20 20"
                    fill="none"
                    {...props}
                >
                    <g clipPath="url(#clip0_18252_20797)">
                        <path
                            d="M0 8C0 3.58172 3.58172 0 8 0H12C16.4183 0 20 3.58172 20 8V12C20 16.4183 16.4183 20 12 20H8C3.58172 20 0 16.4183 0 12V8Z"
                            fill="var(--pw-int-bg-tertiary-color)"
                        />
                        <path
                            d="M12.9653 10.5519C13.1419 10.2512 13.5804 10.2512 13.7551 10.5519L15.6315 13.7575C15.808 14.0583 15.5868 14.4328 15.2356 14.4328H11.4828C11.1316 14.4328 10.9124 14.0583 11.087 13.7575L12.9634 10.5519H12.9653Z"
                            fill="var(--pw-int-icon-primary-color)"
                        />
                        <path
                            d="M11.832 8.41742C12.0027 8.11859 12.0027 7.74991 11.832 7.44915L10.2932 4.76555C10.1205 4.46479 9.68976 4.46479 9.51705 4.76555L4.36719 13.7555C4.19449 14.0562 4.40988 14.4327 4.75527 14.4327H7.83083C8.17429 14.4327 8.49058 14.2484 8.66133 13.9496L11.8301 8.41742H11.832Z"
                            fill="var(--pw-int-icon-primary-color)"
                        />
                    </g>
                    <defs>
                        <clipPath id="clip0_18252_20797">
                            <path
                                d="M0 8C0 3.58172 3.58172 0 8 0H12C16.4183 0 20 3.58172 20 8V12C20 16.4183 16.4183 20 12 20H8C3.58172 20 0 16.4183 0 12V8Z"
                                fill="white"
                            />
                        </clipPath>
                    </defs>
                </svg>
            }
            {...restProps}
        />
    );
};

export default AvalancheMonotone;
