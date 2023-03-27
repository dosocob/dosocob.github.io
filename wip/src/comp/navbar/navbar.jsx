import React from "react";
import "./navbar.css";


const Navbar = () => {
    return (
        <div className="navbar">
            <a href="/">Home</a>
            <a href="/about-me">About Me</a>
            <a href="/pas">Chart Book</a>
            <a href="/frequencies">Frequencies</a>
        </div>
    )
}
export default Navbar;