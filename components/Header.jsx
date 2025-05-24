"use client"

import Link from "next/link"
import { useEffect, useState } from "react" 
import Image from "next/image"
import { LayoutDashboard, Map, Thermometer } from "lucide-react" 
import React from "react"
import { usePathname } from "next/navigation"

const navigationLinks = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard size={16} />,
  },
  {
    name: "Mapa de Riegos",
    href: "/riego",
    icon: <Map size={16} />,
  },
  {
    name: "Sensores",
    href: "/sensores",
    icon: <Thermometer size={16} />,
  }
]

export default function Header() {
  const [isMobileView, setIsMobileView] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobileView(window.innerWidth < 768)
    }
    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#4cd964] shadow-lg">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Contenedor del logo */}
            <div className="flex items-center gap-3 mr-8">
              <Link href="/dashboard" className="flex items-center gap-3">
                <div className="rounded-full overflow-hidden w-9 h-9 transition-transform transform hover:scale-105">
                  <Image src="/logo.png" alt="RiegOS logo" width={36} height={36} />
                </div>
                <span className="font-bold text-white text-lg">RiegOS</span>
              </Link>
            </div>

            {/* Menú de navegación para escritorio */}
            {!isMobileView && (
              <nav className="flex items-center gap-6">
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
              </nav>
            )}
          </div>
        </div>
      </header>

      {/* Navegación inferior para móviles */}
      {isMobileView && (
        <nav className="fixed bottom-0 left-0 right-0 bg-[#4cd964] text-white h-16 flex items-center justify-around z-50 shadow-xl rounded-t-2xl">
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
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${active ? "bg-[#3EAF57] text-white" : "text-white hover:bg-[#3EAF57]/70"}`}
    >
      {icon && <span className="text-white">{icon}</span>}
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
