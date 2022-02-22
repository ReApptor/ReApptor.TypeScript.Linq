# RentaComponents

This project was generated using [Nx](https://nx.dev) Extensible Build Framework.

## Working with component library

- All development is done in feature branches. 
- Name of feature branch should follow following pattern feature/{ticket}-{description} Example ```feature/RSW-450-branch-instructions```
- All pull requests should have at least 2 reviewers-
- All pull requests should be approved by someone else than the original committer before merging to master
- When merging to master from feature branch use ```git squash``` and remove feature the branch.

## Development server

Run `npm run Start:WeAre.TestApplication.WebUI` for a dev server.

## Generate an application

Run `npx nx g @nrwl/react:app my-app` to generate an application.

## Generate a library publishable npm package

Run `nx g @nrwl/react:lib my-lib --publishable --importPath @weare/package-name` to generate a library.

## Generate a library

Run `npx nx g @nrwl/react:lib my-lib` to generate a library.

## MyGet (npm & nuget) packages

### NuGet

Navigate: <b>Rider / Project / Manage NuGet Packages / Sources / New Source</b>

Name: <b>WeAre NuGet</b>

Url: https://www.myget.org/F/reapptor-apps/auth/c1974203-0797-4879-9034-e16c256c1445/api/v3/index.json

### Npm

Navigate: <b>Rider / Terminal:</b>

Name: <b>@weare</b>

Run `npm config set @weare:registry https://www.myget.org/F/reapptor-apps/auth/c1974203-0797-4879-9034-e16c256c1445/npm/`

## Code scaffolding

Run `nx g @nrwl/react:component my-component --project=WeAre.TestApplication.WebUI` to generate a new component.

## Build

Run `npm run Build:WeAre.TestApplication.WebUI` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `npm run Test:WeAre.TestApplication.WebUI` to execute the unit tests via [Jest](https://jestjs.io).

## Understand your workspace

Run `npm run dep-graph` to see a diagram of the dependencies of your projects.

## Further help

Visit the [Nx Documentation](https://nx.dev) to learn more.

## ☁ Nx Cloud

### Distributed Computation Caching & Distributed Task Execution

Nx Cloud pairs with Nx in order to enable you to build and test code more rapidly, by up to 10 times. Even teams that are new to Nx can connect to Nx Cloud and start saving time instantly.

Visit [Nx Cloud](https://nx.app/) to learn more.

  

## Change Log

Please refer to [`CHANGELOG.md`](CHANGELOG.md) to see the complete list of changes for each release.

---

## Rest of available npm scripts: 

    "lint": "nx workspace-lint && nx lint",
    "e2e": "nx e2e",
    "affected:apps": "nx affected:apps",
    "affected:libs": "nx affected:libs",
    "affected:build": "nx affected:build",
    "affected:e2e": "nx affected:e2e",
    "affected:test": "nx affected:test",
    "affected:lint": "nx affected:lint",
    "affected:dep-graph": "nx affected:dep-graph",
    "affected": "nx affected",
    "format": "nx format:write",
    "format:write": "nx format:write",
    "format:check": "nx format:check",
    "update": "nx migrate latest",
    "workspace-generator": "nx workspace-generator",
    "dep-graph": "nx dep-graph",
    "help": "nx help",

## What has been customized: 

1. applications and libraries generated with nx command will be inside `./apps` and `./libs` but we moved them to the root of solution. things need to be updated: 

* project's jest.config.js
* project's tsconfig.json
* project's tsconfig.lib.json
* project's tsconfig.spec.json
* workspaces workspace.json (all paths related to this project should be updated)


2. we removed `types` key from all `tsconfig` files, just to allow to use all of installed packages.

* project's tsconfig.json
* project's tsconfig.lib.json
* project's tsconfig.spec.json


3. we added `post-install.js` to add `ts-nameof` to rollup configuration generator. It will run automatically after `npm install` 


4. we added `extra-webpack.js` to add support of fonts to React applications. currently only for `WeAre.TestApplication.WebUI`. 
we just push a plugin to the nx original webpack setting `@nrwl/react/plugins/webpack.js`   
To enable it  we need to add this to 

```
{
  "projects": {
    "PROJECT_NAME": {
      "targets": {
        "build": {
          "options": {
            "webpackConfig": "./extra-webpack"  <--
```

5. We added `extra-rollup.js` to modify our css class name for module components,we replace the postcss plugin with our own.
   To enable it  we need to add this to 

```
{
  "projects": {
    "PROJECT_NAME": {
      "targets": {
        "build": {
          "options": {
            "rollupConfig": "./extra-rollup" <--
```
