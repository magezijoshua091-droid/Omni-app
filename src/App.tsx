import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router";
import { useState, useEffect } from "react";
import { Button } from "./components/ui/button";
import { Zap, Moon, Sun, LogOut, User, Menu, X } from "lucide-react";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Footer from "./components/Footer";
import { ErrorBoundary } from "./components/ErrorBoundary";

// Pages
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import UploadPage from "./pages/UploadPage";
import PricingPage from "./pages/PricingPage";
import AuthPage from "./pages/AuthPage";
import AboutPage from "./pages/AboutPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import FeaturesPage from "./pages/FeaturesPage";
import DocumentationPage from "./pages/DocumentationPage";
import BlogPage from "./pages/BlogPage";
import ContactPage from "./pages/ContactPage";
import APIStatusPage from "./pages/APIStatusPage";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="rounded-full"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <nav className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">Omni</span>
            </Link>
            {user && (
              <div className="hidden md:flex ml-10 space-x-8">
                <Link to="/dashboard" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Dashboard</Link>
                <Link to="/upload" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Upload</Link>
              </div>
            )}
            {!user && (
              <div className="hidden md:flex ml-10 space-x-8">
                <Link to="/pricing" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Pricing</Link>
                <Link to="/about" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">About</Link>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden md:flex items-center gap-4">
              <ThemeToggle />
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-medium text-gray-900 dark:text-white">{user.email}</span>
                    <span className="text-[10px] text-blue-600 font-bold uppercase">{user.role}</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={logout} className="text-gray-500 hover:text-red-600">
                    <LogOut className="w-5 h-5" />
                  </Button>
                </div>
              ) : (
                <>
                  <Link to="/auth">
                    <Button variant="ghost" size="sm">Log in</Button>
                  </Link>
                  <Link to="/auth?mode=register">
                    <Button size="sm">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
            
            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-2">
              <ThemeToggle />
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 animate-in slide-in-from-top duration-200">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {user ? (
              <>
                <div className="px-3 py-4 border-b border-gray-100 dark:border-gray-900 mb-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{user.email}</p>
                  <p className="text-[10px] text-blue-600 font-bold uppercase">{user.role}</p>
                </div>
                <Link to="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900">Dashboard</Link>
                <Link to="/upload" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900">Upload</Link>
                <button onClick={logout} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">Log out</button>
              </>
            ) : (
              <>
                <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900">Home</Link>
                <Link to="/pricing" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900">Pricing</Link>
                <Link to="/about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900">About</Link>
                <div className="pt-4 flex flex-col gap-2">
                  <Link to="/auth" className="w-full">
                    <Button variant="outline" className="w-full">Log in</Button>
                  </Link>
                  <Link to="/auth?mode=register" className="w-full">
                    <Button className="w-full">Get Started</Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="omni-ui-theme">
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/upload" element={<UploadPage />} />
                  <Route path="/pricing" element={<PricingPage />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/features" element={<FeaturesPage />} />
                  <Route path="/docs" element={<DocumentationPage />} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/status" element={<APIStatusPage />} />
                </Routes>
              </ErrorBoundary>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
