import {useEffect, useState} from "react";
import axios from "../utils/axios";

export default function Home() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        axios
            .get('/')
            .then(response => {
                setMessage(response.data.message);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setMessage('Error fetching data');
            });

    }, [])
  return (
    <div>
      <h1 className="text-3xl font-bold underline">Welcome to Home Page</h1>
      <p>{message}</p>
    </div>
  )
} 
