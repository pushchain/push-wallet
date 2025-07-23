import { FC } from "react";
import { IconWrapper } from "../IconWrapper";
import { IconProps } from "../Icons.types";

const PushChainMonotone: FC<IconProps> = (allProps) => {
    const { svgProps: props, ...restProps } = allProps;
    return (
        <IconWrapper
            componentName="PushChainMonotone"
            icon={
                <svg
                    width="inherit"
                    height="inherit"
                    viewBox="0 0 11 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    {...props}
                >
                    <g clip-path="url(#clip0_27769_15295)">
                        <path
                            d="M1.09401 12.3457C0.766822 12.3457 0.5 12.0753 0.5 11.7421V4.16122C0.5 3.82874 0.766136 3.5576 1.09401 3.5576H2.9549C3.33353 3.5576 3.64082 3.24533 3.64082 2.86057V0.949328C3.64082 0.616846 3.90696 0.345703 4.23482 0.345703H9.60968C10.1008 0.345703 10.5007 0.752069 10.5007 1.25114V5.79296C10.5007 6.12544 10.2345 6.39659 9.90668 6.39659H8.04579C7.66716 6.39659 7.35987 6.70885 7.35987 7.09361V8.98464C7.35987 9.31712 7.09373 9.58827 6.76586 9.58827H4.32674C3.94811 9.58827 3.64082 9.90054 3.64082 10.2853V11.7428C3.64082 12.0753 3.37468 12.3464 3.04681 12.3464H1.09401V12.3457ZM4.32674 3.53738C3.94811 3.53738 3.64082 3.84965 3.64082 4.23441V5.69956C3.64082 6.08432 3.94811 6.39659 4.32674 6.39659H6.67395C7.05258 6.39659 7.35987 6.08432 7.35987 5.69956V4.23441C7.35987 3.84965 7.05258 3.53738 6.67395 3.53738H4.32674Z"
                            fill="#8C93A0"
                        />
                    </g>
                    <defs>
                        <clipPath id="clip0_27769_15295">
                            <rect
                                width="10"
                                height="12"
                                fill="white"
                                transform="translate(0.5 0.345703)"
                            />
                        </clipPath>
                    </defs>
                </svg>
            }
            {...restProps}
        />
    );
};

export default PushChainMonotone;
