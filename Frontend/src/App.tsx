import { Outlet } from "react-router";
import CommonLayout from "./components/layout/CommonLayout";
import { generateRoutes } from "./utils/generateRoutes";
import { adminSidebarItems } from "./router/adminSidebarItems";
import { Toaster } from "sonner";

function App() {
  console.log(generateRoutes(adminSidebarItems))
  return (
    <CommonLayout>
       <Toaster position="top-center" />
      <Outlet></Outlet>
    </CommonLayout>
  );
}

export default App;
