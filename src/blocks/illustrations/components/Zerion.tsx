import { FC } from 'react';
import { IllustrationWrapper } from '../IllustrationWrapper';
import { IllustrationProps } from '../Illustrations.types';

const Zerion: FC<IllustrationProps> = (allProps) => {
  const { svgProps: props, ...restProps } = allProps;
  return (
    <IllustrationWrapper
      componentName="Zerion"
      illustration={
        <svg
          width={restProps?.width ?? '24'}
          height={restProps?.height ?? '24'}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          {...props}
        >
          <g clip-path="url(#clip0_37008_2651)">
            <mask id="mask0_37008_2651" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
              <path d="M32 0H0V32H32V0Z" fill="white"/>
            </mask>
            <g mask="url(#mask0_37008_2651)">
              <path d="M32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32C24.8366 32 32 24.8366 32 16Z" fill="#2461ED"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M18.3024 15.5734C15.1651 13.8781 11.3478 11.6796 8.47485 9.88767C7.62718 9.27697 8.0574 7.98087 9.08189 7.98087H23.2973C24.0902 7.98087 24.6207 8.86499 24.2233 9.53401C23.268 11.1838 21.8735 13.2783 20.7087 14.939C20.0835 15.8305 19.0644 15.9836 18.3024 15.5734ZM13.7267 16.1239C16.7601 17.7409 21.0113 20.2 24.0318 22.0594C24.9671 22.6354 24.5933 24.0173 23.5033 24.0173C21.7195 24.0173 18.8207 24.0178 15.9371 24.0182C13.0832 24.0187 10.2441 24.0191 8.51494 24.0191C7.64358 24.0191 7.19696 23.1149 7.56702 22.4842C8.81756 20.3531 10.2231 18.2022 11.3916 16.5961C11.9111 15.8797 12.9684 15.7192 13.7267 16.1239Z" fill="white"/>
            </g>
          </g>
          <defs>
            <clipPath id="clip0_37008_2651">
              <rect width='32' height='32' fill="white"/>
            </clipPath>
          </defs>
        </svg>
      }
      {...restProps}
    />
  );
};

export default Zerion;
