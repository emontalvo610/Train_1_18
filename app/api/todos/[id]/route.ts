/* eslint-disable  @typescript-eslint/no-explicit-any */

import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { todos } from "../data";

export async function PUT(request: Request, params: any) {
  const { id: paramsId } = await params;
  const session = await getServerSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, description } = await request.json();
  const todoIndex = todos.findIndex(
    (todo) => todo.id === paramsId && todo.userId === session.user?.email
  );

  if (todoIndex === -1) {
    return NextResponse.json({ error: "Todo not found" }, { status: 404 });
  }

  todos[todoIndex] = {
    ...todos[todoIndex],
    title,
    description,
  };

  return NextResponse.json(todos[todoIndex]);
}

export async function DELETE(request: Request, params: any) {
  const { id: paramsId } = await params;
  const session = await getServerSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const todoIndex = todos.findIndex(
    (todo) => todo.id === paramsId && todo.userId === session.user?.email
  );

  if (todoIndex === -1) {
    return NextResponse.json({ error: "Todo not found" }, { status: 404 });
  }

  todos.splice(todoIndex, 1);
  return NextResponse.json({ message: "Todo deleted" });
}
