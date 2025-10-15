import { FC } from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import styled, { FlattenSimpleInterpolation } from 'styled-components';

import { TransformedHTMLAttributes } from '../Blocks.types';
import { Text, TextProps } from '../text';

export type LinkProps = RouterLinkProps & {
  css?: FlattenSimpleInterpolation;
  textProps?: TextProps;
  isText?: boolean;
} & TransformedHTMLAttributes<HTMLAnchorElement>;

const StyledLink = styled(RouterLink)<{
  $isTest?: LinkProps['isText'];
  css?: LinkProps['css'];
}>`
  /* Link CSS */

  text-decoration: none;

  &:hover > * {
    color: ${({ $isTest }) => ($isTest ? 'var(--pw-int-text-link-color)' : '')};
  }

  /* Extra CSS props */
  ${(props) => props.css || ''}
`;

const Link: FC<LinkProps> = ({ textProps, isText = true, ...props }) => {
  return (
    <StyledLink
      $isTest={isText}
      {...props}
    >
      {isText ? <Text {...textProps}>{props?.children}</Text> : props.children}
    </StyledLink>
  );
};

Link.displayName = 'Link';

export { Link };
