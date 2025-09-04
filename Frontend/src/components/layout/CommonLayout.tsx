import type { ReactNode } from "react";

import Footer from "./Footer";
import { Navbar } from "./Navbar";
import SearchInput from "../SearchInput";

interface IProps {
  children: ReactNode;
}

export default function CommonLayout({ children }: IProps) {
  return (
    <div>
      <Navbar></Navbar>
      <div className="bg-[#727088]  py-4 shadow sticky top-0 z-50">
        <SearchInput></SearchInput>
      </div>
      <div className="w-11/12 mx-auto">{children}</div>
      <Footer></Footer>
    </div>
  );
}
