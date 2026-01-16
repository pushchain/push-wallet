import { FC } from 'react';
import { IconWrapper } from '../IconWrapper';
import { IconProps } from '../Icons.types';

const PushMonotone: FC<IconProps> = (allProps) => {
  const { svgProps: props, ...restProps } = allProps;
  return (
    <IconWrapper
      componentName="PushMonotone"
      icon={
        <svg
          width="inherit"
          height="inherit"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          {...props}
        >
          <g clip-path="url(#clip0_40273_30994)">
            <path d="M0 8C0 3.58172 3.58172 0 8 0H16C20.4183 0 24 3.58172 24 8V16C24 20.4183 20.4183 24 16 24H8C3.58172 24 0 20.4183 0 16V8Z" fill="#EAEBF2"/>
            <g clip-path="url(#clip1_40273_30994)">
              <path d="M7.77044 18C7.45569 18 7.2002 17.7289 7.2002 17.3964V9.81552C7.2002 9.48234 7.45569 9.2119 7.77044 9.2119H9.5569C9.92038 9.2119 10.2154 8.89963 10.2154 8.51487V6.60362C10.2154 6.27114 10.4709 6 10.7856 6H15.9455C16.417 6 16.8009 6.40637 16.8009 6.90544V11.4473C16.8009 11.7797 16.5454 12.0509 16.2306 12.0509H14.4441C14.0807 12.0509 13.7857 12.3631 13.7857 12.7479V14.6389C13.7857 14.9714 13.5302 15.2426 13.2154 15.2426H10.8739C10.5104 15.2426 10.2154 15.5548 10.2154 15.9396V17.3971C10.2154 17.7296 9.95989 18.0007 9.64514 18.0007H7.77044V18ZM10.8739 9.19168C10.5104 9.19168 10.2154 9.50395 10.2154 9.88871V11.3539C10.2154 11.7386 10.5104 12.0509 10.8739 12.0509H13.1272C13.4907 12.0509 13.7857 11.7386 13.7857 11.3539V9.88871C13.7857 9.50395 13.4907 9.19168 13.1272 9.19168H10.8739Z" fill="#202124"/>
            </g>
          </g>
          <defs>
            <clipPath id="clip0_40273_30994">
              <path d="M0 8C0 3.58172 3.58172 0 8 0H16C20.4183 0 24 3.58172 24 8V16C24 20.4183 20.4183 24 16 24H8C3.58172 24 0 20.4183 0 16V8Z" fill="white"/>
            </clipPath>
            <clipPath id="clip1_40273_30994">
              <rect width="9.6" height="12" fill="white" transform="translate(7.2002 6)"/>
            </clipPath>
          </defs>
        </svg>
      }
      {...restProps}
    />
  );
};

export default PushMonotone;

