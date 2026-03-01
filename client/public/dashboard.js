// 1. DOM Elements
const newsFeed = document.getElementById('newsFeed');
const welcomeName = document.getElementById('welcomeName');
const logoutBtn = document.getElementById('logoutBtn');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

// 2. Security Check & Setup
const token = localStorage.getItem('token');
const userName = localStorage.getItem('userName');

if (!token) {
    // Kick unauthorized users back to login
    window.location.href = 'index.html';
}

if (userName) {
    welcomeName.textContent = `Hi, ${userName}`;
}

// 3. Logout Logic
logoutBtn.addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'index.html';
});

// 4. Render News Cards (Reusable Function)
const renderNews = (articles) => {
    if (!articles || articles.length === 0) {
        newsFeed.innerHTML = "<p class='info'>No articles found. Try a different topic!</p>";
        return;
    }

    // Inside dashboard.js -> renderNews function
newsFeed.innerHTML = articles.map(article => `
    <div class="news-card">
        <img src="${article.urlToImage || 'https://via.placeholder.com/400x200'}" alt="news">
        <div class="news-card-content">
            <h3>${article.title}</h3>
            <p>${article.description ? article.description.slice(0, 80) + '...' : ''}</p>
            <div class="card-actions">
                <a href="${article.url}" target="_blank" class="read-more">Read Full Story</a>
                <button class="save-btn" 
                    data-title="${article.title}" 
                    data-url="${article.url}" 
                    data-img="${article.urlToImage}"
                    data-desc="${article.description}">
                    Save 🔖
                </button>
            </div>
        </div>
    </div>
`).join('');
};

// 5. Fetch Personalized News (Initial Load)
const fetchMyNews = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/news/my-news', {
            headers: { Authorization: `Bearer ${token}` }
        });
        renderNews(response.data.articles);
    } catch (error) {
        console.error("Fetch Error:", error);
        newsFeed.innerHTML = "<p class='error'>Failed to load personalized feed.</p>";
    }
};

// 6. Search Functionality
const handleSearch = async () => {
    const query = searchInput.value.trim();
    
    if (!query) {
        // If search is empty, go back to personalized news
        return fetchMyNews();
    }

    newsFeed.innerHTML = `<p class="loading">Searching for "${query}"...</p>`;

    try {
        const response = await axios.get(`http://localhost:5000/api/news/search?q=${query}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        renderNews(response.data.articles);
    } catch (error) {
        console.error("Search Error:", error);
        newsFeed.innerHTML = "<p class='error'>Search failed. Try again later.</p>";
    }
};

// 7. Event Listeners for Search
searchBtn.addEventListener('click', handleSearch);

// Allow pressing "Enter" key to search
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});

// Initial Call
fetchMyNews();

newsFeed.addEventListener('click', async (e) => {
    if (e.target.classList.contains('save-btn')) {
        const btn = e.target;
        
        // Grab the data we stored in the "data-" attributes
        const articleData = {
            title: btn.getAttribute('data-title'),
            url: btn.getAttribute('data-url'),
            urlToImage: btn.getAttribute('data-img'),
            description: btn.getAttribute('data-desc')
        };

        try {
            await axios.post('http://localhost:5000/api/bookmark/bookmarks', articleData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            btn.textContent = "Saved ✅";
            btn.style.background = "#4CAF50";
            btn.disabled = true; // Prevent double saving
        } catch (error) {
            console.error("Save Error:", error);
            alert("Failed to save article.");
        }
    }
});