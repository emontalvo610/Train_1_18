// app/api/todos/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/app/lib/mongodb";
import Todo from "@/app/lib/model/Todo";

export async function GET() {
  try {
    const session = await getServerSession();
    console.log("DB try connect");
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    console.log("db connected");

    const todos = await Todo.find({ userId: session.user.email }).sort({
      createdAt: -1,
    });

    console.log("todos", todos);

    return NextResponse.json(todos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    return NextResponse.json(
      { error: "Failed to fetch todos" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, userId } = body;
    const session = await getServerSession();

    if (!userId && !session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const todo = await Todo.create({
      ...body,
      userId: userId || session?.user?.email,
    });

    return NextResponse.json(todo, { status: 201 });
  } catch (error) {
    console.error("Error creating todo:", error);
    return NextResponse.json(
      { error: "Failed to create todo" },
      { status: 500 }
    );
  }
}
