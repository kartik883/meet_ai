"use client";

import { useState } from "react";

const TryProducts = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submittedData, setSubmittedData] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault(); // prevent page reload

    setSubmittedData({
      name: name,
      email: email,
    });

    setName("");
    setEmail("");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="p-5 flex flex-col gap-3 bg-white shadow-md rounded"
      >
        <input
          type="text"
          className="border-2 p-2"
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="email"
          className="border-2 p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded"
        >
          Submit
        </button>
      </form>

      {/* Show submitted data */}
      {submittedData && (
        <div className="mt-5 p-4 bg-white shadow rounded">
          <p><strong>Name:</strong> {submittedData.name}</p>
          <p><strong>Email:</strong> {submittedData.email}</p>
        </div>
      )}
    </div>
  );
};

export default TryProducts;