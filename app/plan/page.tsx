"use client";
import { useState } from "react";

type PlanType = {
  advice?: string;
  recommendedProducts?: { name: string; type: string; description: string }[];
  skinCarePlan?: string;
} | null;

export default function Component() {
  const [plan, setPlan] = useState<PlanType>(null);
  const [rawResponse, setRawResponse] = useState<string | null>(null); // State to hold raw response
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPlan(null);
    setRawResponse(null);

    try {
      const response = await fetch("/api/generateSkinCarePlan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age: (document.getElementById("age") as HTMLInputElement)?.value,
          gender: (document.getElementById("gender") as HTMLInputElement)
            ?.value,
          skinType: (document.getElementById("skinType") as HTMLInputElement)
            ?.value,
          skinIssues: (
            document.getElementById("skinIssues") as HTMLInputElement
          )?.value,
        }),
      });

      const data = await response.json();

      // Check if there was an error parsing the JSON
      if (data.error) {
        setError(data.error);
        setRawResponse(data.content); // Set the raw content if parsing fails
      } else {
        setPlan(data);
      }
    } catch (err) {
      console.error("Error generating plan:", err);
      setError("An error occurred while generating the skincare plan.");
    }
  };

  return (
    <div className="p-4 pt-32 max-w-md mx-auto space-y-6 min-h-[700px]">
      <h1 className="text-2xl font-bold text-center mb-4">Plan</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="age"
            className="block text-sm font-medium text-gray-700"
          >
            Age
          </label>
          <input
            id="age"
            type="number"
            placeholder="Enter your age"
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label
            htmlFor="gender"
            className="block text-sm font-medium text-gray-700"
          >
            Gender
          </label>
          <select
            id="gender"
            className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
            defaultValue=""
          >
            <option value="" disabled>
              Select gender
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="skinType"
            className="block text-sm font-medium text-gray-700"
          >
            Skin Type
          </label>
          <select
            id="skinType"
            className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
            defaultValue=""
          >
            <option value="" disabled>
              Select skin type
            </option>
            <option value="normal">Normal</option>
            <option value="dry">Dry</option>
            <option value="oily">Oily</option>
            <option value="combination">Combination</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="skinIssues"
            className="block text-sm font-medium text-gray-700"
          >
            Pre-existing Skin Issues
          </label>
          <textarea
            id="skinIssues"
            placeholder="Describe any skin issues you have"
            className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Generate Plan
        </button>
      </form>

      {error && <p className="text-red-500">{error}</p>}

      <div className="border-t border-gray-200 my-6"></div>

      {plan && (
        <div className="border border-gray-200 rounded-lg pb-64 shadow-md p-4 space-y-4">
          <h2 className="text-xl font-semibold">
            Your Personalized Skin Care Plan
          </h2>
          {plan.advice && (
            <div>
              <h3 className="font-semibold">Advice:</h3>
              <p>{plan.advice}</p>
            </div>
          )}
          {plan.recommendedProducts && plan.recommendedProducts.length > 0 && (
            <div>
              <h3 className="font-semibold">Recommended Products:</h3>
              <ul>
                {plan.recommendedProducts.map((product, index) => (
                  <li key={index} className="mb-2">
                    <p>
                      <strong>Name:</strong> {product.name}
                    </p>
                    <p>
                      <strong>Type:</strong> {product.type}
                    </p>
                    <p>
                      <strong>Description:</strong> {product.description}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {plan.skinCarePlan && (
            <div>
              <h3 className="font-semibold">Skin Care Plan:</h3>
              <p>{plan.skinCarePlan}</p>
            </div>
          )}
        </div>
      )}

      {/* Display raw response if JSON parsing fails */}
      {rawResponse && (
        <div className="border border-gray-200 rounded-lg shadow-md p-4 pb-64 space-y-4 bg-yellow-50">
          <h2 className="text-xl font-semibold">Raw OpenAI Response</h2>
          <pre className="whitespace-pre-wrap">{rawResponse}</pre>
        </div>
      )}
    </div>
  );
}
