import React from 'react'
import { useEffect, useState } from 'react';
import Loader from './Loader';
import AOS from 'aos';
import 'aos/dist/aos.css';
import aboutimage from '../assets/electropakwebaboutimage.jpg'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function About() {
  useEffect(() => {
    AOS.init({
      duration: 1200,
    });
  }, []);

  const [aboutdata, setAboutData] = useState({
    aboutMsgsData: [],
    aboutimageData: [],
    aboutusData: [],
    aboutmissionData: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const apiEndpoints = [
      { key: 'aboutMsgsData', url: `${API_BASE_URL}/about` },
      { key: 'aboutimageData', url: `${API_BASE_URL}/about_image` },
      { key: 'aboutusData', url: `${API_BASE_URL}/aboutus` },
      { key: 'aboutmissionData', url: `${API_BASE_URL}/about_mission` }
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
        setAboutData((prevData) => ({
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

      <div className='max-w-[1400px] mx-auto px-6 lg:px-14 py-32 relative z-10'>
        {/* Header Section */}
        <div className="mb-16" data-aos="fade-right">
          <span className="text-primary font-bold tracking-widest text-sm uppercase mb-3 block">Our Story</span>
          <h1 className='text-5xl font-extrabold text-text tracking-tight'>About Us</h1>
          <div className='h-2 w-24 bg-primary mt-6 rounded-full'></div>
        </div>

        {/* Introduction Section */}
        <div className='flex flex-col lg:flex-row gap-12 items-center mb-24'>
          <div className='w-full lg:w-1/2'>
            {aboutdata.aboutimageData && aboutdata.aboutimageData.map((item) => (
              <div key={item.id} className='relative group' data-aos="zoom-in">
                <div className="absolute -inset-4 bg-primary/10 rounded-[3rem] blur-2xl group-hover:bg-primary/20 transition-all duration-500"></div>
                <div className="relative h-[400px] lg:h-[600px] rounded-[2.5rem] overflow-hidden border border-border shadow-2xl">
                  <img
                    src={aboutimage}
                    alt="About ElectroPak"
                    className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
                  />
                </div>
              </div>
            ))}
          </div>

          <div className='w-full lg:w-1/2 flex flex-col gap-6 text-left' data-aos="fade-left">
            <h2 className="text-3xl font-bold text-text">Driving Innovation in Engineering</h2>
            <div className="space-y-4">
              {aboutdata.aboutusData && aboutdata.aboutusData.map((items) => (
                <div key={items.id} className='text-lg text-mutedText leading-relaxed'>
                  {items.about_us}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-6 mt-8">
              <div className="p-6 bg-cardsBackground rounded-3xl border border-border shadow-sm">
                <span className="text-3xl font-black text-primary block mb-2">15+</span>
                <span className="text-sm font-bold text-mutedText uppercase tracking-wider">Years Experience</span>
              </div>
              <div className="p-6 bg-cardsBackground rounded-3xl border border-border shadow-sm">
                <span className="text-3xl font-black text-primary block mb-2">500+</span>
                <span className="text-sm font-bold text-mutedText uppercase tracking-wider">Happy Clients</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Vision Section */}
        <div className="relative">
          <div className="mb-12" data-aos="fade-up">
            <h2 className='text-4xl font-extrabold text-text tracking-tight'>Mission & Vision</h2>
            <div className='h-1.5 w-16 bg-primary mt-4 rounded-full'></div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            {aboutdata.aboutmissionData && aboutdata.aboutmissionData.map((items, index) => (
              <div
                key={items.id}
                className={`relative p-10 rounded-[2.5rem] overflow-hidden group shadow-xl transition-all duration-500 hover:-translate-y-2 ${index % 2 === 0 ? 'bg-gradient-blue-sky' : 'bg-gradient-blue-pulse'}`}
                data-aos="zoom-in"
                data-aos-delay={index * 100}
              >
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-white/20 transition-colors"></div>

                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-6 border border-white/30 text-white">
                    {index % 2 === 0 ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    ) : (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{index % 2 === 0 ? 'Our Mission' : 'Our Vision'}</h3>
                  <p className='text-white/90 text-lg leading-relaxed font-medium'>
                    {items.aboutmission}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

