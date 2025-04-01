import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import BasicModal from '../Modal';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Radio, RadioGroup, FormControl, FormControlLabel, FormLabel, MenuItem } from '@mui/material';
import { DatePicker } from 'rsuite'; // Import DatePicker from rsuite
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { fetchListEmployeer, createEmployeer, updateEmployeer, deleteEmployeer, setCurrentUser, Employee } from '../../redux/slice/employeer.slice';
import CustomAlert from '../Alert';
import "./styles.scss";
import 'rsuite/dist/rsuite.min.css';
import moment from 'moment';
import Select from 'react-select';
import { provinces } from './data_province';
import Pagination from '@mui/material/Pagination';

const schema_employeer = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    dateOfBirth: Yup.number().required('DateOfBirth is required'),
    gender: Yup.number().required('Gender is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    address: Yup.string().required('Adress is required'),
});

enum Gender {
    Male = 0,
    Female = 1
}

const EmployeeListPage = () => {
    const [openContact, setOpenContact] = useState(false);
    const [editItem, setEditItem] = useState<Employee | null>(null);
    const { register, reset, handleSubmit, formState: { errors }, setValue, control, clearErrors } = useForm({
        resolver: yupResolver(schema_employeer),
    });
    const dispatch = useAppDispatch();
    const { listEmployeer, currentUser, totalPages } = useAppSelector(state => state.employeerReducer)
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [isDelete, setIsDelete] = useState(false);
    const [sortColumn, setSortColumn] = useState<keyof Employee>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_LIMIT = 15;
    const [isRed, setIsRed] = useState(false);

    useEffect(() => {
        dispatch(fetchListEmployeer({ page: currentPage, limit: PAGE_LIMIT }));
    }, []);

    useEffect(() => {
        setSortColumn("name");
        setSortOrder("asc");
    }, []);

    const handleSort = (column: keyof Employee) => {
        if (sortColumn === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortOrder('asc');
        }
    };

    const sortedEmployees = [...(listEmployeer || [])].sort((a, b) => {
        if (!sortColumn) return 0;
        const valueA = a[sortColumn] ? a[sortColumn].toString().toLowerCase() : '';
        const valueB = b[sortColumn] ? b[sortColumn].toString().toLowerCase() : '';

        return sortOrder === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    });

    const showAlert = (message: string) => {
        setAlertMessage(message);
    };

    const handleEdit = (item: Employee) => {
        clearErrors();
        setEditItem(item);
        setOpenContact(true);
        setValue("name", item.name);
        // @ts-ignore
        setValue("dateOfBirth", item.dateOfBirth ? moment(item.dateOfBirth).valueOf() : null);
        setValue("gender", Number(item.gender));
        setValue("email", item.email);
        const selectedProvince = provinces.find(province => province.value === item.address);
        setValue("address", selectedProvince?.value!)
    };

    const onSubmitForm = (data: any) => {
        if (!editItem) {
            dispatch(createEmployeer(data))
                .then((result: any) => {
                    if (result.error) {
                        showAlert("Create user failed . Email is exited");
                        setIsRed(true)
                    }
                    else {
                        showAlert("Create user successful!");
                    }
                })
            // .then(() => {
            //     dispatch(fetchListEmployeer({ page: currentPage, limit: PAGE_LIMIT }));
            // });
            setOpenContact(false);
            reset();
            return;
        }
        const updatedData = { ...editItem, ...data };
        const { _id, ...dataUpdate } = updatedData;
        dispatch(updateEmployeer({ id: _id!, dataUpdate })).then(() => {
            dispatch(fetchListEmployeer({ page: currentPage, limit: PAGE_LIMIT }));
        });
        setOpenContact(false);
        setEditItem(null);
        showAlert("Update user successful!");
        reset();
    };

    const renderFormContact = () => {
        return (
            <div className='form_contact_container'>
                <h1 className={`title ${editItem ? "update" : "create"}`}>
                    {!editItem ? "Create User" : "Update User"}
                </h1>
                <form onSubmit={handleSubmit(onSubmitForm)} className='form-login'>
                    <div className='form-register'>
                        <div>
                            <input type="text" className='field' {...register('name')} placeholder='Name' />
                            {errors.name && <p className="error-message">{errors.name.message}</p>}
                        </div>
                        <div>
                            <Controller
                                name="dateOfBirth"
                                control={control}
                                render={({ field }) => (
                                    <DatePicker
                                        {...field}
                                        format="dd.MM.yyyy"
                                        value={field.value ? moment(field.value).toDate() : null}
                                        onChange={(value) => {
                                            field.onChange(moment(value).valueOf()); // Chuyển đổi thành timestamp
                                        }}
                                        cleanable={false}  // Makes the input field non-clearable
                                    />
                                )}
                            />
                            {errors.dateOfBirth && <p className="error-message">{errors.dateOfBirth.message}</p>}
                        </div>
                        <div className="gender-container">
                            <FormControl>
                                <FormLabel>Gender:</FormLabel>
                            </FormControl>
                            <Controller
                                name="gender"
                                control={control}
                                render={({ field }) => (
                                    <RadioGroup
                                        {...field}
                                        value={Number(field.value)}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                        row // Thêm thuộc tính này để hiển thị radio theo hàng ngang
                                        sx={{ gap: 8 }}
                                    >
                                        <FormControlLabel value={Gender.Male} control={<Radio />} label="Male" />
                                        <FormControlLabel value={Gender.Female} control={<Radio />} label="Female" />
                                    </RadioGroup>
                                )}
                            />
                        </div>
                        {errors.gender && <p className="error-message">{errors.gender.message}</p>}
                        <div>
                            <input type="text" className='field' {...register('email')} placeholder='Email' />
                            {errors.email && <p className="error-message">{errors.email.message}</p>}
                        </div>
                        <div>
                            <Controller
                                name="address"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        // @ts-ignore
                                        options={provinces}
                                        placeholder="Select a province"
                                        // @ts-ignore
                                        value={provinces.find(option => option.value === field.value)} // Sửa cách tìm giá trị đã chọn
                                        // @ts-ignore
                                        onChange={(selectedOption) => field.onChange(selectedOption?.value)}  // Chọn tỉnh và lấy giá trị
                                        isSearchable  // Cho phép tìm kiếm trong dropdown
                                    />
                                )}
                            />
                            {errors.address && <p className="error-message">{errors.address.message}</p>}
                        </div>
                        <div className='btn_reg'>
                            <button type="submit" className={`btn-register ${editItem ? "update" : "create"}`}>
                                {!editItem ? <div> Create user</div> : <div> Update User</div>}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        );
    };

    const handleDeleteUser = () => {
        if (!!currentUser && !!currentUser._id) {
            dispatch(deleteEmployeer(currentUser._id))
                .then(() => {
                    const newTotalPages = Math.ceil((listEmployeer.length - 1) / PAGE_LIMIT);
                    setCurrentPage((prevPage) => (prevPage > newTotalPages ? newTotalPages : prevPage));
                    dispatch(fetchListEmployeer({ page: currentPage, limit: PAGE_LIMIT }));
                });
            setIsDelete(false);
        }
    };

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
        <div className='list_app'>
            {alertMessage && <CustomAlert text={alertMessage} severity={isRed ? "error" : 'success'}
                onClose={() => {
                    setAlertMessage(null)
                    setIsRed(false)
                }}
            />}
            <div className='btn_create_list_title'>
                <button
                    className='btn_create_list'
                    onClick={() => {
                        setEditItem(null);
                        reset();
                        setOpenContact(true);
                    }}
                >
                    + Create user
                </button>
            </div>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                                Name {sortColumn === 'name' ? (sortOrder === 'asc' ? '⬆' : '⬇') : '⬆'}
                            </TableCell>
                            <TableCell>DateOfBirth</TableCell>
                            <TableCell>Gender</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell onClick={() => handleSort('address')} style={{ cursor: 'pointer' }}>
                                Address {sortColumn === 'address' ? (sortOrder === 'asc' ? '⬆' : '⬇') : '⬆'}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedEmployees?.length > 0 && sortedEmployees?.map((item: any) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{moment(item.dateOfBirth).format("DD/MM/YYYY")}</TableCell>
                                <TableCell>{item.gender === Gender.Male ? "Nam" : "Nữ"}</TableCell>
                                <TableCell>{item.email}</TableCell>
                                <TableCell>{item.address}</TableCell>
                                <TableCell>
                                    <div className="table-buttons">
                                        <button className="edit-btn" onClick={() => handleEdit(item)}>
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsDelete(true);
                                                dispatch(setCurrentUser(item));
                                            }}
                                            className="delete-btn"
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
            <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(event, page) => {
                    setCurrentPage(page);
                    dispatch(fetchListEmployeer({ page: page, limit: PAGE_LIMIT }));
                    setSortColumn("name");
                    setSortOrder("asc");
                }}
                color="primary"
                sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
            />
            <BasicModal
                open={openContact}
                onClose={() => setOpenContact(false)}
                content={renderFormContact()}
            />
            <BasicModal
                open={isDelete}
                onClose={() => setIsDelete(false)}
                content={renderFormDelete()}
            />
        </div>
    );
};

export default EmployeeListPage;
