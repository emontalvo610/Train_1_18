// __mocks__/@/app/lib/model/Todo.ts
const TodoMock = {
  find: jest.fn().mockReturnValue({
    sort: jest.fn().mockResolvedValue([]),
  }),
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn(),
  findOneAndDelete: jest.fn(),
  create: jest.fn(),
};

export default TodoMock;
