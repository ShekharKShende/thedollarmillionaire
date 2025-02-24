"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { fetchStockData, fetchHistoricalData } from "../../../utils/api.js";
import Link from "next/link";
import { ComposedChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const StockPage = () => {
  const { symbol } = useParams();

  interface Stock {
    name: string;
    symbol: string;
    price: number;
    peRatio: number | null;
    mcap: number;
  }

  interface HistoricalData {
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
  }

  const [stock, setStock] = useState<Stock | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingStock, setLoadingStock] = useState<boolean>(true);
  const [loadingHistorical, setLoadingHistorical] = useState<boolean>(true);

  useEffect(() => {
    if (!symbol) return;

    const getStockData = async () => {
      try {
        const data = await fetchStockData(symbol as string);
        setStock(data);
      } catch {
        setError("Stock data not found");
      } finally {
        setLoadingStock(false);
      }
    };

    const getHistoricalData = async () => {
      try {
        const data = await fetchHistoricalData(symbol as string, "7d", "1d");
        setHistoricalData(data);
      } catch {
        setError("Historical data not found");
      } finally {
        setLoadingHistorical(false);
      }
    };

    getStockData();
    getHistoricalData();

    // Load watchlist from local storage
    const savedWatchlist = JSON.parse(localStorage.getItem("watchlist") || "[]");
    setWatchlist(savedWatchlist);
  }, [symbol]);

  // Function to toggle watchlist
  const toggleWatchlist = () => {
    if (!stock) return;

    let updatedWatchlist;
    if (watchlist.includes(stock.symbol)) {
      updatedWatchlist = watchlist.filter((s) => s !== stock.symbol);
    } else {
      updatedWatchlist = [...watchlist, stock.symbol];
    }

    setWatchlist(updatedWatchlist);
    localStorage.setItem("watchlist", JSON.stringify(updatedWatchlist));
  };

  if (error) return <p className="text-red-500 text-center mt-4">{error}</p>;
  if (loadingStock || loadingHistorical) return <p className="text-center text-gray-500 mt-4">Loading...</p>;
  if (!stock) return null;

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-lg space-y-4">
      <h1 className="text-2xl font-bold">{stock.name} ({stock.symbol})</h1>
      <p><strong>Price:</strong> ₹{stock.price}</p>
      <p><strong>PE Ratio:</strong> {stock.peRatio || "N/A"}</p>
      <p><strong>Market Cap:</strong> ₹{(stock.mcap / 1e9).toFixed(2)}B</p>

      {/* Candlestick Chart */}
      <div className="w-full h-48">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={historicalData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="low" fill="#8884d8" />
            <Bar dataKey="high" fill="#82ca9d" />
            <Bar dataKey="open" fill="#ff7300" />
            <Bar dataKey="close" fill="#387908">
              {historicalData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.close > entry.open ? "green" : "red"} />
              ))}
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Watchlist Button */}
      <div className="flex justify-center gap-4">
        <button 
          className={`px-4 py-2 rounded-lg text-white ${
            watchlist.includes(stock.symbol) ? "bg-red-500" : "bg-blue-500"
          }`}
          onClick={toggleWatchlist}
        >
          {watchlist.includes(stock.symbol) ? "Remove from Watchlist" : "Add to Watchlist"}
        </button>

        <Link href="/watchlist">
          <button className="px-4 py-2 bg-green-500 text-white rounded-lg">
            View Watchlist
          </button>
        </Link>
      </div>
    </div>
  );
};

export default StockPage;
