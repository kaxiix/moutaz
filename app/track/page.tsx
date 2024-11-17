"use client";

import { useState } from "react";

interface Item {
  type: string;
  location: string;
}

export default function Component() {
  const [items, setItems] = useState<Item[]>([
    { type: "Mole", location: "Left arm" },
    { type: "Scar", location: "Right knee" },
    { type: "Birthmark", location: "Lower back" },
    { type: "Tattoo", location: "Right shoulder" },
    { type: "Freckle", location: "Nose" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState<Item>({ type: "", location: "" });

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    setItems([...items, newItem]);
    setNewItem({ type: "", location: "" });
    setIsModalOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-md pt-32 mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Body Marks</h1>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location on Body
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((item, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-4 py-3 text-sm text-gray-900">{item.type}</td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {item.location}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg text-lg hover:bg-blue-700 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Your Own Data
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Add New Item</h2>
            <form onSubmit={handleAddItem}>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <input
                  type="text"
                  name="type"
                  value={newItem.type}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Location on Body
                </label>
                <input
                  type="text"
                  name="location"
                  value={newItem.location}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 mr-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
