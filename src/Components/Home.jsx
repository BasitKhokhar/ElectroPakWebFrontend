import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Loader from './Loader';
import Navbar from './Navbar';
import ImageSlider from './Slider';
import Categories from './Categories';
import Brands from './Brands';
import Cart from './Cart';
import Customer_Support from './Customer_Support';
import AllProducts from './AllProducts';
import AOS from 'aos';
import 'aos/dist/aos.css';
import TypingComponent from './TypingComponent';
import TrendingProducts from './TrendingProducts';
import OnSaleProducts from './OnSaleProducts';
import TopProducts from './TopProducts';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Home({ loggedInUserId }) {
  console.log("userid in Home:", loggedInUserId)
  useEffect(() => {
    AOS.init({
      duration: 1200,
    });
  }, []);

  const [homedata, setHomeData] = useState({
    sliderData: [],
    homeParaData: [],
    // CategoryData: [],
    productsData: [],
    brandsData: [],
    customersupportData: [],
    videosData: [],
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    const apiEndpoints = [
      { key: 'logoData', url: `${API_BASE_URL}/logo_image` },
      { key: 'homeParaData', url: `${API_BASE_URL}/home_paragraphs` },
      { key: 'sliderData', url: `${API_BASE_URL}/sliderimages` },
      { key: 'TopProducts', url: `${API_BASE_URL}/products` },
      // { key: 'CategoryData', url: `${API_BASE_URL}/categories` },
      { key: 'brandsData', url: `${API_BASE_URL}/brands` },
      { key: 'customersupportData', url: `${API_BASE_URL}/customer_supportoptions` },
      { key: 'videosData', url: `${API_BASE_URL}/home_videos` }
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
        setHomeData((prevData) => ({
          ...prevData,
          ...updatedData,
        }));
      })
      .finally(() => setLoading(false));
  }, []);
  if (loading) {
    return <Loader />
  }
  console.log('Home Page data:', homedata)

  return (
    <div>
      {/* <div><Navbar userId={userId}/></div> */}
      <ImageSlider sliderData={homedata.sliderData} />
      <div className='mx-4 sm:mx-4 md:mx-6 lg:mx-20 my-24 space-y-24'>
        {
          homedata.homeParaData && homedata.homeParaData.map((items, index) => {
            return (
              <div key={index} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 !== 0 ? 'lg:direction-rtl' : ''}`}>
                <div className={`flex flex-col text-left gap-6 p-4 ${index % 2 !== 0 ? 'lg:order-last' : ''}`} data-aos="fade-up">
                  <h2 className='text-4xl font-extrabold text-text leading-tight'>{items.heading}</h2>
                  <p className='text-lg text-mutedText leading-relaxed font-medium'>{items.description}</p>
                  <div className="flex gap-4 mt-2">
                    <button className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-hover transition-all shadow-lg shadow-primary/20">Explore More</button>
                  </div>
                </div>
                <div className='relative group' data-aos="zoom-in">
                  <div className="absolute -inset-4 bg-gradient-blue-sky/10 rounded-[2.5rem] blur-2xl group-hover:bg-gradient-blue-sky/20 transition-all duration-500"></div>
                  <img src={items.image_url} alt="" className='relative w-full h-[450px] object-cover rounded-[2rem] shadow-2xl border border-white/20' />
                </div>
              </div>
            )
          })
        }
      </div>

      {/* <div className='bg-cardsBackground/50 py-20 border-y border-border'>
        <Categories categoriesData={homedata.CategoryData} />
      </div>

      <div className="py-10">
        <TrendingProducts loggedInUserId={loggedInUserId} />
      </div>
      <div className="py-10">
        <OnSaleProducts loggedInUserId={loggedInUserId} />
      </div> */}

      <div className='my-24 py-20 bg-gradient-blue-pulse relative overflow-hidden'>
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative text-center mb-12">
          <h2 className="text-4xl font-extrabold text-white mb-4">Experience ElectroPak</h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto px-4 font-medium">Watch our latest products in action and see how we redefine technology.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mx-4 sm:mx-4 md:mx-6 lg:mx-20">
          {homedata.videosData && homedata.videosData.map((video) => (
            <div key={video.id} className="group relative" data-aos="flip-up">
              <div className="absolute -inset-2 bg-white/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-duration-500"></div>
              <video className="relative w-full h-[400px] object-cover rounded-3xl shadow-2xl border border-white/20" controls autoPlay muted loop>
                <source src={video.video_url} type="video/mp4" />
              </video>
            </div>
          ))}
        </div>
      </div>
      <TopProducts productsData={homedata.TopProducts} />

      <div>
        <Customer_Support customerSupportdata={homedata.customersupportData} />
      </div>
      <div>
        <Brands brandsdata={homedata.brandsData} />
      </div>
    </div>
  );
}
