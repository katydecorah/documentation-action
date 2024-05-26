import { readFile, readdir } from "fs/promises";
import { load } from "js-yaml";
import { getInput } from "@actions/core";
import { ActionConfig } from "./action";

export async function getWorkflow(): Promise<WorkflowConfig | undefined> {
  const exampleWorkflowFile: string = getInput("example-workflow-file");
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

export async function getWorkflows(): Promise<WorkflowConfig[] | undefined> {
  const exampleWorkflowFile: string = getInput("example-workflow-file");
  const additionalWorkflowFilePrefix: string = getInput(
    "additional-workflow-file-prefix"
  );
  try {
    const workflows = await readdir("./.github/workflows/");
    const additionalWorkflows = workflows.filter(
      (f) =>
        f.startsWith(additionalWorkflowFilePrefix) && f !== exampleWorkflowFile
    );

    if (additionalWorkflows.length === 0) return undefined;

    const workflowArray: WorkflowConfig[] = [];

    for (const workflow of additionalWorkflows) {
      const yaml = await readFile(`./.github/workflows/${workflow}`, "utf-8");
      workflowArray.push({
        yaml,
        json: load(yaml) as WorkflowJson,
      });
    }
    return workflowArray;
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

export type Input = {
  description: string;
  required?: boolean;
  type?: string;
  default?: string;
  deprecationMessage?: string;
  options?: string[];
};

export type Inputs = {
  [key: string]: Input;
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
