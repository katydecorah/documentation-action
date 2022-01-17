import { buildDocs, trimExampleWorkflow } from "../build-docs";
import { readFileSync } from "fs";
import { load } from "js-yaml";

const action = load(readFileSync("./action.yml", "utf-8"));
const exampleWorkflowYaml = readFileSync(
  "./.github/workflows/example.yml",
  "utf-8"
);

describe("buildDocs", () => {
  test("with inputs", () => {
    expect(
      buildDocs({
        exampleWorkflowYaml,
        release: "katydecorah/documentation-action@v0.1.0",
        action,
      })
    ).toMatchInlineSnapshot(`
      "
      ## Set up the workflow

      \`\`\`yml
      name: Document Github action
      on: release

      jobs:
        document_action:
          runs-on: macOS-latest
          name: Write documentation
          steps:
            - name: Checkout
              uses: actions/checkout@v2
            - name: Documentation action
              uses: katydecorah/documentation-action@v0.1.0
            - name: Commit files
              run: |
                git config --local user.email \\"action@github.com\\"
                git config --local user.name \\"GitHub Action\\"
                git add -A && git commit -m \\"Updated README.md\\"
                git push \\"https://\${GITHUB_ACTOR}:\${{secrets.GITHUB_TOKEN}}@github.com/\${GITHUB_REPOSITORY}.git\\" HEAD:\${GITHUB_REF}

      \`\`\`

      ### Action options

      - \`exampleWorkflowFile\`: The example workflow file in \`.github/workflows/\` Default: \`example.yml\`.
      - \`documentationFile\`: The file where the action will write and update documentation for the action. Default: \`README.md\`.
      "
    `);
  });
  test("without inputs", () => {
    expect(
      buildDocs({
        exampleWorkflowYaml,
        release: "katydecorah/documentation-action@v0.1.0",
        action: {},
      })
    ).toMatchInlineSnapshot(`
      "
      ## Set up the workflow

      \`\`\`yml
      name: Document Github action
      on: release

      jobs:
        document_action:
          runs-on: macOS-latest
          name: Write documentation
          steps:
            - name: Checkout
              uses: actions/checkout@v2
            - name: Documentation action
              uses: katydecorah/documentation-action@v0.1.0
            - name: Commit files
              run: |
                git config --local user.email \\"action@github.com\\"
                git config --local user.name \\"GitHub Action\\"
                git add -A && git commit -m \\"Updated README.md\\"
                git push \\"https://\${GITHUB_ACTOR}:\${{secrets.GITHUB_TOKEN}}@github.com/\${GITHUB_REPOSITORY}.git\\" HEAD:\${GITHUB_REF}

      \`\`\`
      "
    `);
  });
});

test("trimExampleWorkflow", () => {
  expect(
    trimExampleWorkflow({
      exampleWorkflowYaml,
      release: "katydecorah/documentation-action@v0.1.0",
    })
  ).toMatchInlineSnapshot(`
    "name: Document Github action
    on: release

    jobs:
      document_action:
        runs-on: macOS-latest
        name: Write documentation
        steps:
          - name: Checkout
            uses: actions/checkout@v2
          - name: Documentation action
            uses: katydecorah/documentation-action@v0.1.0
          - name: Commit files
            run: |
              git config --local user.email \\"action@github.com\\"
              git config --local user.name \\"GitHub Action\\"
              git add -A && git commit -m \\"Updated README.md\\"
              git push \\"https://\${GITHUB_ACTOR}:\${{secrets.GITHUB_TOKEN}}@github.com/\${GITHUB_REPOSITORY}.git\\" HEAD:\${GITHUB_REF}
    "
  `);
});
