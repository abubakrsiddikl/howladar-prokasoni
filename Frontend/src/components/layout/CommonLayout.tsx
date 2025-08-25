import type { ReactNode } from "react";

import Footer from "./Footer";
import { Navbar } from "./Navbar";

interface IProps {
  children: ReactNode;
}

export default function CommonLayout({ children }: IProps) {
  return (
    <div>
      <Navbar></Navbar>
      <div className="w-11/12 mx-auto">

      {children}
      </div>
      <Footer></Footer>
    </div>
  );
}
