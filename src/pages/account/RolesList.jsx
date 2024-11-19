/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react"
import {
    Button,
    Box,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    FormControlLabel,
    Checkbox,
    DialogActions
} from '@mui/material';
import api from "../../configuration/ApiConfig";
import GenericDataTable from "../generic/GenericDataTables";
import { useNavigate } from "react-router-dom";


const RolesList = () => {
    
    const navigate = useNavigate();
    const [roles, setRoles] = useState([]);
    const [page, setPage] = useState(0);
    const [rolesName, setRolesName] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalElements, setTotalElements] = useState(10);
    const [formData, setFormData] = useState({});
    const [permissions, setPermissions] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState(new Set());
    const [isEditModalOpen, setEditModalOpen] = useState(false);

    useEffect(() => {
        fetchListRoles();
    },[page,rowsPerPage]);

    const declareColumns = [
        {headerName : "ID", field: "rolesId"},
        {headerName : "NAME", field: "rolesName"},
        {
            headerName : "ACTION", 
            field: "actoon",
            render: (row) => (
                <>
                    <Button 
                    color="primary"
                    size="small"
                    onClick={() => handleEdit(row.rolesId)}
                    style={{marginRight: "8px"}}
                    variant="outlined">
                        Edit
                    </Button>
                </>
            )
        }
    ];

    const handleEdit = async (id) => {
        const responseFindRoles = await api.get(`/api/v1/roles/find-permissions?roles=${id}`)
        const responseListPermissions = await api.get(`/api/v1/permission/fetching-menu-by-level`);
        
        const roleData = responseFindRoles.data.data;
        const permissionData = responseListPermissions.data.data;
        

        setFormData({ rolesId: roleData.rolesId, rolesName: roleData.rolesName });
        setPermissions(permissionData);

        setSelectedPermissions(new Set(roleData.permissionRequestList));

        setEditModalOpen(true);
    };

    const handlePermissionToggle = (menuId, level, children = []) => {
        const newPermissions = new Set(selectedPermissions);
    
        if (level === 1) {
            // Toggle only the Level 1 item itself, without affecting children
            if (newPermissions.has(menuId)) {
                newPermissions.delete(menuId);
            } else {
                newPermissions.add(menuId);
            }
        } else if (level === 2) {
            // Toggle the Level 2 item
            if (newPermissions.has(menuId)) {
                newPermissions.delete(menuId);
            } else {
                newPermissions.add(menuId);
            }
    
            // Check if all children of the parent are selected; if so, select the parent
            const allChildrenSelected = children.every(child => newPermissions.has(child.menuIdLevel2));
            if (allChildrenSelected) {
                newPermissions.add(children[0].parentId); // Add parent if all children are selected
            } else {
                newPermissions.delete(children[0].parentId); // Remove parent if not all children are selected
            }
        }
    
        setSelectedPermissions(newPermissions);
    };
    
    const handleCloseModal = () => {
        setEditModalOpen(false);
    };

    const fetchListRoles = async () => {
        try{
            const response = await api.get(`/api/v1/roles/search-roles`, 
                {
                    params: {
                        rolesName,
                    }
                });
                setRoles(response.data.data.content);
                setTotalElements(response.data.data.totalElements);
        }catch(error){
            console.log("Error fetching roles list : ",error);
        }
    };

    const handleChangePage = (event, newPage) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0)
    };

    const handleSearch = () => {
        setPage(0);
        fetchListRoles();  
    };

    const handleClearSearch = () => {
        setRolesName("");
        fetchListRoles();
    };

    const handleClickAddRoles = () => {
        navigate('/app/management-account/settings-roles');
    };

   const handleEditSettingRoles = async () => {
        try{
            const updatedRolesPayload = {
                rolesId : formData.rolesId,
                rolesName : formData.rolesName,
                permissionRequestList : Array.from(selectedPermissions)
            };
            console.log("Process edit setting roles : ",JSON.stringify(updatedRolesPayload));
            await api.put(`/api/v1/roles/setting-roles-update`,updatedRolesPayload);
            setEditModalOpen(false);
            fetchListRoles();
        }catch(error){
            console.log("Error update setting roles : ",error);
        };
   };

    return(
        <div>
            <Box display="flex" gap={2} mb={2}>
                <TextField
                    label="Roles Name"
                    variant="outlined"
                    value={rolesName}
                    onChange={(e) => setRolesName(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={handleSearch}>
                    Search
                </Button>
            </Box>
            <Button variant="contained" color="primary" onClick={handleClickAddRoles}>
                Add Data
            </Button>
            &nbsp;
            <Button variant="contained" color="primary" onClick={handleClearSearch}>
                Clear Search
            </Button>
            <GenericDataTable
                title="Data Roles"
                columns={declareColumns}
                rows={roles}
                page={page}
                rowsPerPage={rowsPerPage}
                totalElements={totalElements}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangePage}
            />
        {/* Modal Dialog */}
    <Dialog open={isEditModalOpen} onClose={handleCloseModal}>
        <DialogTitle>Edit Setting Roles</DialogTitle>
        <DialogContent>
        <TextField
            label="Roles Name"
            name="rolesName"
            fullWidth
            variant="outlined"
            value={formData.rolesName}
            margin="dense"
            onChange={(e) => setFormData({ ...formData, rolesName: e.target.value })}
        />
        <div style={{ marginTop: '20px' }}>
            {permissions.map((menu) => (
                <div key={menu.menuIdLevel1}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={selectedPermissions.has(menu.menuIdLevel1)}
                                onChange={() => handlePermissionToggle(menu.menuIdLevel1, 1, menu.children)}
                            />
                        }
                        label={menu.menuName}
                    />
                    {menu.children.map((child) => (
                        <div key={child.menuIdLevel2} style={{ marginLeft: '20px' }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={selectedPermissions.has(child.menuIdLevel2)}
                                        onChange={() => handlePermissionToggle(child.menuIdLevel2, 2, menu.children)}
                                    />
                                }
                                label={child.menuName}
                            />
                        </div>
                    ))}
                </div>
            ))}
        </div>
    </DialogContent>
    <DialogActions>
        <Button onClick={handleEditSettingRoles} color="primary">Edit</Button>
        <Button onClick={handleCloseModal} color="primary">Cancel</Button>
    </DialogActions>
</Dialog>
</div>
    )

}

export default RolesList;