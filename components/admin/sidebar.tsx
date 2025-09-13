"use client"

import type React from "react"
import {
  BarChart2,
  Receipt,
  Building2,
  CreditCard,
  Folder,
  Wallet,
  Users2,
  Shield,
  MessagesSquare,
  Video,
  Settings,
  HelpCircle,
  ChevronDown,
  Home,
  ShoppingCart,
  Package,
  FileText,
  Database,
  Globe,
  Mail,
  Calendar,
  ImageIcon,
  Zap,
  Code,
  Layers,
  Monitor,
  PieChart,
  TrendingUp,
  Activity,
  Target,
  UserPlus,
  UserX,
  Lock,
  Key,
  Eye,
  Bell,
  MessageSquare,
  Camera,
  Headphones,
  Play,
  Bookmark,
  Tag,
  Search,
  Filter,
  Download,
  Upload,
  Edit,
  Plus,
  Minus,
  Check,
  Star,
  Map,
  Truck,
  Clock,
  Timer,
  DollarSign,
  TrendingDown,
  Puzzle,
  BookOpen,
  GraduationCap,
  Users,
  BarChart3,
  Award,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

type MenuState = "full" | "collapsed" | "hidden"

interface SubMenuItem {
  id: string
  label: string
  href: string
  icon?: React.ComponentType<any>
  badge?: string
  isNew?: boolean
  children?: SubMenuItem[]
}

interface MenuItem {
  id: string
  label: string
  href?: string
  icon: React.ComponentType<any>
  badge?: string
  isNew?: boolean
  children?: SubMenuItem[]
}

interface MenuSection {
  id: string
  label: string
  items: MenuItem[]
}

const menuData: MenuSection[] = [
  {
    id: "overview",
    label: "Overview",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        href: "/dashboard/admin",
        icon: Home,
        badge: "3",
        children: [
          {
            id: "analytics",
            label: "Analytics",
            href: "/dashboard/admin/analytics",
            icon: BarChart2,
          },
          {
            id: "reports",
            label: "Reports",
            href: "/dashboard/admin/reports",
            icon: FileText,
            children: [
              {
                id: "student-reports",
                label: "Student Reports",
                href: "/dashboard/admin/reports/students",
                icon: TrendingUp,
              },
              {
                id: "faculty-reports",
                label: "Faculty Reports",
                href: "/dashboard/admin/reports/faculty",
                icon: Users2,
              },
              {
                id: "academic-reports",
                label: "Academic Reports",
                href: "/dashboard/admin/reports/academic",
                icon: DollarSign,
              },
            ],
          },
          {
            id: "real-time",
            label: "Real-time",
            href: "/dashboard/admin/realtime",
            icon: Activity,
            isNew: true,
          },
        ],
      },
      {
        id: "analytics",
        label: "Analytics",
        href: "/dashboard/admin/analytics",
        icon: BarChart2,
        children: [
          {
            id: "overview",
            label: "Overview",
            href: "/dashboard/admin/analytics/overview",
            icon: PieChart,
          },
          {
            id: "performance",
            label: "Performance",
            href: "/dashboard/admin/analytics/performance",
            icon: TrendingUp,
          },
          {
            id: "engagement",
            label: "Engagement",
            href: "/dashboard/admin/analytics/engagement",
            icon: Target,
          },
        ],
      },
      {
        id: "organization",
        label: "Organization",
        href: "/dashboard/admin/organization",
        icon: Building2,
      },
      {
        id: "projects",
        label: "Projects",
        href: "/dashboard/admin/projects",
        icon: Folder,
        badge: "12",
      },
    ],
  },
  {
    id: "academic",
    label: "Academic Management",
    items: [
      {
        id: "classes",
        label: "Classes",
        href: "/dashboard/admin/classes",
        icon: BookOpen,
        children: [
          {
            id: "all-classes",
            label: "All Classes",
            href: "/dashboard/admin/classes/all",
            icon: BookOpen,
          },
          {
            id: "active-classes",
            label: "Active Classes",
            href: "/dashboard/admin/classes/active",
            icon: BookOpen,
          },
          {
            id: "schedules",
            label: "Schedules",
            href: "/dashboard/admin/classes/schedules",
            icon: Calendar,
          },
        ],
      },
      {
        id: "students",
        label: "Students",
        href: "/dashboard/admin/students",
        icon: GraduationCap,
        badge: "5",
        children: [
          {
            id: "all-students",
            label: "All Students",
            href: "/dashboard/admin/students/all",
            icon: GraduationCap,
          },
          {
            id: "enrolled",
            label: "Enrolled",
            href: "/dashboard/admin/students/enrolled",
            icon: Check,
          },
          {
            id: "graduated",
            label: "Graduated",
            href: "/dashboard/admin/students/graduated",
            icon: Award,
          },
        ],
      },
      {
        id: "faculty",
        label: "Faculty",
        href: "/dashboard/admin/faculty",
        icon: Users2,
        children: [
          {
            id: "all-faculty",
            label: "All Faculty",
            href: "/dashboard/admin/faculty/all",
            icon: Users2,
          },
          {
            id: "departments",
            label: "Departments",
            href: "/dashboard/admin/faculty/departments",
            icon: Building2,
          },
          {
            id: "schedules",
            label: "Schedules",
            href: "/dashboard/admin/faculty/schedules",
            icon: Calendar,
          },
        ],
      },
    ],
  },
  {
    id: "content",
    label: "Content Management",
    items: [
      {
        id: "documents",
        label: "Documents",
        href: "/dashboard/documents",
        icon: FileText,
        children: [
          {
            id: "all-documents",
            label: "All Documents",
            href: "/dashboard/documents",
            icon: FileText,
          },
          {
            id: "shared",
            label: "Shared",
            href: "/dashboard/documents/shared",
            icon: Globe,
          },
          {
            id: "private",
            label: "Private",
            href: "/dashboard/documents/private",
            icon: Lock,
          },
        ],
      },
      {
        id: "social",
        label: "Social Media",
        href: "/dashboard/social",
        icon: MessageSquare,
        children: [
          {
            id: "posts",
            label: "Posts",
            href: "/dashboard/social/posts",
            icon: MessageSquare,
          },
          {
            id: "engagement",
            label: "Engagement",
            href: "/dashboard/social/engagement",
            icon: TrendingUp,
          },
          {
            id: "analytics",
            label: "Analytics",
            href: "/dashboard/social/analytics",
            icon: BarChart3,
          },
        ],
      },
      {
        id: "media",
        label: "Media",
        href: "/dashboard/admin/media",
        icon: ImageIcon,
        children: [
          {
            id: "images",
            label: "Images",
            href: "/dashboard/admin/media/images",
            icon: ImageIcon,
          },
          {
            id: "videos",
            label: "Videos",
            href: "/dashboard/admin/media/videos",
            icon: Play,
          },
          {
            id: "audio",
            label: "Audio",
            href: "/dashboard/admin/media/audio",
            icon: Headphones,
          },
        ],
      },
    ],
  },
  {
    id: "communication",
    label: "Communication",
    items: [
      {
        id: "meetings",
        label: "Meetings",
        href: "/meeting",
        icon: Video,
        children: [
          {
            id: "scheduled",
            label: "Scheduled",
            href: "/meeting/scheduled",
            icon: Calendar,
          },
          {
            id: "recordings",
            label: "Recordings",
            href: "/meeting/recordings",
            icon: Camera,
          },
          {
            id: "rooms",
            label: "Meeting Rooms",
            href: "/meeting/rooms",
            icon: Monitor,
          },
        ],
      },
      {
        id: "notifications",
        label: "Notifications",
        href: "/dashboard/admin/notifications",
        icon: Bell,
        badge: "12",
      },
      {
        id: "announcements",
        label: "Announcements",
        href: "/dashboard/admin/announcements",
        icon: MessageSquare,
      },
    ],
  },
  {
    id: "tools",
    label: "Tools & Utilities",
    items: [
      {
        id: "settings",
        label: "Settings",
        href: "/dashboard/admin/settings",
        icon: Settings,
        children: [
          {
            id: "general",
            label: "General",
            href: "/dashboard/admin/settings/general",
            icon: Settings,
          },
          {
            id: "security",
            label: "Security",
            href: "/dashboard/admin/settings/security",
            icon: Shield,
          },
          {
            id: "notifications",
            label: "Notifications",
            href: "/dashboard/admin/settings/notifications",
            icon: Bell,
          },
        ],
      },
      {
        id: "backup",
        label: "Backup & Restore",
        href: "/dashboard/admin/backup",
        icon: Database,
        children: [
          {
            id: "create-backup",
            label: "Create Backup",
            href: "/dashboard/admin/backup/create",
            icon: Download,
          },
          {
            id: "restore",
            label: "Restore",
            href: "/dashboard/admin/backup/restore",
            icon: Upload,
          },
        ],
      },
    ],
  },
]

