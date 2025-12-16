const API = "http://localhost:4000/api/challenges";

export async function getDiscoverChallenges() {
    const res = await fetch(`${API}/discover`, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
    });
    return res.json();
}

export async function getMyChallenges() {
    const res = await fetch(`${API}/mine`, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
    });
    return res.json();
}

export async function joinChallenge(id) {
    const res = await fetch(`${API}/join/${id}`, {
        method: "POST",
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
    });
    return res.json();
}

export async function createChallenge(data) {
    const res = await fetch(`${API}/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify(data)
    });
    return res.json();
}
