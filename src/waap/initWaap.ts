import { initWaaP } from '@human.tech/waap-sdk';
import { waapInitConfig } from './waap.config';

let waapInitialized = false;

export const ensureWaapInit = () => {
  if (typeof window === 'undefined') return;
  if (waapInitialized) return;

  initWaaP(waapInitConfig);
  waapInitialized = true;
};