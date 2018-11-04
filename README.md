#Bionic Yoshi Server

## Prerequisites
**yarn 1.9.4** or **node 8.11.1** and **MongoDB 2.6.10** (or higher) is required



## Installation
This application can be installed via **yarn** by running `yarn`.

### Configuration
You can find a folder with configuration files at `/config` if you need. 

You must configure your MongoDB URL ( With Auth if needed ) `/config/db.js`

In PROD MODE you must configure API and Websocket Server PORT.

And you can configure secret key who bcrypt All passwords.

### Build
Once installed you're able to build the server.

#### Development mode
To launch the client in dev mode, run `yarn start`. 

API REST : [http://localhost:3090](http://localhost:3090)

WEBSOCKET SERVER : [http://localhost:3091](http://localhost:3091)

#### Production mode
To build the client in prod mode, run `yarn build`.

You can use NodeJS.

````
node dist/app.js
````

Or you can use PM2 to serve.

````
sudo npm install -g pm2
````

````
pm2 start dist/app.js
````

If you want to create service you can follow this tutorial : [Manage Application with PM2](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04#manage-application-with-pm2)

#### Accessing the application
Go to [http://35.233.61.218](http://35.233.61.218) to see your application working.