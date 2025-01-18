import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { todos } from "./data";
import { v4 as uuidv4 } from "uuid";
import { Todo } from "@/app/types/todo";

// Add this to your environment variables
const HOOK_SECRET = process.env.AUTH0_HOOK_SECRET;

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userTodos = todos.filter(
      (todo) => todo.userId === session.user?.email
    );
    return NextResponse.json({ todos: userTodos }); // Wrap in an object
  } catch (error) {
    console.error("GET todos error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  console.log("@>>>>>>>>>>>>>>>> Trigger Post");
  try {
    const hookSecret = request.headers.get("x-auth0-hook-secret");
    const session = await getServerSession();

    if (!session?.user && hookSecret !== HOOK_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, userId } = await request.json();
    console.log("title", title);
    const actualUserId = userId || session?.user?.email;

    const newTodo: Todo = {
      id: uuidv4(),
      title,
      description,
      userId: actualUserId!,
    };

    todos.push(newTodo);
    return NextResponse.json({ todo: newTodo }); // Wrap in an object
  } catch (error) {
    console.error("POST todo error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
