import { FlattenSimpleInterpolation, css } from 'styled-components';
import { ButtonSize, ButtonVariant } from './Button.types';

export const getButtonVariantStyles = (variant: ButtonVariant, loading: boolean) => {
  switch (variant) {
    case 'primary': {
      return `
        background-color: ${loading 
          ? 'color-mix(in srgb, var(--pw-int-btn-primary-bg-color), #FFFFFF 10%)' 
          : 'var(--pw-int-btn-primary-bg-color)'};
        color: var(--pw-int-btn-primary-text-color);
        ${
          !loading &&
          `
            &:hover {
              background-color: color-mix(in srgb, var(--pw-int-btn-primary-bg-color), #FFFFFF 10%);
            }
            &:active {
              background-color: color-mix(in srgb, var(--pw-int-btn-primary-bg-color), #000000 10%);
            }
          `
        };
      `;
    }
    case 'outline': {
      return `
        background-color: transparent;
        border: var(--border-sm) solid var(--pw-int-btn-secondary-border-color);
        color: var(--pw-int-btn-secondary-text-color);
        outline: none;
        ${
          !loading &&
          `
          &:hover {
            border: var(--border-sm) solid var(--pw-int-btn-secondary-border-hover-color);
            background-color: transparent;
          }
        
          &:active {
            border:  var(--border-sm) solid var(--pw-int-btn-secondary-border-active-color);
            background-color: transparent;
          }`
        };

        &:focus-visible {
          border: var(--border-sm) solid var(--pw-int-btn-secondary-border-focused-color);
          background-color: transparent;
        }
      `;
    }
  }
};

export const getButtonSizeStyles = ({
  iconOnly,
  size,
}: {
  iconOnly?: boolean;
  size: ButtonSize;
}): FlattenSimpleInterpolation => {
  if (size === 'extraSmall') {
    return css`
      /* Button tag container size css */

      ${iconOnly
        ? `
            border-radius: var(--pw-int-btn-xsmall-border-radius);
            gap: var(--spacing-none);
            height: 32px;
            width: 32px;
            padding: var(--spacing-none);
        `
        : `
            border-radius: var(--pw-int-btn-xsmall-border-radius);
            gap: var(--spacing-xxxs);
            height: 32px;
            padding: var(--spacing-xs) var(--spacing-sm);
            min-width: 100px;
      `}

      /* Button text size css */
      leading-trim: both;
      text-edge: cap;
      font-size: var(--pw-int-btn-xsmall-text-size);
      font-style: normal;
      font-weight: 500;
      line-height: 16px;

      [role='img'] {
        width: 16px;
        height: 16px;
      }
      [role='spinner'] {
        width: 10.66px;
        height: 10.66px;
      }

      .icon-text > span {
        height: 16px;
        width: 16px;
      }

      .icon-only > span {
        height: 16px;
        width: 16px;
      }
    `;
  }
  if (size === 'small') {
    return css`
      /* Button tag container size css */

      ${iconOnly
        ? `
            border-radius: var(--pw-int-btn-border-radius);
            gap: var(--spacing-none);
            height: 40px;
            width: 40px;
            padding: var(--spacing-none);
        `
        : `
            border-radius: var(--pw-int-btn-border-radius);
            gap: var(--spacing-xxxs);
            height: 40px;
            padding: var(--spacing-xs) var(--spacing-md);
            min-width: 100px;
      `}

      /* Button text size css */
      leading-trim: both;
      text-edge: cap;
      font-size: var(--pw-int-btn-small-text-size);
      font-style: normal;
      font-weight: 500;
      line-height: 16px;

      [role='img'] {
        width: 24px;
        height: 24px;
      }
      [role='spinner'] {
        width: 16px;
        height: 16px;
      }

      .icon-text > span {
        height: 16px;
        width: 16px;
      }

      .icon-only > span {
        height: 24px;
        width: 24px;
      }
    `;
  }

  return css`
    /* Button tag container size css */

    ${iconOnly
      ? `
          border-radius: var(--pw-int-btn-border-radius);
          gap: var(--spacing-none);
          height: 48px;
          width: 48px;
          padding: var(--spacing-none);
      `
      : `
          border-radius: var(--pw-int-btn-border-radius);
          gap: var(--spacing-xxxs);
          height: 48px;
          padding: var(--spacing-sm) var(--spacing-md);
          min-width: 100px;
    `}

    /* Button text size css */
    leading-trim: both;
    text-edge: cap;
    font-size: var(--pw-int-btn-medium-text-size);
    font-style: normal;
    font-weight: 500;
    line-height: 16px;

    [role='img'] {
      width: 24px;
      height: 24px;
    }
    [role='spinner'] {
      width: 16px;
      height: 16px;
    }

    .icon-text > span {
      height: 24px;
      width: 24px;
    }

    .icon-only > span {
      height: 24px;
      width: 24px;
    }
  `;
};
