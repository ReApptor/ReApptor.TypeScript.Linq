npm install -g @microsoft/api-extractor
npm install -g @microsoft/api-documenter

mkdir input
cd ../WeAre.ReApptor.React.Toolkit/
npm install
npm run build
mkdir ./etc
api-extractor run --local --typescript-compiler-folder $(npm root)/typescript
cp -a ./temp/. ../Documentation/input/
rm -r ./etc
rm -r ./temp
rm -r ./dist

cd ../WeAre.ReApptor.React.Common/
npm install
npm run build
mkdir ./etc
api-extractor run --local --typescript-compiler-folder $(npm root)/typescript
cp -a ./temp/. ../Documentation/input/
rm -r ./etc
rm -r ./temp
rm -r ./dist

api-documenter markdown -i ../Documentation/input/ -o ../Documentation/docs/
cp ../Documentation/index.html ../Documentation/docs/index.html
cd ../Documentation
rm -r ./input
cd ./docs/
mv index.md README.md
npm i -g serve && serve .

