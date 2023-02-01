import { buildDocs, trimExampleWorkflow } from "../build-docs";
import { readFileSync } from "fs";
import { load } from "js-yaml";
import { ActionConfig } from "../action";
import { WorkflowConfig, WorkflowJson } from "../get-metadata";

const action = load(readFileSync("./action.yml", "utf-8")) as ActionConfig;
const workflowYaml = readFileSync(
  "./.github/workflows/example.yml",
  "utf-8"
) as string;
const workflowWithInputsYaml = readFileSync(
  "./.github/workflows/test-with-inputs.yml",
  "utf-8"
) as string;

const workflow: WorkflowConfig = {
  yaml: workflowYaml,
  json: load(workflowYaml) as WorkflowJson,
};

const workflowWithInputs: WorkflowConfig = {
  yaml: workflowWithInputsYaml,
  json: load(workflowWithInputsYaml) as WorkflowJson,
};

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

      permissions:
        contents: write

      on:
        workflow_dispatch:
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
                git pull
                git config --local user.email "action@github.com"
                git config --local user.name "GitHub Action"
                git commit -am "Update documentation"
                git push
      \`\`\`

      ## Action options

      - \`exampleWorkflowFile\`: The example workflow file in \`.github/workflows/\` Default: \`example.yml\`.

      - \`additionalWorkflowFilePrefix\`: To include additional workflow files, save them with this prefix in \`.github/workflow/\`. Default: \`example\`.

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

      permissions:
        contents: write

      on:
        workflow_dispatch:
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
                git pull
                git config --local user.email "action@github.com"
                git config --local user.name "GitHub Action"
                git commit -am "Update documentation"
                git push
      \`\`\`"
    `);
  });

  test("with workflow inputs", () => {
    expect(
      buildDocs({
        workflow: workflowWithInputs,
        release: "katydecorah/documentation-action@v0.1.0",
        action,
      })
    ).toMatchInlineSnapshot(`
      "
      ## Set up the workflow

      To use this action, create a new workflow in \`.github/workflows\` and modify it as needed:

      \`\`\`yml
      name: Document GitHub action (test)

      on:
        workflow_dispatch:
          inputs:
            bookIsbn:
              description: The book's ISBN.
              required: true
              type: string
            notes:
              description: Notes about the book.
              type: string

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
                git pull
                git config --local user.email "action@github.com"
                git config --local user.name "GitHub Action"
                git commit -am "Update documentation"
                git push
      \`\`\`

      ## Action options

      - \`exampleWorkflowFile\`: The example workflow file in \`.github/workflows/\` Default: \`example.yml\`.

      - \`additionalWorkflowFilePrefix\`: To include additional workflow files, save them with this prefix in \`.github/workflow/\`. Default: \`example\`.

      - \`documentationFile\`: The file where the action will write and update documentation for the action. Default: \`README.md\`.

      ## Trigger the action

      To trigger the action, [create a workflow dispatch event](https://docs.github.com/en/rest/actions/workflows#create-a-workflow-dispatch-event) with the following body parameters:

      \`\`\`js
      { 
        "ref": "main", // Required. The git reference for the workflow, a branch or tag name.
        "inputs": {
          "bookIsbn": "", // Required. The book's ISBN.
          "notes": "", // Notes about the book.
        }
      }
      \`\`\`
      "
    `);
  });
});

test("trimExampleWorkflow", () => {
  expect(
    trimExampleWorkflow({
      workflow: workflow.yaml,
      release: "katydecorah/documentation-action@v0.1.0",
    })
  ).toMatchInlineSnapshot(`
    "name: Document GitHub action

    permissions:
      contents: write

    on:
      workflow_dispatch:
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
              git pull
              git config --local user.email "action@github.com"
              git config --local user.name "GitHub Action"
              git commit -am "Update documentation"
              git push"
  `);
});
