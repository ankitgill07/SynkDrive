import Loader from '@/components/common/Loader'
import { userAuth } from '@/contextApi/AuthContext'
import React from 'react'
import { Navigate } from 'react-router-dom'


function ProtectedRoute({ children }) {
    const { isAuth, loading } = userAuth()


    if (loading) return <Loader />

    if (!isAuth) {
        return <Navigate to="/auth" replace />
    }


    return children
}

export default ProtectedRoute