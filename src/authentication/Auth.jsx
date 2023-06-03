import React, { useEffect, useState } from 'react'
import "./Auth.css"
import { Link, Redirect, useHistory } from "react-router-dom";
import { BASEURL } from '../baseUrl';
import { Toaster, toast } from 'react-hot-toast';

const Auth = () => {
    const history = useHistory();
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        if (!storedToken) {
            history.push("/adminlogin")
        } else {
            if (isLoggedIn === false) {
                history.push("/adminlogin")
            } else {
                history.push("/")
            }
        }
    }, []);

    const [sunmit, setSubmit] = useState(false)

    let ResultError



    let hndlSubmit = async (e) => {
        try {
            if (sunmit) {
                return
            }
            setSubmit(true)

            e.preventDefault()
            let email = e.target.email.value
            let password = e.target.password.value

            const res = await fetch(`${BASEURL}/login`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email, password }) });
            const jsonData = await res.json();
            if (!res.ok) {
                setSubmit(false)
                throw new Error(jsonData.message);
            }
            window.localStorage.setItem('token', jsonData?.accessToken)
            window.localStorage.setItem('isLoggedIn', true)
            window.localStorage.setItem('userId', jsonData?.userId)
            window.localStorage.setItem('accessTokenExpiresIn', jsonData?.accessTokenExpiresIn)
            window.localStorage.setItem('refreshTokenExpiresIn', jsonData?.refreshTokenExpiresIn)




        } catch (error) {
            toast.error(error.message)
            setSubmit(false)
            console.log(error);
        } finally {
            history.push("/")
        }



    }

    return (
        <div className='Auth_body'>
            <div className="align">
                <div className="grid align__item">
                    <div className="register">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="site__logo"
                            width={56}
                            height={84}
                            viewBox="77.7 214.9 274.7 412"
                        >
                            <defs>
                                <linearGradient id="a" x1="0%" y1="0%" y2="0%">
                                    <stop offset="0%" stopColor="#8ceabb" />
                                    <stop offset="100%" stopColor="#378f7b" />
                                </linearGradient>
                            </defs>
                            <path
                                fill="url(#a)"
                                d="M215 214.9c-83.6 123.5-137.3 200.8-137.3 275.9 0 75.2 61.4 136.1 137.3 136.1s137.3-60.9 137.3-136.1c0-75.1-53.7-152.4-137.3-275.9z"
                            />
                        </svg>


                        <h2>Admin Login</h2>
                        <form action="" method="post" className="form" onSubmit={(e) => hndlSubmit(e)}>
                            <div className="form__field">
                                <input type="email" placeholder="info@mailaddress.com" name='email' required id='email' />
                            </div>
                            <div className="form__field">
                                <input type="password" placeholder="••••••••••••" name='password' required id='password' />
                            </div>
                            <div className="form__field">
                                <input type="submit" defaultValue="Sign Up" />
                            </div>
                        </form>
                        <Toaster />

                    </div>
                </div>
            </div>

        </div>
    )
}

export default Auth