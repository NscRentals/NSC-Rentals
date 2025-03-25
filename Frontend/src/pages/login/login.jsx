import "./login.css" 
import axios from "axios"
import { useState } from "react"
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function LoginPage(){

    const [email,setEmail]=useState("");
    const [password, setPassword]=useState("");
    const Navigate = useNavigate();

    function handleOnSubmit(e){

        console.log(email,password)

        e.preventDefault()//preventing refresh page on click
        axios.post("http://localhost:4000/api/users/login",{

            email : email,
            password : password
            
        }).then((res)=>{

            console.log(res)
            toast.success("Login Successfull");
            const user = res.data.user;

            const token = res.data.token; // Get JWT token from response

        if (token) {
            localStorage.setItem("authToken", token); // Store token
        }

            if(user.type=="Customer"){
                Navigate("/")
            }else{
                Navigate("/admin")
            }

        }).catch((err)=>{

            console.log(err)
            toast.error(err.response.data.error)
        })
        
    }



    return(

    
        <div className="bg-image w-full h-screen flex justify-center items-center">

            <form onSubmit={handleOnSubmit}>

            <div className="w-[500px] h-[600px] backdrop-blur-xl flex flex-col justify-center items-center">
                <h1 className="text-white mb-10 text-2xl">Login</h1>
                <input type= "email" placeholder="Email" className="w-[300px] h-[50px] bg-transparent border-b-2 border-white text-white text-2xl outline-none"
                value={email}
                onChange={(e)=>{

                    setEmail(e.target.value)
                }}
                />
                
                <input type= "password" placeholder="password" className="mt-6 w-[300px] h-[50px] bg-transparent border-b-2 border-white text-white text-2xl outline-none"
                value={password}
                onChange={(e)=>{

                    setPassword(e.target.value)
                }}
                />
                <button className="my-10 w-[200px] h-[50px] bg-black text-white backdrop-blur-xl rounded-lg">Login</button>
            </div>

            </form>

        </div>
    )
}