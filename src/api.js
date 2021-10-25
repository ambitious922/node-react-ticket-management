import axios from 'axios';
//need to //out the OR statement below (or remove) when committing to Heroku. Just need the 3001 when using the app locally
const baseURL = process.env.REACT_APP_BASE_URL || "http://localhost:3001"

export default {
  noToken() {
    return axios.create({
      baseURL: baseURL
    });
  },
  
  withToken() {
    const tokenStr = window.sessionStorage.getItem("token")
    return axios.create({
      baseURL: baseURL,
      headers: {"Authorization" : `Bearer ${tokenStr}`}
    });
  } 
}