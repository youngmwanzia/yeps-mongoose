require('..');
const App = require('yeps');
const srv = require('yeps-server');
const error = require('yeps-error');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

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
    server = srv.createHttpServer(app);
  });

  afterEach(() => {
    server.close();
  });

  after(() => {
    mongoose.connection.close();
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
});
