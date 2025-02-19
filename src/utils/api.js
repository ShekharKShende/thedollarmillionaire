import axios from "axios";

const API_URL = "https://api.thedollarmillionaire.com/api";  // Corrected backend URL

export const fetchStockData = async (symbol) => {
    try {
        const response = await axios.get(`${API_URL}/stocks/${symbol}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("Error fetching stock data:", error);
        return [];
    }
};

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
