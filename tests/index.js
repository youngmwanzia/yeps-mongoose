require('..');
const App = require('yeps');
const srv = require('yeps-server');
const error = require('yeps-error');
const chai = require('chai');
const chaiHttp = require('chai-http');
const config = require('config');
let mongoose = require('../mongoose');
const mongooseModule = require('..');

const { Schema } = mongoose;
const { expect } = chai;

chai.use(chaiHttp);

let app;
let server;

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required.'],
  },
});

const User = mongoose.model('user', UserSchema);

describe('YEPS mysql test', () => {
  beforeEach(() => {
    app = new App();
    app.then(error());
    app.then(mongooseModule());
    server = srv.createHttpServer(app);
  });

  afterEach(() => {
    server.close();
  });

  after(() => {
    mongoose.connection.close();
  });

  it('should check mongoose in context', async () => {
    let isTestFinished1 = false;
    let isTestFinished2 = false;

    app.then(async (ctx) => {
      expect(ctx.mongoose).is.not.undefined;

      isTestFinished1 = true;

      ctx.res.writeHead(200);
    });

    await chai.request(server)
      .get('/')
      .send()
      .then((res) => {
        expect(res).to.have.status(200);
        isTestFinished2 = true;
      });

    expect(isTestFinished1).is.true;
    expect(isTestFinished2).is.true;
  });

  it('should test User', async () => {
    let isTestFinished1 = false;
    let isTestFinished2 = false;

    app.then(async (ctx) => {
      const test = new User({ name: 'Test' });

      await test.save();

      const users = await User.find({ name: 'Test' });
      expect(users[0]._id.toString()).to.be.equal(test._id.toString());

      const user = await User.findOne({ _id: test._id });
      expect(user.name).to.be.equal('Test');

      await test.remove();

      isTestFinished1 = true;

      ctx.res.writeHead(200);
      ctx.res.end(JSON.stringify(test));
    });

    await chai.request(server)
      .get('/')
      .send()
      .then((res) => {
        expect(res).to.have.status(200);
        isTestFinished2 = true;
      });

    expect(isTestFinished1).is.true;
    expect(isTestFinished2).is.true;
  });

  it('should test connection error', (done) => {
    const { uri } = config.mongoose;
    const { exit } = process;

    process.exit = (code) => {
      expect(code).to.be.equal(1);

      process.exit = exit;
      config.mongoose.uri = uri;
      done();
    };

    config.mongoose.uri = 'mongodb://test/test';
    mongoose.connection.close();

    delete require.cache[require.resolve('../mongoose')];
    mongoose = require('../mongoose');
  });


  it('should test connected event', (done) => {
    mongoose.connection.close();

    delete require.cache[require.resolve('../mongoose')];
    mongoose = require('../mongoose');

    mongoose.connection.on('connected', done);
  });

  it('should test reconnected event', (done) => {
    mongoose.connection.close();

    mongoose.connection.on('reconnected', done);

    mongoose.connection.emit('reconnected');
  });

  it('should test process SIGINT event', (done) => {
    const { exit } = process;

    process.exit = (code) => {
      expect(code).to.be.equal(0);

      process.exit = exit;

      delete require.cache[require.resolve('../mongoose')];
      mongoose = require('../mongoose');

      done();
    };

    process.emit('SIGINT');
  });
});
