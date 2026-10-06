import { Database, LayoutDashboard, Network, UsersRound } from 'lucide-react'

export const nav = [
  { to: '', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/datasources', label: 'Data Sources', icon: Database },
  { to: '/group-api', label: 'Group API', icon: UsersRound },
  { to: '/dynamic-api', label: 'Dynamic API', icon: Network },
]
