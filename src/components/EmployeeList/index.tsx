import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { FormControl } from '@mui/material';
import BasicModal from '../Modal';
import "./styles.scss";
import { v4 as uuidv4 } from 'uuid';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { fetchListEmployeer, createEmployeer, updateEmployeer, deleteEmployeer } from '../../redux/slice/employeer.slice';

const schema_employeer = Yup.object().shape({
    name: Yup.string()
        .required('Name is required'),
    dateOfBirth: Yup.string()
        .required('Name is required'),
    gender: Yup.string()
        .required('Name is required'),
    email: Yup.string()
        .required('Name is required'),
    address: Yup.string()
        .required('Name is required'),
});

const Appbar = () => {
    const [openContact, setOpenContact] = useState(false);
    const [editItem, setEditItem] = useState<any>(null);
    const { register, reset, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(schema_employeer),
    });
    const dispatch = useAppDispatch();
    const { listEmployeer } = useAppSelector(state => state.employeerReducer)


    const handleEdit = (item: any) => {
        setEditItem(item);
        setOpenContact(true);
        setValue("name", item.name);
        setValue("dateOfBirth", item.dateOfBirth);
        setValue("gender", item.gender);
        setValue("email", item.email);
        setValue("address", item.address);
    };

    const onSubmitForm = (data: any) => {
        if (!editItem) {
            dispatch(createEmployeer(data))
            setOpenContact(false);
            reset();
            return;
        }
        const updatedData = { ...editItem, ...data };
        const { _id, ...dataUpdate } = updatedData;
        dispatch(updateEmployeer({ id: _id, dataUpdate }));
        setOpenContact(false);
        setEditItem(null);
        reset();
    };

    useEffect(() => {
        dispatch(fetchListEmployeer({ page: 1, limit: 15 }));
    }, [])



    const renderFormContact = () => {
        return (
            <div className='form_contact_container'>
                {!editItem ? <h1 className='title'> Create contact</h1> : <h1 className='title'> Update contact</h1>}
                <form onSubmit={handleSubmit(onSubmitForm)} className='form-login'>

                    <div className='form-register'>
                        <div>
                            <input type="text" className='field' {...register('name')} placeholder='Name' />
                            {errors.name && <p className="error-message">{errors.name.message}</p>}
                        </div>
                        <div>
                            <input type="text" className='field' {...register('dateOfBirth')} placeholder='Date Of Birth' />
                            {errors.dateOfBirth && <p className="error-message">{errors.dateOfBirth.message}</p>}
                        </div>
                        <div>
                            <input type="text" className='field' {...register('gender')} placeholder='Gender' />
                            {errors.gender && <p className="error-message">{errors.gender.message}</p>}
                        </div>
                        <div>
                            <input type="text" className='field' {...register('email')} placeholder='Email' />
                            {errors.email && <p className="error-message">{errors.email.message}</p>}
                        </div>
                        <div>
                            <input type="text" className='field' {...register('address')} placeholder='address' />
                            {errors.address && <p className="error-message">{errors.address.message}</p>}
                        </div>
                        <div className='btn_reg'>
                            <button type="submit" className='btn-register'>
                                {!editItem ? <div> Create contact</div> : <div> Update Contact</div>}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        );
    };

    return (
        <div className='list_app'>
            <div className='btn_create_list'>
                <button className='btn_create_list' onClick={() => setOpenContact(true)}>+ Create list</button>
            </div>
            <TableContainer component={Paper} style={{ marginTop: 20 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>DateOfBirth</TableCell>
                            <TableCell>Gender</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Address</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {listEmployeer?.length > 0 && listEmployeer?.map((item: any) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.dateOfBirth}</TableCell>
                                <TableCell>{item.gender}</TableCell>
                                <TableCell>{item.email}</TableCell>
                                <TableCell>{item.address}</TableCell>
                                <TableCell>
                                    {item.sub_field !== "#" && (
                                        <>
                                            <Button variant="contained" color="primary" size="small" onClick={() => handleEdit(item)}>
                                                Edit
                                            </Button>

                                            <Button variant="contained" color="secondary" size="small" onClick={() => dispatch(deleteEmployeer(item._id))} style={{ marginLeft: 10 }}>
                                                Delete
                                            </Button>
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <BasicModal
                open={openContact}
                onClose={() => setOpenContact(false)}
                content={renderFormContact()}
            />
        </div>
    );
};

export default Appbar;
