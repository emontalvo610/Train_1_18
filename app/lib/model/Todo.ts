// app/lib/model/Todo.ts
import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: String,
      required: [true, "Please provide a userId"],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation error in development
const Todo = mongoose.models.Todo || mongoose.model("Todo", todoSchema);

export default Todo;
