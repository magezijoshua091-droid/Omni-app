import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router";
import { Button } from "./components/ui/button";
import { Zap, Moon, Sun, LogOut, User } from "lucide-react";
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
  const isPublic = ["/", "/pricing", "/auth"].includes(location.pathname);

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
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <ThemeToggle />
            {user ? (
              <div className="flex items-center gap-4">
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-xs font-medium text-gray-900 dark:text-white">{user.email}</span>
                  <span className="text-[10px] text-blue-600 font-bold uppercase">{user.role}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={logout} className="text-gray-500 hover:text-red-600">
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            ) : (
              <>
                <Link to="/pricing" className="hidden md:block text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  Pricing
                </Link>
                <Link to="/auth">
                  <Button variant="ghost" size="sm">Log in</Button>
                </Link>
                <Link to="/auth?mode=register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
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
