import React from 'react'
import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
export default function Customer_Support({ customerSupportdata }) {
  useEffect(() => {
    AOS.init({
      duration: 1200,
    });
  }, []);
  return (
    <div className='bg-background text-text px-4 sm:px-4 md:px-6 lg:px-10 py-12 my-8'>
      <div className='container mx-auto grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4'>
        {
          customerSupportdata && customerSupportdata.map((items) => {
            return (
              <div
                key={items.id}
                className='group flex flex-col items-center text-center p-8 rounded-2xl bg-white border border-border hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300'
                data-aos="fade-up"
              >
                <div className='relative mb-6'>
                  {/* Subtle decorative glow */}
                  <div className="absolute -inset-4 bg-primary/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                  {/* Icon Container */}
                  <div className='relative w-16 h-16 flex justify-center items-center bg-primary/10 text-primary rounded-2xl group-hover:bg-primary group-hover:text-white transition-all duration-300'>
                    <i className={`${items.icons} text-2xl animate-pulse group-hover:animate-none`}></i>
                  </div>
                </div>

                <div className='flex flex-col gap-2'>
                  <h3 className='text-lg font-bold text-text group-hover:text-primary transition-colors'>
                    {items.headings}
                  </h3>
                  <p className='text-mutedText text-sm leading-relaxed max-w-[200px]'>
                    {items.description}
                  </p>
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}
