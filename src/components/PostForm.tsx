"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Send } from "lucide-react";

export default function PostForm() {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      setLoading(true);
      await addDoc(collection(db, "posts"), {
        text: text.trim(),
        userId: user.uid,
        userName: user.displayName || "Anonymous",
        userPhoto: user.photoURL || "",
        createdAt: serverTimestamp(),
      });
      setText("");
    } catch (error) {
      console.error("Error adding post: ", error);
      alert("投稿に失敗しました。詳細: " + String(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card rounded-xl shadow-sm border border-card-border p-4 mb-6 transition-colors duration-200">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-3">
          {user.photoURL ? (
            <img src={user.photoURL} alt="User" className="w-10 h-10 rounded-full object-cover shrink-0 shadow-sm" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-icon-hover shrink-0 shadow-sm" />
          )}
          <div className="flex-1">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="いまどうしてる？"
              className="w-full resize-none border-none outline-none text-lg text-text placeholder-icon bg-transparent min-h-[80px]"
              maxLength={280}
              disabled={loading}
            />
            <div className="flex items-center justify-between border-t border-card-border pt-3 mt-2">
              <span className="text-sm text-icon font-medium">
                {280 - text.length}
              </span>
              <button
                type="submit"
                disabled={!text.trim() || loading}
                className="flex items-center gap-2 px-6 py-2 bg-btn hover:bg-btn-hover focus:ring-2 focus:ring-btn/50 text-btn-text rounded-full font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <span>投稿する</span>
                <Send className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
