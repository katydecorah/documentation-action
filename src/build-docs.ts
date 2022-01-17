import { formatInputs } from "./format-inputs";

export function buildDocs({ exampleWorkflowYaml, action, release }) {
  let docs = `
## Set up the workflow

\`\`\`yml
${trimExampleWorkflow({ exampleWorkflowYaml, release })}
\`\`\`
`;
  // Document inputs, if they exist
  if ("inputs" in action) {
    docs += formatInputs(action.inputs);
  }
  return docs;
}

export function trimExampleWorkflow({ exampleWorkflowYaml, release }) {
  return exampleWorkflowYaml.replace("uses: ./", `uses: ${release}`);
}
