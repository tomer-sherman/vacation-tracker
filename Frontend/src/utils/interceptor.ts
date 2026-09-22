import axios, { InternalAxiosRequestConfig } from "axios";

class Interceptor {

    public create(): void {

        axios.interceptors.request.use((httpRequest: InternalAxiosRequestConfig) => {

            // Fetches token from local storage.
            const token = localStorage.getItem("auth-token");

            // Alocate the token in the header in each request.
            if (token) {
                httpRequest.headers.Authorization = "Bearer " + token;
            }
            
            // Return the request.
            return httpRequest
        })


    }

}

export const interceptor = new Interceptor();