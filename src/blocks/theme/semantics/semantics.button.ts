import { colorBrands } from '../colors/colors.brands';
import { colorPrimitives } from '../colors/colors.primitives';
import { brandSemantics } from './semantics.brand';
import { strokeSemantics } from './semantics.stroke';
import { textColorSemantics } from './semantics.text';

export const buttonSemantics = {
  'medium-text-size': '16px',
  'small-text-size': '14px',
  'xsmall-text-size': '12px',
  'border-radius': '12px',
  'xsmall-border-radius': '8px',
}

export const primaryButtonSemantics = {
  'bg-color': { light: colorBrands['primary-500'], dark: colorBrands['primary-500'] },
  'text-color': { light: colorPrimitives['white-100'], dark: colorPrimitives['white-100'] },
};

export const outlineButtonSemantics = {
  'border-color': { light: strokeSemantics['tertiary-color'].light, dark: strokeSemantics['tertiary-color'].dark },
  'text-color': { light: textColorSemantics['primary-color'].light, dark: textColorSemantics['primary-color'].dark },
  'border-hover-color': { light: brandSemantics['primary-subtle-color'].light, dark: brandSemantics['primary-subtle-color'].dark },
  'border-focused-color': { light: brandSemantics['primary-subtle-color'].light, dark: brandSemantics['primary-subtle-color'].dark },
  'border-active-color': { light: brandSemantics['primary-color'].light, dark: brandSemantics['primary-color'].dark },
};
