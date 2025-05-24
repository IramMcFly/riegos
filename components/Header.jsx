"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import Image from "next/image"
import { LayoutDashboard, Map, Thermometer, User, Menu, X } from "lucide-react"
import React from "react"
import { usePathname } from "next/navigation"

const navigationLinks = [
  {
    name: "Dashboard",
    href: "/",
    icon: <LayoutDashboard size={16} />,
  },
  {
    name: "Mapa de Riegos",
    href: "/mapa",
    icon: <Map size={16} />,
  },
  {
    name: "Sensores",
    href: "/sensores",
    icon: <Thermometer size={16} />,
  }
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  // The isMobile state and its effect can be removed if Tailwind's responsive classes are sufficient.
  // For now, we'll keep it to ensure the bottom mobile nav logic remains, but the hamburger menu visibility is fixed.
  const [isMobileView, setIsMobileView] = useState(false) 
  const pathname = usePathname()

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobileView(window.innerWidth < 768) // Used for bottom nav
    }
    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#4cd964] shadow-md">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-16 items-center">
            <div className="flex items-center gap-3 mr-8">
              <Link href="/" className="flex items-center gap-3">
                <div className="rounded-full overflow-hidden w-9 h-9">
                  <Image src="/images/logoDS.png" alt="RiegOS logo" width={36} height={36} />
                </div>
                <span className="font-bold text-white text-lg">RiegOS</span>
              </Link>
            </div>

            <nav className={`absolute left-0 right-0 top-16 bg-[#4cd964] md:bg-transparent md:static md:flex md:items-center ${isMenuOpen ? "block" : "hidden md:flex"}`}>
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 p-4 md:p-0 md:ml-64">
                {navigationLinks.map((link) => (
                  <NavItem
                    key={link.href}
                    href={link.href}
                    active={pathname === link.href}
                    icon={link.icon}
                  >
                    {link.name}
                  </NavItem>
                ))}
              </div>
            </nav>

            <div className="ml-auto">
              <button className="text-white hover:bg-[#3EAF57]/20 p-2 rounded-full">
                <User size={20} />
              </button>
            </div>

            {/* Button for mobile menu - md:hidden ensures it's only on small screens */}
            <button
              className="md:hidden text-white hover:bg-[#3EAF57]/20 p-2 rounded-full ml-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>
      {isMobileView && (
        <nav className="fixed bottom-0 left-0 right-0 bg-[#4cd964] text-white h-16 flex items-center justify-around z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
          {navigationLinks.map((link) => (
            <MobileNavItem
              key={link.href}
              href={link.href}
              icon={React.cloneElement(link.icon, { size: 24 })}
            >
              {link.name}
            </MobileNavItem>
          ))}
        </nav>
      )}
    </>
  )
}

function NavItem({ href, children, active, icon }) {
  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${active ? "bg-[#3EAF57] text-white" : "text-white hover:bg-[#3EAF57]/70"}`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </Link>
  )
}

function MobileNavItem({ href, children, icon }) {
  return (
    <Link href={href} className="flex flex-col items-center justify-center text-xs">
      <span className="mb-1 text-white">{icon}</span>
      <span className="text-gray-100">{children}</span>
    </Link>
  )
}
