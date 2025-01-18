// app/lib/model/Todo.ts
import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: [true, "Please provide a description"],
  },
  completed: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Todo =
  process.env.NODE_ENV === "test"
    ? mongoose.models.Todo || mongoose.model("Todo", todoSchema)
    : mongoose.models.Todo || mongoose.model("Todo", todoSchema);

export default Todo;
