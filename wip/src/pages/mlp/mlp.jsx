import React, { useState, useEffect } from "react";
import Article2 from "../../comp/article2/article2";
import "./mlp.css";


const Mlp = () => {
    
    const [showTitle, setShowTitle] = useState(false);

    useEffect(() => {
      const timeoutId = setTimeout(() => {
        setShowTitle(true);
      }, 500);
      return () => clearTimeout(timeoutId);
    }, []);
  
    return (
      <div className="mlp">
        <h1 className={`title ${showTitle ? "visible" : ""}`}>Being Me Human Design</h1>
        <Article2 />
      </div>
    );
  };
export default Mlp;