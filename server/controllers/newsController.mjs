import { fetchNewsByInterests } from "../utils/newsService.mjs";

export const getMyNews = async (req, res) => {
    try 
    {
        // req.user is available because of our 'protect' middleware!
        const interests = req.user.interestCategories;

        if (!interests || interests.length === 0) {
            return res.status(200).json({ 
                message: "No interests found. Showing general news.",
                articles: await fetchNewsByInterests(["latest"]) 
            });
        }

        const articles = await fetchNewsByInterests(interests);
        res.status(200).json({
            count: articles.length,
            articles
        });
    } 
    catch (error) 
    {
        res.status(500).json({ message: error.message });
    }
};