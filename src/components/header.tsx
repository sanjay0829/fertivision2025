import Image from "next/image";
import React from "react";

const Header = () => {
  return (
    <div className="flex w-full rounded-lg border-2 border-green-800 bg-green-700 shadow-xl shadow-green-100 ">
      <Image
        src={"/img/header.jpg"}
        width={1000}
        height={1000}
        className="w-full rounded-lg"
        alt="header"
      />
    </div>
  );
};

export default Header;
