import React, { useEffect, useState } from 'react';
import {
    CDBSidebar,
    CDBSidebarHeader,
    CDBSidebarContent,
    CDBSidebarMenu,
    CDBSidebarMenuItem,
    CDBSidebarFooter
} from 'cdbreact';
import { NavLink } from 'react-router-dom';
import '../assets/css/Sidebar.css';
import api from "../configuration/ApiConfig";

const Sidebar = () => {
    
    const [menuData, setMenuData] = useState([]);
    const [openMenus, setOpenMenus] = useState({}); 

    const fetchDynamicMenuByRoles = () => {
        const token = localStorage.getItem('token');
        console.log("token from local storage : ",token);
        if (token) {
            api.get('/api/v1/roles/get-roles')
            .then(response => {
                console.log("Response data:", response);
                if (response.status === 200) {
                    setMenuData(response.data.data.menus);
                }
            })
            .catch(error => {
                console.log('Error fetching menu by roles!', error);
            });
        } else {
            console.log("No token found in localStorage.");
        }
    }

    useEffect(() => {
        fetchDynamicMenuByRoles();
        
        const hadleStorageChange = () => fetchDynamicMenuByRoles();
        window.addEventListener('storage', hadleStorageChange);
        return () => {
            window.removeEventListener('storage', hadleStorageChange);
        }
    }, []);
        
    const toggleSubMenu = (menuId) => {
        setOpenMenus((prevState) => ({
            ...prevState,
            [menuId]: !prevState[menuId]
        }));
    };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'scroll initial' }}>
            
      <CDBSidebar textColor="#fff" backgroundColor="#b1483b">
        <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
          <a href="/" className="text-decoration-none" style={{ color: 'inherit' }}>
            Inventory Apps
          </a>
        </CDBSidebarHeader>

        <CDBSidebarContent className="sidebar-content">
            <CDBSidebarMenu>
                {menuData.map((menu) => (
                    <div key={menu.permissionId}>
                        {/* Parent menu item */}
                        <NavLink 
                            to={menu.endPoint}
                            className={({ isActive }) => isActive ? 'activeClicked' : ''}
                            onClick={() => toggleSubMenu(menu.permissionId)}
                        >
                            <CDBSidebarMenuItem icon={menu.glyphicon}>
                                {menu.name}
                            </CDBSidebarMenuItem>
                        </NavLink>

                        {/* Render child menus if present and open */}
                        {menu.childMenuResponses.length > 0 && openMenus[menu.permissionId] && (
                            <CDBSidebarMenu className="submenu">
                                {menu.childMenuResponses.map((subMenu) => (
                                    <NavLink 
                                        key={subMenu.permissionId} 
                                        to={subMenu.endPoint}
                                        className={({ isActive }) => isActive ? 'activeClicked' : ''}>
                                        <CDBSidebarMenuItem icon={subMenu.glyphicon}>
                                            {subMenu.name}
                                        </CDBSidebarMenuItem>
                                    </NavLink>
                                ))}
                            </CDBSidebarMenu>
                        )}
                    </div>
                ))}
            </CDBSidebarMenu>
        </CDBSidebarContent>

        <CDBSidebarFooter style={{ textAlign: 'center' }}>
          <div
            style={{
              padding: '20px 5px',
            }}
          >
          </div>
        </CDBSidebarFooter>
      </CDBSidebar>

    </div>  
  );
};

export default Sidebar;