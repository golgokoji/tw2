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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-3">
          {user.photoURL ? (
            <img src={user.photoURL} alt="User" className="w-10 h-10 rounded-full object-cover shrink-0 shadow-sm" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0 shadow-sm" />
          )}
          <div className="flex-1">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="いまどうしてる？"
              className="w-full resize-none border-none outline-none text-lg placeholder-gray-400 bg-transparent min-h-[80px]"
              maxLength={280}
              disabled={loading}
            />
            <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-2">
              <span className="text-sm text-gray-400 font-medium">
                {280 - text.length}
              </span>
              <button
                type="submit"
                disabled={!text.trim() || loading}
                className="flex items-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 text-white rounded-full font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
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
