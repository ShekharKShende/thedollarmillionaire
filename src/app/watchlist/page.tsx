"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchStockData, fetchHistoricalData } from "../../utils/api";
import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const WatchlistPage = () => {
  const [watchlist, setWatchlist] = useState<string[]>([]);
  interface StockData {
    symbol: string;
    name: string;
    price: number;
    previousClose: number;
    priceChange: number;
    priceChangePercent: number;
    history: { date: string; open: number; high: number; low: number; close: number }[];
  }

  const [stockData, setStockData] = useState<StockData[]>([]);
  const [historicalData, setHistoricalData] = useState<Record<string, { date: string; open: number; high: number; low: number; close: number }[]>>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedWatchlist = JSON.parse(localStorage.getItem("watchlist") || "[]");
    setWatchlist(savedWatchlist);
  }, []);

  useEffect(() => {
    if (watchlist.length === 0) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const data = await Promise.all(
          watchlist.map(async (symbol) => {
            try {
              const stock = await fetchStockData(symbol);
              const history = await fetchHistoricalData(symbol, "7d", "1d");
              console.log("history", history);
              return {
                symbol: stock.symbol,
                name: stock.name,
                price: stock.price,
                previousClose: stock.previousClose,
                priceChange: stock.price - stock.previousClose,
                priceChangePercent: ((stock.price - stock.previousClose) / stock.previousClose) * 100,
                history: history.map((entry: { date: string; open: number; high: number; low: number; close: number }) => ({
                  date: entry.date,
                  open: entry.open,
                  high: entry.high,
                  low: entry.low,
                  close: entry.close
                })),
              };
            } catch {
              return null;
            }
          })
        );

        const validData = data.filter((stock) => stock !== null) as StockData[];
        setStockData(validData);

        // Set historical data for each stock
        const historyMap: Record<string, { date: string; open: number; high: number; low: number; close: number }[]> = {};
        validData.forEach((stock) => {
          historyMap[stock.symbol] = stock.history;
        });
        setHistoricalData(historyMap);
      } catch (error) {
        console.error("Error fetching watchlist data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [watchlist]);

  if (loading) return <p className="text-center text-gray-500 mt-4">Loading watchlist...</p>;
  console.log("historicalData", historicalData["AAPL"]);
  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-4">My Watchlist</h1>

      {watchlist.length === 0 ? (
        <p className="text-gray-500">Your watchlist is empty.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Stock</th>
                <th className="px-4 py-2 text-left">Price (₹)</th>
                <th className="px-4 py-2 text-left">Daily Move (%)</th>
                <th className="px-4 py-2 text-left">Chart (Last 7 Days)</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {stockData.map((stock) => (
                <tr key={stock.symbol} className="border-b">
                  <td className="px-4 py-2">
                    <Link href={`/stocks/${stock.symbol}`}>
                      <span className="text-blue-500 cursor-pointer hover:underline">
                        {stock.name} ({stock.symbol})
                      </span>
                    </Link>
                  </td>
                  <td className="px-4 py-2">{stock.price}</td>
                  <td className="px-4 py-2">
                    <span className={stock.priceChange > 0 ? "text-green-500" : "text-red-500"}>
                      {stock.priceChangePercent.toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {historicalData[stock.symbol]?.length > 0 ? (
                      <div className="w-40 h-24">
                        <ResponsiveContainer width="100%" height="100%">
                          <ComposedChart data={historicalData[stock.symbol]}>
                            <XAxis dataKey="date" hide />
                            <YAxis hide />
                            <Tooltip />
                            <Bar dataKey="low" fill="#8884d8" />
                            <Bar dataKey="high" fill="#82ca9d" />
                            <Line type="monotone" dataKey="open" stroke="#ff7300" />
                            <Line type="monotone" dataKey="close" stroke="#387908" />
                          </ComposedChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <p className="text-gray-500">No data</p>
                    )}
                  </td>
           
                  <td className="px-4 py-2">
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded-md"
                      onClick={() => {
                        const updatedWatchlist = watchlist.filter((s) => s !== stock.symbol);
                        setWatchlist(updatedWatchlist);
                        localStorage.setItem("watchlist", JSON.stringify(updatedWatchlist));
                      }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default WatchlistPage;
