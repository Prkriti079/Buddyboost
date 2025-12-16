const API_URL = "http://localhost:4000/api/users";

export async function loginUser(email, password) {
    try {
        const res = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        return await res.json();
    } catch {
        return { success: false, message: "Server error" };
    }
}

export async function getProfile() {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:4000/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
    });

    return res.json();
}


export async function registerUser(data) {
    try {
        const res = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        return await res.json();
    } catch {
        return { success: false, message: "Server error" };
    }
}
