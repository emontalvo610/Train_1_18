// __tests__/api/todos/[id].test.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Todo from "@/app/lib/model/Todo";
import dbConnect from "@/app/lib/mongodb";
import { PUT, DELETE } from "@/app/api/todos/[id]/route";

// Mock implementations
jest.mock("next-auth");
jest.mock("@/app/lib/model/Todo");
jest.mock("@/app/lib/mongodb", () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue(null),
}));

describe("Todo Item API Routes", () => {
  const mockSession = {
    user: {
      email: "test@example.com",
    },
  };

  const mockTodoId = "123456789";
  const mockUpdatedTodo = {
    _id: mockTodoId,
    title: "Updated Todo",
    description: "Updated Description",
    completed: true,
    userId: "test@example.com",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
  });

  describe("PUT /api/todos/[id]", () => {
    it("should return 401 if user is not authenticated", async () => {
      (getServerSession as jest.Mock).mockResolvedValueOnce(null);

      const response = await PUT(
        new Request("http://localhost:3000/api/todos/" + mockTodoId, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: "Updated Todo",
            description: "Updated Description",
            completed: true,
          }),
        }),
        { params: { id: mockTodoId } }
      );

      const data = await response.json();
      expect(response.status).toBe(401);
      expect(data).toEqual({ error: "Unauthorized" });
    });

    it("should update todo successfully", async () => {
      (Todo.findOneAndUpdate as jest.Mock).mockResolvedValueOnce(
        mockUpdatedTodo
      );

      const response = await PUT(
        new Request("http://localhost:3000/api/todos/" + mockTodoId, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: "Updated Todo",
            description: "Updated Description",
            completed: true,
          }),
        }),
        { params: { id: mockTodoId } }
      );

      const data = await response.json();
      expect(response.status).toBe(200);
      expect(data).toEqual(mockUpdatedTodo);
      expect(Todo.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: mockTodoId, userId: "test@example.com" },
        {
          title: "Updated Todo",
          description: "Updated Description",
          completed: true,
        },
        { new: true }
      );
    });

    it("should return 404 if todo is not found", async () => {
      (Todo.findOneAndUpdate as jest.Mock).mockResolvedValueOnce(null);

      const response = await PUT(
        new Request("http://localhost:3000/api/todos/" + mockTodoId, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: "Updated Todo",
            description: "Updated Description",
            completed: true,
          }),
        }),
        { params: { id: mockTodoId } }
      );

      const data = await response.json();
      expect(response.status).toBe(404);
      expect(data).toEqual({ error: "Todo not found" });
    });
  });

  describe("DELETE /api/todos/[id]", () => {
    it("should return 401 if user is not authenticated", async () => {
      (getServerSession as jest.Mock).mockResolvedValueOnce(null);

      const response = await DELETE(
        new Request("http://localhost:3000/api/todos/" + mockTodoId, {
          method: "DELETE",
        }),
        { params: { id: mockTodoId } }
      );

      const data = await response.json();
      expect(response.status).toBe(401);
      expect(data).toEqual({ error: "Unauthorized" });
    });

    it("should delete todo successfully", async () => {
      (Todo.findOneAndDelete as jest.Mock).mockResolvedValueOnce(
        mockUpdatedTodo
      );

      const response = await DELETE(
        new Request("http://localhost:3000/api/todos/" + mockTodoId, {
          method: "DELETE",
        }),
        { params: { id: mockTodoId } }
      );

      const data = await response.json();
      expect(response.status).toBe(200);
      expect(data).toEqual({ message: "Todo deleted successfully" });
      expect(Todo.findOneAndDelete).toHaveBeenCalledWith({
        _id: mockTodoId,
        userId: "test@example.com",
      });
    });

    it("should return 404 if todo is not found", async () => {
      (Todo.findOneAndDelete as jest.Mock).mockResolvedValueOnce(null);

      const response = await DELETE(
        new Request("http://localhost:3000/api/todos/" + mockTodoId, {
          method: "DELETE",
        }),
        { params: { id: mockTodoId } }
      );

      const data = await response.json();
      expect(response.status).toBe(404);
      expect(data).toEqual({ error: "Todo not found" });
    });
  });
});
