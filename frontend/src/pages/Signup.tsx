import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dna } from "lucide-react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [error, setError] = useState("");

  const update = (k: string, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  // 🔥 SIGNUP HANDLER
  const handleSignup = async (e: any) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("Passwords do not match ❌");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      const user = userCredential.user;

      console.log("USER CREATED:", user);

      // save locally
      localStorage.setItem("user", JSON.stringify(user));

      // 🔥 redirect
      window.location.href = "/onboarding";

    } catch (err: any) {
      console.log("SIGNUP ERROR:", err);

      if (err.code === "auth/email-already-in-use") {
        setError("Email already registered. Please login.");
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-grid-pattern relative">
      <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="glass rounded-2xl p-8 w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <Dna className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold">Skill Genome</span>
          </Link>

          <h1 className="text-2xl font-bold mb-1">
            Create your account
          </h1>

          <p className="text-sm text-muted-foreground">
            Start decoding your skill genome
          </p>
        </div>

        {/* 🔥 FORM */}
        <form className="space-y-4" onSubmit={handleSignup}>
          <div>
            <label className="text-sm font-medium mb-1.5 block">
              Full Name
            </label>
            <Input
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">
              Email
            </label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">
              Password
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">
              Confirm Password
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              value={form.confirm}
              onChange={(e) => update("confirm", e.target.value)}
            />
          </div>

          {/* 🔥 ERROR MESSAGE */}
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          {/* 🔥 FIXED BUTTON */}
          <Button
            variant="hero"
            className="w-full"
            size="lg"
            type="submit"
          >
            Create Account
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary hover:underline font-medium"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}