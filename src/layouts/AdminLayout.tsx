import { Outlet } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { adminMenu } from "@/config/menus";

const AdminLayout = () => (
  <AppShell menu={adminMenu}>
    <Outlet />
  </AppShell>
);

export default AdminLayout;
