"use client";

import { useState } from "react";
import Image from "next/image";

interface TableRow {
  id: number;
  avatar: string;
  name: string;
  text: string;
}

const initialData: TableRow[] = [
  {
    id: 1,
    avatar: "/placeholder.svg",
    name: "Alice Johnson",
    text: "Exploring new hiking trails this weekend.",
  },
  {
    id: 2,
    avatar: "/placeholder.svg",
    name: "Bob Smith",
    text: "Just finished reading an amazing sci-fi novel!",
  },
  {
    id: 3,
    avatar: "/placeholder.svg",
    name: "Carol Williams",
    text: "Planning a trip to Japan next month.",
  },
  {
    id: 4,
    avatar: "/placeholder.svg",
    name: "David Brown",
    text: "Learning to play the guitar, any tips?",
  },
  {
    id: 5,
    avatar: "/placeholder.svg",
    name: "Eva Martinez",
    text: "Trying out a new vegan recipe tonight.",
  },
];

export default function Component() {
  const [tableData, setTableData] = useState<TableRow[]>(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRowData, setNewRowData] = useState({ name: "", text: "" });

  const addNewRow = () => {
    const newId = tableData.length + 1;
    const newRow: TableRow = {
      id: newId,
      avatar: "/placeholder.svg",
      name: newRowData.name,
      text: newRowData.text,
    };
    setTableData([...tableData, newRow]);
    setIsModalOpen(false);
    setNewRowData({ name: "", text: "" });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewRowData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div className="p-4 pt-32 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">Mobile Table</h1>
      <div className="space-y-4" role="table" aria-label="User Information">
        {tableData.map((row) => (
          <div
            key={row.id}
            className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow"
            role="row"
          >
            <div className="flex-shrink-0">
              <Image
                src={row.avatar}
                alt={`${row.name}'s avatar`}
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-medium text-gray-900 truncate"
                role="cell"
              >
                {row.name}
              </p>
              <p className="text-sm text-gray-500 truncate" role="cell">
                {row.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full mt-4 flex items-center justify-center py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mr-2 h-4 w-4"
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
        Add New Row
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Add New Row</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addNewRow();
              }}
            >
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={newRowData.name}
                  onChange={handleInputChange}
                  required
                  className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Text
                </label>
                <textarea
                  name="text"
                  value={newRowData.text}
                  onChange={handleInputChange}
                  required
                  className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex justify-end">
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
