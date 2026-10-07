
async function testSubmit() {
    try {
        console.log("Logging in...");
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'chef@gmail.com', password: 'password' })
        }).then(r => r.json());

        let token = loginRes.token;
        if (!token) {
             const loginRes2 = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: 'chef@gmail.com', password: 'chef123' })
            }).then(r => r.json());
            token = loginRes2.token;
        }

        if (!token) { console.error("Login failed"); return; }
        console.log("Logged in successfully!");

        const formData = new FormData();
        formData.append('title', 'Test Recipe');
        formData.append('ingredients', 'Test ingredients');
        formData.append('instructions', 'Test instructions');
        
        // Use a Blob for the image
        const blob = new Blob(['dummy content'], { type: 'image/jpeg' });
        formData.append('image', blob, 'test.jpg');

        console.log("Submitting recipe...");
        const res = await fetch('http://localhost:5000/api/recipes', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData
        });

        const data = await res.json();
        console.log("Status:", res.status);
        console.log("Data:", data);
    } catch (error) {
        console.error("General Error:", error);
    }
}

testSubmit();
