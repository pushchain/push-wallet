import { FC } from 'react';
import styled from 'styled-components';

import { MenuItemComponentProps, MenuItemTypeVariant } from './Menu.types';
import * as RadixDropdown from '@radix-ui/react-dropdown-menu';
import { Link } from '../link';
import { textVariants } from '../text';

const StyledMenuItem = styled(RadixDropdown.Item) <MenuItemComponentProps>`
  // Menu default styles
  padding: var(--spacing-none) var(--spacing-xxxs);
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: center;
  gap: var(--spacing-xxxs);
  border-radius: var(--radius-xxs);

  [role='img'] {
    width: 24px;
    height: 24px;
    color: var(--pw-int-${({ type }) => (type ? type === 'error' ? 'error-primary-color' : 'success-primary-color' : 'icon-primary-color')});
  }

  &:hover {
    background-color: var(--pw-int-bg-secondary-color);
    outline: none !important;
  }

  cursor: pointer;
  min-height: 32px;

  /* Extra CSS props */
  ${(props) => props.css || ''};
`;

const StyledLabel = styled.span<{ type?: MenuItemTypeVariant }>`
  color: var(--pw-int-${({ type }) => (type ? type === 'error' ? 'error-primary-color' : 'success-primary-color' : 'text-primary-color')});
  text-align: center;

  font-family: var(--pw-int-font-family);
  font-size: ${textVariants['bs-regular'].fontSize};
  font-style: ${textVariants['bs-regular'].fontStyle};
  font-weight: ${textVariants['bs-regular'].fontWeight};
  line-height: ${textVariants['bs-regular'].lineHeight};
`;

const MenuItem: FC<MenuItemComponentProps> = ({
  icon,
  label,
  type,
  onClick,
  destination,
  newTab,
  disabled,
  ...props
}) => {
  const menuContent = (
    <StyledMenuItem
      onSelect={onClick}
      disabled={disabled}
      type={type}
      {...props}
    >
      {icon}
      <StyledLabel type={type}>{label}</StyledLabel>
    </StyledMenuItem>
  );

  return (
    <div>
      {destination ? (
        <Link
          to={destination}
          {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {menuContent}
        </Link>
      ) : (
        menuContent
      )}
    </div>
  );
};

MenuItem.displayName = 'MenuItem';

export { MenuItem };
