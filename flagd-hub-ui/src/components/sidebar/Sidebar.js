import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Sidebar.css';

const Sidebar = ({ onAreaSelect }) => {
  const [areas, setAreas] = useState([]);
  const [activeArea, setActiveArea] = useState(null);

  useEffect(() => {
    const fetchFeatureFlags = async () => {
      try {
        const apiUrl = process.env.REACT_APP_SERVER_URL;
        const response = await axios.get(apiUrl+'/flagd-hub/flags');
        const flags = response.data;
        const uniqueAreas = [...new Set(flags.map(flag => flag.area))];
        setAreas(['All', ...uniqueAreas]); // Add "All" to the list
      } catch (error) {
        console.error('Error fetching feature flags:', error);
      }
    };

    fetchFeatureFlags();
  }, []);

  const handleAreaClick = (area) => {
    setActiveArea(area);
    onAreaSelect(area === 'All' ? null : area); // Send null for "All"
  };

  return (
    <div className="sidebar">
      <h3>Areas</h3>
      <ul>
        {areas.map((area, index) => (
          <li
            key={index}
            className={activeArea === area ? 'active' : ''}
            onClick={() => handleAreaClick(area)}
          >
            {area}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
