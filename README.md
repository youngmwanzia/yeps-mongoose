# YEPS Mongoose


YEPS Promise based Mongoose client

[![NPM](https://nodei.co/npm/yeps-mongoose.png)](https://npmjs.org/package/yeps-mongoose)

[![npm version](https://badge.fury.io/js/yeps-mongoose.svg)](https://badge.fury.io/js/yeps-mongoose)
[![Build Status](https://travis-ci.org/evheniy/yeps-mongoose.svg?branch=master)](https://travis-ci.org/evheniy/yeps-mongoose)
[![Coverage Status](https://coveralls.io/repos/github/evheniy/yeps-mongoose/badge.svg?branch=master)](https://coveralls.io/github/evheniy/yeps-mongoose?branch=master)
[![Linux Build](https://img.shields.io/travis/evheniy/yeps-mongoose/master.svg?label=linux)](https://travis-ci.org/evheniy/)

[![Dependency Status](https://david-dm.org/evheniy/yeps-mongoose.svg)](https://david-dm.org/evheniy/yeps-mongoose)
[![devDependency Status](https://david-dm.org/evheniy/yeps-mongoose/dev-status.svg)](https://david-dm.org/evheniy/yeps-mongoose#info=devDependencies)
[![NSP Status](https://img.shields.io/badge/NSP%20status-no%20vulnerabilities-green.svg)](https://travis-ci.org/evheniy/yeps-mongoose)

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/evheniy/yeps-mongoose/master/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/evheniy/yeps-mongoose.svg)](https://github.com/evheniy/yeps-mongoose/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/evheniy/yeps-mongoose.svg)](https://github.com/evheniy/yeps-mongoose/network)
[![GitHub issues](https://img.shields.io/github/issues/evheniy/yeps-mongoose.svg)](https://github.com/evheniy/yeps-mongoose/issues)
[![Twitter](https://img.shields.io/twitter/url/https/github.com/evheniy/yeps-mongoose.svg?style=social)](https://twitter.com/intent/tweet?text=Wow:&url=%5Bobject%20Object%5D)


## How to install

    npm i -S yeps-mongoose
    
## How to use

### Config

config/default.json

    {
      "mongoose": {
        "uri": "mongodb://localhost/test",
        "parameters": {
          "useMongoClient": true
        }
      }
    }

### Middleware

    const App = require('yeps');
    
    const error = require('yeps-error');
    const logger = require('yeps-logger');
    const server = require('yeps-server');
    
    require('yeps-mongoose');
    
    const mongoose = require('mongoose');
    
    const { Schema } = mongoose;
    
    const app = new App();
    
    app.all([
        error(),
        logger(),
    ]);
    
    const UserSchema = new Schema({
      name: {
        type: String,
        required: [true, 'Name is required.'],
      },
    });
    
    const User = mongoose.model('user', UserSchema);
    
    app.then(async ctx => {
        const test = new User({ name: 'Test' });
        
        await test.save();
        
        const users = await User.find({ name: 'Test' });
        
        const user = await User.findOne({ _id: test._id });
        
        await test.remove();
    });
    
    server.createHttpServer(app);
    

#### [YEPS documentation](http://yeps.info/)


#### Dependencies:

* [Mongoose](http://mongoosejs.com/) - elegant mongodb object modeling for node.js
* [config](https://github.com/lorenwest/node-config) - node.js config
