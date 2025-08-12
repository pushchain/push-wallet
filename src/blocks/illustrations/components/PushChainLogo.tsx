import { FC } from "react";
import { IllustrationWrapper } from "../IllustrationWrapper";
import { IllustrationProps } from "../Illustrations.types";

const PushChainLogo: FC<IllustrationProps> = (allProps) => {
    const { svgProps: props, ...restProps } = allProps;
    return (
        <IllustrationWrapper
            componentName="PushChainLogo"
            illustration={
                <svg
                    width={restProps.width ?? '48'}
                    height={restProps.height ?? '48'}
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    {...props}
                >
                    <circle
                        cx="16"
                        cy="16"
                        r="16"
                        fill="url(#paint0_radial_20474_38975)"
                    />
                    <g clip-path="url(#clip0_20474_38975)">
                        <path
                            d="M8.95041 25C8.42582 25 8 24.5933 8 24.0946V12.7233C8 12.2235 8.42582 11.8178 8.95041 11.8178H11.9278C12.5336 11.8178 13.0253 11.3494 13.0253 10.7723V7.90544C13.0253 7.40671 13.4511 7 13.9757 7H22.5755C23.3613 7 24.0011 7.60955 24.0011 8.35816V15.1709C24.0011 15.6696 23.5753 16.0763 23.0507 16.0763H20.0733C19.4675 16.0763 18.9758 16.5447 18.9758 17.1219V19.9584C18.9758 20.4571 18.55 20.8638 18.0254 20.8638H14.1228C13.517 20.8638 13.0253 21.3322 13.0253 21.9094V24.0956C13.0253 24.5943 12.5995 25.001 12.0749 25.001H8.95041V25ZM14.1228 11.7875C13.517 11.7875 13.0253 12.2559 13.0253 12.8331V15.0308C13.0253 15.6079 13.517 16.0763 14.1228 16.0763H17.8783C18.4841 16.0763 18.9758 15.6079 18.9758 15.0308V12.8331C18.9758 12.2559 18.4841 11.7875 17.8783 11.7875H14.1228Z"
                            fill="white"
                        />
                    </g>
                    <defs>
                        <radialGradient
                            id="paint0_radial_20474_38975"
                            cx="0"
                            cy="0"
                            r="1"
                            gradientUnits="userSpaceOnUse"
                            gradientTransform="translate(7 26.5) rotate(-45.4244) scale(47.731 46.8673)"
                        >
                            <stop stop-color="#484AF0" />
                            <stop offset="0.514423" stop-color="#BA39ED" />
                            <stop offset="1" stop-color="#D548EC" />
                        </radialGradient>
                        <clipPath id="clip0_20474_38975">
                            <rect
                                width="16"
                                height="18"
                                fill="white"
                                transform="translate(8 7)"
                            />
                        </clipPath>
                    </defs>
                </svg>
            }
            {...restProps}
        />
    );
};

export default PushChainLogo;
