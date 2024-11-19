/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import GenericDataTable from "../generic/GenericDataTables";
import GenericModal from "../generic/GenericModals";
import api from "../../configuration/ApiConfig";
import { 
    TextField, 
    Button, 
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    InputLabel,
    Select,
    MenuItem,
    Alert,
} from '@mui/material';
import dayjs from "dayjs";

const AccountList = () => {
    
    const [accounts, setAccounts] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalElements, setTotalElements] = useState(10);
    //state for searching
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState(null);
    //pop up modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    //pop up generic modal edit
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const [roles, setRoles] = useState([]);
    //pop up generic modal delete
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [errors, setErrors] = useState([]);
    
    const [newData, setNewData] = useState({
        id: 0,
        username : "",
        email : "",
        fullName : "",
        phoneNumber : "",
        password: "P@sw0rdb1996*", //default password
        confirmPassword : "P@sw0rdb1996*", //default password
        dob : null,
        rolesId : 2
    });
    const [selectedDate, setSelectedDate] = useState(null);

    const declareColumns = [
        {headerName : "ID", field: "id"},
        {headerName : "Username", field: "username"},
        {headerName : "Full Name", field: "fullName"},
        {headerName : "Email", field: "email"},
        {headerName : "Phone Number", field: "phoneNumber"},
        {headerName : "Date Of Birth", field : "dob"},
        {headerName : "Role", field: "rolesName"},
        {headerName : "Role ID", field: "rolesId"},
        {
            headerName : "Action", 
            field: "action",
            render: (row) => (
                <>
                <Button 
                variant="outlined"
                color="primary"
                size="small"
                onClick={() => handleEdit(row.id)}
                style={{marginRight: "8px"}}>
                    Edit
                </Button>
                <Button
                variant="outlined"
                color="secondary"
                size="small"
                onClick={() => handleDelete(row.id)}>
                    Delete
                </Button>
                </>
            )
        }, 
    ];

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        fetchListAccounts();
    },[page, rowsPerPage]);

    useEffect(() => {
        const fetchingDropdownRoles = async () => {
            try{
                const response = await api.get('/api/v1/roles/dropdown-roles');
                setRoles(response.data.data.content);
            }catch(error){  
                console.log("Error fetching roles : ",error);
            }
        };
        fetchingDropdownRoles();
    },[]);

    const fetchListAccounts = async () => {
        try{
            var dob = dateOfBirth ? dayjs(dateOfBirth).format('YYYY-MM-DD') : '';
            const response = await api.get(`/api/v1/account/search`, {
                params : {
                    username,
                    email,
                    fullName,
                    phoneNumber,
                    dob,
                    page,
                    size: rowsPerPage
                }
            });
            setAccounts(response.data.data.content);
            setTotalElements(response.data.data.totalElements);
        }catch(error) {
            console.log('error fetching account list : ',error);
        }
    };

    const handleSearch = () => {
        setPage(0); //if searching fallback to page 0
        fetchListAccounts();
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleEdit = (id) => {
        setErrors([]);
        const rowToEdit = accounts.find((account) => account.id === id);
        setFormData(rowToEdit);
        setEditModalOpen(true);
    };

    const handleDelete = (id) => {
       setErrors([]);
       const rowToDelete = accounts.find((account) => account.id === id);
       setFormData(rowToDelete);
       setDeleteModalOpen(true);
    };

    const handleFieldChangeToModal = (e) => {
        const {name, value} = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value}));
    };

    const handleSaveToModal = async (data) => {
        console.log("Update data account : ",data);
        try{
            const response = await api.put('/api/v1/account/update-account',data);
            console.log(JSON.stringify(response));
            fetchListAccounts();
            setEditModalOpen(false);
        }catch(error){
            console.log("Error update data account : ",error);
            if (error.response && error.response.data.errors){
                setErrors(error.response.data.errors);
            }
        }
    };

    const handleDeleteToModal = async (data) => {
        console.log("Delete data account : ",data);
        try{
            setDeleteModalOpen(false);
            const id = data.id;
            console.log("id = ",id);
            const response = await api.delete(`/api/v1/account/delete-account/${id}`);
            console.log(JSON.stringify(response));
            fetchListAccounts();
            setDeleteModalOpen(false);
        }catch(error){
            console.log("Error delete data account : ",error);
        }
    }    

    const handleSave = async () => {
        try{
            const response = await api.post('/api/v1/auth/signup', newData);
            console.log(JSON.stringify(response));
            fetchListAccounts();
            handleCloseModal();
        }catch(error){
            console.log("Error saving data : ",error);
            if (error.response && error.response.data.errors){
                setErrors(error.response.data.errors);
            }
        }
    };

    const handleCloseToModal = () => {
        setEditModalOpen(false);
    };

    const handleCloseToModalDelete = () => {
        setDeleteModalOpen(false);
    }

    const handleOpenModal = () => {
        setErrors([]);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleFieldValue = (e) => {
        const { name, value } = e.target;
        setNewData((prevData) => ({
            ...prevData,
            [name] : value
        }));
    };
    
    const handleClearSearch = () => {
        setDateOfBirth(null);
        setUsername('');
        setEmail('');
        setFullName('');
        setPhoneNumber('');
        fetchListAccounts();
    }

    const handleDateChange = (newDate) => {
        setSelectedDate(newDate);
        //convert to yyyy-MM-dd
        setNewData({...newData, dob: dayjs(newDate).format('YYYY-MM-DD')});
    };

    const handleDateChangeForSearching = (newDate) => {
        setDateOfBirth(newDate);
    };


    return (
        <div>
            <Box display="flex" gap={2} mb={2}>
            <TextField
                    label="Username"
                    variant="outlined"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    label="Email"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    label="Full name"
                    variant="outlined"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                />
                <TextField
                    label="Phone Number"
                    variant="outlined"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />    
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Date of birth"
                        value={dateOfBirth}
                        onChange={handleDateChangeForSearching}
                        format="YYYY-MM-DD"
                        renderInput={(params) => <TextField {...params} fullWidth/>}
                    />
                </LocalizationProvider>
                <Button variant="contained"color="primary"onClick={handleSearch}>
                    Search
                </Button>
            </Box>
            <Button onClick={handleOpenModal} variant="contained" color="primary">
                Add Data
            </Button>
            &nbsp;
            <Button onClick={handleClearSearch} variant="contained" color="primary">
                Clear Search
            </Button>
            <hr/>
            <GenericDataTable
            title="Data Accounts"
            columns={declareColumns}
            rows={accounts}
            page={page}
            rowsPerPage={rowsPerPage}
            totalElements={totalElements}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
        />

        {/* Modal Dialog */}
        <Dialog open={isModalOpen} onClose={handleCloseModal}>
            <DialogTitle>Add New Account</DialogTitle>
            <DialogContent>
                {errors.length > 0 && (
                    <Alert severity="error" style={{ marginBottom: "1rem"}}>
                        <ul>
                            {errors.map((err,index) => (
                                <li key={index}>{err}</li>
                            ))}
                        </ul>
                    </Alert>
                )}
                <TextField 
                label="Username" 
                name="username" 
                fullWidth 
                variant="outlined"
                margin="dense"
                onChange={handleFieldValue}/>
                
                <TextField
                label="Email"
                name="email"
                fullWidth
                variant="outlined"
                margin="dense"
                onChange={handleFieldValue}
                />

                <TextField
                label="Full Name"
                name="fullName"
                fullWidth
                variant="outlined"
                margin="dense"
                onChange={handleFieldValue}
                />

                <TextField
                label="Phone Number"
                name="phoneNumber"
                fullWidth
                variant="outlined"
                margin="dense"
                onChange={handleFieldValue}
                />

                {/* date picker */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Date of birth"
                        value={selectedDate}
                        onChange={handleDateChange}
                        format="YYYY-MM-DD"
                        renderInput={(params) => <TextField {...params} fullWidth/>}
                    />
                </LocalizationProvider>

                <InputLabel>Roles</InputLabel>
                <Select value={newData.rolesId}
                    fullWidth
                    onChange={handleFieldValue}
                    name="rolesId"
                    label="Roles">
                        {roles.map((role) => (
                            <MenuItem key={role.id} value={role.id}>
                                {role.name}
                            </MenuItem>
                        ))}
                </Select>

                <TextField
                label="Password"
                type="password"
                name="password"
                value={newData.password}
                fullWidth
                variant="outlined"
                margin="dense"
                onChange={handleFieldValue}
                />

                <TextField
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={newData.confirmPassword}
                fullWidth
                variant="outlined"
                margin="dense"
                onChange={handleFieldValue}
                />

            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseModal} color="secondary">Close</Button>
                <Button onClick={handleSave} color="primary">Save</Button>
            </DialogActions>
        </Dialog>

        {/* generic dialog for edit*/}
        <GenericModal
            open={isEditModalOpen}
            data={formData}
            fields={declareColumns.filter(columns => columns.field !== "action")}
            onClose={handleCloseToModal}
            onSave={handleSaveToModal}
            onFieldChange={handleFieldChangeToModal}
            titleModal={"Edit Account"}
            errors={errors}
        />

        {/**generic dialog for delete */}
        <GenericModal
            open={isDeleteModalOpen}
            data={formData}
            fields={declareColumns.filter(columns => columns.field !== "action")}
            onClose={handleCloseToModalDelete}
            onSave={handleDeleteToModal}
            onFieldChange={handleFieldChangeToModal}
            titleModal={"Confirm Delete Account"}
            errors={errors}
        />
        </div>
    )
};

export default AccountList;