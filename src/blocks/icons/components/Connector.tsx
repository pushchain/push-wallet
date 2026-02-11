import { FC } from 'react';
import { IconWrapper } from '../IconWrapper';
import { IconProps } from '../Icons.types';

const Connector: FC<IconProps> = (allProps) => {
  const { svgProps: props, ...restProps } = allProps;
  return (
    <IconWrapper
      componentName="CloudUpload"
      icon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="inherit"
          height="inherit"
          viewBox="0 0 14 15"
          fill="none"
          {...props}
        >
          <path d="M0.5 0.5V8.5C0.5 11.8137 3.18629 14.5 6.5 14.5H13.5" stroke="#C4CBD5" strokeLinecap="round"/>
        </svg>
      }
      {...restProps}
    />
  );
};

export default Connector;
