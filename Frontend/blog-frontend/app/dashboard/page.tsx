"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FiFileText,
  FiFolder,
  FiLogOut,
  FiBarChart2,
  FiUser,
} from "react-icons/fi";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-blue-600 to-indigo-700 text-white shadow-xl p-6 flex flex-col">
        <h2 className="text-3xl font-extrabold mb-12 tracking-wide">
          CMS Panel
        </h2>

        <nav className="flex flex-col gap-3">
          <button
            onClick={() => router.push("/dashboard/posts")}
            className="flex items-center gap-4 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition"
          >
            <FiFileText size={22} />
            Posts
          </button>

          <button
            onClick={() => router.push("/dashboard/categories")}
            className="flex items-center gap-4 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition"
          >
            <FiFolder size={22} />
            Categories
          </button>

          <button
            onClick={handleLogout}
            className="mt-auto flex items-center gap-4 px-4 py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 transition"
          >
            <FiLogOut size={22} />
            Logout
          </button>
        </nav>
      </aside>

      {/* Right Section */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-10">
          <h1 className="text-xl font-semibold text-slate-700">
            Dashboard Overview
          </h1>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-slate-600">
              <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                <FiUser />
              </div>
              <span className="font-medium">Admin</span>
            </div>

            <button
              onClick={handleLogout}
              className="text-sm px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-10">
          {/* Welcome */}
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-800 mb-1">
              Welcome back 
            </h2>
            <p className="text-slate-500">
              Here’s what’s happening with your CMS today
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white rounded-xl shadow p-6">
              <p className="text-slate-500 text-sm">Total Posts</p>
              <h3 className="text-3xl font-bold text-blue-600 mt-2">24</h3>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <p className="text-slate-500 text-sm">Categories</p>
              <h3 className="text-3xl font-bold text-indigo-600 mt-2">8</h3>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <p className="text-slate-500 text-sm">Views</p>
              <h3 className="text-3xl font-bold text-sky-600 mt-2">1.2K</h3>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div
              onClick={() => router.push("/dashboard/posts")}
              className="group cursor-pointer bg-white rounded-2xl shadow-md p-6 hover:shadow-xl hover:-translate-y-1 transition"
            >
              <div className="w-14 h-14 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <FiFileText size={26} />
              </div>
              <h2 className="text-xl font-semibold text-slate-800 mb-1">
                Manage Posts
              </h2>
              <p className="text-slate-500 mb-4">
                Create, edit and publish blog posts.
              </p>
              <span className="text-blue-600 font-medium">
                Go to Posts →
              </span>
            </div>

            <div
              onClick={() => router.push("/dashboard/categories")}
              className="group cursor-pointer bg-white rounded-2xl shadow-md p-6 hover:shadow-xl hover:-translate-y-1 transition"
            >
              <div className="w-14 h-14 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <FiFolder size={26} />
              </div>
              <h2 className="text-xl font-semibold text-slate-800 mb-1">
                Manage Categories
              </h2>
              <p className="text-slate-500 mb-4">
                Organize posts with categories.
              </p>
              <span className="text-indigo-600 font-medium">
                Go to Categories →
              </span>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 opacity-80">
              <div className="w-14 h-14 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mb-4">
                <FiBarChart2 size={26} />
              </div>
              <h2 className="text-xl font-semibold m-1">
                Analytics
              </h2>
              <p className="text-slate-500 mb-4">
                Insights and reports coming soon.
              </p>
              <span className="text-slate-400 font-medium">
                Stay tuned 
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
