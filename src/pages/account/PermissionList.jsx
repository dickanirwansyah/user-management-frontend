/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react"
import {
    Button,
    Box,
    TextField
} from '@mui/material';
import api from "../../configuration/ApiConfig";
import GenericDataTable from "../generic/GenericDataTables";

const PermissionList = () => {

    const [permissions, setPermissions] = useState([]);
    const [page, setPage] = useState(0);
    const [name, setName] = useState("");
    const [permissionDescription, setPermissionDescription] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalElements, setTotalElements] = useState(10);

    const declareColumns = [
        {headerName : "ID", field: "id"},
        {headerName : "Name", field: "name"},
        {headerName : "Description", field: "permissionDescription"},
        {headerName : "End Point", field: "endPoint"},
        {headerName : "Icon", field: "icon"},
        {headerName : "Have Parent", field: "haveParent"},
        {headerName : "Parent ID", field: "parentId"},
        {headerName : "Level", field: "permissionLevel"},
        {
            headerName: "Action",
            field: "action",
            render: (row) => (
                <>
                <Button
                    color="primary"
                    size="small"
                    style={{marginRight: "8px"}}
                    variant="outlined">
                    Show
                </Button>
                </>
            )
        }
    ];

    useEffect(() => {
        fetchListPermissions();
    },[page, rowsPerPage]);

    const fetchListPermissions = async () => {
        try{
            const response = await api.get(`/api/v1/permission/search`, 
                {
                    params: {
                        name,
                        permissionDescription
                    }
                });
                setPermissions(response.data.data.content);
                setTotalElements(response.data.data.totalElements);
        }catch(error){
            console.log("Error fetching permissions list : ",error);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }

    const handleSearch = () => {
        setPage(0);
        fetchListPermissions();
    }

    return (
        <div>
            <Box display="flex" gap={2} mb={2}>
                <TextField
                    label="name"
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <TextField
                    label="Description"
                    variant="outlined"
                    value={permissionDescription}
                    onChange={(e) => setPermissionDescription(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={handleSearch}>
                    Search
                </Button>
            </Box>
            <GenericDataTable
                title="Data Permissions"
                columns={declareColumns}
                rows={permissions}
                page={page}
                rowsPerPage={rowsPerPage}
                totalElements={totalElements}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </div>
    )
}

export default PermissionList;