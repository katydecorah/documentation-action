import { docs } from "../action";
import { readFileSync, promises } from "fs";
import * as GetMetadata from "../get-metadata";
import * as BuildDocs from "../build-docs";
import { load } from "js-yaml";
import { setFailed } from "@actions/core";
import * as core from "@actions/core";

jest.mock("@actions/core");

const action = load(readFileSync("./action.yml", "utf-8"));
const workflow = readFileSync("./.github/workflows/example.yml", "utf-8");

beforeEach(() => {
  jest.spyOn(core, "getInput").mockImplementation(() => "README.md");
});

describe("action", () => {
  test("works", async () => {
    const writeFileSpy = jest.spyOn(promises, "writeFile").mockImplementation();
    const getWorkflowSpy = jest
      .spyOn(GetMetadata, "getWorkflow")
      .mockReturnValueOnce(workflow);
    const getActionSpy = jest
      .spyOn(GetMetadata, "getActionConfig")
      .mockReturnValueOnce(action);
    const getRelease = jest
      .spyOn(GetMetadata, "getRelease")
      .mockReturnValueOnce(`katydecorah/documentation-action@v1.0.0`);
    const buildDocsSpy = jest.spyOn(BuildDocs, "buildDocs");

    await docs();
    expect(getWorkflowSpy).toHaveBeenCalled();
    expect(getActionSpy).toHaveBeenCalled();
    expect(getRelease).toHaveBeenCalled();
    expect(buildDocsSpy).toHaveBeenCalled();
    expect(buildDocsSpy.mock.results[0].value).toMatchSnapshot();
    expect(writeFileSpy.mock.calls[0]).toMatchSnapshot();
  });

  test("writeFile fails", async () => {
    jest.spyOn(GetMetadata, "getWorkflow").mockReturnValueOnce(workflow);
    jest.spyOn(GetMetadata, "getActionConfig").mockReturnValueOnce(action);
    jest
      .spyOn(GetMetadata, "getRelease")
      .mockReturnValueOnce(`katydecorah/documentation-action@v1.0.0`);
    jest.spyOn(BuildDocs, "buildDocs");

    jest.spyOn(promises, "writeFile").mockRejectedValue({ message: "Error" });

    await docs();
    expect(setFailed).toHaveBeenCalledWith("Error");
  });

  test("get metadata fails", async () => {
    jest.spyOn(promises, "writeFile").mockImplementation();
    await docs();
    expect(setFailed).toHaveBeenCalledWith("Unable to get action metadata");
  });
});
