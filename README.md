## How run Components development setup


Make sure to run `npm install` in `Renta.TestApplication.WebUI`

After that open `package.json` in `Renta.TestApplication.WebUI` and run these scripts once:

```
prebuild
build
```

Then run and stop these scripts so they appear in Riders Run/Debug Configuration settings:

```
watch:components
watch:components:back
watch:common
watch:common:back
watch:toolkit
watch:toolkit:back
```

Create a new Compound profile and add `Renta.TestApplication.WebUI` and the above "watch"-scripts to it. 


## Change Log

Please refer to [`CHANGELOG.md`](CHANGELOG.md) to see the complete list of changes for each release.

---

Rest of available npm scripts: 

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
