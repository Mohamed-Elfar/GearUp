/*
import axios from "axios";
import React, { useEffect, useState } from "react";

function SellerAddProducts() {
  const [data, setData] = useState([]);
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");

  console.log(
    "🚀 ~ SellerAddProducts.jsx:10 ~ SellerAddProducts ~ year:",
    year
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/data.json");
        setData(res.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  const brands = data.map((car) => car.brand);

  const models = data.map((car) => car.models);

  return (
    <>
      <div className="container">
        <div className="form-floating mb-3 mt-5">
          <input
            type="text"
            className="form-control"
            id="floatingInput"
            placeholder="Year"
            onChange={(e) => setYear(e.target.value)}
            value={year}
          />
          <label htmlFor="floatingInput">Year</label>
        </div>

        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            id="floatingInput"
            placeholder="brand"
            onChange={(e) => setBrand(e.target.value)}
            value={brand}
          />
          <label htmlFor="floatingInput">brand</label>
        </div>
        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            id="floatingInput"
            placeholder="Model"
            onChange={(e)=>setModel(e.target.value)}
            value={}
          />
          <label htmlFor="floatingInput">Model</label>
        </div>
      </div>
    </>
  );
}

export default SellerAddProducts;
*/

import axios from "axios";
import React, { useEffect, useState } from "react";

function SellerAddProducts() {
  const [data, setData] = useState([]);
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [brandSuggestions, setBrandSuggestions] = useState([]);
  const [brandFocused, setBrandFocused] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/data.json");
        setData(res.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const brands = data.map((car) => car.brand);

  const handleBrandChange = (e) => {
    const value = e.target.value;
    setBrand(value);

    const filtered = brands.filter((item) =>
      item.toLowerCase().includes(value.toLowerCase())
    );
    setBrandSuggestions(filtered);
  };

  const handleBrandFocus = () => {
    setBrandFocused(true);
    if (brand === "") {
      setBrandSuggestions(brands);
    }
  };

  const handleBrandBlur = () => {
    // تأخير بسيط عشان لو ضغط على عنصر في الليست ميختفيش قبل ما يختاره
    setTimeout(() => {
      setBrandFocused(false);
      setBrandSuggestions([]);
    }, 200);
  };

  const handleBrandSelect = (value) => {
    setBrand(value);
    setBrandSuggestions([]);
  };

  return (
    <>
      <div className="container">
        <div className="form-floating mb-3 mt-5">
          <input
            type="text"
            className="form-control"
            id="floatingInputYear"
            placeholder="Year"
            onChange={(e) => setYear(e.target.value)}
            value={year}
          />
          <label htmlFor="floatingInputYear">Year</label>
        </div>

        <div className="form-floating mb-3" style={{ position: "relative" }}>
          <input
            type="text"
            className="form-control"
            id="floatingInputBrand"
            placeholder="Brand"
            onChange={handleBrandChange}
            onFocus={handleBrandFocus}
            onBlur={handleBrandBlur}
            value={brand}
            autoComplete="off"
          />
          <label htmlFor="floatingInputBrand">Brand</label>

          {brandFocused && brandSuggestions.length > 0 && (
            <ul
              style={{
                listStyle: "none",
                margin: 0,
                padding: "5px",
                border: "1px solid #ccc",
                position: "absolute",
                top: "100%",
                width: "100%",
                background: "#fff",
                zIndex: 10,
                maxHeight: "200px",
                overflowY: "auto",
              }}
            >
              {brandSuggestions.map((item, index) => (
                <li
                  key={index}
                  onClick={() => handleBrandSelect(item)}
                  style={{
                    padding: "5px",
                    cursor: "pointer",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            id="floatingInputModel"
            placeholder="Model"
            onChange={(e) => setModel(e.target.value)}
            value={model}
          />
          <label htmlFor="floatingInputModel">Model</label>
        </div>
      </div>
    </>
  );
}

export default SellerAddProducts;
