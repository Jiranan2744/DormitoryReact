import { Link } from 'react-router-dom';
import { useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from 'react-router-dom';
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess, signoutUserStart } from "../redux/user/userSlice"
import { useDispatch } from "react-redux"
import Navbar from '../components/navbar/Navbar';

export default function Profile() {

    const { currentUser, loading, error } = useSelector((state) => state.user)
    const [formData, setFormData] = useState({});
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [showListingError, setShowListingError] = useState(false);
    const [userListings, setUserListings] = useState([]);


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch(updateUserStart());

            const res = await fetch(`/users/update/${currentUser._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.success === false) {
                dispatch(updateUserFailure(data.message));
                return;
            }

            dispatch(updateUserSuccess(data));
        } catch (error) {

            dispatch(updateUserFailure(error.message));

        }
    };

    const handleDeleteUser = async () => {

        try {
            dispatch(deleteUserStart());
            const res = await fetch(`/users/${currentUser._id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (data.success === false) {
                dispatch(deleteUserFailure(data.message));
                return;
            }
            dispatch(deleteUserSuccess(data));
            navigate('/login');
        } catch (error) {
            dispatch(deleteUserFailure(error.message));
        }
    };

    const handleSignOut = async () => {
        try {
            dispatch(signoutUserStart());
            const res = await fetch('/auth/signout');
            const data = await res.json();
            if (data.success === false) {
                dispatch(deleteUserFailure(data.message));
                return;
            }
            dispatch(deleteUserSuccess(data));
            navigate('/login');

        } catch (error) {
            dispatch(deleteUserFailure(error.message));
        }
    };




    return (
        <>
            <Navbar />
            {currentUser && (
                <div className='p-3 max-w-lg mx-auto'>
                    <h1 className='text-3xl font-semibold text-center my-4'>Profile</h1>
                    <form onSubmit={handleSubmit} className="mb-3" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <input
                            type='text'
                            placeholder='firstname'
                            defaultValue={currentUser.firstname}
                            id='firstname'
                            className='border p-3 rounded-lg'
                            style={{ width: '30%', borderRadius: '5px' }}
                            onChange={handleChange}
                        />

                        <input
                            type='text'
                            placeholder='lastname'
                            defaultValue={currentUser.lastname}
                            id='lastname'
                            className='border p-3 rounded-lg'
                            style={{ width: '30%', borderRadius: '5px', marginTop: '10px' }}
                            onChange={handleChange}
                        />
                        <input
                            type='email'
                            placeholder='email'
                            id='email'
                            defaultValue={currentUser.email}
                            className='border p-3 rounded-lg'
                            style={{ width: '30%', borderRadius: '5px', marginTop: '10px' }}
                            onChange={handleChange}
                        />
                        <input
                            type='phone'
                            placeholder='phone'
                            id='phone'
                            defaultValue={currentUser.phone}
                            className='border p-3 rounded-lg'
                            style={{ width: '30%', borderRadius: '5px', marginTop: '10px' }}
                            onChange={handleChange}
                        />
                        <input
                            type='password'
                            placeholder='password'
                            id='password'
                            className='border p-3 rounded-lg'
                            style={{ width: '30%', borderRadius: '5px', marginTop: '10px' }}
                        />
                        <br />
                        <button disabled={loading} className="rounded-lg uppercase hover:opacity-95 disabled:opacity-80" style={{ backgroundColor: 'rgb(51, 65, 85)', color: '#ffffff', borderRadius: '5px', width: '30%', padding: '5px', height: '10%' }} >
                            {loading ? 'Loading...' : 'Update'}
                        </button>
                        <br />

                    </form>

                    <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>

                        <span onClick={handleDeleteUser} style={{ cursor: 'pointer', color: 'red', marginRight: '35vh' }}>
                            Delete account
                        </span>

                        <span onClick={handleSignOut} style={{ cursor: 'pointer', color: 'red' }}>
                            Sign out
                        </span>
                    </div>

                    <p style={{ color: 'red' }}>{error ? error : ''}</p>
                    <p style={{ color: 'green' }}>
                        {updateSuccess ? 'Update successfully!' : ''}
                    </p>  
                </div>
            )}
        </>
    );
}

