import axios from "axios"
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom'

import Header from '../components/ui/header_footer/customer/Header.jsx'
import Footer from '../components/ui/header_footer/customer/Footer.jsx'
import BA_course from '../assets/logo/BA_course.svg'
import Timer from '../components/icons/Calendar/Timer.jsx'
import Globe from '../components/icons/Navigation/Globe.jsx'
import FeedbackCard from '../components/ui/card/FeedbackCard.jsx'
import Star from '../components/icons/Interface/Star.jsx'
import UserCheck from '../components/icons/User/UserCheck.jsx'
import UserGroup from '../components/icons/User/UsersGroup.jsx'
import CalendarCheck from '../components/icons/Calendar/CalendarCheck.jsx'
import CalendarClose from '../components/icons/Calendar/CalendarClose.jsx'
import Clock from '../components/icons/Calendar/Clock.jsx'
import TextInput from '../components/ui/placeholder/TextInput'
import TextArea from '../components/ui/placeholder/TextArea'
import DropDown from '../components/ui/placeholder/DropDown'
import CustomDatePicker from '../components/ui/placeholder/CustomDatePicker'
import Button from '../components/ui/button/Button.jsx'
import InformSuccess from '../components/ui/inform/InformSuccess'
import InformFailure from '../components/ui/inform/InformFailure'

