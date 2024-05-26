import type { Config } from "jest";

const config: Config = {
  resetMocks: true,
  clearMocks: true,
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  prettierPath: require.resolve("prettier-2"),
};

export default config;
