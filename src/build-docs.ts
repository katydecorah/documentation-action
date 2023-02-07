import { formatInputs, formatWorkflowInputs } from "./format-inputs";
import { ActionConfig } from "./action";
import { WorkflowConfig, WorkflowJson } from "./get-metadata";

export function buildDocs({
  workflow,
  action,
  release,
  additionalWorkflows,
}: {
  workflow: WorkflowConfig;
  action: ActionConfig;
  release: string;
  additionalWorkflows?: WorkflowConfig[];
}): string {
  let docs = documentSetup(workflow, release);
  if (additionalWorkflows)
    docs += documentAdditionalWorkflows(additionalWorkflows, release);
  // Document inputs, if they exist
  docs += documentActionInputs(action) || "";
  // Document workflow inputs, if they exist
  docs += documentWorkflowInputs(workflow.json) || "";
  return docs;
}

export function trimExampleWorkflow({ workflow, release }): string {
  return workflow.replace("uses: ./", `uses: ${release}`).trim();
}

function documentSetup(workflow: WorkflowConfig, release: string): string {
  return `
## Set up the workflow

To use this action, create a new workflow in \`.github/workflows\` and modify it as needed:

\`\`\`yml
${trimExampleWorkflow({ workflow: workflow.yaml, release })}
\`\`\``;
}

function documentAdditionalWorkflows(
  additionalWorkflows: WorkflowConfig[],
  release: string
): string {
  return `

### Additional example workflows

${additionalWorkflows
  .map(
    (workflow) => `<details>
<summary>${workflow.json.name}</summary>

\`\`\`yml
${trimExampleWorkflow({ workflow: workflow.yaml, release })}
\`\`\`

</details>`
  )
  .join("\n\n")}
`;
}

function documentActionInputs(action: ActionConfig): string | undefined {
  if (!action.inputs) return;
  return `

## Action options

${formatInputs(action.inputs)}`;
}

function documentWorkflowInputs(workflow: WorkflowJson): string | undefined {
  if (!workflow.on.workflow_dispatch || !workflow.on.workflow_dispatch.inputs)
    return;
  return `
## Trigger the action

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
