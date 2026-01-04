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
    <div className='bg-gradient-blue-sky text-white px-6 sm:px-10 py-16 mt-20 border-t border-white/10'>
      <div className='container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16'>
        {/* Brand Section */}
        <div className='flex flex-col gap-6'>
          <Link to="/" className="group inline-block">
            {
              footerdata.logoData && footerdata.logoData.map((item) => {
                return (
                  <div key={item.id} data-aos="fade-up" className="relative">
                    <div className="absolute -inset-2 bg-white/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <img src={logo} alt="ElectroPak Logo" className='relative h-14' />

                  </div>
                )
              })
            }
          </Link>
          <div className='flex flex-col gap-4'>
            {
              footerdata.contactListData && footerdata.contactListData.map((items) => {
                return (
                  <div className='flex items-center gap-4 group cursor-pointer' key={items.id} data-aos="fade-up">
                    <span className='w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary border border-white/10 group-hover:bg-primary group-hover:text-white transition-all duration-300'>
                      <i className={items.icons}></i>
                    </span>
                    <span className='text-white/70 group-hover:text-white transition-colors'>{items.contact_list_items}</span>
                  </div>
                )
              })
            }
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className='text-xl font-bold mb-8 relative inline-block' data-aos="fade-up">
            Quick Links
            <span className="absolute -bottom-2 left-0 w-12 h-1 bg-primary rounded-full"></span>
          </h3>
          <div className='flex flex-col gap-4' data-aos="fade-up">
            {footerdata.FooterLinksData && footerdata.FooterLinksData.map((items, index) => (
              <Link key={`${items.footer_links_list}-${index}`} to={items.routes} className='text-white/60 hover:text-primary transition-colors flex items-center gap-2 group'>
                <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-primary transition-colors"></span>
                {items.footer_links_list}
              </Link>
            ))}
          </div>
        </div>

        {/* Information */}
        <div>
          <h3 className='text-xl font-bold mb-8 relative inline-block' data-aos="fade-up">
            Information
            <span className="absolute -bottom-2 left-0 w-12 h-1 bg-accent rounded-full"></span>
          </h3>
          <div className='flex flex-col gap-4' data-aos="fade-up">
            {
              footerdata.FooterInfoData && footerdata.FooterInfoData.map((items, index) => {
                return (
                  <Link key={`${items.footer_info_list}-${index}`} to={items.routes} className='text-white/60 hover:text-accent transition-colors flex items-center gap-2 group'>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-accent transition-colors"></span>
                    {items.footer_info_list}
                  </Link>
                )
              })
            }
          </div>
        </div>

        {/* Social Links */}
        <div>
          <h3 className='text-xl font-bold mb-8 relative inline-block' data-aos="fade-up">
            Connect With Us
            <span className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></span>
          </h3>
          <div className='flex gap-4' data-aos="fade-up">
            {
              footerdata.socialIconsData && footerdata.socialIconsData.map((items) => {
                return (
                  <a key={items.icons} href={items.routes} className='w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl hover:bg-white hover:text-text hover:shadow-2xl hover:shadow-white/10 transition-all duration-300 transform hover:-translate-y-1'>
                    <i className={items.icons} ></i>
                  </a>
                )
              })
            }
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className='container mx-auto border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-6'>
        <p className="text-white/40 text-sm">© {new Date().getFullYear()} ElectroPak. All Rights Reserved.</p>
        <div className="flex items-center gap-4">
          <span className="text-white/40 text-sm">Crafted by</span>
          <a href="https://basitportfolioweb.netlify.app/" className='bg-primary/10 text-primary border border-primary/20 py-1.5 px-4 rounded-full text-sm font-bold hover:bg-primary hover:text-white transition-all duration-300'>B.Creatives</a>
        </div>
      </div>
    </div>
  )
}
