# documentation-action

A GitHub action to help document your GitHub actions.

To use this action, create two workflow files:

1. `.github/workflows/example.yml` - in this file, create an example action to show developers how to use it.
2. `.github/workflows/documentation.yml` - this will hold handle `documentation-action` which is documented below. Follow the steps below to set up the documetnation action:

<!-- START GENERATED DOCUMENTATION -->

## Set up the workflow

To use this action, create a new workflow in `.github/workflows` and modify it as needed:

```yml
name: Document GitHub action

on:
  push:
    paths:
      - ".github/workflows/example.yml"
      - "action.yml"
      - "package.json"
      - "README.md"
  workflow_dispatch:
    inputs:
      bookIsbn:
        description: The book's ISBN
        required: true
        type: string
      notes:
        description: Notes about the book
        type: string

jobs:
  document_action:
    runs-on: macOS-latest
    name: Write documentation
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      - name: Documentation action
        uses: katydecorah/documentation-action@v0.1.0
      - name: Commit files
        if: env.UpdateDocumentation == 'true'
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git commit -am "Update documentation"
          git push
```

## Action options

- `exampleWorkflowFile`: The example workflow file in `.github/workflows/` Default: `example.yml`.

- `documentationFile`: The file where the action will write and update documentation for the action. Default: `README.md`.

## Trigger the workflow

To trigger the action, [create a workflow dispatch event](https://docs.github.com/en/rest/actions/workflows#create-a-workflow-dispatch-event) with the following body parameters:

```js
{ 
  "ref": "main", // Required. The git reference for the workflow, a branch or tag name.
  "inputs": {
    "bookIsbn": "", // Required.  The book's ISBN.
"notes": "", //  Notes about the book.
  }
}
```
  <!-- END GENERATED DOCUMENTATION -->
