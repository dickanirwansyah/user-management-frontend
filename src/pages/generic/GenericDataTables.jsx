/* eslint-disable array-callback-return */
import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Paper,
    Typography,
    Box
} from '@mui/material';

const GenericDataTable = ({
    title = "Generic Data Tables",
    columns,
    rows,
    page,
    rowsPerPage,
    totalElements,
    onPageChange,
    onRowsPerPageChange
}) => {
    return (
        <Paper>
            <Typography variant="h6" component="div" style={{padding:'16px'}}>
                {title}
            </Typography>
            <Box sx={{ overflowX: 'auto', overflowY: 'auto', maxHeight: 400 }}>
            <TableContainer>
                <Table stickyHeader aria-label="scrollable table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell 
                                key={column.field} 
                                >{column.headerName}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row,rowIndex) => (
                            <TableRow key={rowIndex}>
                                {columns.map((column) => (
                                    <TableCell key={column.field}
                                        >
                                        {column.render ? column.render(row) : row[column.field]}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            </Box>
            <TablePagination
                component="div"
                count={totalElements}
                page={page}
                onPageChange={onPageChange}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={onRowsPerPageChange}
            />
        </Paper>
    )
}

export default GenericDataTable;