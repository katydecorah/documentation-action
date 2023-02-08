import { ActionConfig, docs } from "../action";
import { readFileSync, promises } from "fs";
import * as GetMetadata from "../get-metadata";
import * as BuildDocs from "../build-docs";
import { load } from "js-yaml";
import { setFailed } from "@actions/core";
import * as core from "@actions/core";

jest.mock("@actions/core");

const action = load(readFileSync("./action.yml", "utf-8")) as ActionConfig;
const workflowYaml = readFileSync("./.github/workflows/example.yml", "utf-8");

const workflowYaml2 = readFileSync(
  "./.github/workflows/example-advanced.yml",
  "utf-8"
);
const workflowYaml3 = readFileSync(
  "./.github/workflows/example-new-feature.yml",
  "utf-8"
);

const workflow = {
  yaml: workflowYaml,
  json: load(workflowYaml),
};

const workflows = [
  {
    yaml: workflowYaml2,
    json: load(workflowYaml2),
  },
  {
    yaml: workflowYaml3,
    json: load(workflowYaml3),
  },
];

const defaultInputs = {
  "example-workflow": "example.yml",
  "additional-workflow-prefix": "example",
  "documentation-file": "README.md",
};

beforeEach(() => {
  jest
    .spyOn(core, "getInput")
    .mockImplementation((v) => defaultInputs[v] || undefined);
});

describe("action", () => {
  test("works", async () => {
    const writeFileSpy = jest.spyOn(promises, "writeFile").mockImplementation();
    const getWorkflowSpy = jest
      .spyOn(GetMetadata, "getWorkflow")
      .mockReturnValueOnce(Promise.resolve(workflow));
    const getActionSpy = jest
      .spyOn(GetMetadata, "getActionConfig")
      .mockReturnValueOnce(Promise.resolve(action));
    const getRelease = jest
      .spyOn(GetMetadata, "getRelease")
      .mockReturnValueOnce(
        Promise.resolve(`katydecorah/documentation-action@v1.0.0`)
      );
    const getWorkflowsSpy = jest
      .spyOn(GetMetadata, "getWorkflows")
      .mockReturnValueOnce(Promise.resolve());
    const buildDocsSpy = jest.spyOn(BuildDocs, "buildDocs");

    await docs();
    expect(getWorkflowSpy).toHaveBeenCalled();
    expect(getActionSpy).toHaveBeenCalled();
    expect(getRelease).toHaveBeenCalled();
    expect(getWorkflowsSpy).toHaveBeenCalled();
    expect(buildDocsSpy).toHaveBeenCalled();
    expect(buildDocsSpy.mock.results[0].value).toMatchSnapshot();
    expect(writeFileSpy.mock.calls[0]).toMatchSnapshot();
  });

  test("works, workflows", async () => {
    const writeFileSpy = jest.spyOn(promises, "writeFile").mockImplementation();
    const getWorkflowSpy = jest
      .spyOn(GetMetadata, "getWorkflow")
      .mockReturnValueOnce(Promise.resolve(workflow));
    const getActionSpy = jest
      .spyOn(GetMetadata, "getActionConfig")
      .mockReturnValueOnce(Promise.resolve(action));
    const getRelease = jest
      .spyOn(GetMetadata, "getRelease")
      .mockReturnValueOnce(
        Promise.resolve(`katydecorah/documentation-action@v1.0.0`)
      );
    const getWorkflowsSpy = jest
      .spyOn(GetMetadata, "getWorkflows")
      .mockReturnValueOnce(Promise.resolve(workflows));
    const buildDocsSpy = jest.spyOn(BuildDocs, "buildDocs");

    await docs();
    expect(getWorkflowSpy).toHaveBeenCalled();
    expect(getActionSpy).toHaveBeenCalled();
    expect(getRelease).toHaveBeenCalled();
    expect(getWorkflowsSpy).toHaveBeenCalled();
    expect(buildDocsSpy).toHaveBeenCalled();
    expect(buildDocsSpy.mock.results[0].value).toMatchSnapshot();
    expect(writeFileSpy.mock.calls[0]).toMatchSnapshot();
  });

  test("writeFile fails", async () => {
    jest
      .spyOn(GetMetadata, "getWorkflow")
      .mockReturnValueOnce(Promise.resolve(workflow));
    jest
      .spyOn(GetMetadata, "getActionConfig")
      .mockReturnValueOnce(Promise.resolve(action));
    jest
      .spyOn(GetMetadata, "getRelease")
      .mockReturnValueOnce(
        Promise.resolve(`katydecorah/documentation-action@v1.0.0`)
      );
    jest
      .spyOn(GetMetadata, "getWorkflows")
      .mockReturnValueOnce(Promise.resolve());
    jest.spyOn(BuildDocs, "buildDocs");

    jest.spyOn(promises, "writeFile").mockRejectedValue({ message: "Error" });

    await docs();
    expect(setFailed).toHaveBeenCalledWith({ message: "Error" });
  });

  test("get metadata fails", async () => {
    jest
      .spyOn(GetMetadata, "getWorkflow")
      .mockReturnValueOnce(Promise.resolve(undefined));
    jest
      .spyOn(GetMetadata, "getActionConfig")
      .mockReturnValueOnce(Promise.resolve(undefined));
    jest
      .spyOn(GetMetadata, "getRelease")
      .mockReturnValueOnce(Promise.resolve(undefined));
    jest
      .spyOn(GetMetadata, "getWorkflows")
      .mockReturnValueOnce(Promise.resolve());
    await docs();
    expect(setFailed).toHaveBeenCalledWith("Unable to get action metadata");
  });
});
