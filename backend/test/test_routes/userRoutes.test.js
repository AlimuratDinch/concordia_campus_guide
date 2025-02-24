const request = require('supertest');
const express = require('express');
const userRoutes = require('../../routes/userRoutes');
const app = express();
const generatePassword = require('../../routes/function');

// Setup middleware and routes for testing
app.use(express.json());
app.use('/user', userRoutes);

describe('User Routes', () => {
  let testUserId;
  let server;

  beforeAll(() => {
    // Start the server before running the tests
    server = app.listen(4000); // You can change the port as needed
  });

  afterAll(() => {
    // Close the server after tests are done
    server.close();
  });

  it('should create a new user', async () => {
    const response = await request(app)
      .post('/user/new') // Make sure the endpoint path matches the router
      .send({
        netname: 'T_User',
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'testpassword'
      });

    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined(); // Check that ID is returned
    expect(response.body.id).toBeGreaterThan(0); // Ensure ID is a positive number

    // Save the created user ID for later deletion
    testUserId = response.body.id;

    // Introduce a delay of 1000ms (1 second) before attempting deletion
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

///////////////////


it('should fail sign in with incorrect password', async () => {
  const testUserEmail = 'testuser@example.com';
  const response = await request(app)
    .post('/user/signin')
    .send({
      email: testUserEmail,
      password: generatePassword() // Incorrect password
    });

  expect(response.status).toBe(401);
  expect(response.body.message).toBe('Invalid password');
});

it('should fail sign in for non-existing user in db', async () => {
  const response = await request(app)
    .post('/user/signin')
    .send({
      email: 'nonexistentuser@example.com',  //not exist
      password: generatePassword()
    });

  expect(response.status).toBe(404);
  expect(response.body.message).toBe('User not found');
});







////////////////////
  it('should delete a user', async () => {
    const response = await request(app)
      .delete(`/user/remove/${testUserId}`); // Adjust the path to match the actual route

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User deleted successfully');
  });

////////


////////
});

