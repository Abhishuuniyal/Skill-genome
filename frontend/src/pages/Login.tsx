import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dna } from "lucide-react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../lib/firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorType, setErrorType] = useState("");

  // 🔥 EMAIL LOGIN (FIREBASE)
  const handleLogin = async (e: any) => {
    e.preventDefault();
    setErrorType("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      console.log("LOGIN SUCCESS:", user);

      localStorage.setItem("user", JSON.stringify(user));

      window.location.href = "/onboarding";

    } catch (error: any) {
      console.log("LOGIN ERROR:", error);

      // 🔥 SMART ERRORS
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/invalid-credential"
      ) {
        setErrorType("no-user");
      } else if (error.code === "auth/wrong-password") {
        setErrorType("wrong-password");
      } else {
        setErrorType("generic");
      }
    }
  };

  // 🔥 GOOGLE LOGIN
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();

    provider.setCustomParameters({
      prompt: "select_account",
    });

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log("GOOGLE USER:", user);

      localStorage.setItem("user", JSON.stringify(user));

      window.location.href = "/onboarding";

    } catch (error: any) {
      console.log("GOOGLE ERROR:", error);
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-grid-pattern relative">
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="glass rounded-2xl p-8 w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <Dna className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold">Skill Genome</span>
          </Link>

          <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your account
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="text-sm font-medium mb-1.5 block">
              Email
            </label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">
              Password
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* 🔥 ERROR UI */}
          {errorType === "no-user" && (
            <p className="text-red-500 text-sm">
              No account found.{" "}
              <Link
                to="/signup"
                className="underline text-primary font-medium"
              >
                Sign up first 🚀
              </Link>
            </p>
          )}

          {errorType === "wrong-password" && (
            <p className="text-red-500 text-sm">
              Incorrect password ❌
            </p>
          )}

          {errorType === "generic" && (
            <p className="text-red-500 text-sm">
              Login failed. Try again.
            </p>
          )}

          <div className="flex justify-end">
            <a
              href="#"
              className="text-xs text-primary hover:underline"
            >
              Forgot password?
            </a>
          </div>

          <Button variant="hero" className="w-full" size="lg">
            Login
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            size="lg"
            onClick={handleGoogleLogin}
          >
            Continue with Google
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-primary hover:underline font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}