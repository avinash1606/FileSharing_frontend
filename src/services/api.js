import axios from 'axios';

const API_URL=`https://filesharing-backend-mbmo.onrender.com`;

export const upLoadFile= async(data)=>{
    try{
        let response= await axios.post(`${API_URL}/upload`,data);
        return response.data;

    }
    catch(err){
        console.error("Error while calling the api ",err.message)
    }


}