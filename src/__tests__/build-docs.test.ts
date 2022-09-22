import { buildDocs, trimExampleWorkflow } from "../build-docs";
import { readFileSync } from "fs";
import { load } from "js-yaml";
import { ActionConfig } from "../action";

const action = load(readFileSync("./action.yml", "utf-8")) as ActionConfig;
const workflow = readFileSync("./.github/workflows/example.yml", "utf-8");

describe("buildDocs", () => {
  test("with inputs", () => {
    expect(
      buildDocs({
        workflow,
        release: "katydecorah/documentation-action@v0.1.0",
        action,
      })
    ).toMatchInlineSnapshot(`
      "
      ## Set up the workflow

      To use this action, create a new workflow in \`.github/workflows\` and modify it as needed:

      \`\`\`yml
      name: Document GitHub action

      on:
        push:
          paths:
            - ".github/workflows/example.yml"
            - "action.yml"
            - "package.json"
            - "README.md"

      jobs:
        document_action:
          runs-on: macOS-latest
          name: Write documentation
          steps:
            - name: Checkout
              uses: actions/checkout@v3
            - name: Documentation action
              uses: katydecorah/documentation-action@v0.1.0
            - name: Commit files
              if: env.UpdateDocumentation == 'true'
              run: |
                git config --local user.email "action@github.com"
                git config --local user.name "GitHub Action"
                git commit -am "Update documentation"
                git push
      \`\`\`

      ## Action options

      - \`exampleWorkflowFile\`: The example workflow file in \`.github/workflows/\` Default: \`example.yml\`.

      - \`documentationFile\`: The file where the action will write and update documentation for the action. Default: \`README.md\`.

      "
    `);
  });
  test("without inputs", () => {
    expect(
      buildDocs({
        workflow,
        release: "katydecorah/documentation-action@v0.1.0",
        action: {},
      })
    ).toMatchInlineSnapshot(`
      "
      ## Set up the workflow

      To use this action, create a new workflow in \`.github/workflows\` and modify it as needed:

      \`\`\`yml
      name: Document GitHub action

      on:
        push:
          paths:
            - ".github/workflows/example.yml"
            - "action.yml"
            - "package.json"
            - "README.md"

      jobs:
        document_action:
          runs-on: macOS-latest
          name: Write documentation
          steps:
            - name: Checkout
              uses: actions/checkout@v3
            - name: Documentation action
              uses: katydecorah/documentation-action@v0.1.0
            - name: Commit files
              if: env.UpdateDocumentation == 'true'
              run: |
                git config --local user.email "action@github.com"
                git config --local user.name "GitHub Action"
                git commit -am "Update documentation"
                git push
      \`\`\`"
    `);
  });
});

test("trimExampleWorkflow", () => {
  expect(
    trimExampleWorkflow({
      workflow,
      release: "katydecorah/documentation-action@v0.1.0",
    })
  ).toMatchInlineSnapshot(`
    "name: Document GitHub action

    on:
      push:
        paths:
          - ".github/workflows/example.yml"
          - "action.yml"
          - "package.json"
          - "README.md"

    jobs:
      document_action:
        runs-on: macOS-latest
        name: Write documentation
        steps:
          - name: Checkout
            uses: actions/checkout@v3
          - name: Documentation action
            uses: katydecorah/documentation-action@v0.1.0
          - name: Commit files
            if: env.UpdateDocumentation == 'true'
            run: |
              git config --local user.email "action@github.com"
              git config --local user.name "GitHub Action"
              git commit -am "Update documentation"
              git push"
  `);
});
