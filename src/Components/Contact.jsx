import React from 'react'
import { useEffect, useState } from 'react';
import Loader from './Loader';
import FormComponent from './Login/conatctForm'
import AOS from 'aos';
import 'aos/dist/aos.css';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Contact() {
  useEffect(() => {
    AOS.init({
      duration: 1200,
    });
  }, []);

  const [contactdata, setContactData] = useState({
    contactListData: [],
    mapImageData: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const apiEndpoints = [
      { key: 'mapImageData', url: `${API_BASE_URL}/map_image` },
      { key: 'contactListData', url: `${API_BASE_URL}/contact_list` },
    ];
    Promise.all(
      apiEndpoints.map((endpoint) =>
        fetch(endpoint.url)
          .then((response) => response.json())
          .then((data) => {
            return { key: endpoint.key, data };
          })
          .catch((error) => ({ key: endpoint.key, data: [], error }))
      )
    )
      .then((results) => {
        const updatedData = results.reduce((acc, result) => {
          acc[result.key] = result.data;
          return acc;
        }, {});
        setContactData((prevData) => ({
          ...prevData,
          ...updatedData,
        }));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><Loader /></div>
  }

  return (
    <div className='relative overflow-hidden bg-background'>
      {/* Decorative Background Elements */}
      <div className="absolute top-20 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-40 -right-20 w-96 h-96 bg-accent/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className='max-w-[1400px] mx-auto px-6 lg:px-14 py-32 relative'>
        {/* Header Section */}
        <div className="mb-16" data-aos="fade-right">
          <span className="text-primary font-bold tracking-widest text-sm uppercase mb-3 block">Connect With Us</span>
          <h1 className='text-5xl font-extrabold text-text tracking-tight'>Get In Touch</h1>
          <div className='h-2 w-24 bg-primary mt-6 rounded-full'></div>
          <p className="text-mutedText mt-6 max-w-2xl text-lg leading-relaxed">
            Have questions about our products or services? Our team is here to help you. reach out to us through any of the channels below.
          </p>
        </div>

        {/* Contact info grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20'>
          {contactdata.contactListData && contactdata.contactListData.map((items, index) => (
            <div
              key={index}
              className='group flex items-start gap-6 p-8 bg-cardsBackground rounded-[2rem] border border-border/50 shadow-sm hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2 transition-all duration-500'
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className='flex-shrink-0 w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-500'>
                <i className={items.icons}></i>
              </div>
              <div className='flex flex-col text-left'>
                <span className='text-sm font-bold text-primary/80 uppercase tracking-widest mb-1'>{items.description}</span>
                <span className='text-lg font-bold text-text mb-2'>{items.contact_list_items}</span>
                <span className='text-mutedText text-sm leading-relaxed'>Available for your support 24/7.</span>
              </div>
            </div>
          ))}
        </div>

        {/* Map and Form Section */}
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-10 items-start' data-aos="fade-up">
          {/* Map Section */}
          <div className='lg:col-span-12 xl:col-span-5 h-[500px] lg:h-full min-h-[500px] group'>
            {contactdata.mapImageData && contactdata.mapImageData.map((item, index) => (
              <div key={index} className='h-full relative rounded-[2.5rem] overflow-hidden border border-border shadow-2xl transition-all duration-500 group-hover:shadow-primary/10'>
                <div className="absolute inset-0 bg-primary/5 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                <img
                  src={item.image_url}
                  alt="Location Map"
                  className='w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700'
                />
                <div className="absolute bottom-6 left-6 right-6 p-6 bg-cardsBackground/90 backdrop-blur-md rounded-2xl border border-white/20 z-20 shadow-xl">
                  <h4 className="font-bold text-text">Visit Our Office</h4>
                  <p className="text-mutedText text-sm mt-1">Our physical location for face-to-face assistance.</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form Section */}
          <div className='lg:col-span-12 xl:col-span-7'>
            <FormComponent />
          </div>
        </div>
      </div>
    </div>
  )
}
