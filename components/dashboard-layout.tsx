"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { 
  Bell, 
  Calendar, 
  CreditCard, 
  Globe, 
  HelpCircle, 
  LayoutDashboard, 
  LogOut, 
  Menu, 
  MessageSquare, 
  Settings, 
  User 
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ModeToggle } from "@/components/mode-toggle"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
      active: pathname === "/dashboard",
    },
    {
      href: "/requests",
      label: "My Requests",
      icon: <MessageSquare className="mr-2 h-4 w-4" />,
      active: pathname === "/requests",
    },
    {
      href: "/schedule",
      label: "Schedule",
      icon: <Calendar className="mr-2 h-4 w-4" />,
      active: pathname === "/schedule",
    },
    {
      href: "/messages",
      label: "Messages",
      icon: <MessageSquare className="mr-2 h-4 w-4" />,
      active: pathname === "/messages",
    },
    {
      href: "/billing",
      label: "Billing",
      icon: <CreditCard className="mr-2 h-4 w-4" />,
      active: pathname === "/billing",
    },
    {
      href: "/settings",
      label: "Settings",
      icon: <Settings className="mr-2 h-4 w-4" />,
      active: pathname === "/settings",
    },
    {
      href: "/help",
      label: "Help & Support",
      icon: <HelpCircle className="mr-2 h-4 w-4" />,
      active: pathname === "/help",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <Globe className="h-6 w-6" />
              <span>TranslateNow</span>
            </Link>
            <div className="mt-8 flex flex-col gap-4">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-2 text-sm ${
                    route.active ? "text-primary font-medium" : "text-muted-foreground"
                  }`}
                >
                  {route.icon}
                  {route.label}
                </Link>
              ))}
              <Link
                href="/logout"
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Link>
            </div>
          </SheetContent>
        </Sheet>
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Globe className="h-6 w-6" />
          <span>TranslateNow</span>
        </Link>
        <div className="flex-1"></div>
        <div className="flex items-center gap-4">
          <ModeToggle />
          <Button variant="outline" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-background md:block">
          <div className="flex h-full flex-col gap-2 p-4">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                  route.active
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {route.icon}
                {route.label}
              </Link>
            ))}
            <div className="flex-1"></div>
            <Link
              href="/logout"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Link>
          </div>
        </aside>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}