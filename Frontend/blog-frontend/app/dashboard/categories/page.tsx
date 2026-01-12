"use client";

import { useEffect, useState } from "react";
import { FiEdit, FiTrash2, FiPlus, FiArrowLeft } from "react-icons/fi";
import { useRouter } from "next/navigation";
import api from "../../lib/api";

type Category = {
  id: number;
  name: string;
  createdAt: string;
};

export default function CategoriesPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState("");

  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState<number | null>(null);

  /* ========================
     LOAD CATEGORIES
     ======================== */
  const loadCategories = async () => {
    try {
      const res = await api.get<Category[]>("/Category");
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to load categories", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  /* ========================
     ADD / EDIT
     ======================== */
  const openModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setName(category.name);
    } else {
      setEditingCategory(null);
      setName("");
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (editingCategory) {
        await api.put(`/Category/${editingCategory.id}`, { name });
      } else {
        await api.post("/Category", { name });
      }
      setShowModal(false);
      loadCategories();
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  /* ========================
     DELETE
     ======================== */
  const confirmDelete = (id: number) => {
    setDeleteCategoryId(id);
    setShowDeletePopup(true);
  };

  const handleDelete = async () => {
    if (!deleteCategoryId) return;
    try {
      await api.delete(`/Category/${deleteCategoryId}`);
      setShowDeletePopup(false);
      loadCategories();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Categories
          </h1>
          <p className="text-slate-500">
            Manage blog categories
          </p>
        </div>

        <div className="flex gap-3">
          {/* Back to Dashboard */}
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg
                       bg-white shadow text-slate-800 font-medium
                       hover:bg-slate-50 transition"
          >
            <FiArrowLeft />
            Dashboard
          </button>

          {/* Add Category */}
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-indigo-600
                       text-white px-4 py-2 rounded-lg
                       hover:bg-indigo-700 transition"
          >
            <FiPlus />
            Add Category
          </button>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Created</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr
                key={c.id}
                className="border-t hover:bg-slate-50 transition"
              >
                <td className="p-4 font-medium text-slate-800">
                  {c.name}
                </td>
                <td className="p-4 text-slate-600">
                  {new Date(c.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4 flex justify-center gap-4">
                  <button
                    onClick={() => openModal(c)}
                    className="flex items-center gap-1 text-blue-600 hover:underline"
                  >
                    <FiEdit /> Edit
                  </button>
                  <button
                    onClick={() => confirmDelete(c.id)}
                    className="flex items-center gap-1 text-red-600 hover:underline"
                  >
                    <FiTrash2 /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= ADD / EDIT MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-96 shadow-xl">
            <h2 className="text-xl font-bold text-slate-800 mb-4">
              {editingCategory ? "Edit Category" : "Add Category"}
            </h2>

            <input
              className="w-full border rounded-lg p-2 mb-4
                         text-slate-900 placeholder-slate-500
                         focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Category name"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg
                           bg-slate-100 text-slate-800
                           hover:bg-slate-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg
                           bg-indigo-600 text-white
                           hover:bg-indigo-700 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRM ================= */}
      {showDeletePopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 text-center shadow-xl">
            <p className="mb-6 text-slate-700">
              Are you sure you want to delete this category?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowDeletePopup(false)}
                className="px-4 py-2 rounded-lg
                           bg-slate-100 text-slate-800
                           hover:bg-slate-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg
                           bg-red-600 text-white
                           hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
