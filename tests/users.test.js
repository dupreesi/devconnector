const mongoose = require('mongoose');
const mongoDB = 'mongodb://localhost:27017/exampledb_test';

mongoose.connect(mongoDB);

const User = require('../models/User');

// User model tests

describe('Test User model', () => {
  // clear db before each test
  beforeAll(async () => {
    await User.remove({});
  });
  // clear db afer each test
  afterEach(async () => {
    await User.remove({});
  });
  // close connection after test
  afterAll(async () => {
    await mongoose.connection.close();
  });
  // check for User existence
  it('has a module', () => {
    expect(User).toBeDefined();
    console.log('successful');
  });
  // check if we can create,save and get a user
  it('gets a user', async () => {
    const user = new User({
      name: 'tester',
      email: 'tester@tester.com',
      password: '123456'
    });
    await user.save();

    const foundUser = await User.findOne({ name: 'tester' });
    console.log(foundUser);
    const expected = 'tester';
    const actual = foundUser.name;
    expect(actual).toEqual(expected);
  });
});
