import { readFile } from "fs/promises";
import { load } from "js-yaml";
import { getInput, setFailed } from "@actions/core";
import { ActionConfig } from "./action";

export async function getWorkflow() {
  const exampleWorkflowFile: string = getInput("exampleWorkflowFile");
  try {
    return await readFile(
      `./.github/workflows/${exampleWorkflowFile}`,
      "utf-8"
    );
  } catch (error) {
    setFailed(error.message);
  }
}

export async function getActionConfig() {
  try {
    const actionConfig = await readFile("./action.yml", "utf-8");
    return load(actionConfig) as ActionConfig;
  } catch (error) {
    setFailed(error.message);
  }
}

export async function getRelease() {
  try {
    const { version } = JSON.parse(await readFile("./package.json", "utf-8"));
    return `${process.env.GITHUB_REPOSITORY}@v${version}`;
  } catch (error) {
    setFailed(error.message);
  }
}
