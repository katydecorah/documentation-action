import { ActionConfig } from "./action";

export function formatInputs(inputs: ActionConfig["inputs"]): string {
  const formattedInputs = Object.keys(inputs)
    .map(
      (key) =>
        `- \`${key}\`: ${showRequired(inputs[key].required)}${
          inputs[key].description
        }${showDefault(inputs[key].default)}\n${showDeprecation(
          inputs[key].deprecationMessage
        )}\n`
    )
    .join("");
  return formattedInputs;
}

export function showRequired(value: boolean | undefined): string {
  return !value ? "" : "Required. ";
}

function showDefault(value: string | undefined): string {
  return !value ? "" : ` Default: \`${value}\`.`;
}

function showDeprecation(value: string | undefined): string {
  return !value ? "" : ` Deprecation warning: \`${value}\``;
}
