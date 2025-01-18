// __mocks__/next-auth.ts
export const getServerSession = jest.fn(() =>
  Promise.resolve({
    user: {
      email: "test@example.com",
    },
  })
);
