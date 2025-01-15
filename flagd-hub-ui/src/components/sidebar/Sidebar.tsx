import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Sidebar.css';

interface SidebarProps {
  onAreaSelect: (area: string | null) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onAreaSelect }) => {
  const [areas, setAreas] = useState<string[]>([]);
  const [filteredAreas, setFilteredAreas] = useState<string[]>([]);
  const [activeArea, setActiveArea] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchFeatureFlags = async () => {
      try {
        const response = await axios.get('/flagd-hub/flags');
        const flags = response.data;
        const uniqueAreas: any = [...new Set(flags.map((flag: { area: string }) => flag.area))];
        const areasWithAll = ['All', ...uniqueAreas];
        setAreas(areasWithAll);
        setFilteredAreas(areasWithAll);
      } catch (error) {
        console.error('Error fetching feature flags:', error);
      }
    };

    fetchFeatureFlags();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value.trim() === '') {
      setFilteredAreas(areas);
    } else {
      setFilteredAreas(
        areas.filter((area) =>
          area.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
  };

  const handleAreaClick = (area: string) => {
    setActiveArea(area);
    onAreaSelect(area === 'All' ? null : area);
  };

  return (
    <div className="sidebar">
      <h3>Areas</h3>
      <input
        type="text"
        className="sidebar-search"
        placeholder="Search areas..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <ul>
        {filteredAreas.map((area, index) => (
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
