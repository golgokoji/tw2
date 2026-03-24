"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { LogOut, Bird, Sun, Moon } from "lucide-react";

export default function Header() {
  const { user, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();

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
    <header className="sticky top-0 z-50 bg-header-bg backdrop-blur-md border-b border-card-border transition-colors duration-200">
      <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bird className="w-8 h-8 text-btn fill-btn" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-btn to-cyan-500 bg-clip-text text-transparent">
            NextSNS
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 text-icon hover:text-text hover:bg-icon-hover rounded-full transition-colors"
            title="テーマ切り替え"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {loading ? (
            <div className="w-8 h-8 rounded-full border-2 border-btn border-t-transparent animate-spin" />
          ) : user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-9 h-9 rounded-full object-cover shadow-sm" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-icon-hover shadow-sm" />
                )}
                <span className="font-medium text-sm hidden sm:block text-text">{user.displayName}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-icon hover:text-red-500 hover:bg-icon-hover rounded-full transition-colors"
                title="ログアウト"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="px-5 py-2 bg-btn hover:bg-btn-hover text-btn-text rounded-full font-medium transition-colors shadow-sm text-sm"
            >
              Google ログイン
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
