import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import { deleteEmployeer, fetchListEmployeer, setCurrentUser, setIsCreateOrEditUser } from '../../../redux/slice/employeer.slice';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from '@mui/material';
import moment from 'moment';
import { Gender, LIMIT_PAGE } from '../types';
import "./style.scss";
import BasicModal from '../../Modal';

const UserTable = ({ currentPage }: { currentPage: number }) => {
    const dispatch = useAppDispatch();
    const [order, setOrder] = useState<("asc" | "desc")[]>([]);
    const [orderBy, setOrderBy] = useState<string[]>([]);
    const { listEmployeer, currentUser } = useAppSelector(state => state.employeerReducer)
    const [isDelete, setIsDelete] = useState(false);

    useEffect(() => {
        dispatch(fetchListEmployeer({ page: currentPage, limit: LIMIT_PAGE }));
    }, []);

    const handleRequestSort = (column: string) => {
        setOrderBy((prevOrderBy) => {
            const newOrderBy = [...prevOrderBy];
            const newOrder = [...order];
            const columnIndex = newOrderBy.indexOf(column);
            if (columnIndex !== -1) {
                newOrder[columnIndex] = newOrder[columnIndex] === "asc" ? "desc" : "asc";
            } else {
                newOrderBy.push(column);
                newOrder.push("asc");
            }
            dispatch(fetchListEmployeer({ page: currentPage, limit: LIMIT_PAGE, sortFields: newOrderBy, sortOrders: newOrder }))
            setOrder(newOrder);
            return newOrderBy;
        });
    };
    const handleDeleteUser = () => {
        if (!!currentUser && !!currentUser._id) {
            dispatch(deleteEmployeer(currentUser._id))
            setIsDelete(false);
            dispatch(setCurrentUser(null))
        }
    }

    const renderFormDelete = () => {
        return (
            <div className="form_delete_user">
                <h2 className='delete_title'> Bạn có chắc chắn muốn xoá nhân viên <span>{currentUser?.name}</span> không ? </h2>
                <div className='btn_action'>
                    <button className='yes-btn' onClick={handleDeleteUser}> Yes</button>
                    <button className='no-btn' onClick={() => setIsDelete(false)}> No</button>
                </div>
            </div>
        );
    };

    return (
        <>
            <div className='user_table_page'>
                <TableContainer component={Paper} className='table_container'>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    className='table_title'
                                >
                                    <TableSortLabel
                                        active={orderBy.includes("name")}
                                        direction={orderBy.includes("name") ? order[orderBy.indexOf("name")] : "asc"}
                                        onClick={() => handleRequestSort("name")}
                                    >
                                        Name
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell className='table_title'>DateOfBirth</TableCell>
                                <TableCell className='table_title'>Gender</TableCell>
                                <TableCell className='table_title'>Email</TableCell>
                                <TableCell className='table_title'>
                                    <TableSortLabel
                                        active={orderBy.includes("address")}
                                        direction={orderBy.includes("address") ? order[orderBy.indexOf("address")] : "asc"}
                                        onClick={() => handleRequestSort("address")}
                                    >
                                        Address
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell className='table_title'>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {!!listEmployeer && listEmployeer?.length > 0 && listEmployeer?.map((item: any) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{moment(item.dateOfBirth).format("DD/MM/YYYY")}</TableCell>
                                    <TableCell>{item.gender === Gender.Male ? "Nam" : "Nữ"}</TableCell>
                                    <TableCell>{item.email}</TableCell>
                                    <TableCell>{item.address}</TableCell>
                                    <TableCell>
                                        <div className="table-buttons">
                                            <button className="edit-btn"
                                                onClick={() => {
                                                    dispatch(setCurrentUser(item))
                                                    dispatch(setIsCreateOrEditUser(true))
                                                }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="delete-btn"
                                                onClick={() => {
                                                    dispatch(setCurrentUser(item))
                                                    setIsDelete(true)
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <BasicModal
                open={isDelete}
                onClose={() => {
                    setIsDelete(false)
                    dispatch(setCurrentUser(null))
                }}
                content={renderFormDelete()}
            />
        </>

    )
}

export default UserTable