import React from "react";
import { Article1, Chartbook, Product2 } from "../../comp";
import "./pas.css";

const Pas = () => {
    return (
        <div className="pas">
            <div className="products">
                <Chartbook />
                <Article1 />
            </div>
        </div>
    )
}
export default Pas;