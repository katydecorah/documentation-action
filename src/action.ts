import { setFailed } from "@actions/core";
import { writeDocs } from "./write-docs";
import { buildDocs } from "./build-docs";
import { getWorkflow, getActionConfig, getRelease } from "./get-metadata";

export async function docs() {
  try {
    // Get workflow metadata
    const [workflow, action, release] = await Promise.all([
      getWorkflow(),
      getActionConfig(),
      getRelease(),
    ]);

    if (!workflow || !action || !release) {
      setFailed("Unable to get action metadata");
      return;
    }
    // Build docs
    const docs = buildDocs({ workflow, action, release });
    // Write docs
    await writeDocs(docs);
  } catch (error) {
    setFailed(error);
  }
}

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
      required?: boolean;
      /** A string representing the default value. */
      default?: string;
      /** If the input parameter is used, this string is logged as a warning message. */
      deprecationMessage?: string;
    };
  };
};
