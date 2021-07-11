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