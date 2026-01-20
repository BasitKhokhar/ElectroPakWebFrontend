import React from 'react'
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import logo from '../assets/logo2.png'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export default function Footer() {

  useEffect(() => {
    AOS.init({
      duration: 1200,
    });
  }, []);

  const [footerdata, setFooterData] = useState({
    logoData: [],
    contactListData: [],
    FooterLinksData: [],
    FooterInfoData: [],
    socialIconsData: []
  });
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiEndpoints = [
      { key: 'logoData', url: `${API_BASE_URL}/logo_image` },
      { key: 'contactListData', url: `${API_BASE_URL}/contact_list` },
      { key: 'FooterLinksData', url: `${API_BASE_URL}/footer_links` },
      { key: 'FooterInfoData', url: `${API_BASE_URL}/footer_info` },
      { key: 'socialIconsData', url: `${API_BASE_URL}/social_icons` }
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
        setFooterData((prevData) => ({
          ...prevData,
          ...updatedData,
        }));
      })
  }, []);
  console.log('Footer data:', footerdata)

  return (
    <footer className='bg-[#0A0F1C] text-white py-16 mt-20 border-t border-white/5 relative overflow-hidden'>
      {/* Decorative Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

      <div className='container mx-auto px-6 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16 relative z-10'>
        {/* Brand Section */}
        <div className='flex flex-col gap-8'>
          <Link to="/" className="group inline-block">
            {
              footerdata.logoData && footerdata.logoData.map((item) => {
                return (
                  <div key={item.id} data-aos="fade-up" className="relative">
                    <div className="absolute -inset-4 bg-primary/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <img src={logo} alt="ElectroPak Logo" className='relative h-12 sm:h-14 transition-transform group-hover:scale-105 duration-300' />
                  </div>
                )
              })
            }
          </Link>
          <div className='flex flex-col gap-5'>
            {
              footerdata.contactListData && footerdata.contactListData.map((items) => {
                return (
                  <div className='flex items-center gap-4 group cursor-pointer' key={items.id} data-aos="fade-up">
                    <div className='w-11 h-11 rounded-1.5xl bg-white/5 flex items-center justify-center text-primary border border-white/10 group-hover:bg-primary group-hover:text-white group-hover:border-primary/50 transition-all duration-300 shadow-inner'>
                      <i className={`${items.icons} text-lg`}></i>
                    </div>
                    <span className='text-gray-400 group-hover:text-white transition-colors duration-300 leading-relaxed'>{items.contact_list_items}</span>
                  </div>
                )
              })
            }
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className='text-lg font-bold mb-8 uppercase tracking-widest text-primary/90' data-aos="fade-up">
            Quick Links
            <span className="block w-10 h-1 bg-primary mt-2 rounded-full"></span>
          </h3>
          <div className='flex flex-col gap-4' data-aos="fade-up">
            {footerdata.FooterLinksData && footerdata.FooterLinksData.map((items, index) => (
              <Link
                key={`${items.footer_links_list}-${index}`}
                to={items.routes}
                className='text-gray-400 hover:text-white transition-all duration-300 flex items-center gap-3 group'
              >
                <i className="fa-solid fa-chevron-right text-[10px] text-primary group-hover:translate-x-1 transition-transform"></i>
                <span className="group-hover:translate-x-1 transition-transform">{items.footer_links_list}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Information */}
        <div>
          <h3 className='text-lg font-bold mb-8 uppercase tracking-widest text-accent/90' data-aos="fade-up">
            Information
            <span className="block w-10 h-1 bg-accent mt-2 rounded-full"></span>
          </h3>
          <div className='flex flex-col gap-4' data-aos="fade-up">
            {
              footerdata.FooterInfoData && footerdata.FooterInfoData.map((items, index) => {
                return (
                  <Link
                    key={`${items.footer_info_list}-${index}`}
                    to={items.routes}
                    className='text-gray-400 hover:text-white transition-all duration-300 flex items-center gap-3 group'
                  >
                    <i className="fa-solid fa-circle-info text-[10px] text-accent group-hover:scale-125 transition-transform"></i>
                    <span className="group-hover:translate-x-1 transition-transform">{items.footer_info_list}</span>
                  </Link>
                )
              })
            }
          </div>
        </div>

        {/* Social Links */}
        <div>
          <h3 className='text-lg font-bold mb-8 uppercase tracking-widest text-white/90' data-aos="fade-up">
            Connect
            <span className="block w-10 h-1 bg-white/20 mt-2 rounded-full"></span>
          </h3>
          <p className="text-gray-400 mb-6 text-sm leading-relaxed" data-aos="fade-up">
            Stay updated with our latest offers and products via our social channels.
          </p>
          <div className='flex flex-wrap gap-4' data-aos="fade-up">
            {
              footerdata.socialIconsData && footerdata.socialIconsData.map((items) => {
                return (
                  <a
                    key={items.icons}
                    href={items.routes}
                    target="_blank"
                    rel="noopener noreferrer"
                    className='w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl text-gray-400 hover:bg-primary hover:text-white hover:border-primary/50 hover:shadow-[0_0_20px_rgba(26,115,232,0.4)] transition-all duration-500 transform hover:-translate-y-2'
                  >
                    <i className={items.icons}></i>
                  </a>
                )
              })
            }
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className='container mx-auto px-6 sm:px-6 lg:px-8 border-t border-white/5 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10'>
        <div className="flex flex-col gap-1 items-center md:items-start text-center md:text-left">
          <p className="text-gray-500 text-[13px] tracking-wide">© {new Date().getFullYear()} ElectroPak. Developed for Excellence.</p>
          <p className="text-gray-600 text-[11px]">All Rights Reserved. Terms & Conditions apply.</p>
        </div>

        <div className="flex items-center gap-4 bg-white/5 p-2 px-4 rounded-2xl border border-white/5 backdrop-blur-sm">
          <span className="text-gray-400 text-xs font-medium uppercase tracking-tighter">Crafted by</span>
          <a
            href="https://basitportfolioweb.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className='relative text-primary font-bold text-sm tracking-widest px-1 group'
          >
            B.Creatives
            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
          </a>
        </div>
      </div>
    </footer>
  )
}
