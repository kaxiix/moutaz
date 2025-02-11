"use client";

import { useState } from "react";

export default function MoleAssessment() {
  const [formData, setFormData] = useState({
    asymmetry: "",
    border: "",
    color: "",
    diameter: "",
  });
  const [result, setResult] = useState<{
    type: string;
    likelihood: string;
  } | null>(null);
  const [rawResponse, setRawResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);

  const handleChange = (value: string, name: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setRawResponse(null);

    try {
      const response = await fetch("/api/analyzeMole", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        setRawResponse(data.content || "No additional information.");
      } else {
        setResult(data.result);
      }
    } catch (err) {
      console.error("Error analyzing mole:", err);
      setError("An error occurred while analyzing the mole.");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-20 p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4">Mole Assessment</h2>
      {/* Image placeholder and upload button */}
      <div className="flex flex-col items-center mb-4">
        {image ? (
          <img
            src={image}
            alt="Uploaded mole"
            className="w-32 h-32 object-cover rounded-full border border-gray-300"
          />
        ) : (
          <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
        <label
          htmlFor="image-upload"
          className="mt-2 text-blue-600 cursor-pointer hover:underline"
        >
          Upload Photo
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Form fields for asymmetry, border, color, and diameter */}
        {/* Asymmetry */}
        <div>
          <label
            htmlFor="asymmetry"
            className="block text-sm font-medium text-gray-700"
          >
            Asymmetry (A)
          </label>
          <select
            id="asymmetry"
            value={formData.asymmetry}
            onChange={(e) => handleChange(e.target.value, "asymmetry")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="" disabled>
              Select asymmetry
            </option>
            <option value="Symmetrical">Symmetrical</option>
            <option value="Asymmetrical">Asymmetrical</option>
          </select>
        </div>

        {/* Border */}
        <div>
          <label
            htmlFor="border"
            className="block text-sm font-medium text-gray-700"
          >
            Border (B)
          </label>
          <select
            id="border"
            value={formData.border}
            onChange={(e) => handleChange(e.target.value, "border")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="" disabled>
              Select border type
            </option>
            <option value="Regular">Regular</option>
            <option value="Irregular">Irregular</option>
          </select>
        </div>

        {/* Color */}
        <div>
          <label
            htmlFor="color"
            className="block text-sm font-medium text-gray-700"
          >
            Color (C)
          </label>
          <select
            id="color"
            value={formData.color}
            onChange={(e) => handleChange(e.target.value, "color")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="" disabled>
              Select color
            </option>
            <option value="Uniform Color">Uniform Color</option>
            <option value="Multiple Colors">Multiple Colors</option>
          </select>
        </div>

        {/* Diameter */}
        <div>
          <label
            htmlFor="diameter"
            className="block text-sm font-medium text-gray-700"
          >
            Diameter (D)
          </label>
          <select
            id="diameter"
            value={formData.diameter}
            onChange={(e) => handleChange(e.target.value, "diameter")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="" disabled>
              Select diameter
            </option>
            <option value="Smaller than 6mm">Smaller than 6mm</option>
            <option value="Larger than 6mm">Larger than 6mm</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-2 mt-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Analyze
        </button>
      </form>
      {/* Display result formatted */}
      {result && (
        <div className="mt-6 p-4 bg-gray-100 rounded-md border border-gray-300">
          <h3 className="text-lg font-semibold text-center">Analysis Result</h3>
          <p className="mt-2 text-center">
            <strong>Type:</strong> {result.type}
          </p>
          <p className="mt-1 text-center">
            <strong>Likelihood of Cancer:</strong> {result.likelihood}
          </p>
        </div>
      )}
      {/* Display raw response if JSON parsing fails */}
      {rawResponse && (
        <div className="mt-6 p-4 bg-yellow-100 rounded-md">
          <h3 className="text-lg font-semibold">Raw OpenAI Response:</h3>
          <pre className="whitespace-pre-wrap">{rawResponse}</pre>
        </div>
      )}
      {/* Display error message */}
      {error && <p className="text-red-500 mt-4">{error}</p>}
      random text
    </div>
  );
}
