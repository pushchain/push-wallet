import { Theme, ThemeMode, ThemeOverrides } from './Theme.types';
import { colorSemantics } from './colors/colors.semantics';
import { sizeSemantics } from './sizes/sizes.semantics';
import { blurVariables } from './variables/variables.blur';
import { borderRadiusVariables } from './variables/variables.borderRadius';
import { borderSizeVariables } from './variables/variables.borderSize';
import { opacityVariables } from './variables/variables.opacity';
import { spacingVariables } from './variables/variables.spacing';

const getThemeColors = (mode: ThemeMode) =>
  Object.entries(colorSemantics).reduce((acc, [semanticName, sematicsVariants]) => {
    Object.entries(sematicsVariants).forEach(([variantKey, variantValue]) => {
      acc[`${semanticName}-${variantKey}` as keyof Theme['colors']] = variantValue[mode];
    });
    return acc;
  }, {} as Theme['colors']);

const getThemeSizes = () =>
  Object.entries(sizeSemantics).reduce((acc, [semanticName, sematicsVariants]) => {
    Object.entries(sematicsVariants).forEach(([variantKey, variantValue]) => {
      acc[`${semanticName}-${variantKey}`] = variantValue;
    });
    return acc;
  }, {} as Theme['size']);

export const createTheme = (mode: ThemeMode): Theme => ({
  colors: getThemeColors(mode),
  blur: blurVariables,
  borderRadius: borderRadiusVariables,
  borderSize: borderSizeVariables,
  opacity: opacityVariables,
  spacing: spacingVariables,
  size: getThemeSizes(),
});

export const getBlocksCSSVariables = (theme: Theme, themeMode: 'dark' | 'light', themeOverrides: ThemeOverrides = {}) => {
  const vars: Record<string, string> = {};
  const isLightMode = themeMode === 'light';
  const { light = {}, dark = {}, ...global } = themeOverrides || {};

  const activeOverrides = {
    ...global,                         // global values
    ...(isLightMode ? light : dark),  // mode-specific overrides take priority
  };


  // Flatten original theme
  Object.values(theme).forEach((section) => {
    Object.entries(section).forEach(([key, value]) => {
      vars[`--${key}`] = value;
    });
  });

  // Handle overrides
  Object.entries(activeOverrides).forEach(([key, value]) => {
    switch(key) {
      case '--pw-core-text-size': {
        const size = parseInt(value, 10);
        const px = (val: number) => `${Math.round(val)}px`;
        vars['--pw-int-text-heading-large-size'] = px(size);
        vars['--pw-int-text-heading-small-size'] = px(size * 0.75);
        vars['--pw-int-text-heading-xsmall-size'] = px(size * 0.7);
        vars['--pw-int-text-body-large-size'] = px(size * 0.6);
        vars['--pw-int-text-body-size'] = px(size * 0.55);
        vars['--pw-int-text-body-small-size'] = px(size * 0.45);
        vars['--pw-int-text-body-xsmall-size'] = px(size * 0.4);
        vars['--pw-int-btn-medium-text-size'] = px(size * 0.6);
        vars['--pw-int-btn-small-text-size'] = px(size * 0.55);
        vars['--pw-int-btn-xsmall-text-size'] = px(size * 0.45);
        break;
      }
      case '--pw-core-brand-primary-color': {
        vars['--pw-int-brand-primary-color'] = value;
        vars['--pw-int-brand-primary-subtle-color'] = isLightMode ? `color-mix(in srgb, ${value}, #ffffff 50%)` : value;
        vars['--pw-int-btn-secondary-border-hover-color'] = vars['--pw-int-brand-primary-subtle-color'];
        vars['--pw-int-btn-secondary-border-focused-color'] = vars['--pw-int-brand-primary-subtle-color'];
        vars['--pw-int-btn-secondary-border-active-color'] = vars['--pw-int-brand-primary-color']
        break;
      }
      case '--pw-core-text-primary-color': {
        vars['--pw-int-text-primary-color'] = value;
        vars['--pw-int-icon-primary-color'] = isLightMode ? `color-mix(in srgb, ${value}, #ffffff 3%)` : `color-mix(in srgb, ${value}, #ffffff 70%)`;
        vars['--pw-int-btn-secondary-text-color'] = vars['--pw-int-text-primary-color'];
        break;
      }
      case '--pw-core-text-secondary-color': {
        vars['--pw-int-text-secondary-color'] = value;
        vars['--pw-int-icon-secondary-color'] = isLightMode ? `color-mix(in srgb, ${value}, #ffffff 85%)` : `color-mix(in srgb, ${value}, #ffffff 95%)`;
        break;
      }
      case '--pw-core-text-tertiary-color': {
        vars['--pw-int-text-tertiary-color'] = value;
        vars['--pw-int-icon-tertiary-color'] = isLightMode ? `color-mix(in srgb, ${value}, #ffffff 40%)` : `color-mix(in srgb, ${value}, #000000 50%)`;
        break;
      }
      case '--pw-core-text-link-color': {
        vars['--pw-int-text-link-color'] = value;
        vars['--pw-int-icon-brand-color'] = isLightMode ? `color-mix(in srgb, ${value}, #ffffff 5%)` : `color-mix(in srgb, ${value}, #ffffff 15%)`;
        break;
      }
      case '--pw-core-success-primary-color': {
        vars['--pw-int-success-primary-color'] = value;
        vars['--pw-int-success-primary-subtle-color'] = isLightMode ? `color-mix(in srgb, ${value}, #ffffff 83%)` : `color-mix(in srgb, ${value}, #000000 40%)`;
        break;
      }
      case '--pw-core-btn-border-radius': {
        const size = parseInt(value, 10);
        const px = (val: number) => `${Math.round(val)}px`;
        vars['--pw-int-btn-border-radius'] = px(size);
        vars['--pw-int-btn-xsmall-border-radius'] = px(size * 0.65);
        break;
      }
      default: {
        vars[key.replace('core', 'int')] = value;
        break;
      }
    }
  });

  console.log(vars);

  return Object.entries(vars)
    .map(([key, value]) => `${key}: ${value};`)
    .join('\n');
}
