import { formatInputs } from "../index";
import { readFileSync } from "fs";
import { load } from "js-yaml";

const action = load(readFileSync("./action.yml", "utf-8"));

describe("formatInputs", () => {
  test("", () => {
    expect(formatInputs(action.inputs)).toMatchInlineSnapshot(`
      "
      ### Action options

      - \`exampleWorkflowFile\`: The example workflow file in \`.github/workflows/\` Default: \`example.yml\`.
      - \`documentationFile\`: The file where the action will write and update documentation for the action. Default: \`README.md\`.
      "
    `);
  });
});
