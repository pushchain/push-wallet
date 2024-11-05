// build.mjs
import fs from "fs";
import dotenv from "dotenv";
const envFilePath = ".env";

const initiatePreDeploymentFlow = (deploymentType) => {
  // Load existing environment variables
  const envConfig = dotenv.parse(fs.readFileSync(envFilePath));

  envConfig.VITE_DEV_MODE = deploymentType; // Update the deployment type

  console.log("VITE_DEV_MODE set to", deploymentType);

  // Convert the envConfig object back to a string
  const updatedEnv = Object.entries(envConfig)
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  // Write the updated content to .env file
  fs.writeFileSync(envFilePath, updatedEnv, { encoding: "utf8" });
};

const args = process.argv.slice(2);
await initiatePreDeploymentFlow(args[0]);
