import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: String,
    url: { type: String, required: true },
    urlToImage: String,
    source: String,
    savedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Bookmark', bookmarkSchema);