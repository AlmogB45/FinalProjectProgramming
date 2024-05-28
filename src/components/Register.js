import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import '../CSS/Register.css';
import CityAPI from './CityAPI';
import logoImage from "../assets/LOGO1.png";

export default function Register() {
    const {register, handleSubmit, formState: {errors} } = useForm();

    const onSub = (data) => {
        console.log(data);
    }
    // Add function to fetchCityAPI 
    //TODO: Check CityAPI

    
    return (
        <div className="register-container">
            <div className="panel">
                <div className="logoReg">
                    <img src={logoImage} alt="logoReg" />
                    <h1 id='RegTitle'>LENDLOOP</h1>
                    <div className="separator1"></div>
                </div>
                <div className="register-panel">
                    <h2>New user? Sign-up below!</h2>
                    <form onSubmit={handleSubmit(onSub)} className='col-md-6'>
                        <input {...register("user",{required:true, minLength:2})} type='text' placeholder='Username'
                        className='form-control' />
                        {errors.user && <div className='text-danger'>* Enter a valid username (min 2 characters)</div>}

                        <input {...register("email",{required:true, pattern:/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i})} type='text' placeholder='Email'
                        className='form-control' />
                        {errors.email && <div className='text-danger'>* Enter a valid email address</div>}

                        <input {...register("password",{required:true, minLength:9})} type='password' placeholder='Password'
                        className='form-control' />
                        {errors.password && <div className='text-danger'>* Enter a valid password</div>}

                        <div className="InfoPromptReg">
                            <h3>Personal Information</h3>                          
                        </div>

                        <div className="separatorRegister"></div>

                        <input {...register("phone",{required:true, minLength:9})} type='text' placeholder='Phone'
                        className='form-control' />
                        {errors.phone && <div className='text-danger'>* Enter a valid number</div>}
                        <input {...register("age", {required:true})} type='age' placeholder='Age'
                        className='form-control' />
                        {errors.age && <div className='text-danger'>* Must be above 18!</div>}
                        <button className='btn SignUp'>Sign Up</button>
                        </form>
                </div>

            </div>
        </div>
    );
}






                        