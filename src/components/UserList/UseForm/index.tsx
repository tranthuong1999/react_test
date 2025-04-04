import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Radio, RadioGroup, FormControl, FormControlLabel, FormLabel } from '@mui/material';
import { DatePicker } from 'rsuite';
import "./style.scss";
import 'rsuite/dist/rsuite.min.css';
import moment from 'moment';
import Select from 'react-select';
import { Gender, provinces } from '../types';
import BasicModal from '../../Modal';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import { createEmployeer, setCurrentUser, setIsCreateOrEditUser, updateEmployeer } from '../../../redux/slice/employeer.slice';

const schema_employeer = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    dateOfBirth: Yup.number().required('DateOfBirth is required'),
    gender: Yup.number().required('Gender is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    address: Yup.string().required('Adress is required'),
});

const UseFormPage = () => {
    const { register, reset, handleSubmit, formState: { errors }, setValue, control, clearErrors } = useForm({
        resolver: yupResolver(schema_employeer),
    });
    const dispatch = useAppDispatch();
    const { isCreateOrEditUser, currentUser } = useAppSelector(state => state.employeerReducer)

    useEffect(() => {
        if (!!currentUser) {
            const { name, dateOfBirth, gender, email, address } = currentUser;
            clearErrors();
            setValue("name", name);
            // @ts-ignore
            setValue("dateOfBirth", dateOfBirth ? moment(dateOfBirth).valueOf() : null);
            setValue("gender", Number(gender));
            setValue("email", email);
            const selectedProvince = provinces.find(province => province.value === address);
            setValue("address", selectedProvince?.value!)
            return;
        }
        if (currentUser === null) {
            reset();
        }
    }, [currentUser])

    const onSubmitForm = (data: any) => {
        if (!currentUser) {
            dispatch(createEmployeer(data))
            dispatch(setIsCreateOrEditUser(false))
            reset();
            return;
        }
        const updatedData = { ...currentUser, ...data };
        const { _id, ...dataUpdate } = updatedData;
        dispatch(updateEmployeer({ id: _id!, dataUpdate }))
        dispatch(setIsCreateOrEditUser(false))
        dispatch(setCurrentUser(null))
        reset();
    }

    const renderFormUser = () => {
        return (
            <div className='form_contact_container'>
                <h1>
                    {!currentUser ? 'Create User' : "Update User"}
                </h1>
                <form onSubmit={handleSubmit(onSubmitForm)} className='form-login'>
                    <div className='form-register'>
                        <div>
                            <input type="text" className='field' {...register('name')} placeholder='Name' />
                            {errors.name && <p className="error-message">{errors.name.message}</p>}
                        </div>
                        <div className='date_of_birth_container'>
                            <div> Date Of Birth :</div>
                            <Controller
                                name="dateOfBirth"
                                control={control}
                                render={({ field }) => (
                                    <DatePicker
                                        {...field}
                                        format="dd.MM.yyyy"
                                        value={field.value ? moment(field.value).toDate() : null}
                                        onChange={(value) => {
                                            field.onChange(moment(value).valueOf());
                                        }}
                                        cleanable={false}
                                    />
                                )}
                            />
                        </div>
                        {errors.dateOfBirth && <p className="error-message">{errors.dateOfBirth.message}</p>}
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
                                        row
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
                                        isSearchable
                                    />
                                )}
                            />
                            {errors.address && <p className="error-message">{errors.address.message}</p>}
                        </div>
                        <div className='btn_reg'>
                            <button type="submit" className={`btn-register`}>
                                {!currentUser ? 'Create User' : "Update User"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
    return (
        <BasicModal
            open={isCreateOrEditUser}
            onClose={() => {
                dispatch(setIsCreateOrEditUser(false));
                dispatch(setCurrentUser(null));
                reset();
            }}
            content={renderFormUser()}
        />
    );
}

export default UseFormPage