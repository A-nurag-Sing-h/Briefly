import User from "../models/userModel.mjs";
import Bookmark from "../models/bookmark.mjs";

export const addBookmark = async (req,res)=>{
    try 
    {
        const { title, url, source, urlToImage, publishedAt } = req.body;
        const userId = req.user._id;
        const user = await User.findById(userId);

        const isAlreadyBookmarked = user.bookmarks.some((b) => b.url === url);
        if (isAlreadyBookmarked) 
        {
            return res.status(400).json({ message: "Article already bookmarked" });
        }
        user.bookmarks.push({ title, url, source, urlToImage, publishedAt });
        await user.save();
        res.status(200).json({ message: "Article saved!", bookmarks: user.bookmarks });
    }
    catch(err)
    {
        res.status(500).json({ message: err.message });
    }
};

export const showBookmarks = async (req, res) => {
    try 
    {
        // req.user was populated by your protect middleware.
        // We just grab the bookmarks array from it.
        const bookmarks = req.user.bookmarks;
        res.status(200).json({
            success: true,
            count: bookmarks.length,
            bookmarks: bookmarks
        });
    } 
    catch (err) 
    {
        res.status(500).json({ 
            success: false,
            message: "Server Error: Could not retrieve bookmarks" 
        });
    }
};

// controllers/bookmarkController.mjs

export const deleteBookmark = async (req, res) => {
    try {
        const { id } = req.params; 
        
        // 1. Double check we have a user from the 'protect' middleware
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Not authorized, user missing" });
        }

        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const initialCount = user.bookmarks.length;

        // 2. 🚨 THE CRASH-PROOF FILTER
        user.bookmarks = user.bookmarks.filter((bookmark) => {
            // Check if bookmark exists AND has an _id property
            if (bookmark && bookmark._id) {
                // Only keep it if the ID DOES NOT match the one we want to delete
                return bookmark._id.toString() !== id;
            }
            // If bookmark is null or has no _id, we drop it (cleans your DB!)
            return false; 
        });

        // 3. Check if we actually removed something
        if (user.bookmarks.length === initialCount) {
            return res.status(404).json({ message: "Bookmark not found or already deleted" });
        }

        // 4. Save the document back to MongoDB
        await user.save();

        res.status(200).json({ 
            message: "Bookmark removed successfully", 
            bookmarks: user.bookmarks 
        });

    } catch (err) {
        console.error("🔥 Server Crash prevented. Error:", err.message);
        res.status(500).json({ message: "Server Error: " + err.message });
    }
};

// bookmarkController.mjs logic snippet
export const saveBookmark = async (req, res) => {
    try {
        const { title, description, url, urlToImage, source } = req.body;
        
        const newBookmark = await Bookmark.create({
            user: req.user.id, // From your protect middleware
            title, description, url, urlToImage, source
        });

        res.status(201).json({ message: "Article bookmarked!", bookmark: newBookmark });
    } catch (error) {
        res.status(500).json({ message: "Could not save bookmark" });
    }
};