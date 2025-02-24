import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;  // Corrected backend URL

export const fetchStockData = async (symbol) => {
    try {
        const response = await axios.get(`${API_URL}/stocks/${symbol}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("Error fetching stock data:", error);
        return [];
    }
};

export async function fetchHistoricalData(symbol, period = "7d", interval = "1d") {
    const response = await fetch(`${API_URL}/historical/${symbol}?period=${period}&interval=${interval}`);
    const data = await response.json();

    if (!data.prices) throw new Error("No historical data found");

    return data.prices.map((entry) => ({
        date: entry.date,
        price: entry.close,
        open: entry.open,
        high: entry.high,
        low: entry.low,
        close: entry.close
    }));
}


export const fetchCorporateActions = async (symbol) => {
    try {
        const response = await axios.get(`${API_URL}/corporate-actions/${symbol}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("Error fetching corporate actions:", error);
        return [];
    }
};

export const fetchFinancialMetrics = async (symbol) => {
    try {
        const response = await axios.get(`${API_URL}/financial-metrics/${symbol}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("Error fetching financial metrics:", error);
        return {};
    }
};
