import {
  outlineButtonSemantics,
  primaryButtonSemantics,
} from '../semantics/semantics.button';
import { iconSemantics } from '../semantics/semantics.icon';
import { strokeSemantics } from '../semantics/semantics.stroke';
import { surfaceSemantics } from '../semantics/semantics.surface';
import { textColorSemantics } from '../semantics/semantics.text';
import { spinnerSemantics } from '../semantics/semantics.spinner';
import { stateSemantics } from '../semantics/semantics.state';
import { brandSemantics } from '../semantics/semantics.brand';

// TODO: find a better way to do this in future
type SemanticKeys = {
  global: 'pw-int',
  brand: 'pw-int-brand',
  buttonPrimary: 'pw-int-btn-primary',
  buttonOutline: 'pw-int-btn-secondary',
  text: 'pw-int-text';
  icon: 'pw-int-icon';
  surface: 'pw-int-bg';
  stroke: 'pw-int-border';
  spinner: 'pw-int-spinner';
};

export const semanticKeys: SemanticKeys = {
  global: 'pw-int',
  brand: 'pw-int-brand',
  buttonPrimary: 'pw-int-btn-primary',
  buttonOutline: 'pw-int-btn-secondary',
  text: 'pw-int-text',
  icon: 'pw-int-icon',
  surface: 'pw-int-bg',
  stroke: 'pw-int-border',
  spinner: 'pw-int-spinner',
};

export const colorSemantics = {
  [semanticKeys.global]: stateSemantics,
  [semanticKeys.brand]: brandSemantics,
  [semanticKeys.buttonPrimary]: primaryButtonSemantics,
  [semanticKeys.buttonOutline]: outlineButtonSemantics,
  [semanticKeys.text]: textColorSemantics,
  [semanticKeys.icon]: iconSemantics,
  [semanticKeys.surface]: surfaceSemantics,
  [semanticKeys.stroke]: strokeSemantics,
  [semanticKeys.spinner]: spinnerSemantics,
};
