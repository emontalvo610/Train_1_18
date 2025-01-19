import TodoList from "../components/TodoList";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
// import { ClipboardList } from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto p-6 md:p-8 lg:p-12">
        <div className="mb-8 space-y-2">
          <div className="flex items-center gap-3">
            {/* <ClipboardList className="h-8 w-8 text-indigo-600" /> */}
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Todo Dashboard
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Manage your tasks efficiently and stay organized
          </p>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6">
          <TodoList />
        </div>
      </div>
    </div>
  );
}
