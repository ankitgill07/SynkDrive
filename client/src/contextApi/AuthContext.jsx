import { receiveUserData } from '@/api/AuthApi'
import React, { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [isAuth, setIsAuth] = useState(false)
    const [loading, setLoading] = useState(true)

    const checkAuthorization = async () => {
        try {
            const result = await receiveUserData()
        
            if (result.success) {
                setUser(result)
                setIsAuth(true)
            } else {
                setUser(null)
                setIsAuth(false)
            }
        } catch (error) {
            setUser(null)
            setIsAuth(false)
        } finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        checkAuthorization()
    }, [])

    return <AuthContext.Provider value={{ user, setUser, isAuth, setIsAuth, checkAuthorization, loading }}>
        {children}
    </AuthContext.Provider>
}

export const userAuth = () => useContext(AuthContext)

