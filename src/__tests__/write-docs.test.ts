import { writeDocs } from "../write-docs";
import { promises } from "fs";
import { setOutput, setFailed } from "@actions/core";
import * as core from "@actions/core";

jest.mock("@actions/core");

const exampleReadMe = `# documentation-action

A GitHub action to help document your GitHub actions.`;
const exampleDocs = `
## Set up the workflow

\`\`\`yml
name: Document Github action
on: release
\`\`\`
`;

beforeEach(() => {
  jest.spyOn(core, "getInput").mockImplementation(() => "README.md");
});

describe("writeDocs", () => {
  test("with comments", async () => {
    jest.spyOn(promises, "readFile").mockImplementationOnce(
      async () => `${exampleReadMe} 

<!-- START GENERATED DOCUMENTATION --> 
Hello! 
<!-- END GENERATED DOCUMENTATION -->`
    );
    const writeMock = jest.spyOn(promises, "writeFile").mockImplementation();
    await writeDocs(exampleDocs);
    expect(writeMock.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "./README.md",
        "# documentation-action

      A GitHub action to help document your GitHub actions. 

      <!-- START GENERATED DOCUMENTATION -->

      ## Set up the workflow

      \`\`\`yml
      name: Document Github action
      on: release
      \`\`\`
      <!-- END GENERATED DOCUMENTATION -->",
      ]
    `);
    expect(setOutput).toHaveBeenCalledWith("update", "true");
  });

  test("without comments", async () => {
    jest
      .spyOn(promises, "readFile")
      .mockImplementationOnce(async () => exampleReadMe);
    const writeMock = jest.spyOn(promises, "writeFile").mockImplementation();
    await writeDocs(exampleDocs);
    expect(writeMock.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "./README.md",
        "# documentation-action

      A GitHub action to help document your GitHub actions.

      <!-- START GENERATED DOCUMENTATION -->

      ## Set up the workflow

      \`\`\`yml
      name: Document Github action
      on: release
      \`\`\`
      <!-- END GENERATED DOCUMENTATION -->
      ",
      ]
    `);
    expect(setOutput).toHaveBeenCalledWith("update", "true");
  });

  test("no changes", async () => {
    jest.spyOn(promises, "readFile").mockImplementationOnce(
      async () => `# documentation-action
A GitHub action to help document your GitHub actions.
<!-- START GENERATED DOCUMENTATION -->
## Set up the workflow<!-- END GENERATED DOCUMENTATION -->`
    );
    const writeMock = jest.spyOn(promises, "writeFile").mockImplementation();
    await writeDocs(`## Set up the workflow`);
    expect(writeMock).not.toHaveBeenCalled();
    expect(setOutput).toHaveBeenCalledWith("update", "false");
  });

  test("can't find file", async () => {
    jest.spyOn(promises, "readFile").mockImplementationOnce(() => undefined);
    await writeDocs(exampleDocs);
    expect(setFailed).toHaveBeenCalledWith(
      "Could not read the documentation file: README.md"
    );
  });
});
