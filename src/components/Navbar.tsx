import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button.tsx";
import { Palette, Menu, X } from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-2 rounded-lg">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Palettopia
            </span>
          </Link>

          {/* Hamburger icon */}
          <button
            className="md:hidden p-2"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`transition-colors ${
                isActive("/") ? "text-purple-600" : "text-gray-600 hover:text-purple-600"
              }`}
            >
              Home
            </Link>

            <Link
              to="/tentang-kami"
              className={`transition-colors ${
                isActive("/tentang-kami") ? "text-purple-600" : "text-gray-600 hover:text-purple-600"
              }`}
            >
              Tentang Kami
            </Link>

            <div className="flex items-center gap-3 ml-4">
              <Link to="/login">
                <Button
                  variant="ghost"
                  className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                >
                  Login
                </Button>
              </Link>

              <Link to="/register">
                <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white">
                  Daftar
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* MENU MOBILE */}
        {open && (
          <div className="md:hidden mt-4 flex flex-col gap-4 pb-4">
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className={`block ${
                isActive("/") ? "text-purple-600" : "text-gray-700"
              }`}
            >
              Home
            </Link>

            <Link
              to="/tentang-kami"
              onClick={() => setOpen(false)}
              className={`block ${
                isActive("/tentang-kami") ? "text-purple-600" : "text-gray-700"
              }`}
            >
              Tentang Kami
            </Link>

            <Link to="/login" onClick={() => setOpen(false)}>
              <Button
                variant="ghost"
                className="w-full text-purple-600 hover:bg-purple-50"
              >
                Login
              </Button>
            </Link>

            <Link to="/register" onClick={() => setOpen(false)}>
              <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                Daftar
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
