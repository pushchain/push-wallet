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
                    xmlns="http://www.w3.org/2000/svg"
                    width="inherit"
                    height="inherit"
                    viewBox="0 0 8 8"
                    fill="none"
                    {...props}
                >
                    <g clip-path="url(#clip0_27939_16041)">
                        <path
                            d="M1.17997 8C0.970132 8 0.799805 7.81924 0.799805 7.59758V2.54368C0.799805 2.32156 0.970132 2.14126 1.17997 2.14126H2.37094C2.61326 2.14126 2.80993 1.93309 2.80993 1.67658V0.402416C2.80993 0.180762 2.98026 0 3.19009 0H6.63C6.94431 0 7.20024 0.270911 7.20024 0.603625V3.63151C7.20024 3.85316 7.02992 4.03392 6.82008 4.03392H5.62911C5.38679 4.03392 5.19012 4.2421 5.19012 4.49861V5.75929C5.19012 5.98095 5.01979 6.16171 4.80996 6.16171H3.24892C3.0066 6.16171 2.80993 6.36989 2.80993 6.62639V7.59805C2.80993 7.8197 2.6396 8.00046 2.42977 8.00046H1.17997V8ZM3.24892 2.12779C3.0066 2.12779 2.80993 2.33597 2.80993 2.59247V3.56924C2.80993 3.82574 3.0066 4.03392 3.24892 4.03392H4.75113C4.99345 4.03392 5.19012 3.82574 5.19012 3.56924V2.59247C5.19012 2.33597 4.99345 2.12779 4.75113 2.12779H3.24892Z"
                            fill="#B0B3B9"
                        />
                    </g>
                    <defs>
                        <clipPath id="clip0_27939_16041">
                            <rect
                                width="6.4"
                                height="8"
                                fill="white"
                                transform="translate(0.799805)"
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
