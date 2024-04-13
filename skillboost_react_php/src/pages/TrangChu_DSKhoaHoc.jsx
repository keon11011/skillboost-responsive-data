import axios from "axios"
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom'

import Header from '../components/ui/header_footer/customer/Header.jsx'
import Footer from '../components/ui/header_footer/customer/Footer.jsx'
import ButtonFloat from '../components/ui/button/ButtonFloat.jsx'
import ArrowDownUp from '../components/icons/Arrow/ArrowDownUp.jsx'
import CourseCard from '../components/ui/card/CourseCard.jsx'
import ITBA_course from '../assets/img/ITBA_course.svg'
import BDE_course from '../assets/img/BDE_course.svg'
import BI_course from '../assets/img/BI_course.svg'
import DA_course from '../assets/img/DA_course.svg'
import Desktop_course from '../assets/img/Desktop_course.svg'
import ExcelAdvanced_course from '../assets/img/ExcelAdvanced_course.svg'
import PO_course from '../assets/img/PO_course.svg'
import Python_course from '../assets/img/Python_course.svg'
import SQLAdvanced_course from '../assets/img/SQLAdvanced_course.svg'

const TrangChu_DSKhoaHoc = () => {

    const { id } = useParams();

    //Lấy dữ liệu khóa học lên
    const [khoahocs, setkhoahocs] = useState([]);
    useEffect(() => {
        getKhoaHoc();
    }, []);

    function getKhoaHoc() {
        axios.get('http://localhost:80/SkillBoost-API/api/KhoaHoc/read_all.php').then(function(response) {
            console.log(response.data);
            setkhoahocs(response.data);
        });
    }

    //Hiển thị VND
    const formatAmountToVND = (amount) => {
        const config = { style: 'currency', currency: 'VND', maximumFractionDigits: 9 };
        return new Intl.NumberFormat('vi-VN', config).format(amount);
      };

    return (
    <main className="bg-no-repeat bg-cover bg-[url('./assets/logo/Background.svg')]">
        <div name="Header">
            <Header />
        </div>
        <div name="body" className='px-40 max-sm:px-7 pb-20 max-sm:pt-6 '>
            <div className='relative flex flex-col xl:w-full items-start w-full gap-10 max-sm:p-0'>
                <div className='items-center inline-flex justify-between w-full'>
                    <p className='headline-medium text-gray-500'>Khóa học tại Skillboost</p>
                    <div className='ml-auto max-sm:hidden'>
                        <ButtonFloat> <ArrowDownUp /> <div className='pl-2 '>Sắp xếp</div></ButtonFloat>
                    </div>
                </div>
                <div className='grid grid-cols-3 gap-10 justify-center self-center max-sm:grid-cols-1'>
                    {khoahocs.map((khoahoc, key) =>
                    <ul key={key}>
                        <li>
                            <Link to={`/khoahoc/${khoahoc.MaKhoaHoc}`}>
                                <CourseCard coursepic={khoahoc.HinhMinhHoc} coursename ={khoahoc.TenKhoaHoc} teachername={khoahoc.GiangVien} starrate={khoahoc.DanhGiaKhoaHoc} price={formatAmountToVND(khoahoc.GiaTien)}/>
                            </Link>
                        </li>
                    </ul>
                    )}
                </div>
            </div>
        </div>
        <div name="Footer">
            <Footer />
        </div>
        
    </main>
    
  )
}

export default TrangChu_DSKhoaHoc