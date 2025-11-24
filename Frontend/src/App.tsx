import { Outlet } from "react-router";
import CommonLayout from "./components/layout/CommonLayout";
import { Toaster } from "sonner";
import GATracker from "./components/modules/GA/GATracker";

function App() {

  return (
    <CommonLayout>
       <Toaster position="top-center" richColors/>
       <GATracker></GATracker>
      <Outlet></Outlet>
    </CommonLayout>
  );
}

export default App;
