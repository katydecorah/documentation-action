# documentation-action

A GitHub action to document your GitHub action.

To use this action, create two workflow files:

1. `.github/workflows/example.yml` - in this file, create an example action to show developers how to use your action.
2. `.github/workflows/documentation.yml` - in this file, create a workflow to run documentation-action which is documented below.

<!-- START GENERATED DOCUMENTATION -->

## Set up the workflow

To use this action, create a new workflow in `.github/workflows` and modify it as needed:

```yml
name: Document GitHub action

permissions:
  contents: write

on:
  workflow_dispatch:
  push:
    paths:
      - ".github/workflows/example.yml"
      - "action.yml"
      - "package.json"
      - "README.md"

jobs:
  document_action:
    runs-on: macOS-latest
    name: Write documentation
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Documentation action
        id: documentation
        uses: katydecorah/documentation-action@v1.2.0
      - name: Commit files
        if: steps.documentation.outputs.update == 'true'
        run: |
          git pull
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git commit -am "Update documentation"
          git push
```

### Additional example workflows

<details>
<summary>Document GitHub action (advanced)</summary>

```yml
name: Document GitHub action (advanced)
# This workflow file is the same as example.yml
# It's a proof of concept that you provide additional workflow files and they will appear in the README.

permissions:
  contents: write

jobs:
  document_action:
    runs-on: macOS-latest
    name: Write documentation
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Documentation action
        id: documentation
        uses: katydecorah/documentation-action@v1.2.0
      - name: Commit files
        if: steps.documentation.outputs.update == 'true'
        run: |
          git pull
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git commit -am "Update documentation"
          git push
```

</details>

<details>
<summary>Document GitHub action (new feature)</summary>

```yml
name: Document GitHub action (new feature)
# This workflow file is the same as example.yml
# It's a proof of concept that you provide additional workflow files and they will appear in the README.

permissions:
  contents: write

jobs:
  document_action:
    runs-on: macOS-latest
    name: Write documentation
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Documentation action
        id: documentation
        uses: katydecorah/documentation-action@v1.2.0
      - name: Commit files
        if: steps.documentation.outputs.update == 'true'
        run: |
          git pull
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git commit -am "Update documentation"
          git push
```

</details>

## Action options

- `example-workflow-file`: The example workflow file in `.github/workflows/` Default: `example.yml`.

- `additional-workflow-file-prefix`: To include additional workflow files, save them with this prefix in `.github/workflow/`. Default: `example`.

- `documentation-file`: The file where the action will write and update documentation for the action. Default: `README.md`.


## Action outputs

- `update`: If true, the action updated the documentation file.
<!-- END GENERATED DOCUMENTATION -->
