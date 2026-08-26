import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarClock,
  Stethoscope,
  Building2,
  Users,
  MessageSquareQuote,
  HelpCircle,
  ClipboardList,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Logo } from "../../components/layout/Logo";
import { cn } from "../../utils/cn";

const links = [
  {
    to: "/admin/dashboard",
    label: "Tableau de bord",
    Icon: LayoutDashboard,
  },
  {
    to: "/admin/reservations",
    label: "Rendez-vous",
    Icon: CalendarClock,
  },
  {
    to: "/admin/services",
    label: "Services",
    Icon: Stethoscope,
  },
  {
    to: "/admin/departments",
    label: "Départements",
    Icon: Building2,
  },
  {
    to: "/admin/team",
    label: "Équipe",
    Icon: Users,
  },
  {
    to: "/admin/testimonials",
    label: "Témoignages",
    Icon: MessageSquareQuote,
  },
  {
    to: "/admin/faq",
    label: "FAQ",
    Icon: HelpCircle,
  },
  {
    to: "/admin/patient-info",
    label: "Infos patients",
    Icon: ClipboardList,
  },
];

const settingsLink = {
  to: "/admin/settings",
  label: "Paramètres",
  Icon: Settings,
};

const mobileLinks = links.slice(0, 4);

export default function AdminLayout() {
  const { signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-ink">
      {/* Desktop sidebar */}
      <aside
        className="
          fixed inset-y-4 left-4 z-40 hidden w-[250px]
          flex-col rounded-[28px]
          border border-white/70
          bg-white/65
          p-3
          backdrop-blur-2xl
          [-webkit-backdrop-filter:blur(24px)]
          lg:flex
        "
      >
        {/* Logo */}
        <div className="px-3 py-3">
          <Logo />
        </div>

        {/* Main navigation */}
        <nav className="mt-5 flex-1 space-y-1">
          {links.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  `
                    group flex items-center gap-3
                    rounded-2xl px-3.5 py-3
                    text-[13px] font-medium
                    transition-all duration-200
                  `,
                  isActive
                    ? `
                      bg-primary text-white
                      shadow-xs
                    `
                    : `
                      text-ink-soft
                      hover:bg-black/[0.04]
                      hover:text-ink
                    `,
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={17}
                    strokeWidth={isActive ? 2.2 : 1.8}
                    className="shrink-0"
                  />

                  <span className="truncate">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="mt-4 space-y-1 border-t border-black/[0.06] pt-3">
          <NavLink
            to={settingsLink.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-2xl px-3.5 py-3 text-[13px] font-medium transition",
                isActive
                  ? "bg-primary-50 text-primary-700"
                  : "text-ink-soft hover:bg-black/[0.04] hover:text-ink",
              )
            }
          >
            <Settings size={17} strokeWidth={1.8} />
            <span>{settingsLink.label}</span>
          </NavLink>

          <button
            onClick={signOut}
            className="
              flex w-full items-center gap-3
              rounded-2xl px-3.5 py-3
              text-left text-[13px] font-medium
              text-ink-soft
              transition
              hover:bg-red-500/[0.06]
              hover:text-red-600
            "
          >
            <LogOut size={17} strokeWidth={1.8} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Mobile / tablet top bar */}
      <header
        className="
          sticky top-3 z-30 mx-3 mb-3
          flex items-center justify-between
          rounded-[22px]
          border border-white/70
          bg-white/70
          px-3 py-2.5
          backdrop-blur-2xl
          [-webkit-backdrop-filter:blur(24px)]
          lg:hidden
        "
      >
        <div className="px-2">
          <Logo />
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((value) => !value)}
          aria-label="Ouvrir le menu"
          className="
            flex size-10 items-center justify-center
            rounded-full
            bg-black/[0.04]
            text-ink
            transition
            hover:bg-black/[0.07]
          "
        >
          <Menu size={19} strokeWidth={2} />
        </button>
      </header>

      {/* Mobile expanded menu */}
      {mobileMenuOpen && (
        <div
          className="
            fixed inset-x-3 top-[72px] z-40
            rounded-[24px]
            border border-white/70
            bg-white/90
            p-2
            backdrop-blur-2xl
            [-webkit-backdrop-filter:blur(24px)]
            lg:hidden
          "
        >
          <nav className="space-y-1">
            {[...links, settingsLink].map(({ to, label, Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-medium",
                    isActive
                      ? "bg-primary text-white"
                      : "text-ink-soft hover:bg-black/[0.04]",
                  )
                }
              >
                <Icon size={17} strokeWidth={1.8} />
                <span>{label}</span>
              </NavLink>
            ))}

            <button
              onClick={signOut}
              className="
                flex w-full items-center gap-3
                rounded-2xl px-3.5 py-3
                text-left text-sm font-medium
                text-red-600
                hover:bg-red-500/[0.06]
              "
            >
              <LogOut size={17} strokeWidth={1.8} />
              <span>Déconnexion</span>
            </button>
          </nav>
        </div>
      )}

      {/* Main content */}
      <main
        className="
          min-h-screen
          px-3 pb-24 pt-2
          sm:px-5
          md:px-6
          lg:ml-[274px]
          lg:px-7
          lg:pb-7
          lg:pt-5
        "
      >
        <div className="mx-auto w-full max-w-[1600px]">
          <Outlet />
        </div>
      </main>

      {/* Mobile bottom navigation */}
      <nav
        className="
          fixed inset-x-3 bottom-3 z-40
          flex items-center justify-around
          rounded-[24px]
          border border-white/70
          bg-white/75
          px-2 py-2
          backdrop-blur-2xl
          [-webkit-backdrop-filter:blur(24px)]
          lg:hidden
        "
      >
        {mobileLinks.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className="relative flex min-w-0 flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-2"
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={18}
                  strokeWidth={isActive ? 2.2 : 1.8}
                  className={cn(
                    "transition",
                    isActive ? "text-primary" : "text-ink-soft",
                  )}
                />

                <span
                  className={cn(
                    "max-w-full truncate text-[10px] font-medium",
                    isActive ? "text-primary" : "text-ink-soft",
                  )}
                >
                  {label}
                </span>

                {isActive && (
                  <span
                    className="
                      absolute -bottom-0.5
                      size-1 rounded-full
                      bg-primary
                    "
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
