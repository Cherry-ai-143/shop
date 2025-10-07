"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Search, Menu, X, User, LogOut, Settings, Eye, EyeOff } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isSignInOpen, setIsSignInOpen] = useState(false)
  const [isSignUpOpen, setIsSignUpOpen] = useState(false)
  const [showSignInPassword, setShowSignInPassword] = useState(false)
  const [showSignUpPassword, setShowSignUpPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [user, setUser] = useState({
    name: "",
    email: "",
  })

  const [registeredUsers, setRegisteredUsers] = useState<Array<{ name: string; email: string; password: string }>>([])

  const [signUpForm, setSignUpForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })

  const [signInForm, setSignInForm] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSignIn = () => {
    const foundUser = registeredUsers.find((u) => u.email === signInForm.email && u.password === signInForm.password)

    if (foundUser) {
      console.log("[v0] User signed in:", foundUser)
      setUser({
        name: foundUser.name,
        email: foundUser.email,
      })
      setIsAuthenticated(true)
      setIsSignInOpen(false)
      // Reset form
      setSignInForm({ email: "", password: "", rememberMe: false })
    } else {
      alert("Invalid email or password. Please sign up first or check your credentials.")
    }
  }

  const handleSignUp = () => {
    if (signUpForm.password !== signUpForm.confirmPassword) {
      alert("Passwords do not match!")
      return
    }
    if (!signUpForm.agreeToTerms) {
      alert("Please agree to the Terms of Service and Privacy Policy")
      return
    }
    if (!signUpForm.fullName || !signUpForm.email || !signUpForm.password) {
      alert("Please fill in all fields")
      return
    }

    console.log("[v0] User registered:", signUpForm.fullName, signUpForm.email)

    // Store the registered user
    setRegisteredUsers([
      ...registeredUsers,
      {
        name: signUpForm.fullName,
        email: signUpForm.email,
        password: signUpForm.password,
      },
    ])

    // Reset signup form
    setSignUpForm({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    })

    // Close signup modal and open signin modal
    setIsSignUpOpen(false)
    setIsSignInOpen(true)

    // Show success message
    alert("Account created successfully! Please sign in with your credentials.")
  }

  const handleLogout = () => {
    console.log("[v0] User logged out")
    setIsAuthenticated(false)
    setUser({ name: "", email: "" })
  }

  const getInitials = (name: string, email: string) => {
    console.log("[v0] Getting initials for:", { name, email })

    // If name exists and has content, use first letter of name
    if (name && name.trim().length > 0) {
      const initial = name.trim().charAt(0).toUpperCase()
      console.log("[v0] Using name initial:", initial)
      return initial
    }

    // Fallback to first letter of email
    if (email && email.trim().length > 0) {
      const initial = email.trim().charAt(0).toUpperCase()
      console.log("[v0] Using email initial:", initial)
      return initial
    }

    // Final fallback
    console.log("[v0] Using default initial: U")
    return "U"
  }

  const switchToSignIn = () => {
    setIsSignUpOpen(false)
    setIsSignInOpen(true)
  }

  const switchToSignUp = () => {
    setIsSignInOpen(false)
    setIsSignUpOpen(true)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
    }
  }

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/categories", label: "Categories" },
    { href: "/compare", label: "Compare Products" },
    { href: "/cart", label: "Cart" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <>
      <nav className="sticky top-0 z-50 glassmorphism-strong animate-slide-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center space-x-2 hover-glow hover-scale rounded-lg p-2 transition-all duration-300"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center animate-pulse-gentle">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Smart Compare
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-foreground hover:text-primary transition-all duration-300 font-medium hover-glow hover-lift rounded px-3 py-2 animate-fade-in-up animate-delay-${index * 100}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Search Bar and Auth Section */}
            <div className="hidden md:flex items-center space-x-4">
              <form onSubmit={handleSearch} className="relative animate-slide-in-right">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 rounded-lg bg-input border border-border focus:outline-none focus:ring-2 focus:ring-accent glassmorphism transition-all duration-300 hover-lift"
                />
              </form>

              {!isAuthenticated ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsSignInOpen(true)}
                    className="hover-glow hover-scale bg-transparent transition-all duration-300"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setIsSignUpOpen(true)}
                    className="bg-gradient-to-r from-primary to-secondary hover-glow hover-lift transition-all duration-300"
                  >
                    Sign Up
                  </Button>
                </>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-12 w-12 rounded-full hover-scale transition-all duration-300 p-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    >
                      <Avatar className="h-12 w-12 ring-2 ring-primary/30 hover:ring-primary/50 transition-all duration-300">
                        <AvatarImage src="/placeholder.svg" alt={user.name || user.email} />
                        <AvatarFallback
                          className="bg-gradient-to-br from-primary via-accent to-secondary text-white font-bold text-xl"
                          style={{ backgroundColor: "#0D9488" }}
                        >
                          {getInitials(user.name, user.email)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 glassmorphism-strong animate-scale-in" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-semibold leading-none text-foreground">{user.name || "User"}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer hover-glow focus:bg-accent/10">
                      <User className="mr-2 h-4 w-4" />
                      <span>View Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer hover-glow focus:bg-accent/10">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer hover-glow text-destructive focus:text-destructive focus:bg-destructive/10"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="hover-glow hover-rotate transition-all duration-300"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden glassmorphism-strong rounded-lg mt-2 p-4 animate-slide-in mobile-stack">
              <div className="flex flex-col space-y-4">
                {navItems.map((item, index) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-foreground hover:text-primary transition-all duration-300 font-medium hover-glow rounded px-3 py-2 animate-fade-in-up animate-delay-${index * 100}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="pt-4 border-t border-border">
                  <form onSubmit={handleSearch} className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full rounded-lg bg-input border border-border focus:outline-none focus:ring-2 focus:ring-accent glassmorphism"
                    />
                  </form>

                  {!isAuthenticated ? (
                    <div className="flex space-x-2 mobile-stack mobile-full">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsSignInOpen(true)
                          setIsMenuOpen(false)
                        }}
                        className="flex-1 hover-glow bg-transparent"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Sign In
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          setIsSignUpOpen(true)
                          setIsMenuOpen(false)
                        }}
                        className="flex-1 bg-gradient-to-r from-primary to-secondary hover-glow"
                      >
                        Sign Up
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center space-x-3 p-3 rounded-lg glassmorphism ring-1 ring-primary/10">
                        <Avatar className="h-14 w-14 ring-2 ring-primary/30">
                          <AvatarImage src="/placeholder.svg" alt={user.name || user.email} />
                          <AvatarFallback
                            className="bg-gradient-to-br from-primary via-accent to-secondary text-white font-bold text-xl"
                            style={{ backgroundColor: "#0D9488" }}
                          >
                            {getInitials(user.name, user.email)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">{user.name || "User"}</p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full justify-start hover-glow bg-transparent">
                        <User className="w-4 h-4 mr-2" />
                        View Profile
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start hover-glow bg-transparent">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleLogout}
                        className="w-full justify-start hover-glow text-destructive hover:text-destructive bg-transparent"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Sign In Modal */}
      <Dialog open={isSignInOpen} onOpenChange={setIsSignInOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 gap-0 bg-[#E0F2F1] border-none">
          <div className="flex flex-col items-center pt-8 pb-6 px-8">
            {/* Logo */}
            <div className="flex items-center space-x-2 mb-8">
              <div className="w-10 h-10 bg-gradient-to-r from-[#0D9488] to-[#F97316] rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">
                <span className="text-[#475569]">Smart </span>
                <span className="text-[#F97316]">Compare</span>
              </span>
            </div>

            {/* White Card */}
            <div className="w-full bg-white rounded-2xl shadow-lg p-8">
              <DialogHeader className="space-y-2 mb-6">
                <DialogTitle className="text-2xl font-bold text-[#1E293B] text-center">Welcome Back</DialogTitle>
                <DialogDescription className="text-[#64748B] text-center">
                  Sign in to your account to continue
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="text-[#1E293B] font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={signInForm.email}
                    onChange={(e) => setSignInForm({ ...signInForm, email: e.target.value })}
                    className="h-12 bg-[#F8FAFC] border-[#E2E8F0] focus:border-[#0D9488] focus:ring-[#0D9488]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signin-password" className="text-[#1E293B] font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="signin-password"
                      type={showSignInPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={signInForm.password}
                      onChange={(e) => setSignInForm({ ...signInForm, password: e.target.value })}
                      className="h-12 bg-[#F8FAFC] border-[#E2E8F0] focus:border-[#0D9488] focus:ring-[#0D9488] pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignInPassword(!showSignInPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#1E293B]"
                    >
                      {showSignInPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={signInForm.rememberMe}
                      onCheckedChange={(checked) => setSignInForm({ ...signInForm, rememberMe: checked as boolean })}
                      className="border-[#CBD5E1]"
                    />
                    <Label htmlFor="remember" className="text-sm text-[#475569] cursor-pointer font-normal">
                      Remember me
                    </Label>
                  </div>
                  <Button variant="link" className="px-0 text-sm text-[#0D9488] hover:text-[#0F766E] h-auto">
                    Forgot password?
                  </Button>
                </div>

                <Button
                  onClick={handleSignIn}
                  className="w-full h-12 bg-gradient-to-r from-[#0D9488] to-[#F97316] hover:opacity-90 text-white font-semibold text-base mt-6"
                >
                  Sign In
                </Button>

                <p className="text-sm text-center text-[#64748B] mt-4">
                  Don't have an account?{" "}
                  <button
                    onClick={() => {
                      setIsSignInOpen(false)
                      setIsSignUpOpen(true)
                    }}
                    className="text-[#0D9488] hover:text-[#0F766E] font-medium"
                  >
                    Sign up here
                  </button>
                </p>
              </div>
            </div>

            {/* Terms Text */}
            <p className="text-xs text-center text-[#64748B] mt-6 max-w-md">
              By signing in, you agree to our{" "}
              <button className="text-[#0D9488] hover:underline">Terms of Service</button> and{" "}
              <button className="text-[#0D9488] hover:underline">Privacy Policy</button>
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sign Up Modal */}
      <Dialog open={isSignUpOpen} onOpenChange={setIsSignUpOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 gap-0 bg-[#E0F2F1] border-none">
          <div className="flex flex-col items-center pt-8 pb-6 px-8">
            {/* Logo */}
            <div className="flex items-center space-x-2 mb-8">
              <div className="w-10 h-10 bg-gradient-to-r from-[#0D9488] to-[#F97316] rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">
                <span className="text-[#475569]">Smart </span>
                <span className="text-[#F97316]">Compare</span>
              </span>
            </div>

            {/* White Card */}
            <div className="w-full bg-white rounded-2xl shadow-lg p-8">
              <DialogHeader className="space-y-2 mb-6">
                <DialogTitle className="text-2xl font-bold text-[#1E293B] text-center">Create Account</DialogTitle>
                <DialogDescription className="text-[#64748B] text-center">
                  Join Smart Compare to start saving money
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="text-[#1E293B] font-medium">
                    Full Name
                  </Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Your full name"
                    value={signUpForm.fullName}
                    onChange={(e) => setSignUpForm({ ...signUpForm, fullName: e.target.value })}
                    className="h-12 bg-[#F8FAFC] border-[#E2E8F0] focus:border-[#0D9488] focus:ring-[#0D9488]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-[#1E293B] font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={signUpForm.email}
                    onChange={(e) => setSignUpForm({ ...signUpForm, email: e.target.value })}
                    className="h-12 bg-[#F8FAFC] border-[#E2E8F0] focus:border-[#0D9488] focus:ring-[#0D9488]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-[#1E293B] font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showSignUpPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={signUpForm.password}
                      onChange={(e) => setSignUpForm({ ...signUpForm, password: e.target.value })}
                      className="h-12 bg-[#F8FAFC] border-[#E2E8F0] focus:border-[#0D9488] focus:ring-[#0D9488] pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#1E293B]"
                    >
                      {showSignUpPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-confirm-password" className="text-[#1E293B] font-medium">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="signup-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={signUpForm.confirmPassword}
                      onChange={(e) => setSignUpForm({ ...signUpForm, confirmPassword: e.target.value })}
                      className="h-12 bg-[#F8FAFC] border-[#E2E8F0] focus:border-[#0D9488] focus:ring-[#0D9488] pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#1E293B]"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-start space-x-2 pt-2">
                  <Checkbox
                    id="terms"
                    checked={signUpForm.agreeToTerms}
                    onCheckedChange={(checked) => setSignUpForm({ ...signUpForm, agreeToTerms: checked as boolean })}
                    className="border-[#CBD5E1] mt-1"
                  />
                  <Label htmlFor="terms" className="text-sm text-[#475569] cursor-pointer font-normal leading-relaxed">
                    I agree to the <button className="text-[#0D9488] hover:underline">Terms of Service</button> and{" "}
                    <button className="text-[#0D9488] hover:underline">Privacy Policy</button>
                  </Label>
                </div>

                <Button
                  onClick={handleSignUp}
                  className="w-full h-12 bg-gradient-to-r from-[#0D9488] to-[#F97316] hover:opacity-90 text-white font-semibold text-base mt-6"
                >
                  Create Account
                </Button>

                <p className="text-sm text-center text-[#64748B] mt-4">
                  Already have an account?{" "}
                  <button
                    onClick={() => {
                      setIsSignUpOpen(false)
                      setIsSignInOpen(true)
                    }}
                    className="text-[#0D9488] hover:text-[#0F766E] font-medium"
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
