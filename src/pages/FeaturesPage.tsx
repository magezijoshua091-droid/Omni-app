import { Button } from "../components/ui/button";
import { Link } from "react-router";
import { Zap, Sparkles, Shield, HardDrive, FileType, Search } from "lucide-react";

export default function FeaturesPage() {
  const features = [
    {
      title: "Intelligent Compression",
      description: "Our AI-driven compression engine analyzes your files to find the perfect balance between quality and size. Save up to 90% storage without visible loss.",
      icon: Zap,
      color: "text-blue-600",
      bg: "bg-blue-100 dark:bg-blue-900/30"
    },
    {
      title: "AI Content Analysis",
      description: "Automatically extract metadata, summarize documents, and get smart suggestions for your files using the latest Gemini models.",
      icon: Sparkles,
      color: "text-purple-600",
      bg: "bg-purple-100 dark:bg-purple-900/30"
    },
    {
      title: "Secure Cloud Storage",
      description: "Files are stored with bank-grade encryption in AWS S3. Access your data securely from anywhere with time-limited signed URLs.",
      icon: Shield,
      color: "text-green-600",
      bg: "bg-green-100 dark:bg-green-900/30"
    },
    {
      title: "Universal File Support",
      description: "From PDFs and Word docs to 4K videos and RAW images, Omni handles over 200+ file formats with ease.",
      icon: FileType,
      color: "text-orange-600",
      bg: "bg-orange-100 dark:bg-orange-900/30"
    },
    {
      title: "Smart Search",
      description: "Find exactly what you need with AI-powered semantic search. Search by content, not just filenames.",
      icon: Search,
      color: "text-pink-600",
      bg: "bg-pink-100 dark:bg-pink-900/30"
    },
    {
      title: "Scalable Infrastructure",
      description: "Built on a high-performance Redis queue system, Omni scales with your needs, processing thousands of files simultaneously.",
      icon: HardDrive,
      color: "text-indigo-600",
      bg: "bg-indigo-100 dark:bg-indigo-900/30"
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-20">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-6xl mb-6">
            Powerful Features for <span className="text-blue-600">Modern Teams</span>
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
            Omni combines cutting-edge AI with enterprise-grade infrastructure to give you the ultimate file management experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {features.map((feature, index) => (
            <div key={index} className="p-8 rounded-3xl border border-gray-100 dark:border-gray-900 bg-gray-50/50 dark:bg-gray-900/50 hover:shadow-lg transition-all group">
              <div className={`w-12 h-12 ${feature.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="relative rounded-3xl overflow-hidden bg-blue-600 py-16 px-8 md:px-16 text-center">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Experience the Power of Omni</h2>
            <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
              Join 10,000+ users who are already transforming their workflows with our AI-powered file system.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/auth?mode=register">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 w-full sm:w-auto font-bold px-8">
                  Get Started for Free
                </Button>
              </Link>
              <Link to="/pricing">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 w-full sm:w-auto px-8">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
