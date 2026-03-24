"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { LogOut, Bird } from "lucide-react";

export default function Header() {
  const { user, loading } = useAuth();

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bird className="w-8 h-8 text-blue-500 fill-blue-500" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
            NextSNS
          </h1>
        </div>

        <div>
          {loading ? (
            <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
          ) : user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-9 h-9 rounded-full object-cover shadow-sm" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gray-200 shadow-sm" />
                )}
                <span className="font-medium text-sm hidden sm:block text-gray-700">{user.displayName}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                title="ログアウト"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-medium transition-colors shadow-sm text-sm"
            >
              Google ログイン
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
