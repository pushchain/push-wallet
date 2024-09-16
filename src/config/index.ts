// load the appropriate config as per the server state
import { config as generalConfig } from './config-general.ts'
import { Config } from './config.types.ts'
import { config as localConfig } from './config-local.ts'
import { config as devConfig } from './config-dev.ts'
import { config as stageConfig } from './config-staging.ts'
import { config as prodConfig } from './config-prod.ts'
import { ENV } from '../constants.ts'

const env = import.meta.env.VITE_APP_ENV

// dynamic import
let dynamicConfig
switch (env) {
  case ENV.LOCAL: {
    dynamicConfig = localConfig
    break
  }
  case ENV.DEV: {
    dynamicConfig = devConfig
    break
  }
  case ENV.STAGING: {
    dynamicConfig = stageConfig
    break
  }
  case ENV.PROD: {
    dynamicConfig = prodConfig
    break
  }
  default: {
    dynamicConfig = stageConfig
  }
}

// combine config
const config: Config = { ...dynamicConfig, ...generalConfig }

export default config
