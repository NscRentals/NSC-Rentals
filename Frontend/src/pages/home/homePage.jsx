import React from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <div className="relative w-[90vw] max-w-[1700px] h-[600px] rounded-3xl overflow-hidden shadow-lg bg-white mt-12">
        <img
          src="/images/rent_car.jpg"
          alt="Rent a car"
          className="absolute inset-0 w-full h-full object-cover object-center rounded-3xl"
        />
        <div className="absolute inset-0 bg-black/10 rounded-3xl" />
        <div className="relative z-10 flex flex-col h-full justify-start p-20">
          <h1
            className="text-7xl font-bold mb-10 text-gray-900"
            style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}
          >
            Hit the Road with Style and Comfort!
          </h1>
          <p
            className="text-3xl mb-16 text-gray-800"
            style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 300 }}
          >
            Rent a Car, Start Your Journey Now!
          </p>
          <button
            className="mt-auto w-fit px-14 py-6 bg-black text-white text-3xl rounded-full font-light shadow hover:bg-gray-900 transition-all"
            style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 300 }}
            onClick={() => navigate('/vehicles')}
          >
            Rent a car
          </button>
        </div>
      </div>

      {/* Full-width black section with centered card */}
      <div className="w-full bg-black py-24 mt-[200px] flex justify-center">
        <div className="w-[90vw] max-w-[1700px] flex flex-col md:flex-row items-stretch gap-0 min-h-[520px] bg-black rounded-3xl">
          {/* Left: Text */}
          <div className="flex-1 flex flex-col justify-center px-16 py-12 rounded-l-3xl bg-black">
            <h2
              className="text-6xl font-bold text-white mb-10 text-left leading-tight"
              style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}
            >
              Rent Your Ride,<br />Reap the Rewards
            </h2>
            <p
              className="text-2xl text-white mb-12 max-w-[520px] text-left leading-relaxed"
              style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 300 }}
            >
              Have a car, truck, or van you're not using? List it with us and start earning! Our peer-to-peer rental platform allows you to rent out your vehicle to trusted individuals in your community. It's easy, secure, and a great way to make money while helping others get access to reliable transportation. Join today and turn your idle vehicle into a source of income!
            </p>
            <button
              className="w-fit px-10 py-4 bg-white text-black text-xl rounded-full font-medium shadow hover:bg-gray-200 transition-all text-left"
              style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400 }}
              onClick={() => navigate('/vehicles/add')}
            >
              List your vehicle
            </button>
          </div>
          {/* Right: Image */}
          <div className="flex-1 flex items-center justify-center min-h-[400px]">
            <img
              src="/images/peer2peer.JPG"
              alt="Peer to peer rental"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
      </div>
    </div>
  );
}