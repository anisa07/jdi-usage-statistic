# jdi-usage-statistic server
Server to gather and preserve info about [JDI testing framework](https://github.com/jdi-testing/jdi-light) usage statistic.

### How to run it statistic server:
1. Setup and run your mongo db instance. Example how to run [mongo](https://docs.mongodb.com/guides/server/install/) and [mongod](https://docs.mongodb.com/manual/tutorial/manage-mongodb-processes/) 
1. Install npm packages with ```npm i``` command
1. Fill **.env.example** with appropriate data, remove **.example**, make sure that **.env** is added into **.gitignore**
1. Create **keys** folder in the root of the project. Create SSL certificate keys, generate **server.key** and **server.cert** put them into **keys** folder, make sure that **keys** folder  is added into **.gitignore**
1. Open **src/utils/corsSettings.js** and put your [statistics client part](https://github.com/anisa07/react-client-jdi-usage-statistics) host into ```whitelist``` array
1. Run ```npm run prod``` or ```npm start``` for developer pusposes
