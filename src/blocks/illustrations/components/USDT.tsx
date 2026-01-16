import { FC } from 'react';
import { IllustrationWrapper } from '../IllustrationWrapper';
import { IllustrationProps } from '../Illustrations.types';

const USDT: FC<IllustrationProps> = (allProps) => {
  const { svgProps: props, ...restProps } = allProps;
  return (
    <IllustrationWrapper
      componentName="USDT"
      illustration={
        <svg
          width={restProps?.width ?? '24'}
          height={restProps?.height ?? '24'}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          {...props}
        >
            <g clip-path="url(#clip0_33697_860)">
                <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#009393"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M12.015 12.8578C14.0787 12.8578 15.8034 12.5089 16.2249 12.0427C15.867 11.6473 14.5725 11.3359 12.9285 11.2507V12.2356C12.6342 12.2509 12.3282 12.2584 12.0147 12.2584C11.7012 12.2584 11.3952 12.2509 11.1003 12.2356V11.2507C9.45694 11.3359 8.16184 11.6473 7.80394 12.0427C8.22604 12.5089 9.95104 12.8578 12.0147 12.8578H12.015ZM15.6816 8.22185V9.57815H12.9285V10.5187C14.8623 10.6192 16.3134 11.0326 16.3242 11.5273V12.5587C16.3134 13.0534 14.8623 13.4659 12.9285 13.5667V15.8749H11.1006V13.5667C9.16684 13.4662 7.71634 13.0534 7.70554 12.5587V11.5273C7.71634 11.0326 9.16684 10.6192 11.1006 10.5187V9.57815H8.34754V8.22185H15.6819H15.6816ZM7.26484 6.06335H16.9296C17.1606 6.06335 17.3733 6.18485 17.4885 6.38225L20.304 11.2171C20.4498 11.4679 20.4066 11.7844 20.1984 11.9875L12.4482 19.5529C12.1968 19.798 11.793 19.798 11.5422 19.5529L3.80164 11.9977C3.58894 11.7895 3.54874 11.464 3.70564 11.212L6.71554 6.36725C6.83284 6.17885 7.04104 6.06365 7.26514 6.06365L7.26484 6.06335Z" fill="white"/>
            </g>
            <defs>
                <clipPath id="clip0_33697_860">
                    <rect width="24" height="24" fill="white"/>
                </clipPath>
            </defs>
        </svg>
      }
      {...restProps}
    />
  );
};

export default USDT;

