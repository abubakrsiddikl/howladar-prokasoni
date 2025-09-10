import { Outlet } from "react-router";
import CommonLayout from "./components/layout/CommonLayout";
import { Toaster } from "sonner";

function App() {

  return (
    <CommonLayout>
       <Toaster position="top-center" />
      <Outlet></Outlet>
    </CommonLayout>
  );
}

export default App;
