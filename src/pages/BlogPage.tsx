import { Calendar, User, ArrowRight } from "lucide-react";

export default function BlogPage() {
  const posts = [
    {
      title: "Announcing Omni v1.0: The Future of File Management",
      excerpt: "Today we're excited to announce the general availability of Omni, the world's first AI-powered file operating system.",
      date: "April 10, 2026",
      author: "Sarah Chen",
      category: "Product",
      image: "https://picsum.photos/seed/blog1/800/400"
    },
    {
      title: "How AI is Revolutionizing Data Compression",
      excerpt: "Deep dive into how we use neural networks to achieve unprecedented compression ratios without quality loss.",
      date: "April 5, 2026",
      author: "Dr. James Wilson",
      category: "Engineering",
      image: "https://picsum.photos/seed/blog2/800/400"
    },
    {
      title: "10 Workflows to Supercharge Your Productivity",
      excerpt: "Learn how top teams are using Omni's automated processors to save hours of manual work every week.",
      date: "March 28, 2026",
      author: "Elena Rodriguez",
      category: "Tutorial",
      image: "https://picsum.photos/seed/blog3/800/400"
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-6xl mb-4">The Omni Blog</h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Insights, tutorials, and updates from the team building the future of digital asset management.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {posts.map((post, index) => (
            <article key={index} className="flex flex-col bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all group">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-8 flex-grow flex flex-col">
                <div className="flex items-center gap-4 mb-4">
                  <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Calendar className="w-3 h-3" />
                    {post.date}
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 leading-tight group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="mt-auto pt-6 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                      <img src={`https://i.pravatar.cc/150?u=${post.author}`} alt={post.author} />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{post.author}</span>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 font-bold text-sm flex items-center gap-1">
                    Read More <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-20 text-center">
          <button className="px-8 py-3 rounded-full border-2 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
            Load More Posts
          </button>
        </div>
      </div>
    </div>
  );
}
