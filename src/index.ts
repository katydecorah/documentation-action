import { readFileSync } from "fs";
import { load } from "js-yaml";
import { getInput, setFailed } from "@actions/core";
import { writeDocs } from "./write-docs";
import { buildDocs } from "./build-docs";

type ActionConfig = {
  name: string;
  author: string;
  description: string;
  runs: {
    using: string;
    main: string;
  };
  inputs: {
    [input: string]: {
      description: string;
      default?: string;
      required?: boolean;
    };
  };
};

async function docs() {
  try {
    const exampleWorkflowFile: string = getInput("exampleWorkflowFile");
    const exampleWorkflowYaml: string = readFileSync(
      `./.github/workflows/${exampleWorkflowFile}`,
      "utf8"
    );
    const documentationFile: string = getInput("documentationFile");
    const actionConfig: string = readFileSync("./action.yml", "utf8");
    const action = load(actionConfig) as ActionConfig;
    const { version } = JSON.parse(readFileSync("./package.json", "utf-8"));
    const release = `${process.env.GITHUB_REPOSITORY}@v${version}`;
    const docs = buildDocs({ exampleWorkflowYaml, action, release });
    writeDocs(docs, documentationFile);
  } catch (error) {
    setFailed(error.message);
  }
}

export function formatInputs(inputs: ActionConfig["inputs"]) {
  const formattedInputs = Object.keys(inputs)
    .map(
      (key) =>
        `- \`${key}\`: ${inputs[key].required ? "Required. " : ""}${
          inputs[key].description
        }${
          inputs[key].default ? ` Default: \`${inputs[key].default}\`.` : ""
        }\n`
    )
    .join("");
  return `
### Action options

${formattedInputs}`;
}

export default docs();
