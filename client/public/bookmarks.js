// 1. DOM Elements
const bookmarksFeed = document.getElementById('bookmarksFeed');
const token = localStorage.getItem('token');
const logoutBtn = document.getElementById('logoutBtn');

// 2. Auth Guard: Kick unauthorized users back to login
if (!token) {
    window.location.href = 'index.html';
}

// 3. Fetch Bookmarks from your specific backend route
// Inside bookmarks.js
const fetchBookmarks = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/bookmark/bookmarks', {
            headers: { Authorization: `Bearer ${token}` }
        });

        // 🚨 DEBUG: Look at this in your console!
        console.log("Full Data from Backend:", response.data);

        // 🚨 THE FIX: 
        // If your backend sends the array directly: use response.data
        // If your backend wraps it: use response.data.bookmarks (or whatever key you used)
        const bookmarksArray = Array.isArray(response.data) ? response.data : response.data.bookmarks;

        if (bookmarksArray) {
            renderBookmarks(bookmarksArray);
        } else {
            console.error("Backend did not return an array!", response.data);
            renderBookmarks([]); // Show empty state
        }

    } catch (error) {
        console.error("Library Fetch Error:", error);
        bookmarksFeed.innerHTML = `<p class="error">Failed to load library.</p>`;
    }
};

// 4. Render the Saved Articles as Cards
const renderBookmarks = (items) => {
    // If no bookmarks, show a helpful message
    if (!items || items.length === 0) {
        bookmarksFeed.innerHTML = `
            <div class="info-box" style="grid-column: 1/-1; text-align: center; padding: 50px;">
                <p>Your library is currently empty.</p>
                <a href="dashboard.html" style="color: var(--primary); font-weight: bold;">Browse the news feed ➔</a>
            </div>`;
        return;
    }

    // Map through the items and create the HTML cards
    bookmarksFeed.innerHTML = items.map(item => `
        <div class="news-card" id="card-${item._id}">
            <img src="${item.urlToImage || 'https://via.placeholder.com/400x200?text=Saved+Article'}" alt="news">
            <div class="news-card-content">
                <h3>${item.title}</h3>
                <p>${item.description ? item.description.slice(0, 100) + '...' : ''}</p>
                <div class="card-actions">
                    <a href="${item.url}" target="_blank" class="read-more">Read Article</a>
                    <button class="delete-btn" data-id="${item._id}">Remove 🗑️</button>
                </div>
            </div>
        </div>
    `).join('');
};

// 5. Delete Logic (Using Event Delegation)
// 5. Delete Logic (Using Event Delegation)
bookmarksFeed.addEventListener('click', async (e) => {
    // 1. Check if the clicked element (or its parent icon) is the delete button
    const deleteBtn = e.target.closest('.delete-btn');
    
    if (deleteBtn) {
        const bookmarkId = deleteBtn.getAttribute('data-id');
        console.log("Attempting to delete Bookmark ID:", bookmarkId);
        
        if (!confirm("Remove this article from your library?")) return;

        try {
            // 🚨 MATCHING YOUR BACKEND: 
            // Your server.mjs uses: app.use('/api/bookmarks', ...)
            // Your router uses: router.delete('/bookmarks/:id', ...)
            // TOTAL URL: /api/bookmarks/bookmarks/${id}
            
            const deleteUrl = `http://localhost:5000/api/bookmark/bookmarks/${bookmarkId}`;
            console.log("Calling Delete URL:", deleteUrl);

            await axios.delete(deleteUrl, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // 2. Success! Remove the card from the UI
            const card = document.getElementById(`card-${bookmarkId}`);
            if (card) {
                card.remove();
                console.log("Card removed from UI");
            }

            // 3. If the library is now empty, refresh the view
            if (bookmarksFeed.children.length === 0) {
                renderBookmarks([]);
            }

        } catch (error) {
            console.error("Delete Error details:", error.response?.data || error.message);
            alert(`Delete failed: ${error.response?.data?.message || "Server error"}`);
        }
    }
});

// 6. Logout Logic
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.clear();
        window.location.href = 'index.html';
    });
}

// 7. Initial Load
fetchBookmarks();