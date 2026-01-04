import React, { useEffect, useState } from 'react';
import Loader from './Loader';
import AOS from 'aos';
import 'aos/dist/aos.css';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Services = () => {
  useEffect(() => {
    AOS.init({
      duration: 1200,
    });
  }, []);

  const [activeTab, setActiveTab] = useState(0);
  const [servicesdata, setServicesData] = useState({
    servicesData: [],
    plumbersData: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const apiEndpoints = [
      { key: 'servicesData', url: `${API_BASE_URL}/services` },
      { key: 'plumbersData', url: `${API_BASE_URL}/plumbers` }
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
        setServicesData((prevData) => ({
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
          <span className="text-primary font-bold tracking-widest text-sm uppercase mb-3 block">Expert Solutions</span>
          <h1 className='text-5xl font-extrabold text-text tracking-tight'>Our Services</h1>
          <div className='h-2 w-24 bg-primary mt-6 rounded-full'></div>
          <p className="text-mutedText mt-6 max-w-2xl text-lg leading-relaxed">
            From sanitary engineering to modern plumbing solutions, we provide the highest quality services delivered by industry experts.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Navigation Tabs */}
          <div className="w-full lg:w-1/3">
            <div className="flex flex-col gap-4 sticky top-24" data-aos="fade-right">
              {servicesdata.servicesData && servicesdata.servicesData.map((service, index) => (
                <button
                  key={service.id}
                  className={`group w-full flex items-center justify-between text-left p-6 rounded-2xl transition-all duration-300 border ${activeTab === index
                      ? 'bg-primary text-white border-primary shadow-xl shadow-primary/20 -translate-y-1'
                      : 'bg-cardsBackground text-text border-border hover:border-primary/50 hover:bg-background shadow-sm'
                    }`}
                  onClick={() => setActiveTab(index)}
                >
                  <h4 className="font-bold text-lg">{service.title}</h4>
                  <div className={`transition-transform duration-300 ${activeTab === index ? 'translate-x-1' : 'group-hover:translate-x-1'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Content Area */}
          <div className="w-full lg:w-2/3">
            <div className="bg-cardsBackground rounded-[2.5rem] border border-border shadow-2xl p-8 lg:p-12 min-h-[500px] relative overflow-hidden group">
              {/* Subtle background glow */}
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>

              {servicesdata.servicesData && servicesdata.servicesData.map((service, index) => (
                <div
                  key={service.id}
                  className={`transition-all duration-500 transform ${activeTab === index ? 'opacity-100 scale-100 translate-x-0' : 'hidden opacity-0 scale-95 -translate-x-4'}`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="relative h-80 rounded-[2rem] overflow-hidden shadow-xl" data-aos="zoom-in">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>

                    <div className='flex flex-col text-left' data-aos="fade-left">
                      <h3 className="text-2xl font-bold text-text mb-4 leading-tight">Professional Sanitary & Plumbing Solutions</h3>
                      <p className="text-mutedText leading-relaxed mb-8">{service.description}</p>

                      <div className="space-y-4">
                        {['Quality Servicing', 'Expert Workers', 'Modern Equipment'].map((feature, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center text-success">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                            </div>
                            <span className="font-bold text-text/80">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Plumbers Section */}
        <div className="mt-32">
          <div className="mb-12" data-aos="fade-up">
            <h2 className='text-4xl font-extrabold text-text tracking-tight'>Our Experts</h2>
            <div className='h-1.5 w-16 bg-primary mt-4 rounded-full'></div>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10'>
            {servicesdata.plumbersData && servicesdata.plumbersData.map((expert, index) => (
              <div
                key={expert.id}
                className='group bg-cardsBackground p-6 rounded-[2.5rem] border border-border shadow-md hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-500 cursor-pointer text-left'
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="relative rounded-[2rem] overflow-hidden mb-6 h-64 bg-background">
                  <img
                    src={expert.image_url}
                    alt={expert.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500"></div>
                </div>

                <div className="space-y-3 px-2">
                  <div className="w-10 h-1 bg-primary/30 rounded-full group-hover:w-16 transition-all duration-500"></div>
                  <div>
                    <span className="text-xs font-bold text-primary uppercase tracking-widest block mb-1">Professional Plumber</span>
                    <h2 className='text-xl font-bold text-text'>{expert.name}</h2>
                  </div>
                  <div className="flex items-center gap-3 text-mutedText group-hover:text-primary transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                    <span className='font-semibold'>{expert.contact}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
