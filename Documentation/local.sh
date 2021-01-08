npm install -g @microsoft/api-extractor
npm install -g @microsoft/api-documenter
cd ../WeAre.Athenaeum.React.Toolkit/
npm install
npm run build
mkdir ./etc
api-extractor run --local
api-documenter markdown -i ./temp/ -o ../Documentation/docs/
rm -r ./etc
cp ../Documentation/index.html ../Documentation/docs/index.html
cd ../Documentation/docs/
mv index.md README.md
npm i -g serve && serve .

