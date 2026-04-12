import { Button } from "../components/ui/button";
import { Link } from "react-router";
import { Users, Globe, Shield, Zap } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
            Our Mission at <span className="text-blue-600">Omni</span>
          </h1>
          <p className="mt-4 text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            We're building the world's most intelligent file operating system, empowering creators and businesses to manage their digital assets with AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">The Future of File Management</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
              Omni was born out of a simple frustration: files are static, but our work is dynamic. We believe your files should work for you, not the other way around.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              By integrating state-of-the-art AI directly into the file system, we enable automated workflows that were previously impossible. From instant compression to intelligent content analysis, Omni is your digital partner.
            </p>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Users className="w-5 h-5" />
                </div>
                <span className="font-medium dark:text-gray-200">10k+ Users</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                  <Globe className="w-5 h-5" />
                </div>
                <span className="font-medium dark:text-gray-200">Global Reach</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-video bg-gray-100 dark:bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800">
              <img 
                src="https://picsum.photos/seed/team/800/600" 
                alt="Our Team" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        <div className="bg-blue-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to join the revolution?</h2>
          <p className="text-blue-100 mb-8 text-lg max-w-xl mx-auto">
            Experience the power of AI-driven file management today. Start your 14-day free trial.
          </p>
          <Link to="/auth?mode=register">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-bold px-8">
              Get Started Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
