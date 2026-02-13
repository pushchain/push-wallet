import { initWaaP } from '@human.tech/waap-sdk';
import { waapInitConfig } from './waap.config';

let waapInitialized = false;

export const ensureWaapInit = (isDarkMode: boolean) => {
  if (typeof window === 'undefined') return;
  if (waapInitialized) return;

  initWaaP(waapInitConfig(isDarkMode));
  waapInitialized = true;
};