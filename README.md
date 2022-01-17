# documentation-action

A GitHub action to help document your GitHub actions.

To use this action, create two workflow files in `.github/workflows/`:

1. `documentation.yml` - this will hold the action documented below.
2. `example.yml` - this will hold a sample action to run your action.


<!-- START GENERATED DOCUMENTATION -->

## Set up the workflow

```yml
name: Document Github action
on:
  push:
    paths:
      - ".github/workflows/example.yml"
      - "action.yml"
      - "package.json"

jobs:
  document_action:
    runs-on: macOS-latest
    name: Write documentation
    steps:
      - name: Checkout
        uses: actions/checkout@v2
      - name: Documentation action
        uses: katydecorah/documentation-action@v0.0.6
      - name: Commit files
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git commit -am "Update documentation"
          git push

```

### Action options

- `exampleWorkflowFile`: The example workflow file in `.github/workflows/` Default: `example.yml`.

- `documentationFile`: The file where the action will write and update documentation for the action. Default: `README.md`.


<!-- END GENERATED DOCUMENTATION -->
