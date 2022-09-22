import { readFile } from "fs/promises";
import { load } from "js-yaml";
import { getInput } from "@actions/core";
import { ActionConfig } from "./action";

export async function getWorkflow(): Promise<WorkflowConfig | undefined> {
  const exampleWorkflowFile: string = getInput("exampleWorkflowFile");
  try {
    const yaml = await readFile(
      `./.github/workflows/${exampleWorkflowFile}`,
      "utf-8"
    );
    return {
      yaml,
      json: load(yaml) as WorkflowJson,
    };
  } catch (error) {
    throw new Error(error);
  }
}

export async function getActionConfig(): Promise<ActionConfig> {
  try {
    const actionConfig = await readFile("./action.yml", "utf-8");
    return load(actionConfig) as ActionConfig;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getRelease(): Promise<string> {
  try {
    const { version } = JSON.parse(await readFile("./package.json", "utf-8"));
    return `${process.env.GITHUB_REPOSITORY}@v${version}`;
  } catch (error) {
    throw new Error(error);
  }
}

export type WorkflowConfig = {
  yaml: string;
  json: WorkflowJson;
};

export type Inputs = {
  [key: string]: {
    description: string;
    required: boolean;
    type: string;
  };
};

export type WorkflowJson = {
  name: string;
  on: {
    push: {
      paths: string[];
    };
    workflow_dispatch?: {
      inputs?: Inputs;
    };
  };
  jobs: Record<string, unknown>;
};
