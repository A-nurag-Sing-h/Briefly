// Elements we need 
const loginTab = document.getElementById('loginTab');
const registerTab = document.getElementById('registerTab');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

// TAB SWITCHING LOGIC
registerTab.addEventListener('click', () => {
    registerForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
    registerTab.classList.add('active');
    loginTab.classList.remove('active');
});

loginTab.addEventListener('click', () => {
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
});

// LOGIN SUBMISSION
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await axios.post('http://localhost:5000/api/users/login', {
            email,
            password
        });

        const data = response.data;
        
        // 🚨 FIX: Your backend sends data.user = { name, token, etc }
        const loggedInUser = data.user;

        console.log('Login Successful!', loggedInUser);
        
        // Save the correct nested values to localStorage
        localStorage.setItem('token', loggedInUser.token);
        localStorage.setItem('userName', loggedInUser.name);

        alert(`Welcome back, ${loggedInUser.name}!`);
        
        // 🚨 FIX: Added missing redirection
        window.location.href = 'dashboard.html';
        
    } catch (error) {
        const errorMsg = error.response?.data?.message || 'Login failed';
        console.error('Login Error:', errorMsg);
        alert(errorMsg);
    }
});

// REGISTRATION SUBMISSION 
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    const checkedBoxes = document.querySelectorAll('.interest-chips input[type="checkbox"]:checked');
    const interestCategories = Array.from(checkedBoxes).map(checkbox => checkbox.value);

    if (interestCategories.length === 0) {
        return alert("Please select at least one interest for your exam prep!");
    }

    try {
        const response = await axios.post('http://localhost:5000/api/users/register', {
            name,
            email,
            password,
            interestCategories
        });

        const data = response.data;
        console.log('Registration Successful!', data);

        // 🚨 FIX: Matching the nested structure of your backend
        const newUser = data.user; 
        
        localStorage.setItem('token', newUser.token);
        localStorage.setItem('userName', newUser.name);

        alert(`Account created! Welcome to Briefly, ${newUser.name}`);
        
        // Redirect to dashboard after registration
        window.location.href = 'dashboard.html';
    } catch (error) {
        const errorMsg = error.response?.data?.message || 'Registration failed';
        console.error('Reg Error:', errorMsg);
        alert(errorMsg);
    }
});