import { Link, useLocation } from 'react-router-dom';

import {

  Map, LogOut, LogIn,

  Moon, Sun, Search, Menu, X, Shield, User, BookOpen,

} from 'lucide-react';

import { useState, useCallback } from 'react';

import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@/components/ui/button';

import { SearchDialog, useSearchShortcut } from '@/components/layout/SearchDialog';

import { useAuthStore, useThemeStore } from '@/stores';

import { cn } from '@/lib/utils';



export function Navbar() {

  const { user, logout, isAuthenticated, isAdmin } = useAuthStore();

  const { theme, toggleTheme } = useThemeStore();

  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);

  const [searchOpen, setSearchOpen] = useState(false);



  const openSearch = useCallback(() => setSearchOpen(true), []);

  useSearchShortcut(openSearch);



  const navLinks = [

    // { to: '/roadmap', label: 'Roadmap', icon: Map },
    { to: '/devops-roadmap', label: 'Learn DevOps', icon: BookOpen },

    ...(isAuthenticated() ? [

      // { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },

      // { to: '/bookmarks', label: 'Bookmarks', icon: Bookmark },

    ] : []),

    ...(isAdmin() ? [{ to: '/admin', label: 'Admin', icon: Shield }] : []),

  ];



  return (

    <>

      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl">

        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">

          <Link to="/" className="flex items-center gap-2 font-bold text-lg">

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm">

              D

            </div>

            <span className="hidden sm:inline">DevOps Hub</span>

          </Link>



          <nav className="hidden md:flex items-center gap-1">

            {navLinks.map(({ to, label, icon: Icon }) => (

              <Link

                key={to}

                to={to}

                className={cn(

                  'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',

                  location.pathname.startsWith(to)

                    ? 'bg-accent text-accent-foreground'

                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'

                )}

              >

                <Icon className="h-4 w-4" />

                {label}

              </Link>

            ))}

          </nav>



          <div className="flex items-center gap-2">

            {/* <Button variant="ghost" size="icon" onClick={openSearch} title="Search (Ctrl+K)">

              <Search className="h-4 w-4" />

            </Button> */}

            <Button variant="ghost" size="icon" onClick={toggleTheme}>

              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}

            </Button>



            {isAuthenticated() ? (

              <div className="hidden sm:flex items-center gap-2">

                <Link to="/profile">

                  <Button variant="ghost" size="sm" className="gap-2">

                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">

                      {user?.name?.[0]?.toUpperCase()}

                    </div>

                    {user?.name}

                  </Button>

                </Link>

                <Link to="/settings">

                  <Button variant="ghost" size="icon" title="Settings">

                    <User className="h-4 w-4" />

                  </Button>

                </Link>

                <Button variant="ghost" size="icon" onClick={logout}>

                  <LogOut className="h-4 w-4" />

                </Button>

              </div>

            ) : (

              <div className="hidden sm:flex items-center gap-2">

                <Link to="/login">

                  <Button variant="ghost" size="sm">

                    <LogIn className="h-4 w-4 mr-1" /> Login

                  </Button>

                </Link>

                <Link to="/register">

                  <Button size="sm">Get Started</Button>

                </Link>

              </div>

            )}



            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>

              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}

            </Button>

          </div>

        </div>



        <AnimatePresence>

          {mobileOpen && (

            <motion.nav

              initial={{ height: 0, opacity: 0 }}

              animate={{ height: 'auto', opacity: 1 }}

              exit={{ height: 0, opacity: 0 }}

              className="md:hidden border-t border-border overflow-hidden"

            >

              <div className="flex flex-col p-4 gap-1">

                {navLinks.map(({ to, label, icon: Icon }) => (

                  <Link

                    key={to}

                    to={to}

                    onClick={() => setMobileOpen(false)}

                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent"

                  >

                    <Icon className="h-4 w-4" /> {label}

                  </Link>

                ))}

                {!isAuthenticated() && (

                  <>

                    <Link to="/login" onClick={() => setMobileOpen(false)} className="px-3 py-2 text-sm">Login</Link>

                    <Link to="/register" onClick={() => setMobileOpen(false)} className="px-3 py-2 text-sm font-medium text-primary">Register</Link>

                  </>

                )}

              </div>

            </motion.nav>

          )}

        </AnimatePresence>

      </header>



      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />

    </>

  );

}



export function Footer() {

  return (

    <footer className="border-t border-border bg-card mt-auto">

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">

        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">

          <div>

            <div className="flex items-center gap-2 font-bold text-lg mb-4">

              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm">D</div>

              DevOps Hub

            </div>

            <p className="text-sm text-muted-foreground">

              Interactive DevOps learning platform. Master Linux, Docker, Kubernetes and more.

            </p>

          </div>

          <div>

            <h4 className="font-semibold mb-3">Learn</h4>

            <ul className="space-y-2 text-sm text-muted-foreground">

              <li><Link to="/roadmap" className="hover:text-foreground">Roadmap</Link></li>

              <li><Link to="/lesson/linux-fundamentals" className="hover:text-foreground">Linux</Link></li>

              <li><Link to="/lesson/docker-basics" className="hover:text-foreground">Docker</Link></li>

            </ul>

          </div>

          <div>

            <h4 className="font-semibold mb-3">Account</h4>

            <ul className="space-y-2 text-sm text-muted-foreground">

              <li><Link to="/login" className="hover:text-foreground">Login</Link></li>

              <li><Link to="/register" className="hover:text-foreground">Register</Link></li>

              <li><Link to="/dashboard" className="hover:text-foreground">Dashboard</Link></li>

            </ul>

          </div>

          <div>

            <h4 className="font-semibold mb-3">Resources</h4>

            <ul className="space-y-2 text-sm text-muted-foreground">

              <li><a href="https://roadmap.sh/devops" target="_blank" rel="noreferrer" className="hover:text-foreground">roadmap.sh</a></li>

              <li><a href="https://docs.docker.com" target="_blank" rel="noreferrer" className="hover:text-foreground">Docker Docs</a></li>

            </ul>

          </div>

        </div>

        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">

          © {new Date().getFullYear()} DevOps Learning Hub. All rights reserved.

        </div>

      </div>

    </footer>

  );

}


