"use client";

import { useState, useEffect } from "react";
import { PlusIcon, PencilIcon, TrashIcon, AlertCircle } from "lucide-react";
import Welcome from "./Welcome";
import { Todo } from "../types/todo";

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [newTodo, setNewTodo] = useState({ title: "", description: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/todos");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTodos(data.todos); // Access the todos array from the response

      // Check if this is a new user (has only the default todo)
      if (
        data.todos.length === 1 &&
        data.todos[0].title.includes("Welcome to TodoApp")
      ) {
        setIsNewUser(true);
      }
    } catch (error) {
      console.error("Failed to fetch todos:", error);
      setError("Failed to load todos. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (isEditing) {
        const response = await fetch(`/api/todos/${isEditing}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newTodo),
        });

        if (!response.ok) throw new Error("Failed to update todo");
      } else {
        const response = await fetch("/api/todos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newTodo),
        });

        if (!response.ok) throw new Error("Failed to create todo");
      }

      setNewTodo({ title: "", description: "" });
      setIsEditing(null);
      await fetchTodos();
    } catch (error) {
      console.error("Failed to save todo:", error);
      setError("Failed to save todo. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setError(null);
      const response = await fetch(`/api/todos/${id}`, { method: "DELETE" });

      if (!response.ok) throw new Error("Failed to delete todo");

      await fetchTodos();
    } catch (error) {
      console.error("Failed to delete todo:", error);
      setError("Failed to delete todo. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={newTodo.title}
          onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="Description"
          value={newTodo.description}
          onChange={(e) =>
            setNewTodo({ ...newTodo, description: e.target.value })
          }
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <PlusIcon size={16} />
          {isEditing ? "Update Todo" : "Add Todo"}
        </button>
      </form>

      <div className="grid gap-4">
        {todos.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No todos yet. Create your first todo above!
          </p>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className="p-4 border rounded shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="font-bold">{todo.title}</h3>
              <p className="text-gray-600">{todo.description}</p>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => {
                    setIsEditing(todo.id);
                    setNewTodo({
                      title: todo.title,
                      description: todo.description,
                    });
                  }}
                  className="flex items-center gap-1 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  <PencilIcon size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(todo.id)}
                  className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  <TrashIcon size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isNewUser && showWelcome && (
        <Welcome onDismiss={() => setShowWelcome(false)} />
      )}
    </div>
  );
}
