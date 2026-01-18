import { FC } from 'react';
import { IconWrapper } from '../IconWrapper';
import { IconProps } from '../Icons.types';

const EthereumMonotone: FC<IconProps> = (allProps) => {
  const { svgProps: props, ...restProps } = allProps;
  return (
    <IconWrapper
      componentName="EthereumMonotone"
      icon={
        <svg
          width="inherit"
          height="inherit"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          {...props}
        >
          <path d="M0 8C0 3.58172 3.58172 0 8 0H12C16.4183 0 20 3.58172 20 8V12C20 16.4183 16.4183 20 12 20H8C3.58172 20 0 16.4183 0 12V8Z" fill="#EAEBF2"/>
          <path d="M6.00043 9.83759L9.99892 3.7533V12.0043L6.00043 9.83759Z" fill="#202124"/>
          <path d="M9.99892 3.7533L13.998 9.83759L9.99892 12.0043V3.7533Z" fill="#202124"/>
          <path d="M9.99851 13.2459V16.2467L6 11.0791L9.99851 13.2459Z" fill="#202124"/>
          <path d="M9.99851 16.2467V13.2459L14 11.0791L9.99851 16.2467Z" fill="#202124"/>
        </svg>
      }
      {...restProps}
    />
  );
};

export default EthereumMonotone;

