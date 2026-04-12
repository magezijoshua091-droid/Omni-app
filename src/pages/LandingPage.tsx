import { ArrowRight, FileUp, Zap, Shield, Sparkles, CheckCircle2, BarChart3, Globe2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Link } from "react-router";

export default function LandingPage() {
  return (
    <div className="bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#3b82f6] to-[#9333ea] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>
        
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
            <div className="mt-24 sm:mt-32 lg:mt-16">
              <a href="#" className="inline-flex space-x-6">
                <span className="rounded-full bg-blue-600/10 px-3 py-1 text-sm font-semibold leading-6 text-blue-600 ring-1 ring-inset ring-blue-600/10">
                  What's new
                </span>
                <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-gray-600 dark:text-gray-400">
                  <span>Just shipped v1.0</span>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </span>
              </a>
            </div>
            <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              The AI-Powered File Operating System
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Omni is the world's first intelligent workspace for your digital assets. Upload, compress, convert, and enhance any file with the power of AI.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Link to="/auth?mode=register">
                <Button size="lg" className="h-12 px-8 text-base font-semibold shadow-lg shadow-blue-600/20">
                  Get started for free
                </Button>
              </Link>
              <Link to="/about" className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
            <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
              <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 dark:bg-white/5 dark:ring-white/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                <img
                  src="https://picsum.photos/seed/dashboard/1200/800"
                  alt="App screenshot"
                  width={2432}
                  height={1442}
                  className="w-[76rem] rounded-md shadow-2xl ring-1 ring-gray-900/10 dark:ring-white/10"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white dark:bg-gray-950 py-24 sm:py-32 border-y border-gray-100 dark:border-gray-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
            <div className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-base leading-7 text-gray-600 dark:text-gray-400">Files processed daily</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-5xl">44 million</dd>
            </div>
            <div className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-base leading-7 text-gray-600 dark:text-gray-400">Storage saved</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-5xl">1.2 Petabytes</dd>
            </div>
            <div className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-base leading-7 text-gray-600 dark:text-gray-400">New users annually</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-5xl">46,000</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 sm:py-32 bg-gray-50 dark:bg-gray-900/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600">Faster Workflows</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Everything you need to manage files
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Stop wasting time with manual file conversions and compression. Let Omni's AI handle the heavy lifting while you focus on what matters.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {[
                {
                  name: 'AI Intelligence',
                  description: 'Automatically detect file types and get smart suggestions for compression, conversion, and enhancement.',
                  icon: Sparkles,
                },
                {
                  name: 'Lightning Fast',
                  description: 'Powered by Redis queues and scalable workers, your files are processed asynchronously in seconds.',
                  icon: Zap,
                },
                {
                  name: 'Enterprise Security',
                  description: 'Bank-grade encryption, AWS S3 secure storage, and signed URLs ensure your files remain private.',
                  icon: Shield,
                },
                {
                  name: 'Advanced Analytics',
                  description: 'Track your storage usage and processing history with beautiful, interactive charts.',
                  icon: BarChart3,
                },
                {
                  name: 'Global CDN',
                  description: 'Access your files from anywhere in the world with our lightning-fast content delivery network.',
                  icon: Globe2,
                },
                {
                  name: 'Smart Workflows',
                  description: 'Create automated rules to process files as soon as they are uploaded to your workspace.',
                  icon: CheckCircle2,
                },
              ].map((feature) => (
                <div key={feature.name} className="flex flex-col bg-white dark:bg-gray-950 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-white">
                    <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-blue-600">
                      <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-400">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white dark:bg-gray-950">
        <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="relative isolate overflow-hidden bg-gray-900 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:pt-0">
            <svg
              viewBox="0 0 1024 1024"
              className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
              aria-hidden="true"
            >
              <circle cx={512} cy={512} r={512} fill="url(#759c1415-0410-454c-8f7c-9a820de03641)" fillOpacity="0.7" />
              <defs>
                <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                  <stop stopColor="#3b82f6" />
                  <stop offset={1} stopColor="#9333ea" />
                </radialGradient>
              </defs>
            </svg>
            <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Boost your productivity.
                <br />
                Start using Omni today.
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                Join thousands of creators and businesses who trust Omni for their file management needs.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
                <Link to="/auth?mode=register">
                  <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                    Get started
                  </Button>
                </Link>
                <Link to="/about" className="text-sm font-semibold leading-6 text-white">
                  Learn more <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
            <div className="relative mt-16 h-80 lg:mt-8">
              <img
                className="absolute left-0 top-0 w-[57rem] max-w-none rounded-md bg-white/5 ring-1 ring-white/10"
                src="https://picsum.photos/seed/app/1824/1080"
                alt="App screenshot"
                width={1824}
                height={1080}
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
