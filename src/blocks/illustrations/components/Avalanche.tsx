import { FC } from "react";
import { IllustrationWrapper } from "../IllustrationWrapper";
import { IllustrationProps } from "../Illustrations.types";

const Avalanche: FC<IllustrationProps> = (allProps) => {
    const { svgProps: props, ...restProps } = allProps;
    return (
        <IllustrationWrapper
            componentName="Avalanche"
            illustration={
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={restProps?.width ?? '24'}
                    height={restProps?.height ?? '24'}
                    viewBox="0 0 32 32"
                    fill="none"
                    {...props}
                >
                    <circle cx="16" cy="16" r="16" fill="#FF394A" />
                    <path
                        d="M21.1771 16.5197C21.4854 15.9945 22.251 15.9945 22.5559 16.5197L25.8318 22.1161C26.1401 22.6412 25.7539 23.295 25.1407 23.295H18.589C17.9757 23.295 17.593 22.6412 17.8979 22.1161L21.1737 16.5197H21.1771Z"
                        fill="white"
                    />
                    <path
                        d="M19.1985 12.7931C19.4965 12.2714 19.4965 11.6278 19.1985 11.1027L16.512 6.41753C16.2105 5.89244 15.4585 5.89244 15.1569 6.41753L6.16605 22.1126C5.86455 22.6377 6.24058 23.2949 6.84359 23.2949H12.2131C12.8127 23.2949 13.3649 22.9731 13.663 22.4514L19.1951 12.7931H19.1985Z"
                        fill="white"
                    />
                </svg>
            }
            {...restProps}
        />
    );
};

export default Avalanche;
