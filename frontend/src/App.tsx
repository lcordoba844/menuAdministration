import {
  Building2,
  ClipboardList,
  House,
  LogOut,
  UtensilsCrossed,
} from 'lucide-react';
import type { ReactElement } from 'react';
import { Navigate, NavLink, Outlet, Route, Routes } from 'react-router';

import { useAuth } from '@/auth/auth-context';
import { LoginPage } from '@/auth/LoginPage';
import { OfficesPage } from '@/features/offices/OfficesPage';

function Placeholder({
  title,
  description,
}: {
  title: string;
  description: string;
}): ReactElement {
  return (
    <>
      <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
      <p className="mt-4 text-base-content/70">{description}</p>
    </>
  );
}

function AuthenticatedLayout(): ReactElement {
  const { status, logout } = useAuth();

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace />;
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 sm:py-24">
      <Outlet />
      <nav
        aria-label="Main navigation"
        className="mt-8 flex flex-wrap justify-center gap-3"
      >
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `btn ${isActive ? 'btn-primary' : 'btn-outline'}`
          }
        >
          <House size={18} aria-hidden="true" />
          Home
        </NavLink>
        <NavLink
          to="/menus"
          className={({ isActive }) =>
            `btn ${isActive ? 'btn-primary' : 'btn-outline'}`
          }
        >
          <UtensilsCrossed size={18} aria-hidden="true" />
          Menus
        </NavLink>
        <NavLink
          to="/orders"
          className={({ isActive }) =>
            `btn ${isActive ? 'btn-primary' : 'btn-outline'}`
          }
        >
          <ClipboardList size={18} aria-hidden="true" />
          Orders
        </NavLink>
        <NavLink
          to="/offices"
          className={({ isActive }) =>
            `btn ${isActive ? 'btn-primary' : 'btn-outline'}`
          }
        >
          <Building2 size={18} aria-hidden="true" />
          Offices
        </NavLink>
        <button type="button" onClick={logout} className="btn btn-ghost">
          <LogOut size={18} aria-hidden="true" />
          Sign out
        </button>
      </nav>
    </main>
  );
}

function App(): ReactElement {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<AuthenticatedLayout />}>
        <Route path="/offices" element={<OfficesPage />} />
        <Route
          path="/"
          element={
            <Placeholder
              title="Welcome to Menu Administration"
              description="Your place to manage menus and meal orders."
            />
          }
        />
        <Route
          path="/menus"
          element={
            <Placeholder
              title="Menus"
              description="Menu management is coming soon."
            />
          }
        />
        <Route
          path="/orders"
          element={
            <Placeholder
              title="Orders"
              description="Meal orders are coming soon."
            />
          }
        />
        <Route
          path="*"
          element={
            <Placeholder
              title="Page not found"
              description="Use the links below to find your way back."
            />
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