export default function AdminSidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [menuState, setMenuState] = useState<MenuState>("full")
  const [isHovered, setIsHovered] = useState(false)
  const [previousDesktopState, setPreviousDesktopState] = useState<MenuState>("full")
  const [isMobile, setIsMobile] = useState(false)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  // Cycle through menu states: full -> collapsed -> hidden -> full
  const toggleMenuState = () => {
    setMenuState((prev) => {
      switch (prev) {
        case "full":
          return "collapsed"
        case "collapsed":
          return "hidden"
        case "hidden":
          return "full"
        default:
          return "full"
      }
    })
  }

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth >= 1024 // lg breakpoint
      setIsMobile(!isDesktop)

      if (!isDesktop) {
        // On mobile/tablet, save current desktop state and set to hidden
        if (menuState !== "hidden") {
          setPreviousDesktopState(menuState)
          setMenuState("hidden")
        }
      } else {
        // On desktop, restore previous state if coming from mobile
        if (menuState === "hidden" && previousDesktopState !== "hidden") {
          setMenuState(previousDesktopState)
        }
      }
    }

    // Check on mount
    handleResize()

    // Add event listener
    window.addEventListener("resize", handleResize)

    return () => window.removeEventListener("resize", handleResize)
  }, [menuState, previousDesktopState])

  // Export functions to window for TopNav to access
  useEffect(() => {
    if (typeof window !== "undefined") {
      ;(window as any).toggleMenuState = toggleMenuState
      ;(window as any).menuState = menuState
      ;(window as any).isHovered = isHovered
      ;(window as any).isMobile = isMobile
      ;(window as any).setIsMobileMenuOpen = setIsMobileMenuOpen
      ;(window as any).isMobileMenuOpen = isMobileMenuOpen
    }
  }, [menuState, isHovered, isMobile, isMobileMenuOpen])

  function handleNavigation() {
    if (isMobile) {
      setIsMobileMenuOpen(false)
    }
  }

  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else {
        newSet.add(itemId)
      }
      return newSet
    })
  }

  function NavItem({
    item,
    level = 0,
    parentId = "",
  }: {
    item: MenuItem | SubMenuItem
    level?: number
    parentId?: string
  }) {
    const itemId = `${parentId}-${item.id}`
    const isExpanded = expandedItems.has(itemId)
    const hasChildren = item.children && item.children.length > 0
    const showText = menuState === "full" || (menuState === "collapsed" && isHovered) || (isMobile && isMobileMenuOpen)
    const showExpandIcon = hasChildren && showText

    const paddingLeft = level === 0 ? "px-3" : level === 1 ? "pl-8 pr-3" : "pl-12 pr-3"

    const content = (
      <div
        className={cn(
          "flex items-center py-2 text-sm rounded-md transition-colors sidebar-menu-item hover:bg-gray-50 dark:hover:bg-[#1F1F23] relative group cursor-pointer",
          paddingLeft,
        )}
        onClick={() => {
          if (hasChildren) {
            toggleExpanded(itemId)
          } else if (item.href) {
            // Navigate to the href
            window.location.href = item.href
            handleNavigation()
          }
        }}
        title={menuState === "collapsed" && !isHovered && !isMobile ? item.label : undefined}
      >
        {item.icon && <item.icon className="h-4 w-4 flex-shrink-0 sidebar-menu-icon" />}

        {showText && (
          <>
            <span className="ml-3 flex-1 transition-opacity duration-200 sidebar-menu-text">{item.label}</span>

            {/* Badges and indicators */}
            <div className="flex items-center space-x-1">
              {item.isNew && (
                <span className="px-1.5 py-0.5 text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                  New
                </span>
              )}
              {item.badge && (
                <span className="px-1.5 py-0.5 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                  {item.badge}
                </span>
              )}
              {showExpandIcon && (
                <ChevronDown
                  className={cn("h-3 w-3 transition-transform duration-200", isExpanded ? "rotate-180" : "rotate-0")}
                />
              )}
            </div>
          </>
        )}

        {/* Tooltip for collapsed state when not hovered and not mobile */}
        {menuState === "collapsed" && !isHovered && !isMobile && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
            {item.label}
            {item.badge && <span className="ml-1 text-blue-300">({item.badge})</span>}
          </div>
        )}
      </div>
    )

    return (
      <div>
        {item.href && !hasChildren ? <Link href={item.href}>{content}</Link> : content}
        {hasChildren && isExpanded && showText && (
          <div className="mt-1 space-y-1">
            {item.children!.map((child) => (
              <NavItem key={child.id} item={child} level={level + 1} parentId={itemId} />
            ))}
          </div>
        )}
      </div>
    )
  }

  // Calculate sidebar width - expand when collapsed and hovered, or full width on mobile
  const getSidebarWidth = () => {
    if (isMobile) {
      return "w-64" // Always full width on mobile
    }
    if (menuState === "collapsed" && isHovered) {
      return "w-64" // Expand to full width when hovered
    }
    if (menuState === "collapsed") {
      return "w-16" // 64px - collapsed width
    }
    return "w-64" // 256px - full width
  }

  // Show text if menu is full OR if collapsed and hovered OR on mobile
  const showText = menuState === "full" || (menuState === "collapsed" && isHovered) || (isMobile && isMobileMenuOpen)

  // On mobile, show sidebar as overlay when isMobileMenuOpen is true
  if (isMobile) {
    return (
      <>
        {/* Mobile sidebar overlay */}
        <nav
          className={`
            fixed inset-y-0 left-0 z-[70] w-64 bg-white dark:bg-[#0F0F12] 
            border-r border-gray-200 dark:border-[#1F1F23] 
            transform transition-transform duration-300 ease-in-out
            ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="h-16 px-3 flex items-center border-b border-gray-200 dark:border-[#1F1F23]">
              <Link
                href="/dashboard/admin"
                className="flex items-center gap-3 w-full"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-semibold hover:cursor-pointer text-gray-900 dark:text-white">
                  COM-PSU-Rizal
                </span>
              </Link>
            </div>

            <div
              className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 scrollbar-none"
              style={{
                scrollbarWidth: "none" /* Firefox */,
                msOverflowStyle: "none" /* IE and Edge */,
              }}
            >
              <div className="space-y-6">
                {menuData.map((section) => (
                  <div key={section.id}>
                    <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider sidebar-section-label">
                      {section.label}
                    </div>
                    <div className="space-y-1">
                      {section.items.map((item) => (
                        <NavItem key={item.id} item={item} parentId={section.id} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-2 py-4 border-t border-gray-200 dark:border-[#1F1F23]">
              <div className="space-y-1">
                <NavItem item={{ id: "settings", label: "Settings", href: "/dashboard/admin/settings", icon: Settings }} />
                <NavItem item={{ id: "help", label: "Help", href: "/help", icon: HelpCircle }} />
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile overlay backdrop */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[65]" onClick={() => setIsMobileMenuOpen(false)} />
        )}
      </>
    )
  }

  // Desktop sidebar
  return (
    <nav
      className={`
        fixed inset-y-0 left-0 z-[60] bg-white dark:bg-[#0F0F12] 
        border-r border-gray-200 dark:border-[#1F1F23] transition-all duration-300 ease-in-out
        ${menuState === "hidden" ? "w-0 border-r-0" : getSidebarWidth()}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        overflow: menuState === "hidden" ? "hidden" : "visible",
      }}
    >
      {menuState !== "hidden" && (
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="h-16 px-3 flex items-center border-b border-gray-200 dark:border-[#1F1F23]">
            {showText ? (
              <Link
                href="/dashboard/admin"
                className="flex items-center gap-3 w-full"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-semibold hover:cursor-pointer text-gray-900 dark:text-white transition-opacity duration-200">
                  COM-PSU-Rizal
                </span>
              </Link>
            ) : (
              <div className="flex justify-center w-full">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
              </div>
            )}
          </div>

          <div
            className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 scrollbar-none"
            style={{
              scrollbarWidth: "none" /* Firefox */,
              msOverflowStyle: "none" /* IE and Edge */,
            }}
          >
            <div className="space-y-6">
              {menuData.map((section) => (
                <div key={section.id}>
                  {showText && (
                    <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider sidebar-section-label transition-opacity duration-200">
                      {section.label}
                    </div>
                  )}
                  <div className="space-y-1">
                    {section.items.map((item) => (
                      <NavItem key={item.id} item={item} parentId={section.id} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="px-2 py-4 border-t border-gray-200 dark:border-[#1F1F23]">
            <div className="space-y-1">
              <NavItem item={{ id: "settings", label: "Settings", href: "/dashboard/admin/settings", icon: Settings }} />
              <NavItem item={{ id: "help", label: "Help", href: "/help", icon: HelpCircle }} />
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
