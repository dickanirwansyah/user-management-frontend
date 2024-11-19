import React, { useEffect, useState } from "react";
import {
    Button,
    Box,
    TextField,
    Paper,
    Typography,
    FormControlLabel,
    Checkbox,
    Collapse,
    List,
    ListItem,
    IconButton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import api from "../../configuration/ApiConfig";

const SettingRoles = () => {

    const [rolesName, setRolesName] = useState("");
    const [permissions, setPermissions] = useState([]);
    const [expandedMenus, setExpandedMenus] = useState({});
    const [selectedPermissions, setSelectedPermissions] = useState([]);

    useEffect(() => {
        const fetchPermissionsByLevel = async () => {
            try{
                const response = await api.get("/api/v1/permission/fetching-menu-by-level");
                if (response.data.status === 200){
                    console.log("data permissions : ",response.data.data);
                    setPermissions(response.data.data);
                }
            }catch(error){
                console.log("Error fetching permissions : ",error);
            }
        };
        fetchPermissionsByLevel();
    }, []);


    const toggleExpand = (menuId) => {
        setExpandedMenus((prev) => ({
            ...prev,
            [menuId]: !prev[menuId],
        }));
    }

    const handleCheckBoxChange = (permissionId) => {
        setSelectedPermissions((prev) => 
            prev.includes(permissionId) ? 
                prev.filter((id) => id !== permissionId) : 
                    [...prev, permissionId]);
    };

    const handleSubmit = async () => {
        const payload = {
            rolesName,
            permissionRequestList : selectedPermissions
        };

        try{
            const response = await api.post("/api/v1/roles/setting-roles", payload);
            if (response.status === 200){
                setRolesName("");
                setSelectedPermissions([]);
            }else{
                console.log("failed add permissions !");
            }
        }catch(error){
            console.log("Error adding roles : ",error);
        }
    }

    return (
      <Box p={3}>
            <Paper elevation={3}>
                <Typography variant="h6" component="div" style={{ padding: '16px'}}>
                    Setting Roles
                </Typography>
            </Paper>
            <Box mt={2}>
                <TextField
                    label="Role Name"
                    variant="outlined"
                    value={rolesName}
                    onChange={(e) => setRolesName(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <Typography variant="subtitle1" component="div" style={{ marginTop: '16px'}}>
                    Select Permissions
                </Typography>
                <Box style={{
                     maxHeight: '400px', 
                     overflowY: 'auto',
                     padding: '8px', 
                }}
                component={Paper}>
                     <List>
                    {permissions.map((permission) => (
                        <React.Fragment key={permission.menuIdLevel1}>
                            <ListItem>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={selectedPermissions.includes(permission.menuIdLevel1)}
                                            onChange={() => handleCheckBoxChange(permission.menuIdLevel1)}
                                        />
                                    }
                                    label={permission.menuName}
                                    />
                                    {permission.children.length > 0 && (
                                        <IconButton onClick={() => toggleExpand(permission.menuIdLevel1)}>
                                            {expandedMenus[permission.menuIdLevel1] ? <ExpandLessIcon/> : <ExpandMoreIcon/>}
                                         </IconButton>
                                    )}
                            </ListItem>
                            <Collapse in={expandedMenus[permission.menuIdLevel1]} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {permission.children.map((child) => (
                                            <ListItem key={child.menuIdLevel2} style={{ paddingLeft: 32 }}>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={selectedPermissions.includes(child.menuIdLevel2)}
                                                            onChange={() => handleCheckBoxChange(child.menuIdLevel2)}   
                                                        />
                                                    }
                                                    label={child.menuName}
                                                    />
                                            </ListItem>
                                        ))}
                                    </List>
                            </Collapse>
                        </React.Fragment>
                    ))}
                </List>
                </Box>
                <Button variant="contained" color="primary" onClick={handleSubmit} style={{marginTop: '16px'}}>
                    Save Roles
                </Button>
            </Box>
      </Box>
    )
}

export default SettingRoles;