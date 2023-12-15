import { ActionConfig } from "./action";
import { Input, Inputs } from "./get-metadata";

export function formatInputs(inputs: ActionConfig["inputs"]): string {
  const formattedInputs = Object.keys(inputs)
    .map((key) => `- \`${key}\`: ${inputMetdata(inputs[key])}\n`)
    .join("\n");
  return formattedInputs;
}

export function formatOutputs(outputs: ActionConfig["outputs"]): string {
  const formattedInputs = Object.keys(outputs)
    .map((key) => `- \`${key}\`: ${inputMetdata(outputs[key])}\n`)
    .join("\n");
  return formattedInputs;
}

export function formatWorkflowInputs(inputs: Inputs): string {
  return Object.keys(inputs)
    .map((key) => `"${key}": "", // ${inputMetdata(inputs[key])}`)
    .join("\n    ");
}

function inputMetdata(input: Input): string {
  return `${showRequired(input.required)}${input.description}${showDefault(
    input.default
  )}${showDeprecation(input.deprecationMessage)}`;
}

function showRequired(value: boolean | undefined): string {
  return !value ? "" : "Required. ";
}

function showDefault(value: string | undefined): string {
  return !value ? "" : ` Default: \`${value}\`.`;
}

function showDeprecation(value: string | undefined): string {
  return !value ? "" : ` Deprecation warning: \`${value}\``;
}
