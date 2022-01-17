import { exportVariable } from "@actions/core";
import { readFileSync, writeFileSync } from "fs";

export function writeDocs(doc: string, documentationFile: string) {
  const readme = readFileSync(`./${documentationFile}`, "utf-8");
  if (!readme)
    throw new Error(
      `Could not read the documentation file: ${documentationFile}`
    );
  const comment = {
    start: `<!-- START GENERATED DOCUMENTATION -->`,
    end: `<!-- END GENERATED DOCUMENTATION -->`,
  };
  const preparedDocs = commentedDocs(comment, doc);
  const regex = new RegExp(`${comment.start}([\\s\\S]*?)${comment.end}`, "gm");
  const oldFile = readme.match(regex);
  let newFile: string;
  if (oldFile) {
    // Find and replace generated documentation
    newFile = readme.replace(oldFile[0].toString(), preparedDocs);
    // If there are no changes to documentation, return early.
    if (oldFile[0].toString() === newFile) {
      exportVariable("UpdateDocumentation", false);
      return;
    }
  } else {
    // If we can't find the comments, then append documentation to the bottom of the page.
    newFile = `${readme}

${preparedDocs}
`;
  }
  exportVariable("UpdateDocumentation", true);
  writeFileSync(`./${documentationFile}`, newFile);
}

function commentedDocs(comment: { start: string; end: string }, doc: string) {
  return `${comment.start}
${doc}${comment.end}`;
}
