import { FC } from 'react';
import { IllustrationWrapper } from '../IllustrationWrapper';
import { IllustrationProps } from '../Illustrations.types';

const Rabby: FC<IllustrationProps> = (allProps) => {
  const { svgProps: props, ...restProps } = allProps;
  return (
    <IllustrationWrapper
      componentName="Rabby"
      illustration={
        <svg
          width={restProps?.width ?? '24'}
          height={restProps?.height ?? '24'}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          {...props}
        >
          <g clip-path="url(#clip0_37008_22581)">
					<mask id="mask0_37008_22581" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
					<path d="M32 0H0V32H32V0Z" fill="white"/>
					</mask>
					<g mask="url(#mask0_37008_22581)">
					<path d="M32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32C24.8366 32 32 24.8366 32 16Z" fill="#EEF0FE"/>
					<mask id="mask1_37008_22581" maskUnits="userSpaceOnUse" x="3" y="3" width="26" height="25">
					<path d="M28.9193 3H3.08074V28H28.9193V3Z" fill="white"/>
					</mask>
					<g mask="url(#mask1_37008_22581)">
					<path d="M26.9082 16.8464C27.7804 14.9542 23.4688 9.66768 19.3498 7.46521C16.7535 5.75899 14.0481 5.99339 13.5002 6.74255C12.2977 8.38666 17.4819 9.77979 20.949 11.4055C20.2038 11.7198 19.5014 12.284 19.0884 13.0055C17.7958 11.635 14.9588 10.4548 11.6299 11.4055C9.38664 12.0461 7.52232 13.5564 6.80176 15.8376C6.62667 15.762 6.43282 15.72 6.22887 15.72C5.44898 15.72 4.81676 16.3341 4.81676 17.0915C4.81676 17.8489 5.44898 18.4629 6.22887 18.4629C6.37344 18.4629 6.82542 18.3688 6.82542 18.3688L14.0481 18.4196C11.1596 22.87 8.87685 23.5205 8.87685 24.2916C8.87685 25.0625 11.061 24.8536 11.8812 24.5663C15.8071 23.1905 20.0239 18.9027 20.7473 17.6684C23.7859 18.0366 26.3396 18.0802 26.9082 16.8464Z" fill="url(#paint0_linear_37008_22581)"/>
					<path d="M13.4136 7.5873C13.6575 7.11536 15.3062 7.06271 17.5452 8.08688C19.1885 8.8386 20.9385 10.5169 21.04 10.9329C21.084 11.114 21.1099 11.3445 20.9492 11.406C20.9492 11.406 20.9489 11.4058 20.9486 11.4057L20.949 11.4055C18.0903 10.0651 14.0643 8.88261 13.4136 7.5873Z" fill="url(#paint1_linear_37008_22581)"/>
					<path d="M12.4746 14.2308C14.872 14.2308 15.9038 14.9843 16.7257 16.3998C17.3113 17.4085 17.1813 19.0039 16.5612 20.0816C17.1426 20.2214 17.6539 20.3758 18.1067 20.5439C17.3724 21.208 16.532 21.8975 15.6381 22.5298C14.4211 22.2283 13.3153 21.9419 11.6384 21.5245C12.3551 20.765 13.174 19.7664 14.0481 18.4195L7.56517 18.3739C7.54266 18.1194 7.53601 17.8426 7.54261 17.5406C7.60564 14.6623 11.1559 14.2308 12.4746 14.2308Z" fill="url(#paint2_linear_37008_22581)"/>
					<path d="M6.71527 18.0782C6.98011 20.2647 8.25962 21.1216 10.8742 21.3752C13.4887 21.6288 14.9885 21.4588 16.9851 21.6352C18.6527 21.7825 20.1417 22.6078 20.694 22.3225C21.1913 22.066 20.913 21.1386 20.2478 20.5436C19.3856 19.7724 18.1923 19.2361 16.0924 19.046C16.5109 17.9331 16.3936 16.3728 15.7437 15.524C14.804 14.2966 13.0695 13.7417 10.8742 13.9841C8.5806 14.2374 6.38289 15.3341 6.71527 18.0782Z" fill="url(#paint3_linear_37008_22581)"/>
					</g>
					</g>
					</g>
					<defs>
					<linearGradient id="paint0_linear_37008_22581" x1="11.3687" y1="15.1708" x2="26.6521" y2="19.6333" gradientUnits="userSpaceOnUse">
					<stop stop-color="#4C65FE"/>
					<stop offset="1" stop-color="#8F9FFF"/>
					</linearGradient>
					<linearGradient id="paint1_linear_37008_22581" x1="24.1354" y1="14.8873" x2="13.3827" y2="3.78907" gradientUnits="userSpaceOnUse">
					<stop stop-color="#4C65FE"/>
					<stop offset="1" stop-color="#5156D8" stop-opacity="0"/>
					</linearGradient>
					<linearGradient id="paint2_linear_37008_22581" x1="18.4149" y1="20.9192" x2="7.93116" y2="14.7133" gradientUnits="userSpaceOnUse">
					<stop stop-color="#2D46E2"/>
					<stop offset="1" stop-color="#8697FF" stop-opacity="0"/>
					</linearGradient>
					<linearGradient id="paint3_linear_37008_22581" x1="12.2853" y1="15.0595" x2="19.2199" y2="24.1318" gradientUnits="userSpaceOnUse">
					<stop stop-color="#4C65FE"/>
					<stop offset="1" stop-color="#4C65FE"/>
					</linearGradient>
					<clipPath id="clip0_37008_22581">
					<rect width='32' height='32' fill="white"/>
					</clipPath>
					</defs>
        </svg>
      }
      {...restProps}
    />
  );
};

export default Rabby;
