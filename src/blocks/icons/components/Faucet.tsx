import { FC } from "react";
import { IconWrapper } from "../IconWrapper";
import { IconProps } from "../Icons.types";

const Faucet: FC<IconProps> = (allProps) => {
    const { svgProps: props, ...restProps } = allProps;
    return (
        <IconWrapper
            componentName="Faucet"
            icon={
                // <svg
                //     xmlns="http://www.w3.org/2000/svg"
                //     width="inherit"
                //     height="inherit"
                //     viewBox="0 0 24 24"
                //     fill="none"
                //     {...props}
                // >
                //     <path
                //         d="M12 22.8418C18.0751 22.8418 23 17.9169 23 11.8418C23 5.76666 18.0751 0.841797 12 0.841797C5.92487 0.841797 1 5.76666 1 11.8418C1 17.9169 5.92487 22.8418 12 22.8418Z"
                //         stroke="currentColor"
                //         stroke-width="1.5"
                //         stroke-miterlimit="10"
                //     />
                //     <path
                //         d="M15.6668 8.1748H8.3335V15.5081H15.6668V8.1748Z"
                //         stroke="currentColor"
                //         stroke-width="1.5"
                //         stroke-linecap="round"
                //         stroke-linejoin="round"
                //     />
                // </svg>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="inherit"
                    height="inherit"
                    viewBox="0 0 24 20"
                    fill="none"
                    {...props}
                >
                    <path
                        d="M1.36365 19H17.7273"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                    />
                    <path
                        d="M3.81824 19V3C3.81824 1.89543 4.71367 1 5.81824 1H13.2728C14.3774 1 15.2728 1.89543 15.2728 3V19"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                    />
                    <path
                        d="M6.68176 8.36365H12.409"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                    />
                    <path
                        d="M15.2727 8.36366H17.3636C18.4682 8.36366 19.3636 9.25909 19.3636 10.3637V14.0909C19.3636 14.9947 20.0962 15.7273 21 15.7273V15.7273C21.9037 15.7273 22.6363 14.9947 22.6363 14.0909V6.25149C22.6363 5.76705 22.4605 5.29907 22.1415 4.93448L19.7727 2.22729"
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

export default Faucet;