const Chitietkhoahoc = () => {

    const [showCourseSelector, setShowCourseSelector] = useState(false);

    //Hiển thị data dưới BE lên
    const [thongTinKhoaHocs, setThongTinKhoaHocs] = useState([]);
    const { id } = useParams();
    
    useEffect(() => {
        getThongTinKhoaHocs();
    }, []);

    function getThongTinKhoaHocs() {
        axios.get(`http://localhost:80/SkillBoost-API/api/KhoaHoc/read_single.php?MaKhoaHoc=${id}`).then(function (response) {
        console.log(response.data);
        setThongTinKhoaHocs(response.data);
        });
    }

    //Hiển thị VND
    const formatAmountToVND = (amount) => {
        const config = { style: 'currency', currency: 'VND', maximumFractionDigits: 9 };
        return new Intl.NumberFormat('vi-VN', config).format(amount);
      };


    const [inputs, setInputs] = useState({});
    const [inputYCTVs, setinputYCTVs] = useState({});
    
    
    //Tất cả Text Inputs
    const handleTextChange = (event) => {
        const id = event.target.id;
        const id_YCTV = event.target.dataset.yctv;
        const value = event.target.value;
        setInputs(values => ({...values, [id]: value}));
        setinputYCTVs(values => ({...values, [id_YCTV]: value}));
    }

    //DatePicker
    const [selectedNgaySinh, setselectedNgaySinh] = useState(null);
    const formattedDate = selectedNgaySinh ? selectedNgaySinh.toLocaleDateString('en-CA') : undefined;

    useEffect(() => {
        const id = 'NgaySinhLead';
        const id_YCTV = 'NgaySinhLeadYeuCau';

        setInputs(values => ({...values, [id]: formattedDate}))
        setinputYCTVs(values => ({...values, [id_YCTV]: formattedDate}));
    }, [formattedDate])

    //Giới tính Dropdown
    const handleGioiTinhChange = (event) => {
        const id = 'GioiTinhLead';
        setInputs(values => ({...values, [id]: event.value}));
    }

    //Kiểm tra nhập đủ trường bắt buộc chưa

    const [isFormValid, setFormValid] = useState(false);

    useEffect(() => {
        const isFormValid = Object.values(inputs).every(value => value && value.trim() !== '');
        setFormValid(isFormValid);
    }, [inputs]);

    //Khai báo biến chứa thông tin khóa học để tạo xuống dưới table ChiTietKhoaHocThuocYCTV
    const inputChiTietKhoaHocs = { 'MaKhoaHoc': thongTinKhoaHocs.MaKhoaHoc, 'TenKhoaHoc': thongTinKhoaHocs.TenKhoaHoc, 'GiaTien': thongTinKhoaHocs.GiaTien, 'GiangVien': thongTinKhoaHocs.GiangVien};

    //Xử lý ấn nút button Submit

    const navigate = useNavigate();

    const [showSuccess, setShowSuccess] = useState(false);
    const [showFailure, setshowFailure] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
    
        axios.post(`http://localhost:80/SkillBoost-API/api/Lead/create.php`, inputs)
            .then(function(response) {
                console.log('Tạo Lead sao rồi', response);
                    
                axios.get(`http://localhost:80/SkillBoost-API/api/Lead/read_new.php`)
                    .then(function(response2) {
    
                        const updatedInputYCTVs = { 'TenLeadYeuCau': inputs.HoTenLead, 'NgaySinhLeadYeuCau': inputs.NgaySinhLead, 'EmailLeadYeuCau': inputs.EmailLead, 'SDTLeadYeuCau': inputs.SoDienThoaiLead, 'TaoBoiLead': response2.data.MaLead };
                        setinputYCTVs(updatedInputYCTVs);
    
                        console.log('InputYCTV', updatedInputYCTVs);
    
                        axios.post('http://localhost:80/SkillBoost-API/api/YeuCauTuVan/create.php', updatedInputYCTVs)
                            .then(function(response3) {
                                console.log('YCTV tạo như thế nào:', response3.data);
    
                                axios.post('http://localhost:80/SkillBoost-API/api/ChiTietKhoaHocThuocYCTV/create.php', inputChiTietKhoaHocs)
                                    .then(function(response3) {
                                        console.log('Tình trạng bảng ChiTietKhoaHocThuocYCTV', response3.data);
    
                                        axios.get(`http://localhost:80/SkillBoost-API/api/YeuCauTuVan/read_new.php`)
                                            .then(function(response4) {
                                                console.log('Mã tư vấn', response4.data);
    
                                                axios.patch('http://localhost:80/SkillBoost-API/api/ChiTietKhoaHocThuocYCTV/update_matuvan.php', response4.data)
                                                    .then(function(response5) {
    
                                                        console.log('Đổi Mã tư vấn', response5.data);

                                                        console.log(response.data);
                                                        
                                                        setShowSuccess(true);
                                                        setTimeout(() => {
                                                        setShowSuccess(false);
                                                        navigate(`/khoahoc/${thongTinKhoaHocs.MaKhoaHoc}`);
                                                        }, 2000);
                                                        })
                                                        .catch(function(error) {
                                                        console.error('Error occurred:', error);
                                                        setshowFailure(true);
                                                        setTimeout(() => {
                                                            setshowFailure(false);
                                                        }, 2000);
                                                    });
                                                });
                                    });
                            })
                            .catch(function(error3) {
                                console.error('Error creating YCTV:', error3);
                            });
                    })
                    .catch(function(error2) {
                        console.error('Error reading new lead:', error2);
                    });
            })
            .catch(function(error) {
                console.error('Error creating lead:', error);
            });
    };
    

    return (
        <main className="bg-no-repeat bg-cover bg-[url('./assets/logo/Background.svg')]">
            <div name="Header">
                <Header />
            </div>
            <div className='px-40 pb-16'>

                <div className='flex flex-row pt-[64px]'>

                    <div className='pr-[64px] '>
                        <img
                            src={BA_course}
                            alt=""
                            width={600}
                            height={300}
                        />
                    </div>
                    <div className='space-y-[16px]'>
                        <div className='display-small text-text-primary '>
                            {thongTinKhoaHocs.TenKhoaHoc}
                        </div>
                        <div className='title-large text-text-primary space-y-[24px]'>
                            Chuẩn bị sẵn sàng để thành công và tìm hiểu các khái niệm phân tích kinh doanh chính để phát triển mạnh trong sự nghiệp Chuyên viên phân tích kinh doanh của bạn!
                        </div>
                        <div className='title-medium'>
                            Giảng viên: <span className='text-text-blue'>{thongTinKhoaHocs.GiangVien}</span>
                        </div>
                        <div className='flex flex-row gap-[36px] text-text-primary'>
                            <div className='flex flex-row body-large gap-[16px]'>
                                <Timer width="24px" height="24px" />
                                Lần cuối cập nhật: <span>{thongTinKhoaHocs.ChinhSuaLanCuoiVaoLuc}</span>
                            </div>
                            <div className='flex flex-row body-large gap-[16px]'>
                                <Globe width="24px" height="24px" />
                                Ngôn ngữ: Tiếng Việt
                            </div>
                        </div>
                    </div>


                </div>

                <div className='flex flex-row pt-16 gap-[24px]'>

                    <div className='flex flex-col gap-[24px] w-2/3'>
                        <div className=' bg-white p-[36px] rounded-lg shadow-md  flex flex-col gap-6	'>
                            <div className='headline-small'>
                                Mô tả khóa học
                            </div>
                            <div className='body-large'>
                                {thongTinKhoaHocs.MoTaDai} 
                            </div>
                        </div>
                        <div className=' bg-white p-[36px] rounded-lg shadow-md  flex flex-col space-y-[24px]'>
                            <div className='headline-small'>
                                Bình luận
                            </div>
                            <div className='body-large flex flex-row gap-[24px]'>
                                <FeedbackCard
                                    cusname={"Nguyễn Văn An"}
                                    starrate={"5"}
                                    content={"Khóa học rất hữu ích khi tôi tìm kiếm chính xác thông tin này và tôi đã có được thứ mình muốn, thật may mắn :) Ryan là một giáo viên xuất sắc, hiểu rất rõ về chủ đề này và đưa ra những lời giải thích có cấu trúc rõ ràng."}
                                    likecount={"22"}
                                />
                                <FeedbackCard
                                    cusname={"Trần Duy Hưng"}
                                    starrate={"5"}
                                    content={"Tôi đã tham gia một khóa học online về IT Business Analysis (BA) và tôi rất hài lòng với trải nghiệm của mình. Đây là một khóa học tuyệt vời để bắt đầu hoặc nâng cao kiến thức về BA trong lĩnh vực Công nghệ thông tin."}
                                    likecount={"23"}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col gap-[24px] '>
                    <div className='w-[418px] max-sm:w-auto h-auto relative bg-background-primary rounded-lg p-6'>
                            <div className='headline-small text-brand-default'>
                            {formatAmountToVND(thongTinKhoaHocs.GiaTien)}
                            </div>
                            <div className='w-full relative border-t-[0.5px] border-[#e6e6e6] h-[0.5px] my-7'>
                            </div>

                            <div className='flex relative flex-row flex-start justify-between text-left mb-6'>
                            <div className='flex'>
                                <Star className='w-[20px] h-[20px] mr-3 text-text-secondary'/>
                                <p className='body-large text-text-secondary'>Đánh giá</p>
                            </div>

                            <div className='flex'>
                                <p className='text-text-secondary pr-1'>{thongTinKhoaHocs.DanhGiaKhoaHoc}</p>
                                <Star className='text-sematic-yellow fill-sematic-yellow w-[20px] h-[20px] relative'/>
                            </div>
                            </div>

                            <div className='flex relative flex-row flex-start justify-between text-left mb-6'>
                            <div className='flex'>
                                <UserCheck className='w-[20px] h-[20px] mr-3 text-text-secondary'/>
                                <p className='body-large text-text-secondary'>Lượt đánh giá</p>
                            </div>

                                <p className='text-text-secondary pr-1'>{thongTinKhoaHocs.LuotDanhGia}</p>
                            </div>

                            <div className='flex relative flex-row flex-start justify-between text-left mb-6'>
                            <div className='flex'>
                                <UserGroup className='w-[20px] h-[20px] mr-3 text-text-secondary'/>
                                <p className='body-large text-text-secondary'>Học viên tối đa</p>
                            </div>

                                <p className='text-text-secondary pr-1'>{thongTinKhoaHocs.SoLuongHocVienToiDa}</p>
                            </div>

                            <div className='flex relative flex-row flex-start justify-between text-left mb-6'>
                            <div className='flex'>
                                <CalendarCheck className='w-[20px] h-[20px] mr-3 text-text-secondary'/>
                                <p className='body-large text-text-secondary'>Ngày khai giảng</p>
                            </div>

                                <p className='text-text-secondary pr-1'>{thongTinKhoaHocs.NgayKhaiGiang}</p> {/*gọi ngày ra*/}
                            </div>

                            <div className='flex relative flex-row flex-start justify-between text-left mb-6'>
                            <div className='flex'>
                                <CalendarClose className='w-[20px] h-[20px] mr-3 text-text-secondary'/>
                                <p className='body-large text-text-secondary'>Ngày bế giảng</p>
                            </div>

                                <p className='text-text-secondary pr-1'>{thongTinKhoaHocs.NgayBeGiang}</p>{/*gọi ngày ra*/}
                            </div>

                            <div className='flex relative flex-row flex-start justify-between text-left mb-6'>
                            <div className='flex'>
                                <Clock className='w-[20px] h-[20px] mr-3 text-text-secondary'/>
                                <p className='body-large text-text-secondary'>Thời gian</p>
                            </div>

                                <p className='text-text-secondary pr-1'>Thứ 2, 17h00 - 20h00</p> {/*gọi weekday, Timestart ra*/}
                            </div>

                            <div className='w-full relative flex flex-row items-start justify-end text-right'>
                            <p className='text-text-secondary pr-1 inline-block'>Thứ 6, 17h00 - 20h00</p> {/*gọi weekday, Timeend ra*/}              
                            </div>
                        </div>

                        <div className='bg-white p-[24px] rounded-lg shadow-md  flex flex-col '>
                            <div className='title-large pb-5'>
                                Thông tin nhận tư vấn
                            </div>
                            <div>
                                <form onSubmit={handleSubmit} className='space-y-3'>
                                <div className='text-text-secondary'>
                                    <TextInput
                                        id='HoTenLead'
                                        title="Họ tên"
                                        showRedAsterisk
                                        previewText='Nhập họ tên'
                                        onChange={handleTextChange}
                                    ></TextInput>
                                </div>
                                <div className='text-text-secondary'>
                                    <CustomDatePicker 
                                    id='NgaySinhLead'
                                    //data-yctv='NgaySinhLeadYeuCau'
                                    title='Ngày sinh'
                                    previewText='Chọn ngày sinh'
                                    showRedAsterisk={true}
                                    selectedDate={selectedNgaySinh}
                                    setSelectedDate={setselectedNgaySinh}
                                    />
                                </div>
                                <div className='text-text-secondary'>
                                <DropDown
                                    id="GioiTinhLead"
                                    title="Giới tính"
                                    previewText="Chọn giới tính"
                                    showRedAsterisk
                                    options={["Nam", "Nữ"].map(i => ({
                                    value: i,label:i
                                    }))}
                                    onHandleChange={handleGioiTinhChange}
                                />
                                </div>
                                <div className='text-text-secondary'>
                                    <TextInput 
                                        id='SoDienThoaiLead'
                                        title="Số điện thoại"
                                        showRedAsterisk 
                                        previewText='Nhập số điện thoại'
                                        onChange={handleTextChange}
                                    ></TextInput>
                                </div>
                                <div className='text-text-secondary'>
                                    <TextInput 
                                        id='EmailLead'
                                        title="Email"
                                        showRedAsterisk 
                                        previewText='Nhập email'
                                        onChange={handleTextChange}
                                    ></TextInput>
                                </div>
                                <div className='text-text-secondary'>
                                    <TextArea 
                                        id='GhiChuLead'
                                        title="Ghi chú" 
                                        previewText='Nhập ghi chú'
                                        onChange={handleTextChange}
                                    ></TextArea>
                                </div>
                                <div className='flex justify-end'>
                                    <Button type='submit' variant='Plain' size='Medium' state={!isFormValid ? 'disabled' : ''} >Gửi yêu cầu tư vấn </Button>
                                </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div name="Footer">
                <Footer />
            </div>
        {showSuccess && <InformSuccess>Tạo yêu cầu tư vấn thành công</InformSuccess>}
        {showFailure && <InformFailure>Tạo yêu cầu tư vấn thất bại</InformFailure>}
        </main>
    )
}

export default Chitietkhoahoc
