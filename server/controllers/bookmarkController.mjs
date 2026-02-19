import User from "../models/userModel.mjs";

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

export const deleteBookmark = async (req, res) => {
    try 
    {
        const { id } = req.params; 
        const userId = req.user._id;

        const user = await User.findById(userId);

        if (!user) 
            {
            return res.status(404).json({ message: "User not found" });
        }

        // 1. Filter out the bookmark with the matching ID
        const initialCount = user.bookmarks.length;
        user.bookmarks = user.bookmarks.filter(
            (bookmark) => bookmark._id.toString() !== id
        );

        // 2. Check if anything was actually removed
        if (user.bookmarks.length === initialCount) {
            return res.status(404).json({ message: "Bookmark not found or already deleted" });
        }

        // 3. Save the updated user document
        await user.save();

        res.status(200).json({ 
            message: "Bookmark removed successfully", 
            bookmarks: user.bookmarks 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};