// load the appropriate config as per the server state
import { config as generalConfig } from './config-general.ts'
import { Config } from './config.types.ts'

const env = import.meta.env.VITE_APP_ENV

// dynamic import
const dynamicConfigModule = await import(/* @vite-ignore */ `./config-${env}`)
const dynamicConfig = dynamicConfigModule.config

// combine config
const config: Config = { ...dynamicConfig, ...generalConfig }

export default config
