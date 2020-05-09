### Installation

1. Run `npm install` in this directory
2. Run `npm start`
3. Navigate to `localhost:3030`
 
### API documentation

Visit doc [link](https://docs.google.com/document/d/1KdNKc4_jK49x83Sk8eC3d4bPzE_GNG_eYxp1WnDBO6A/edit).

### Some info
File `generateMockData.js` will grab scheme from `schemas/` folder and create a single `db.json` inside `api` folder.

[json-server](https://github.com/typicode/json-server) will host `db.json` and automatically create routes for you.

For more information see `scripts` section of `package.json` file.

### Libraries used

[Faker.js](https://github.com/marak/Faker.js/) - to describe fake json data

[json-schema-faker](https://github.com/json-schema-faker/json-schema-faker/) - scheme parser

[json-server](https://github.com/typicode/json-server) - server for mocks

### [Fake generator REPL example](http://json-schema-faker.js.org/#gist/9b64320432b50d468a4412675870c894)
