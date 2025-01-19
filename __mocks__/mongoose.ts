// __mocks__/mongoose.ts
class Schema {
  constructor(definition: any, options: any) {
    return {
      ...definition,
      ...options,
    };
  }
}

const mongoose = {
  Schema,
  model: jest.fn((name, schema) => {
    return {
      find: jest.fn().mockReturnThis(),
      findOne: jest.fn(),
      findOneAndUpdate: jest.fn(),
      findOneAndDelete: jest.fn(),
      create: jest.fn(),
      sort: jest.fn(),
    };
  }),
  models: {
    Todo: null,
  },
  connect: jest.fn().mockResolvedValue(undefined),
};

export default mongoose;
