import { formatInputs, showRequired } from "./format-inputs";
import { ActionConfig } from "./action";
import { Inputs, WorkflowConfig, WorkflowJson } from "./get-metadata";

export function buildDocs({
  workflow,
  action,
  release,
}: {
  workflow: WorkflowConfig;
  action: ActionConfig;
  release: string;
}): string {
  let docs = `
## Set up the workflow

To use this action, create a new workflow in \`.github/workflows\` and modify it as needed:

\`\`\`yml
${trimExampleWorkflow({ workflow: workflow.yaml, release })}
\`\`\``;
  // Document inputs, if they exist
  if ("inputs" in action) {
    docs += `

## Action options

${formatInputs(action.inputs)}`;
  }

  // Document workflow inputs, if they exist
  if (workflowDispatchInputs(workflow.json)) {
    docs += workflowDispatchInputs(workflow.json);
  }
  return docs;
}

export function trimExampleWorkflow({ workflow, release }): string {
  return workflow.replace("uses: ./", `uses: ${release}`).trim();
}

export function workflowDispatchInputs(workflow: WorkflowJson) {
  if (!workflow.on.workflow_dispatch || !workflow.on.workflow_dispatch.inputs)
    return;
  return `## Trigger the workflow

To trigger the action, [create a workflow dispatch event](https://docs.github.com/en/rest/actions/workflows#create-a-workflow-dispatch-event) with the following body parameters:

\`\`\`js
{ 
  "ref": "main", // Required. The git reference for the workflow, a branch or tag name.
  "inputs": {
    ${formatWorkflowInputs(workflow.on.workflow_dispatch.inputs)}
  }
}
\`\`\`
  `;
}

function formatWorkflowInputs(inputs: Inputs) {
  return Object.keys(inputs)
    .map((key) => {
      return `"${key}": "", // ${showRequired(inputs[key].required)} ${
        inputs[key].description
      }.`;
    })
    .join("\n");
}
