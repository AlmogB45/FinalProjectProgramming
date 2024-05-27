import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Use this for now, change to Axios later!! 

export default async function CityAPI() {
    const [imagePreview, setImagePreview] = useState(null);
    const [cities, setCities] = useState ([]);

    const apiUrl = 'https://data.gov.il/api/3/action/datastore_search?resource_id=d4901968-dad3-4845-a9b0-a57d027f11ab';

    useEffect (() => {
      async function fetchCities() {
        try {
          const resp = await fetch(apiUrl);
          const data = await resp.json();
          const cityRecords = data.result.records.map(record => ({ id: record.id, name: record[`שם_ישוב`]}));
          setCities(cityRecords);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
      
      fetchCities();
    }, [])

    const handleFileChange = (event) => {
      const file = event.target.files[0];
      const reader = new FileReader;
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      if (file) {
        reader.readAsDataURL(file);
      }
    };
  }