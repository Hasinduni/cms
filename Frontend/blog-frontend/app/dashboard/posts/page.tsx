"use client";

import { useState, useEffect } from "react";
import { FiEdit, FiTrash2, FiPlus, FiArrowLeft } from "react-icons/fi";
import { useRouter } from "next/navigation";
import api from "../../lib/api";

type Post = {
  id: number;
  title: string;
  content: string;
  categoryId: number;
  categoryName: string; // Frontend only
  status: string;
  createdAt: string;
  userId: number;
};

type Category = {
  id: number;
  name: string;
};

export default function PostsPage() {
  const router = useRouter();

  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deletePostId, setDeletePostId] = useState<number | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState(0);
  const [status, setStatus] = useState("Draft");

  const getUserId = (): number => {
    if (typeof window === "undefined") return 0;
    const token = localStorage.getItem("token");
    if (!token) return 0;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.nameid ? parseInt(payload.nameid) : 0;
    } catch {
      return 0;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postsRes = await api.get<Post[]>("/Post");
        const categoriesRes = await api.get<Category[]>("/Category");

        setCategories(categoriesRes.data);
        if (categoriesRes.data.length > 0) setCategoryId(categoriesRes.data[0].id);

        const postsWithNames = postsRes.data.map((post) => {
          const category = categoriesRes.data.find((c) => c.id === post.categoryId);
          return { ...post, categoryName: category ? category.name : "Unknown" };
        });

        setPosts(postsWithNames);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const openModal = (post?: Post) => {
    if (categories.length === 0) return;
    if (post) {
      setEditingPost(post);
      setTitle(post.title);
      setContent(post.content);
      setCategoryId(post.categoryId);
      setStatus(post.status);
    } else {
      setEditingPost(null);
      setTitle("");
      setContent("");
      setCategoryId(categories[0].id);
      setStatus("Draft");
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!title.trim() || !categoryId) return alert("Title and category are required");
    const tokenUserId = getUserId();
    if (!tokenUserId) return alert("User not logged in");

    const payload = { title, content, categoryId, status, userId: tokenUserId };

    try {
      let updatedPost: Post | null = null;
      if (editingPost) {
        updatedPost = { ...editingPost, ...payload };
        await api.put(`/Post/${editingPost.id}`, payload);
        setPosts((prev) =>
          prev.map((p) =>
            p.id === editingPost.id
              ? { ...updatedPost!, categoryName: categories.find((c) => c.id === payload.categoryId)?.name || "Unknown" }
              : p
          )
        );
      } else {
        const res = await api.post<Post>("/Post", payload);
        updatedPost = { ...res.data, categoryName: categories.find((c) => c.id === res.data.categoryId)?.name || "Unknown" };
        setPosts((prev) => [updatedPost!, ...prev]);
      }

      setShowModal(false);
      setTitle("");
      setContent("");
      setStatus("Draft");
      setEditingPost(null);
    } catch (err) {
      console.error(err);
      alert("Error saving post");
    }
  };

  const confirmDelete = (id: number) => {
    setDeletePostId(id);
    setShowDeletePopup(true);
  };

  const handleDelete = async () => {
    if (deletePostId === null) return;
    const tokenUserId = getUserId();
    if (!tokenUserId) return alert("User not logged in");
    try {
      await api.delete(`/Post/${deletePostId}?userId=${tokenUserId}`);
      setPosts((prev) => prev.filter((p) => p.id !== deletePostId));
      setDeletePostId(null);
      setShowDeletePopup(false);
    } catch (err) {
      console.error(err);
      alert("Error deleting post");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Posts</h1>
          <p className="text-slate-500">Manage blog posts</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white shadow text-slate-800 font-medium hover:bg-slate-50 transition"
          >
            <FiArrowLeft />
            Dashboard
          </button>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            <FiPlus />
            Add Post
          </button>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="p-4 text-left">Title</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Created</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-slate-500">
                  No posts found
                </td>
              </tr>
            )}
            {posts.map((post) => (
              <tr key={post.id} className="border-t hover:bg-slate-50 transition">
                <td className="p-4 font-medium text-slate-800">{post.title}</td>
                <td className="p-4 text-slate-800">{post.categoryName}</td>
                <td className="p-4 text-slate-800">{post.status}</td>
                <td className="p-4 text-slate-600">{new Date(post.createdAt).toLocaleDateString()}</td>
                <td className="p-4 flex justify-center gap-4">
                  <button onClick={() => openModal(post)} className="flex items-center gap-1 text-blue-600 hover:underline">
                    <FiEdit /> Edit
                  </button>
                  <button onClick={() => confirmDelete(post.id)} className="flex items-center gap-1 text-red-600 hover:underline">
                    <FiTrash2 /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-96 shadow-xl">
            <h2 className="text-xl font-bold text-slate-800 mb-4">{editingPost ? "Edit Post" : "Add Post"}</h2>

            <input
              className="w-full border rounded-lg p-2 mb-3 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              className="w-full border rounded-lg p-2 mb-3 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <select
              className="w-full border rounded-lg p-2 mb-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <select
              className="w-full border rounded-lg p-2 mb-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
            </select>

            <div className="flex justify-end gap-3">
              <button className="px-4 py-2 rounded-lg bg-slate-100 text-slate-800 hover:bg-slate-200 transition" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition" onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeletePopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 shadow-xl text-center w-96">
            <p className="mb-6 text-slate-700">Are you sure you want to delete this post?</p>
            <div className="flex justify-center gap-4">
              <button className="px-4 py-2 rounded-lg bg-slate-100 text-slate-800 hover:bg-slate-200 transition" onClick={() => setShowDeletePopup(false)}>
                Cancel
              </button>
              <button className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
