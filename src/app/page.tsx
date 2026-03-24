import Header from "@/components/Header";
import PostForm from "@/components/PostForm";
import Timeline from "@/components/Timeline";

export default function Home() {
  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <PostForm />
        <Timeline />
      </main>
    </>
  );
}
