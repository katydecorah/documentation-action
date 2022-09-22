import { formatInputs } from "./format-inputs";
import { ActionConfig } from "./action";

export function buildDocs({
  workflow,
  action,
  release,
}: {
  workflow: string;
  action: ActionConfig;
  release: string;
}): string {
  let docs = `
## Set up the workflow

To use this action, create a new workflow in \`.github/workflows\` and modify it as needed:

\`\`\`yml
${trimExampleWorkflow({ workflow, release })}
\`\`\``;
  // Document inputs, if they exist
  if ("inputs" in action) {
    docs += `

## Action options

${formatInputs(action.inputs)}`;
  }
  return docs;
}

export function trimExampleWorkflow({ workflow, release }): string {
  return workflow.replace("uses: ./", `uses: ${release}`).trim();
}
