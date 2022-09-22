import { getWorkflow, getActionConfig, getRelease } from "../get-metadata";
import * as core from "@actions/core";
import { promises } from "fs";

jest.mock("@actions/core");

describe("getWorkflow", () => {
  test("works", async () => {
    jest.spyOn(core, "getInput").mockImplementation(() => "README.md");
    const readFileSpy = jest.spyOn(promises, "readFile").mockImplementation();
    await getWorkflow();
    expect(readFileSpy).toHaveBeenCalledWith(
      "./.github/workflows/README.md",
      "utf-8"
    );
  });
  test("fails", async () => {
    jest.spyOn(promises, "readFile").mockRejectedValue("Error");
    return expect(getWorkflow()).rejects.toMatchInlineSnapshot(
      `[Error: Error]`
    );
  });
});

describe("getActionConfig", () => {
  test("works", async () => {
    const readFileSpy = jest.spyOn(promises, "readFile").mockImplementation();
    await getActionConfig();
    expect(readFileSpy).toHaveBeenCalledWith("./action.yml", "utf-8");
  });
  test("fails", async () => {
    jest.spyOn(promises, "readFile").mockRejectedValue("Error");
    return expect(getActionConfig()).rejects.toMatchInlineSnapshot(
      `[Error: Error]`
    );
  });
});

describe("getRelease", () => {
  test("works", async () => {
    process.env.GITHUB_REPOSITORY = "katydecorah/documentation-action";
    jest
      .spyOn(promises, "readFile")
      .mockResolvedValueOnce('{"version": "1.2.0"}');
    expect(await getRelease()).toEqual(
      "katydecorah/documentation-action@v1.2.0"
    );
  });
  test("fails", async () => {
    jest.spyOn(promises, "readFile").mockResolvedValueOnce("");
    return expect(getRelease()).rejects.toMatchInlineSnapshot(
      `[Error: SyntaxError: Unexpected end of JSON input]`
    );
  });
});
