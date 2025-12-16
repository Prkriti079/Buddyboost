import { useState } from "react";
import { registerUser } from "@/api/auth";
import { toast } from "@/hooks/use-toast";

export default function SignupModal({ isOpen, onClose, onSuccess }) {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });

    if (!isOpen) return null;

    function updateField(field, value) {
        setForm({ ...form, [field]: value });
    }

    async function handleSignup(e) {
        e.preventDefault();

        if (!form.firstName || !form.lastName || !form.email || !form.password) {
            toast({ title: "Error", description: "All fields are required." });
            return;
        }

        const res = await registerUser(form);
        if (!res.success) {
            toast({ title: "Signup Failed", description: res.message });
            return;
        }

        toast({ title: "Account Created" });
        onSuccess(res.user, res.token);
        onClose();
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <form className="bg-white text-black p-6 rounded-lg shadow-xl w-80" onSubmit={handleSignup}>

                <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>

                <label className="text-sm font-semibold">First Name</label>
                <input
                    className="border border-gray-400 text-black p-2 w-full mb-2 rounded"
                    value={form.firstName}
                    onChange={(e) => updateField("firstName", e.target.value)}
                    placeholder="John"
                />

                <label className="text-sm font-semibold">Last Name</label>
                <input
                    className="border border-gray-400 text-black p-2 w-full mb-2 rounded"
                    value={form.lastName}
                    onChange={(e) => updateField("lastName", e.target.value)}
                    placeholder="Doe"
                />

                <label className="text-sm font-semibold">Email</label>
                <input
                    className="border border-gray-400 text-black p-2 w-full mb-2 rounded"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="example@mail.com"
                />

                <label className="text-sm font-semibold">Password</label>
                <input
                    className="border border-gray-400 text-black p-2 w-full mb-4 rounded"
                    type="password"
                    value={form.password}
                    onChange={(e) => updateField("password", e.target.value)}
                    placeholder="••••••••"
                />

                <button className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700 transition">
                    Create Account
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
