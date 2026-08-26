import { NavLink, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  CalendarClock,
  Stethoscope,
  Building2,
  Users,
  MessageSquareQuote,
  HelpCircle,
  ClipboardList,
  Settings as SettingsIcon,
  LogOut,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { Logo } from '../../components/layout/Logo'
import { cn } from '../../utils/cn'

const links = [
  { to: '/admin/dashboard', label: 'Tableau de bord', Icon: LayoutDashboard },
  { to: '/admin/reservations', label: 'Rendez-vous', Icon: CalendarClock },
  { to: '/admin/services', label: 'Services', Icon: Stethoscope },
  { to: '/admin/departments', label: 'Départements', Icon: Building2 },
  { to: '/admin/team', label: 'Équipe', Icon: Users },
  { to: '/admin/testimonials', label: 'Témoignages', Icon: MessageSquareQuote },
  { to: '/admin/faq', label: 'FAQ', Icon: HelpCircle },
  { to: '/admin/patient-info', label: 'Infos patients', Icon: ClipboardList },
  { to: '/admin/settings', label: 'Paramètres', Icon: SettingsIcon },
]

export default function AdminLayout() {
  const { signOut } = useAuth()

  return (
    <div className="flex min-h-screen bg-surface-muted">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-line bg-white p-4 lg:flex">
        <div className="px-2 py-2">
          <Logo />
        </div>
        <nav className="mt-6 flex-1 space-y-1">
          {links.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium',
                  isActive ? 'bg-primary-50 text-primary-700' : 'text-ink-soft hover:bg-ink/5'
                )
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={signOut}
          className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-ink-soft hover:bg-ink/5"
        >
          <LogOut size={17} />
          Déconnexion
        </button>
      </aside>

      <main className="flex-1 overflow-x-hidden p-5 sm:p-8">
        <Outlet />
      </main>
    </div>
  )
}
