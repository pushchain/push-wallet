/**
 * SUPPORTED ENVIRONEMENTS
 */
export enum ENV {
  PROD = 'prod',
  STAGING = 'staging',
  DEV = 'dev',
  /**
   * **This is for local development only**
   */
  LOCAL = 'local',
}

/**
 * WALLET STATES
 */
export enum WALLET_STATE {
  UNINITIALIZED,
  SIGNUP,
  LOGIN,
  INITIALIZED,
}
