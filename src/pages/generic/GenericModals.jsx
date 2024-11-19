/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    InputLabel,
    Select,
    MenuItem,
    Alert
} from '@mui/material';
import dayjs from "dayjs";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import api from "../../configuration/ApiConfig";

const GenericModal = ({open, data, fields, onClose, onSave, onFieldChange, titleModal, errors}) => {
    
    const [roles,setRoles] = useState([]);

    //if any roles fetching roles
    useEffect(() => {
        const fetchRoles = async () => {
            try{
                const response = await api.get('/api/v1/roles/dropdown-roles');
                setRoles(response.data.data.content);
            }catch(error){
                console.log("Error fetching roles : ",error);
            }
        };
        fetchRoles();
    }, []);

    return (
        <Dialog open={open} onClose={onClose}>
        <DialogTitle>{titleModal}</DialogTitle>
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
            {fields.map((field) => (
                /* if field terdapat dob maka balikan field adalah date time picker */
                field.field === 'dob' ? (
                    <LocalizationProvider dateAdapter={AdapterDayjs} key={field.field}>
                        <DatePicker
                            label={field.headerName}
                            format="YYYY-MM-DD"
                            value={data[field.field] ? dayjs(data[field.field]) : null}
                            onChange={(newDate) => {
                                    const formatDate = dayjs(newDate).format('YYYY-MM-DD');
                                    onFieldChange({target : {name: field.field, value: formatDate}});
                                }}
                                renderInput={(params) => <TextField {...params} fullWidth margin="dense" variant="outlined"/>}
                        />
                    </LocalizationProvider>
                ) : field.field === 'rolesId' ? (
                    <div key={field.field}>
                        <InputLabel>{field.headerName}</InputLabel>
                        <Select
                            value={data[field.field] || ''}
                            name={field.field}
                            margin="dense"
                            onChange={(e) => onFieldChange({target : {name : field.field , value : e.target.value}})}
                            fullWidth
                            >
                                {roles.map((role) => (
                                    <MenuItem key={role.id} value={role.id}>
                                        {role.name}
                                    </MenuItem>
                                ))}
                        </Select>
                    </div>
                ) : (
                     /* if field tidak terdapat dob maka balikan field adalah text field biasa */
                <TextField
                    key={field.field}
                    label={field.headerName}
                    name={field.field}
                    value={data[field.field] || ''}
                    fullWidth
                    margin="dense"
                    variant="outlined"
                    onChange={onFieldChange}
                    disabled={field.field === 'id'}
                />
                )
            ))}
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} color="secondary">Cancel</Button>
            <Button onClick={() => onSave(data)} color="primary">Save</Button>
        </DialogActions>
    </Dialog>
    );
}
export default GenericModal;