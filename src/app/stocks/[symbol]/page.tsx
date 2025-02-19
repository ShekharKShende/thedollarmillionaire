"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchStockData } from "../../../utils/api";
import { useRouter } from "next/navigation";

export default function StockPage() {
  const { symbol } = useParams();
  interface StockData {
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }

  const [stockData, setStockData] = useState<StockData[]>([]);
  const [searchSymbol, setSearchSymbol] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (searchSymbol) {
      router.push(`/stocks/${searchSymbol.toUpperCase()}`);
    }
  };

  useEffect(() => {
    if (symbol) {
      fetchStockData(symbol).then(data => setStockData(data));
    }
  }, [symbol]);

  return (
    <div className="container mx-auto p-4 border border-gray-300">
      <header className="bg-gray-800 text-white py-4">
        <h1 className="text-3xl font-bold text-center">Stock Market Tracker</h1>
      </header>
      <main className="flex flex-col items-center mt-10">
        <input
          type="text"
          placeholder="Enter stock symbol (e.g., AAPL)"
          className="border p-2 mt-4"
          value={searchSymbol}
          onChange={(e) => setSearchSymbol(e.target.value)}
        />
        <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 mt-2">Search</button>
        <h1 className="text-xl font-semibold mt-6">Stock Data for {symbol}</h1>
        {/* Render stock data */}
        {stockData.length > 0 ? (
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Date</th>
                  <th className="py-2 px-4 border-b">Open</th>
                  <th className="py-2 px-4 border-b">High</th>
                  <th className="py-2 px-4 border-b">Low</th>
                  <th className="py-2 px-4 border-b">Close</th>
                  <th className="py-2 px-4 border-b">Volume</th>
                </tr>
              </thead>
              <tbody>
                {stockData.map((data, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border-b">{data.date}</td>
                    <td className="py-2 px-4 border-b">{data.open}</td>
                    <td className="py-2 px-4 border-b">{data.high}</td>
                    <td className="py-2 px-4 border-b">{data.low}</td>
                    <td className="py-2 px-4 border-b">{data.close}</td>
                    <td className="py-2 px-4 border-b">{data.volume}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-red-500 mt-4">No data available for {symbol}</p>
        )}
      </main>
      <footer className="bg-gray-800 text-white py-4 mt-10">
        <p className="text-center">&copy; 2025 Stock Market Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
}