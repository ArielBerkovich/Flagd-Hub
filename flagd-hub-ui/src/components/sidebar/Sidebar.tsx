import React, { useEffect, useState } from 'react';
import './Sidebar.css';
import LogoutIcon from '@mui/icons-material/Logout';
import Environment from '../../utils/Environment';


interface SidebarProps {
  onAreaSelect: (area: string | null) => void;
  allAreas: string[];
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onAreaSelect, allAreas, onLogout }) => {
  const [filteredAreas, setFilteredAreas] = useState<string[]>([]);
  const [activeArea, setActiveArea] = useState<string | null>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSecured, setIsSecured] = useState<boolean>(false);

  useEffect(() => {
    setIsSecured(Environment.getBoolean('is_secured'));
  }, []);

  useEffect(() => {
    setFilteredAreas(() =>
      searchTerm.trim()
        ? allAreas.filter((area) =>
          area.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : allAreas
    );
  }, [allAreas, searchTerm]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);

    setFilteredAreas(
      ['All', ...allAreas].filter((area) =>
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
        <img
          className="logo"
          src="./flagd-hub-logo.png"
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
      <div className='feature-flags-areas-container' >
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
      {isSecured && (
        <div className='logout-container'>
          <button className='logout-button' onClick={() => {
            localStorage.removeItem('flagd-hub-token');
            onLogout()
          }}>
            <LogoutIcon className="me-2" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
