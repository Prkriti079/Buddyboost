import { useState } from "react";
import { loginUser } from "@/api/auth";
import { toast } from "@/hooks/use-toast";

export default function LoginModal({ isOpen, onClose, onSuccess }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    if (!isOpen) return null;

    async function handleLogin(e) {
        e.preventDefault();

        if (!email || !password) {
            toast({ title: "Error", description: "All fields are required." });
            return;
        }

        const res = await loginUser(email, password);
        if (!res.success) {
            toast({ title: "Login Failed", description: res.message });
            return;
        }

        toast({ title: "Login Successful" });
        onSuccess(res.user, res.token);
        onClose();
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <form className="bg-white text-black p-6 rounded-lg shadow-xl w-80" onSubmit={handleLogin}>

                <h2 className="text-2xl font-bold mb-4 text-center">Log In</h2>

                <label className="text-sm font-semibold">Email</label>
                <input
                    className="border border-gray-400 text-black p-2 w-full mb-3 rounded"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <label className="text-sm font-semibold">Password</label>
                <input
                    className="border border-gray-400 text-black p-2 w-full mb-4 rounded"
                    placeholder="Enter your password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition">
                    Login
                </button>

                <button
                    className="mt-3 w-full py-2 border border-gray-600 rounded hover:bg-gray-100 transition"
                    onClick={onClose}
                    type="button"
                >
                    Cancel
                </button>
            </form>
        </div>
    );
}
