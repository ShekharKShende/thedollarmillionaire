"use client";
// filepath: /d:/thedollarmillionaire/frontend/src/app/page.tsx
import '../../styles/globals.css'
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [symbol, setSymbol] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (symbol) {
      router.push(`/stocks/${symbol.toUpperCase()}`);
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h1 className="text-2xl font-bold">Stock Market Tracker</h1>
      <input
        type="text"
        placeholder="Enter stock symbol (e.g., AAPL)"
        className="border p-2 mt-4"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
      />
      <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 mt-2">Search</button>
    </div>
  );
}