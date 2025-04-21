const dotenv = require('dotenv');
const Joi = require('joi');
const path = require('path');

// Load .env into process.env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Define schema
const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('production', 'development').default('development'),
  HOST: Joi.string().default('0.0.0.0'),
  PORT: Joi.number().default(8080),
  HEARTBEAT_INTERVAL: Joi.number().default(30000),
}).unknown();

// Validate
const { value: envVars, error } = envSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

// Export
module.exports = {
  env: envVars.NODE_ENV,
  host: envVars.HOST,
  port: envVars.PORT,
  heartbeatInterval: envVars.HEARTBEAT_INTERVAL,
};