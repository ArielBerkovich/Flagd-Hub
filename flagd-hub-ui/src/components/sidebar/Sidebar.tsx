import React, { useEffect, useState } from 'react';
import './Sidebar.css';
import FeatureFlagsService from '../../services/feature-flags-service';

interface SidebarProps {
  onAreaSelect: (area: string | null) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onAreaSelect }) => {
  const [areas, setAreas] = useState<string[]>([]);
  const [filteredAreas, setFilteredAreas] = useState<string[]>([]);
  const [activeArea, setActiveArea] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const fetchFeatureFlags = async () => {
    try {
      FeatureFlagsService.getFeatureFlags().then(flags=>{
        const uniqueAreas: any = [...new Set(flags.map((flag: { area: string }) => flag.area))];
        const areasWithAll = ['All', ...uniqueAreas];
        setAreas(areasWithAll);
        setFilteredAreas(() => 
          searchTerm.trim()
            ? areasWithAll.filter((area) =>
                area.toLowerCase().includes(searchTerm.toLowerCase())
              )
            : areasWithAll)
      })
    } catch (error) {
      console.error('Error fetching feature flags:', error);
    }
  };

  useEffect(() => {
    setActiveArea('All')
    fetchFeatureFlags();
    const intervalId = setInterval(fetchFeatureFlags, 1000);

    return () => clearInterval(intervalId); 
  }, [searchTerm]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);

    setFilteredAreas(
      areas.filter((area) =>
        area.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const handleAreaClick = (area: string) => {
    setActiveArea(area);
    onAreaSelect(area === 'All' ? null : area);
  };

  return (
    <div className="sidebar">
      <div className="header">
      <img className="logo"
        src="/flagd-hub-logo.png"
        alt="Logo"
      />
            <h3>Flagd Hub</h3>
      </div>

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
