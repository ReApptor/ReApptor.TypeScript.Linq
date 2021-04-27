## How run Components development setup


make sure to run `npm install` in `Renta.TestApplication.WebUI`

after that open package.json in `Renta.TestApplication.WebUI` and run these commands once manually (because they will apear in Rider Configuration npm scripts):


```
watch:components
watch:components:back
watch:common
watch:common:back
watch:toolkit
watch:toolkit:back
```

Stop these commands and create new Compound profile and add these to it plus Launch setting for `Renta.TestApplication.WebUI`



## Change Log

Please refer to [`CHANGELOG.md`](CHANGELOG.md) to see the complete list of changes for each release.

---