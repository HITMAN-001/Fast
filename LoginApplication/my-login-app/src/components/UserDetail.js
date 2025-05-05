import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const UserDetail = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`http://localhost:8000/users/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setUser(response.data);
      } catch (error) {
        setError('Failed to fetch user details');
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, [id]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/', { replace: true });
  };

  const handleDelete = async () => {
    // Implement delete functionality if needed
  };

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  if (!user) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div>
      <Navbar onLogout={handleLogout} onDelete={handleDelete} />
      <div className="p-6">
        <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">User Details</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-lg text-gray-900">{user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Birth Date</label>
                <p className="text-lg text-gray-900">
                  {user.birthdate ? new Date(user.birthdate).toLocaleDateString() : 'Not specified'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Employment Status</label>
                <p className="text-lg text-gray-900">{user.is_salaried ? 'Salaried' : 'Non-salaried'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Address</label>
                <p className="text-lg text-gray-900 whitespace-pre-line">{user.address || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Account Status</label>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {user.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
          <div className="px-6 py-4 bg-gray-50">
            <button
              onClick={() => navigate('/users')}
              className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-100"
            >
              Back to Users List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
