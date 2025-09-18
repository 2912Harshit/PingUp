
import React from "react";
import { assets } from "../assets/assets";
import { Star } from "lucide-react";

import {SignIn} from "@clerk/clerk-react";


const Login = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <img
        src={assets.bgImage}
        alt="Login Background"
        className="w-full h-full object-cover absolute top-0 left-0 z-[-1]"
      />

      {/* left side */}
      <div className="flex-1 flex flex-col items-start justify-between p-6 md:p-10 lg:pl-40">
        <img src={assets.logo} alt="Logo" className="h-12 object-contain" />

        <div>
          <div>
            <img src={assets.group_users} alt="" className="h-8 md:h-10 " />
            <div>
              <div className="flex">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star
                      key={i}
                      className="size-4 md:size-4.5 text-transparent fill-amber-500"
                    />
                  ))}
              </div>
              <p className="text-xs md:text-sm text-gray-500">
                Join the community of 1000+ users
              </p>
            </div>
          </div>

          <h1 className="text-3xl md:text-6xl md:pb-2 font-bold bg-gradient-to-r from-indigo-950 to-indigo-800 bg-clip-text text-transparent">
            Connect with friends and the world around you 
            on Pingup.
          </h1>
          <p className="text-xl md:text-3xl text-indigo-900 max-w-72 md:max-w-md">
            Share your thoughts, photos, and videos with friends and family.
          </p>
        </div>


        <span className="md:h-10">

        </span>


      </div>


      {/* right side login form */}
      <div className="flex-1 flex items-center justify-center  p-6 sm:p-10">
        <SignIn/>

      </div>
    </div>
  );
};

export default Login;
