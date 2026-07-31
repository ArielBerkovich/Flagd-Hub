import React, { useEffect, useState } from 'react';
import './Sidebar.css';
import LogoutIcon from '@mui/icons-material/Logout';
import { environment } from '../../utils/environment.util';
import { ENV_KEYS } from '../../constants/environment.constants';
import { STORAGE_KEYS } from '../../constants/storage.constants';
import AboutPopup from '../about-popup/AboutPopup';


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
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  useEffect(() => {
    setIsSecured(environment.getBooleanSync(ENV_KEYS.IS_SECURED));
  }, []);

  // Consolidated filtering logic - no more duplication!
  useEffect(() => {
    const areasToFilter = searchTerm.trim() ? allAreas : allAreas;
    const filtered = areasToFilter.filter((area) =>
      area.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAreas(filtered);
  }, [allAreas, searchTerm]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleAreaClick = (area: string) => {
    setActiveArea(area);
    onAreaSelect(area === 'All' ? null : area);
  };

  const handleAboutClick = () => {
    setIsAboutOpen(true);
  };

  return (
    <div className="sidebar">
      <div className="header" onClick={handleAboutClick}>
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
      {isAboutOpen && (
        <AboutPopup
          onClose={() => setIsAboutOpen(false)}
        />
      )}
      {isSecured && (
        <div className='logout-container'>
          <button className='logout-button' onClick={() => {
            localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
            onLogout();
          }}>
            <LogoutIcon className="me-2" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
