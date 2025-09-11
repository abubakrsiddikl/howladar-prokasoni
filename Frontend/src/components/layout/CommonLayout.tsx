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
      <div className="">{children}</div>
      <div className="bg-white">
        <Footer></Footer>
      </div>
    </div>
  );
}
