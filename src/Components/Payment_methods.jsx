import React, { useEffect, useState } from 'react'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export default function Payment_methods() {
  const [payment, setPayment] = useState()
  useEffect(() => {
    fetch(`${API_BASE_URL}/payment_methods`)
      .then(response => response.json())
      .then(data => setPayment(data))
      .catch(error => console.error("the error is", error))
  })


  return (
    <div className='mx-4 sm:mx-4 md:mx-6 lg:mx-20 my-16'>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4" data-aos="fade-up">
        <h2 className="text-3xl font-extrabold text-text tracking-tight">Payment Methods</h2>
        <div className="h-1.5 w-20 bg-primary rounded-full"></div>
      </div>

      <div className="bg-primary/5 border border-primary/10 p-6 rounded-2xl mb-12" data-aos="fade-up">
        <p className="text-lg text-text font-medium leading-relaxed">
          <i className="fas fa-info-circle text-primary mr-2"></i>
          After filling the Delivery Form, please pay <span className="text-primary font-bold">25% in advance</span> using the following methods.
          The remaining balance will be collected on delivery. <b>Keep in contact for confirmation.</b>
        </p>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
        {payment && payment.map((items) => (
          <div key={items.id} className='group bg-white border border-border rounded-3xl p-8 flex flex-col gap-6 items-center shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2' data-aos="zoom-in">
            <div className='w-full aspect-video bg-background rounded-2xl p-4 flex items-center justify-center border border-border/40 group-hover:border-primary/20 transition-colors'>
              <img src={items.image_url} alt="" className='max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500' />
            </div>
            <div className="text-center">
              <span className='text-xl font-black text-text group-hover:text-primary transition-colors block mb-1'>{items.number}</span>
              <span className="text-[10px] font-bold text-mutedText uppercase tracking-widest bg-background px-3 py-1 rounded-full border border-border">Account Number</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
