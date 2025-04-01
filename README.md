**TABTRACKR**

A chrome extension that tracks tab usage.

In the public folder, you'll find a background.js file which is responsible for running in the background and tracking the tab usage data. This data will be sent to the server every 30 seconds as you'll see in the setInterval.

The manifest.json file is responsible for providing metadata to the browser, e.g. extension permissions, icons, and important files like background.js, and index.html.

**GETTING STARTED**

1. Fork and clone the repo.
2. Create a SQL database for running the app and/or another for running the tests.
3. In the server folder, create a .env file and populate it with the DB_USERNAME, DB_PASSWORD, DB_APP, and DB_TEST variables, as well as their relavant values.
4. Run `npm install`, then `npm run dev` to compile and run or `npm run test` to run the tests.
5. In the client folder, run `npm install`, then `npm run build`.
6. Go to chrome://extensions/ in the browser, and click 'Load Unpacked' in the top left. Then open the dist folder.
7. Turn the extension on and you should see the extension running without errors.

**TECH STACK**

TypeScript
Express
SQL + Sequelize
Vite + React

**CONTRIBUTORS**

Original JS app by:
Archie Maunder-Taylor: https://github.com/a-rchi-e

Refactoring into TS + writing Front-end and Back-end tests coauthored by:
Paul Paumier Martinez - https://github.com/manawgh
David Luque - https://github.com/daiV