const mockClient = {
  create: jest.fn(async (doc) => ({ _id: 'mock-startup-id', ...doc })),
  config: () => ({ token: 'test-token' }),
};

module.exports = {
  createClient: () => mockClient,
  // Export anything else your code might try to access safely.
};
