import { writeDocs } from "../write-docs";
import fs from "fs";

jest.mock("fs");

const exampleReadMe = `# documentation-action

A GitHub action to help document your GitHub actions.`;
const exampleDocs = `
## Set up the workflow

\`\`\`yml
name: Document Github action
on: release
\`\`\`
`;

describe("writeDocs", () => {
  test("with comments", async () => {
    jest.spyOn(fs, "readFileSync").mockImplementationOnce(
      () =>
        `${exampleReadMe} 

<!-- START GENERATED DOCUMENTATION --> 
Hello! 
<!-- END GENERATED DOCUMENTATION -->`
    );
    const writeMock = jest.spyOn(fs, "writeFileSync");
    writeDocs(exampleDocs, "README.md");
    expect(writeMock.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
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
  });

  test("without comments", async () => {
    jest.spyOn(fs, "readFileSync").mockImplementationOnce(() => exampleReadMe);
    const writeMock = jest.spyOn(fs, "writeFileSync");
    writeDocs(exampleDocs, "README.md");
    expect(writeMock.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
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
  });

  test("can't find file", async () => {
    jest.spyOn(fs, "readFileSync").mockImplementationOnce(() => undefined);
    try {
      writeDocs(exampleDocs, "README.md");
      // Fail test if above expression doesn't throw anything.
      expect(true).toBe(false);
    } catch (e) {
      expect(e.message).toBe(
        "Could not read the documentation file: README.md"
      );
    }
  });
});
