import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, MenuItem, IconButton,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { updateEmployeer, listEmployeer, createEmployeer, deleteEmployeer } from "../../redux/slice/employeer.slice";
import { useAppDispatch, useAppSelector } from "../../redux/hook";

const EmployeeList = () => {

    return (
        <div>
            <h2>Employee Management</h2>
        </div>
    );
};

export default EmployeeList;
