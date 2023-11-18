// src/components/Layout.js

import React from "react";
import "./about.css";

const Layout = ({ children }) => {
  return (
    <div>
      <header>
        {/* Add navigation if needed */}
      </header>
      <main>{children}</main>
      <footer>
        {/* Add footer content if needed */}
      </footer>
    </div>
  );
};

export default Layout;
