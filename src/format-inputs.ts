import { ActionConfig } from "./action";

export function formatInputs(inputs: ActionConfig["inputs"]) {
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

function showRequired(value: boolean | undefined) {
  if (!value) return "";
  return "Required. ";
}

function showDefault(value: string | undefined) {
  if (!value) return "";
  return ` Default: \`${value}\`.`;
}

function showDeprecation(value: string | undefined) {
  if (!value) return "";
  return ` Deprecation warning: \`${value}\``;
}
