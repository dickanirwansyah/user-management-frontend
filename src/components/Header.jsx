import React, { useEffect, useState } from "react";
import '../assets/css/Header.css';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const Header = ({ onLogout }) => {
    const navigate = useNavigate();

    const [personalInformation, setPersonalInformation] = useState({
        "id" : 0,
        "username" : "",
        "fullName" : "",
        "dob" : "",
    });
    const [dropdownVisible, setDropdownVisible] = useState(false);

    useEffect(() => {
        const storeInformationPersonal = localStorage.getItem('login_information');
        if (storeInformationPersonal){
            const parseDataInformationPersonal = JSON.parse(storeInformationPersonal);
            setPersonalInformation(parseDataInformationPersonal);
        }
    },[]);

    const clickToShowChildMenu = () => {
        setDropdownVisible(!dropdownVisible);
    }

    const handleLogout = () => {
        localStorage.clear();
        onLogout();
        navigate('/login');
        window.location.reload();
    }

    return (
        <header className="app-header">
        <div className="header-content" style={{ display: "flex", alignItems: "center" }}>
            {/* <b>Logo or Title Here</b> */}
            <div style={{ marginLeft: "auto", position: "relative", display: "inline-block" }}>
                <button className="logout-button" onClick={clickToShowChildMenu}>
                    <FontAwesomeIcon icon={faUser} size="1x" />
                    &nbsp;&nbsp;
                    Hi! {personalInformation.fullName || "User"}
                </button>
                {dropdownVisible && (
                    <ul className="dropdown-menu show" style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        zIndex: 1,
                        backgroundColor: "#fff",
                        border: "1px solid #ccc",
                        padding: "0.5rem",
                        borderRadius: "4px",
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)"
                    }}>
                        <li>
                            <button className="dropdown-item" onClick={handleLogout}>
                                Logout
                            </button>
                        </li>
                        <li>
                            <button className="dropdown-item" onClick={() => navigate('/profile')}>Check Profile</button>
                        </li>
                    </ul>
                )}
            </div>
        </div>
    </header>
    )
}

export default Header;