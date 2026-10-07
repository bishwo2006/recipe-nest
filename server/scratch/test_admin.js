
async function testAdminActions() {
    try {
        console.log("Logging in as Admin...");
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@gmail.com', password: 'admin123' })
        }).then(r => r.json());

        const token = loginRes.token;
        if (!token) { console.error("Admin Login failed"); return; }
        console.log("Logged in successfully!");

        // 1. Get Pending Recipes
        console.log("Fetching pending recipes...");
        const pendingRes = await fetch('http://localhost:5000/api/admin/recipes/pending', {
            headers: { Authorization: `Bearer ${token}` }
        }).then(r => r.json());

        if (!pendingRes.length) {
            console.log("No pending recipes found to test with.");
            return;
        }

        const recipeId = pendingRes[0]._id;
        console.log(`Found pending recipe: ${recipeId}`);

        // 2. Test Approve
        console.log("Testing Approval...");
        const approveRes = await fetch(`http://localhost:5000/api/admin/recipes/${recipeId}/approve`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log("Approve Status:", approveRes.status);
        console.log("Approve Data:", await approveRes.json());

    } catch (error) {
        console.error("General Error:", error);
    }
}

testAdminActions();
