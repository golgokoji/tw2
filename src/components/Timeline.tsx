"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { Post } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import { MessageCircle, Heart, Repeat2, Share } from "lucide-react";

export default function Timeline() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map((doc) => {
        const data = doc.data();
        let createdAt = 0;
        if (data.createdAt) {
           if (data.createdAt.toMillis) {
             createdAt = data.createdAt.toMillis();
           } else {
             createdAt = data.createdAt; // Number fallback
           }
        }
        return {
          id: doc.id,
          ...data,
          createdAt,
        } as Post;
      });
      setPosts(postsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching posts: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <div className="w-10 h-10 rounded-full border-4 border-blue-100 border-t-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {posts.length === 0 ? (
        <div className="text-center p-12 text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="font-medium text-lg mb-1">タイムラインはまだ空です。</p>
          <p className="text-sm text-gray-400">最初の投稿をしてみましょう！</p>
        </div>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 transition duration-200 hover:bg-gray-50/80 cursor-pointer">
            <div className="flex gap-3">
              {post.userPhoto ? (
                <img src={post.userPhoto} alt={post.userName} className="w-12 h-12 rounded-full object-cover shrink-0 shadow-sm" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 shrink-0 shadow-sm" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="font-bold text-gray-900 truncate hover:underline">{post.userName}</span>
                    <span className="text-sm text-gray-500 truncate">@{post.userId.substring(0, 8)}</span>
                    <span className="text-gray-300 mx-1">·</span>
                    <span className="text-sm text-gray-500 shrink-0 tabular-nums hover:underline">
                      {post.createdAt ? formatDistanceToNow(post.createdAt, { addSuffix: true, locale: ja }) : 'たった今'}
                    </span>
                  </div>
                </div>
                <p className="text-gray-900 whitespace-pre-wrap break-words leading-relaxed mb-3 text-[15px]">
                  {post.text}
                </p>
                <div className="flex items-center justify-between max-w-md text-gray-500">
                  <button className="flex items-center gap-1.5 hover:text-blue-500 transition-colors group">
                    <div className="p-2 -ml-2 rounded-full group-hover:bg-blue-50 transition-colors">
                      <MessageCircle className="w-4.5 h-4.5" />
                    </div>
                  </button>
                  <button className="flex items-center gap-1.5 hover:text-green-500 transition-colors group">
                    <div className="p-2 rounded-full group-hover:bg-green-50 transition-colors">
                      <Repeat2 className="w-4.5 h-4.5" />
                    </div>
                  </button>
                  <button className="flex items-center gap-1.5 hover:text-pink-500 transition-colors group">
                    <div className="p-2 rounded-full group-hover:bg-pink-50 transition-colors">
                      <Heart className="w-4.5 h-4.5" />
                    </div>
                  </button>
                  <button className="flex items-center gap-1.5 hover:text-blue-500 transition-colors group">
                    <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                      <Share className="w-4.5 h-4.5" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
