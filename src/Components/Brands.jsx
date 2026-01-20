import React from 'react'
import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
export default function Brands({ brandsdata }) {

  useEffect(() => {
    AOS.init({
      duration: 1200,
    });
  }, []);
  return (
    <div className='container mx-auto px-6 sm:px-10 lg:px-20 flex flex-col justify-center items-center my-8'>
      <h1 className='text-3xl font-bold mb-6' data-aos="fade-up">Popular Brands</h1>
      <div className=' grid justify-center items-center grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8'>
        {
          brandsdata && brandsdata.map((items) => {
            return (
              <div key={items.id} className='p-4' data-aos="fade-up">
                <img src={items.image_url} alt="" />
              </div>
            )
          })
        }
      </div>
    </div>
  )
}
