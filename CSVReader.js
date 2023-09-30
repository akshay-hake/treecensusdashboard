import React, { useState } from 'react';
import TMap from './TMap';

function CSVFileReader() {
  const [files, setFiles] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalRecords: 0,
    wardCounts: {},
    uniqueTrees: new Set(),
    totalCanopy: 0,
    wardCanopy: {},
  });

  const [selectedOption, setSelectedOption] = useState('dashboard');

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleFileChange = async (e) => {
    const selectedFiles = e.target.files;
    const filePromises = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const wardNumber = file.name.match(/ward_(\d+)/);
      if (wardNumber) {
        const ward = wardNumber[1];
        const fileContent = await readFile(file);
        const parsedData = await parseCSV(fileContent, ward);
        filePromises.push(parsedData);
      }
    }

    const data = await Promise.all(filePromises);
    setFiles(selectedFiles);
    setTableData(data);
    calculateAnalytics(data);
  };

  const readFile = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target.result);
      };
      reader.readAsText(file);
    });
  };

  const parseCSV = (csvContent, ward) => {
    return new Promise((resolve) => {
      const rows = csvContent.split('\n');
      const headers = rows[0].split(',');
      const rowData = rows.slice(1).map((row) => {
        const values = row.split(',');
        const treeName = values[headers.indexOf('Tree Name')];
        const canopy = parseFloat(values[headers.indexOf('Canopy (sq.mtr)')]);
        analytics.uniqueTrees.add(treeName);
        const sno = values[headers.indexOf('Sr. No')]
        const lat = parseFloat(values[headers.indexOf('Latitude')]);
        const lon = parseFloat(values[headers.indexOf('Longitude')]);
        const height = parseFloat(values[headers.indexOf('Height (Ft)')]);
        const age = parseFloat(values[headers.indexOf('Age (years)')]);
        return { Ward: ward, TreeName: treeName, Canopy: canopy, sno:sno, lat:lat, lon:lon, height:height, age:age };
      });
      resolve(rowData);
    });
  };

  const calculateAnalytics = (data) => {
    let totalRecords = 0;
    const wardCounts = {};
    let totalCanopy = 0;
    const wardCanopy = {};

    for (const fileData of data) {
      for (const row of fileData) {
        totalRecords++;
        const ward = row.Ward;
        wardCounts[ward] = (wardCounts[ward] || 0) + 1;
        if(row.Canopy) {
        totalCanopy += row.Canopy;
        wardCanopy[ward] = (wardCanopy[ward] || 0) + row.Canopy;
        }
      }
    }

    setAnalytics({
        ...analytics,
      totalRecords,
      wardCounts,
      totalCanopy,
      wardCanopy,
    });
  };

  return (
    <div className='dashboard-container'>
        <div className="nav-menu">
        <div
          className={`nav-option ${selectedOption === 'dashboard' ? 'selected' : ''}`}
          onClick={() => handleOptionClick('dashboard')}
        >
          Dashboard
        </div>
        <div
          className={`nav-option ${selectedOption === 'map' ? 'selected' : ''}`}
          onClick={() => handleOptionClick('map')}
        >
          Map
        </div>
      </div>
      <div>
      <div className="content">
        {selectedOption === 'dashboard' && (
          <div className="dashboard-content">
            {/* Render your dashboard content here */}
            <div className="file-input-container">
  <label htmlFor="file-upload" className="file-input-label">
    Choose CSV Files
  </label>
  <input
    type="file"
    id="file-upload"
    accept=".csv"
    className="file-input"
    multiple
    onChange={handleFileChange}
  />
</div>
{files.length > 0 && (
        <div className="uploaded-files">
          <h2>Uploaded Files:</h2>
          <ul className='file-names'>
            {Array.from(files).map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
      {tableData.length > 0 && (
        <div>
           <div className="analytics-container">
  <div className="analytics-block">
    <h2 className="analytics-heading">Total Records</h2>
    <p className="analytics-item">{analytics.totalRecords}</p>
  </div>

  <div className="analytics-block">
    <h2 className="analytics-heading">Count per Ward</h2>
    <ul className="analytics-list">
      {Object.entries(analytics.wardCounts).map(([ward, count]) => (
        <li key={ward} className="analytics-list-item">
          Ward {ward}: {count}
        </li>
      ))}
    </ul>
  </div>

  

  <div className="analytics-block">
    <h2 className="analytics-heading">Total Canopy (sq.mtr)</h2>
    <p className="analytics-item">{analytics.totalCanopy}</p>
  </div>

  <div className="analytics-block">
    <h2 className="analytics-heading">Ward-wise Total Canopy</h2>
    <ul className="analytics-list">
      {Object.entries(analytics.wardCanopy).map(([ward, canopy]) => (
        <li key={ward} className="analytics-list-item">
          Ward {ward}: {canopy}
        </li>
      ))}
    </ul>
  </div>

  <div className="analytics-block">
    <h2 className="analytics-heading">Unique Tree Counts</h2>
    <p className="analytics-item">{analytics.uniqueTrees.size}</p>
  </div>
</div>

        </div>
      )}
    
          </div>
        )}
        {selectedOption === 'map' && (
          <div className="map-content">
            {/* Render your map content here */}
            <TMap data={tableData.flat()}/>
          </div>
        )}
      </div>
      {/* <input type="file" accept=".csv" multiple onChange={handleFileChange} /> */}
      
    </div>
    </div>
  );
}

export default CSVFileReader;
