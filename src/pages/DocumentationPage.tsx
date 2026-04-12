import { Search, Book, Code, Terminal, Cpu, Globe } from "lucide-react";

export default function DocumentationPage() {
  const sections = [
    {
      title: "Getting Started",
      icon: Book,
      items: ["Introduction", "Quick Start Guide", "Account Setup", "First Upload"]
    },
    {
      title: "Core Features",
      icon: Cpu,
      items: ["AI Analysis", "File Compression", "Format Conversion", "Batch Processing"]
    },
    {
      title: "API Reference",
      icon: Code,
      items: ["Authentication", "Endpoints", "Rate Limits", "Webhooks"]
    },
    {
      title: "CLI Tool",
      icon: Terminal,
      items: ["Installation", "Configuration", "Commands", "Automation"]
    },
    {
      title: "Integrations",
      icon: Globe,
      items: ["Slack", "Google Drive", "Dropbox", "Zapier"]
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="sticky top-24">
              <div className="relative mb-8">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search docs..." 
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-600 outline-none text-sm"
                />
              </div>
              <nav className="space-y-8">
                {sections.map((section, idx) => (
                  <div key={idx}>
                    <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                      <section.icon className="w-4 h-4 text-blue-600" />
                      {section.title}
                    </h3>
                    <ul className="space-y-2">
                      {section.items.map((item, i) => (
                        <li key={i}>
                          <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">
                            {item}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-grow max-w-3xl">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6">Documentation</h1>
            <p className="text-xl text-gray-500 dark:text-gray-400 mb-12">
              Everything you need to know about building and managing files with Omni.
            </p>

            <div className="prose dark:prose-invert max-w-none">
              <section className="mb-16">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Introduction</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  Omni is a next-generation file operating system designed for the AI era. It provides a unified interface for storing, processing, and analyzing digital assets using state-of-the-art machine learning models.
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 p-6 rounded-r-xl my-8">
                  <p className="text-blue-800 dark:text-blue-300 font-medium">
                    New to Omni? Check out our <a href="#" className="underline font-bold">Quick Start Guide</a> to get up and running in less than 5 minutes.
                  </p>
                </div>
              </section>

              <section className="mb-16">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Core Concepts</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  Before diving deep, it's important to understand the three pillars of the Omni ecosystem:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="p-6 rounded-2xl border border-gray-100 dark:border-gray-900 bg-gray-50 dark:bg-gray-900/50">
                    <h4 className="font-bold mb-2 dark:text-white">Workspaces</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Collaborative environments where you manage your files and team members.</p>
                  </div>
                  <div className="p-6 rounded-2xl border border-gray-100 dark:border-gray-900 bg-gray-50 dark:bg-gray-900/50">
                    <h4 className="font-bold mb-2 dark:text-white">Processors</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">AI-powered workers that handle compression, conversion, and analysis.</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">API First</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  Omni is built with an API-first philosophy. Every action you can perform in the dashboard is available via our REST API.
                </p>
                <div className="bg-gray-900 rounded-xl p-6 overflow-x-auto">
                  <pre className="text-blue-400 text-sm">
                    <code>{`curl -X POST https://api.omni.ai/v1/files \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -F "file=@/path/to/document.pdf" \\
  -F "options={\\"compress\\": true}"`}</code>
                  </pre>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
