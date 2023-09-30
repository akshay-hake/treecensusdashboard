import React, { useState } from "react";

const TreeFilter = ({ filteredData,setFilteredData, allData, setSelectedTree }) => {
  // Get all unique keys from the JSON array
  console.log("f",filteredData)
  const keys = ['ward', 'tname']; // Assuming the first element contains all keys

  const [selectedFilters, setSelectedFilters] = useState({}); // Initialize filters as an empty object
  

  const handleSelectKey = (event) => {
    const key = event.target.name;
    const value = event.target.value;

    // Update the selectedFilters object with the selected key and value
    let filters= { ...selectedFilters, [key]: value };
    let filtered = allData;

    for (const key in filters) {
      if (filters[key]) {
        filtered = filtered.filter(
          (tree) => tree[key] === filters[key]
        );
      }
    }

    setFilteredData(filtered);
    setSelectedTree(undefined)
  };


  return (
    <div>
      <h2>Select filters:</h2>
      {keys.map((key) => (
        <select
          key={key}
          name={key}
          // value={selectedFilters[key] || ""}
          onChange={handleSelectKey}
        >
          <option value="">All</option>
          {[...new Set(allData.map((tree) => tree[key]))].map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      ))}
      {/* <h2>Filtered Tree Data:</h2>
      <ul>
        {filteredData.map((tree, index) => (
          <li key={index}>{JSON.stringify(tree)}</li>
        ))}
      </ul> */}
    </div>
  );
};

export default TreeFilter;
