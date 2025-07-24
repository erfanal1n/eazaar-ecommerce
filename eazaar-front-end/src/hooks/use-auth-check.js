'use client';
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { userLoggedIn } from "@/redux/features/auth/authSlice";

export default function useAuthCheck() {
    const dispatch = useDispatch();
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        const localAuth = Cookies.get('userInfo');

        if (localAuth) {
            try {
                const auth = JSON.parse(localAuth);
                if (auth?.accessToken && auth?.user) {
                    dispatch(
                        userLoggedIn({
                            accessToken: auth.accessToken,
                            user: auth.user,
                        })
                    );
                }
            } catch (error) {
                console.error('Error parsing auth data:', error);
                // Remove corrupted auth data
                Cookies.remove('userInfo');
            }
        }
        setAuthChecked(true);
    }, [dispatch, setAuthChecked]);

    return authChecked;
}
