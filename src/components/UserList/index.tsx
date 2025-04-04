import React, { useState } from 'react';
import UserTable from './UserTable';
import "./style.scss";
import UseFormPage from './UseForm';
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { fetchListEmployeer, setIsCreateOrEditUser } from '../../redux/slice/employeer.slice';
import { Pagination } from '@mui/material';
import { LIMIT_PAGE } from './types';

const ListUser = () => {
    const dispatch = useAppDispatch()
    const { totalPages } = useAppSelector(state => state.employeerReducer)
    const [currentPage, setCurrentPage] = useState(1);

    return (
        <div className='user_list_page'>
            <div className='btn_create'>
                <button className='btn_create_user' onClick={() => dispatch(setIsCreateOrEditUser(true))}> +Create User</button>
            </div>
            < UseFormPage />
            <UserTable currentPage={currentPage} />
            <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(event, page) => {
                    setCurrentPage(page);
                    dispatch(fetchListEmployeer({ page: page, limit: LIMIT_PAGE }));
                }}
                color="primary"
                sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
            />
        </div>
    )
}

export default ListUser