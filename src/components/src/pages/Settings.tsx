import { useState } from "react";

export default function Settings() {
  const [companyName, setCompanyName] = useState("Acme Corp");
  const [industry, setIndustry] = useState("Technology");
  const [email, setEmail] = useState("admin@acmecorp.com");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      companyName,
      industry,
      email,
    };

    console.log("Saved Data:", data);
    alert("Settings Saved!");
  };

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Settings</h1>

      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <input
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="w-full border p-2"
          placeholder="Company Name"
        />

        <input
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="w-full border p-2"
          placeholder="Industry"
        />

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2"
          placeholder="Email"
        />

        <button
          type="submit"
          className="rounded bg-green-600 px-4 py-2 text-white"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}