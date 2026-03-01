import { fetchNewsByInterests } from "../utils/newsService.mjs";
import User from "../models/userModel.mjs";
import { searchNewsByKeyword } from "../utils/newsService.mjs";


export const getMyNews = async (req, res) => {
    try 
    {
        const user = await User.findById(req.user._id);
        const interests = user.interestCategories;
        if (!interests || interests.length === 0) {
            const articles = await fetchNewsByInterests(["latest"]);
            return res.status(200).json({ 
                message: "No interests found. Showing general news.",
                articles 
            });
        }
        const sortedInterestStrings = [...interests]
            .sort((a, b) => b.points - a.points)
            .map(item => item.category);

        const articles = await fetchNewsByInterests(sortedInterestStrings);
        res.status(200).json({
            success: true,
            count: articles.length,
            activePriorities: sortedInterestStrings, // Useful for debugging!
            articles
        });
    } 
    catch (error) 
    {
        res.status(500).json({ message: error.message });
    }
};

export const searchNews = async (req, res, next) => {
    try 
    {
        const { q } = req.query; 

        if (!q || q.trim() === "") {
            res.status(400);
            throw new Error("Please provide a search keyword (q)");
        }

        const articles = await searchNewsByKeyword(q);

        res.status(200).json({
            success: true,
            results: articles.length,
            query: q,
            articles,
        });
    } 
    catch (err) 
    {
        res.status(500).send({message:err.message});
    }
};