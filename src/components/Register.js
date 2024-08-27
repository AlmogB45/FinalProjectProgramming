import React, { useState, useEffect, useRef} from 'react';
import { useForm } from 'react-hook-form';
import { NavLink, useNavigate } from 'react-router-dom';
import {  createUserWithEmailAndPassword  } from 'firebase/auth';
import { auth, db } from '../Firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import '../CSS/Register.css';
import logoImage from "../assets/LOGO1.png";
import fetchCities from '../utils/cityApi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Register() {
    const [citiesList, setCitiesList] = useState([]);
    const [selectedCity, setSelectedCity] = useState("");

    const { register, handleSubmit, formState: { errors } } = useForm();
    
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
          // Create user in Firebase Auth
          const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
          const user = userCredential.user;
      
          // Get form data
          const formData = {
            username: data.user,
            email: data.email,
            phone: data.phone,
            age: data.age,
            city: selectedCity
          };
      
          // Store additional user data in Firestore
          await setDoc(doc(db, 'Users', user.uid), formData);
      
          toast.success("User registered successfully");
          navigate("/");
        } catch (error) {
          toast.error("Error in registration:", error);
          // Handle error (e.g., show error message to user)
        }
      };

      const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        phone: '',
        age: '',
        city: ''
      });

      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
          ...prevState,
          [name]: value
        }));
      };

    useEffect(() => {
        (async function fetchCitiesFunc() {
            try {
                const cities = await fetchCities();
                setCitiesList(cities);
            } catch (error) {
                console.error('Error fetching cities:', error);
            }
        })();
    }, []);

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
                    <form className='col-md-6' onSubmit={handleSubmit(onSubmit)}>
                        <input {...register("user", { required: true, minLength: 2 })} type='reg-text' placeholder='Username'
                            className='form-control' onChange={(e) => {
                                handleInputChange(e);
                                register("user").onChange(e);
                              }} />
                        {errors.user && <div className='text-danger'>* Enter a valid username (min 2 characters)</div>}

                        <input {...register("email", { required: true, pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i })} type='reg-text' placeholder='Email'
                            className='form-control' onChange={(e) => {
                                handleInputChange(e);
                                register("email").onChange(e);
                              }}  />
                        {errors.email && <div className='text-danger'>* Enter a valid email address</div>}

                        <input {...register("password", { required: true, minLength: 9 })} type='password' placeholder='Password'
                            className='form-control' onChange={(e) => {
                                handleInputChange(e);
                                register("password").onChange(e);
                              }}  />
                        {errors.password && <div className='text-danger'>* Enter a valid password</div>}

                        <div className="InfoPromptReg">
                            <h3>Personal Information</h3>
                        </div>

                        <div className="separatorRegister"></div>

                        <input {...register("phone", { required: true, minLength: 9 })} type='reg-text' placeholder='Phone'
                            className='form-control'  onChange={(e) => {
                                handleInputChange(e);
                                register("phone").onChange(e);
                              }} />

                        {errors.phone && <div className='text-danger'>* Enter a valid number</div>}
                        <input {...register("age", { required: true })} type='reg-age' placeholder='Age'
                            className='form-control' onChange={(e) => {
                                handleInputChange(e);
                                register("age").onChange(e);
                              }} />
                        {errors.age && <div className='text-danger'>* Must be above 18!</div>}

                        <div className="CityReg">
                            <h3 id='CityTitle'>Select a City</h3>
                            <select id='CitySelect' value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
                                <option value="">Select a city</option>
                                {citiesList.map((city) => (
                                    <option className='city-option' key={city.id} value={city.englishName}>
                                        {city.englishName}
                                    </option>
                                ))}
                            </select>
                            {selectedCity && <p id="CityTitle">You selected: {selectedCity}</p>}
                        </div>

                        <button type= "submit" className='btn SignUp'>Sign Up</button>
                    </form>
                </div>

            </div>
        </div>
    );
}





