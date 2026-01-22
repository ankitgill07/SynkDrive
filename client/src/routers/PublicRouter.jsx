import Loader from '@/components/common/Loader'
import { userAuth } from '@/contextApi/AuthContext'
import React from 'react'
import { Navigate } from 'react-router-dom'


function PublicRoute({ children }) {
    const { isAuth, loading } = userAuth()

    if (loading) return <Loader />

    if (isAuth) {
        return <Navigate to="/drive/home" replace />
    }

    return children
}

export default PublicRoute