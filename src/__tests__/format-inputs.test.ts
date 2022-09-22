import { formatInputs } from "../format-inputs";
import { readFileSync } from "fs";
import { load } from "js-yaml";
import { ActionConfig } from "../action";

const action = load(readFileSync("./action.yml", "utf-8")) as ActionConfig;

describe("formatInputs", () => {
  test("generated from action.yml", () => {
    expect(formatInputs(action.inputs)).toMatchInlineSnapshot(`
      "- \`exampleWorkflowFile\`: The example workflow file in \`.github/workflows/\` Default: \`example.yml\`.
      - \`documentationFile\`: The file where the action will write and update documentation for the action. Default: \`README.md\`.
      "
    `);
  });
  test("required and deprecation notice", () => {
    expect(
      formatInputs({
        documentationFile: {
          description:
            "The file where the action will write and update documentation for the action.",
          required: true,
        },

        docFile: {
          description:
            "The file where the action will write and update documentation for the action.",
          deprecationMessage:
            "This input is now deprecated, use `docFile` instead.",
        },
      })
    ).toMatchInlineSnapshot(`
      "- \`documentationFile\`: Required. The file where the action will write and update documentation for the action.
      - \`docFile\`: The file where the action will write and update documentation for the action. Deprecation warning: \`This input is now deprecated, use \`docFile\` instead.\`
      "
    `);
  });
});
