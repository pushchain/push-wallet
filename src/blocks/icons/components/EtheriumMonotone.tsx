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
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          {...props}
        >
          <path d="M0 8C0 3.58172 3.58172 0 8 0H16C20.4183 0 24 3.58172 24 8V16C24 20.4183 20.4183 24 16 24H8C3.58172 24 0 20.4183 0 16V8Z" fill="#EAEBF2"/>
          <path d="M7.20071 11.8051L11.9989 4.50391V14.4052L7.20071 11.8051Z" fill="#202124"/>
          <path d="M11.9989 4.50391L16.7978 11.8051L11.9989 14.4052V4.50391Z" fill="#202124"/>
          <path d="M11.9984 15.895V19.496L7.2002 13.2949L11.9984 15.895Z" fill="#202124"/>
          <path d="M11.9984 19.496V15.895L16.8002 13.2949L11.9984 19.496Z" fill="#202124"/>
        </svg>
      }
      {...restProps}
    />
  );
};

export default EthereumMonotone;
