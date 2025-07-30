import {
    buttonSemantics,
} from '../semantics/semantics.button';
import { listSemantics } from '../semantics/semantics.list';
import { modalSemantics } from '../semantics/semantics.modal';
import { textSemantics } from '../semantics/semantics.text';

// TODO: find a better way to do this in future
type SemanticKeys = {
  button: 'pw-int-btn',
  text: 'pw-int-text',
  modal: 'pw-int-modal',
  list: 'pw-int-list',
};

export const semanticKeys: SemanticKeys = {
  button: 'pw-int-btn',
  text: 'pw-int-text',
  modal: 'pw-int-modal',
  list: 'pw-int-list',
};

export const sizeSemantics = {
  [semanticKeys.button]: buttonSemantics,
  [semanticKeys.text]: textSemantics,
  [semanticKeys.modal]: modalSemantics,
  [semanticKeys.list]: listSemantics,
};
