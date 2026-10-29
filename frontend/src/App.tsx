import { ClipboardList, House, UtensilsCrossed } from 'lucide-react'
import { NavLink, Route, Routes } from 'react-router'

function Placeholder({ title, description }: { title: string; description: string }) {
  return (
    <>
      <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
      <p className="mt-4 text-base-content/70">{description}</p>
    </>
  )
}

function App() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24 text-center">
      <Routes>
        <Route path="/" element={
          <Placeholder title="Welcome to Menu Administration"
            description="Your place to manage menus and meal orders. More coming soon." />
        } />
        <Route path="/menus" element={
          <Placeholder title="Menus" description="Menu management is coming soon." />
        } />
        <Route path="/orders" element={
          <Placeholder title="Orders" description="Meal orders are coming soon." />
        } />
        <Route path="*" element={
          <Placeholder title="Page not found" description="Use the links below to find your way back." />
        } />
      </Routes>

      <nav aria-label="Main navigation" className="mt-8 flex flex-wrap justify-center gap-3">
        <NavLink to="/" end className={({ isActive }) => `btn ${isActive ? 'btn-primary' : 'btn-outline'}`}>
          <House size={18} aria-hidden="true" />
          Home
        </NavLink>
        <NavLink to="/menus" className={({ isActive }) => `btn ${isActive ? 'btn-primary' : 'btn-outline'}`}>
          <UtensilsCrossed size={18} aria-hidden="true" />
          Menus
        </NavLink>
        <NavLink to="/orders" className={({ isActive }) => `btn ${isActive ? 'btn-primary' : 'btn-outline'}`}>
          <ClipboardList size={18} aria-hidden="true" />
          Orders
        </NavLink>
      </nav>
    </main>
  )
}

export default App
