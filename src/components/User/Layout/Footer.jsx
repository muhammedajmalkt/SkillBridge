import React from 'react'
import { FaFacebookF, FaTwitter, FaInstagram, FaPinterest } from 'react-icons/fa'; 

const Footer = () => {
  return (
    <footer className="bg-black text-white  pt-28 ">
    <div className="max-w-6xl mx-auto px-5">
        <div className="flex flex-col md:flex-row justify-between">

            <div className="mb-6 md:mb-0">
            <a href="/" className="text-2xl font-bold text-white ">
                 Ski<span className='text-[#6d28d2] font-bold'>⇅</span>Bridge</a>

                <p className='w-[600px] mt-4'> SkillBridge is the bridge where exchanging skills and talents becomes easy.Swap your skills,
                     find what you are looking for.It's all free, you just "pay" with your time.</p>
            </div>

  <div className="mb-6 md:mb-0">
       <h3 className="text-lg font-bold mb-4">Quick Links</h3>
        <ul className="space-y-2">
            <li><a href="/" className="hover:text-gray-400">Home</a></li>
            <li><a href="/about" className="hover:text-gray-400">About Us</a></li>
            <li><a href="/products" className="hover:text-gray-400">Products</a></li>
            <li><a href="/contact" className="hover:text-gray-400">Contact Us</a></li>
           </ul>
            </div>

            <div>
                <h3 className="text-lg font-bold mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                    <a href="#" className="hover:text-blue-400"><FaFacebookF /></a>
                    <a href="#" className="hover:text-blue-400"><FaTwitter /></a>
                    <a href="#" className="hover:text-red-500"><FaInstagram /></a>
                    <a href="#" className="hover:text-red-700"><FaPinterest /></a>
                </div>
            </div>
        </div>
    </div>
    <div className="border-t border-gray-700 mt-28 py-10 text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} SkillBridge. All rights reserved.</p>
    </div>
</footer>
  )
}

export default Footer