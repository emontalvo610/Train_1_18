// __tests__/api/todos.test.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Todo from "@/app/lib/model/Todo";
import dbConnect from "@/app/lib/mongodb";
import { GET, POST } from "@/app/api/todos/route";

// Mock implementations
jest.mock("next-auth");
jest.mock("@/app/lib/model/Todo");
jest.mock("@/app/lib/mongodb", () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue(null),
}));

describe("Todos API Routes", () => {
  const mockSession = {
    user: {
      email: "test@example.com",
    },
  };

  // Use ISO string format for dates
  const testDate = new Date().toISOString();

  const mockTodos = [
    {
      _id: "1",
      title: "Test Todo 1",
      description: "Test Description 1",
      completed: false,
      userId: "test@example.com",
      createdAt: testDate,
      updatedAt: testDate,
    },
    {
      _id: "2",
      title: "Test Todo 2",
      description: "Test Description 2",
      completed: true,
      userId: "test@example.com",
      createdAt: testDate,
      updatedAt: testDate,
    },
  ];

  const mockNewTodo = {
    title: "New Todo",
    description: "New Description",
    completed: false,
  };

  const mockCreatedTodo = {
    ...mockNewTodo,
    _id: "3",
    userId: "test@example.com",
    createdAt: testDate,
    updatedAt: testDate,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
  });

  describe("GET /api/todos", () => {
    it("should return 401 if user is not authenticated", async () => {
      (getServerSession as jest.Mock).mockResolvedValueOnce(null);

      const response = await GET(
        new Request("http://localhost:3000/api/todos")
      );

      const data = await response.json();
      expect(response.status).toBe(401);
      expect(data).toEqual({ error: "Unauthorized" });
    });

    it("should return todos successfully", async () => {
      const mockFind = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockTodos),
      });
      (Todo.find as jest.Mock).mockImplementation(mockFind);

      const response = await GET(
        new Request("http://localhost:3000/api/todos")
      );

      const data = await response.json();
      expect(response.status).toBe(200);

      // Compare without dates first
      const dataWithoutDates = data.map(
        ({ createdAt, updatedAt, ...rest }) => rest
      );
      const mockWithoutDates = mockTodos.map(
        ({ createdAt, updatedAt, ...rest }) => rest
      );
      expect(dataWithoutDates).toEqual(mockWithoutDates);

      // Verify date formats
      data.forEach((todo: any) => {
        expect(new Date(todo.createdAt).toISOString()).toBeTruthy();
        expect(new Date(todo.updatedAt).toISOString()).toBeTruthy();
      });

      expect(Todo.find).toHaveBeenCalledWith({ userId: "test@example.com" });
    });

    it("should handle database errors", async () => {
      (Todo.find as jest.Mock).mockImplementation(() => {
        throw new Error("Database error");
      });

      const response = await GET(
        new Request("http://localhost:3000/api/todos")
      );

      const data = await response.json();
      expect(response.status).toBe(500);
      expect(data).toEqual({ error: "Failed to fetch todos" });
    });
  });

  describe("POST /api/todos", () => {
    it("should return 401 if user is not authenticated", async () => {
      (getServerSession as jest.Mock).mockResolvedValueOnce(null);

      const response = await POST(
        new Request("http://localhost:3000/api/todos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(mockNewTodo),
        })
      );

      const data = await response.json();
      expect(response.status).toBe(401);
      expect(data).toEqual({ error: "Unauthorized" });
    });

    it("should create todo successfully", async () => {
      (Todo.create as jest.Mock).mockResolvedValueOnce(mockCreatedTodo);

      const response = await POST(
        new Request("http://localhost:3000/api/todos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(mockNewTodo),
        })
      );

      const data = await response.json();
      expect(response.status).toBe(201);

      // Compare without dates first
      const { createdAt, updatedAt, ...dataWithoutDates } = data;
      const {
        createdAt: mockCreatedAt,
        updatedAt: mockUpdatedAt,
        ...mockWithoutDates
      } = mockCreatedTodo;
      expect(dataWithoutDates).toEqual(mockWithoutDates);

      // Verify date formats
      expect(new Date(data.createdAt).toISOString()).toBeTruthy();
      expect(new Date(data.updatedAt).toISOString()).toBeTruthy();

      expect(Todo.create).toHaveBeenCalledWith({
        ...mockNewTodo,
        userId: "test@example.com",
      });
    });

    it("should handle missing required fields", async () => {
      const response = await POST(
        new Request("http://localhost:3000/api/todos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title: "Only Title" }),
        })
      );

      const data = await response.json();
      expect(response.status).toBe(400);
      expect(data).toEqual({ error: "Title and description are required" });
    });

    it("should handle database errors during creation", async () => {
      (Todo.create as jest.Mock).mockRejectedValueOnce(
        new Error("Database error")
      );

      const response = await POST(
        new Request("http://localhost:3000/api/todos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(mockNewTodo),
        })
      );

      const data = await response.json();
      expect(response.status).toBe(500);
      expect(data).toEqual({ error: "Failed to create todo" });
    });
  });
});
