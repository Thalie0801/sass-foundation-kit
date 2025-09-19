import { Outlet } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { clientMenu } from "@/config/menus";

const ClientLayout = () => (
  <AppShell menu={clientMenu}>
    <Outlet />
  </AppShell>
);

export default ClientLayout;
