import { initWaaP } from '@human.tech/waap-sdk';

export type WaaPConfig = Parameters<typeof initWaaP>[0];

export const waapInitConfig: WaaPConfig = {
  config: {
    authenticationMethods: ['social', 'email', 'phone'],
    allowedSocials: ['google', 'twitter', 'discord', 'github'],
    showSecured: true,
  },
  useStaging: false,
};