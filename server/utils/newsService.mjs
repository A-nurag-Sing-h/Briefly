import axios from "axios";

export const fetchNewsByInterests = async (interests) => {
    try 
    {
        const apiKey = process.env.NEWS_API_KEY;
        // Join interests with OR for the API query (e.g., "Technology OR Exams")
        const query = interests.join(" OR ");
        
        const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=${apiKey}&pageSize=10`;

        const response = await axios.get(url);
        return response.data.articles;
    } 
    catch (error) 
    {
        console.error("News API Error:", error.response?.data || error.message);
        throw new Error("Failed to fetch news");
    }
};