import { readFileSync } from "fs";
import { load } from "js-yaml";
import { getInput, setFailed } from "@actions/core";
import { writeDocs } from "./write-docs";
import { buildDocs } from "./build-docs";

/**
 * As defined by:
 * https://docs.github.com/en/actions/creating-actions/metadata-syntax-for-github-actions
 */
export type ActionConfig = {
  name: string;
  author: string;
  description: string;
  runs: {
    using: string;
    main: string;
  };
  inputs: {
    /** A string identifier to associate with the input. */
    [input: string]: {
      /** A string description of the input parameter. */
      description: string;
      /** A boolean to indicate whether the action requires the input parameter. */
      required: boolean;
      /** A string representing the default value. */
      default?: string;
      /** If the input parameter is used, this string is logged as a warning message. */
      deprecationMessage?: string;
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

export default docs();
