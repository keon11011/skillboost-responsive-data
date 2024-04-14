import axios from "axios"
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom'

import SkillboostLogo from '../assets/logo/SkillboostLogo.svg'
import Copy from '../components/icons/Edit/Copy'
import Button from '../components/ui/button/Button'
import TextInput from '../components/ui/placeholder/TextInput'
import pay from '../assets/logo/pay.svg'


const ThanhToan = () => {

  //Hiển thị data dưới BE lên
  const [thongTinBaoGias, getThongTinBaoGias] = useState([]);

  // Khai báo navigate
  const navigate = useNavigate();

  useEffect(() => {
    getBaoGia();
  }, []);

  function getBaoGia() {
    axios.get("http://localhost:80/SkillBoost-API/api/BaoGia/read_latest.php").then(function (response) {
      console.log('Thông tin chi tiết báo giá của Lead', response.data);
      getThongTinBaoGias(response.data);
    });
  }

  // Format VND
  const formatAmountToVND = (amount) => {
    const config = { style: 'currency', currency: 'VND', maximumFractionDigits: 9 };
    return new Intl.NumberFormat('vi-VN', config).format(amount);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const MaBaoGia = { 'MaBaoGia': thongTinBaoGias.MaBaoGia };
    const MaLead = { 'MaLead': thongTinBaoGias.MaLead };
    const khachHangMoiInputs = {
      'HoTenKH': thongTinBaoGias.HoTenLead,
      'GioiTinhKH': thongTinBaoGias.GioiTinhLead,
      'NgaySinhKH': thongTinBaoGias.NgaySinhLead,
      'SoDienThoaiKH': thongTinBaoGias.SoDienThoaiLead,
      'EmailKH': thongTinBaoGias.EmailLead,
      'MaNgheNghiep': thongTinBaoGias.MaNgheNghiep,
      'LyDoTrangThaiKH': 'Đã thanh toán báo giá',
      'ChuyenDoiTuMaLead': thongTinBaoGias.MaLead
    };


    //console.log('MaBaoGia', MaBaoGia);
    //console.log('MaLead', MaLead);
    console.log('khachHangMoiInputs', khachHangMoiInputs);

    // Cập nhật trạng thái Đã thanh toán cho Báo giá
    axios.patch("http://localhost:80/SkillBoost-API/api/BaoGia/paid_already.php", MaBaoGia)
      .then(function (response1) {
        console.log('Update trạng thái báo giá (đã thanh toán): ', response1.data);
      })
      .catch(function (error1) {
        console.error('Error Update trạng thái báo giá (đã thanh toán): ', error1);
      });

    // Cập nhật trạng thái Đã thanh toán cho Lead
    axios.patch("http://localhost:80/SkillBoost-API/api/Lead/paid_already.php", MaLead)
      .then(function (response2) {
        console.log('Update trạng thái Lead (đã thanh toán): ', response2.data);
      })
      .catch(function (error2) {
        console.error('Error Update trạng thái Lead (đã thanh toán): ', error2);
      });

    // Tạo khách hàng mới
    axios.post("http://localhost:80/SkillBoost-API/api/KhachHang/create.php", khachHangMoiInputs)
      .then(function (response3) {
        console.log('Tạo khách hàng mới: ', response3.data);

        // Navigate đến trang thanh toán thành công
        navigate("/thongtinthanhtoan/thanhtoanthanhcong");
      })
      .catch(function (error3) {
        console.error('Error Tạo khách hàng mới: ', error3);
      });

  }

  return (

    <main className="bg-no-repeat bg-cover bg-[url('./assets/logo/Background.svg')]">

      <div className="relative z-10 flex flex-col ">


        <div className='py-[100px] w-full  items-center justify-center flex order-first '>
          <img src={SkillboostLogo} alt="" />
        </div>
        <div className=' bg-white py-[36px] px-[64px] rounded-lg self-center items-center justify-center flex flex-col 	'>
          <div className='headline-medium text-center  '>
            Thanh toán
          </div>
          <div className='flex flex-row mt-6 max-sm:flex-col max-sm:items-center max-sm:justify-center'>
            <div className='mr-14 flex flex-row mt-6 max-sm:flex-col max-sm:items-center max-sm:justify-center'>
              <div>
                <img src={pay} alt="" />
              </div>
            </div>

            <div className='pl-2 w-full   items-center'>
              <div className='grid grid-cols-2  max-sm:grid-cols-1 gap-8'>
                <div className='gap-y-5 flex flex-col'>
                  <div>
                    <TextInput title='Mã đơn hàng' variant='ReadOnly'>{thongTinBaoGias.MaBaoGia}</TextInput>
                  </div>
                  <div>
                    <TextInput title='Tên người thụ hưởng' variant='ReadOnly'> Phạm Nhật Phi</TextInput>
                  </div>
                  <div>
                    <TextInput title='Mã giảm giá (nếu có) ' variant='ReadOnly'>{thongTinBaoGias.MaGiamGia}</TextInput>                  </div>
                </div>
                <div className='gap-y-5 flex flex-col'>
                  <div>
                    <TextInput title='Số tài khoản ' variant='ReadOnly' rightIcon={<Copy width="1.25rem" height="1.25rem" strokeWidth={1.5} stroke='#5E6A6E' />}> 9353538222</TextInput>
                  </div>
                  <div>
                    <TextInput title='Chi nhánh' variant='ReadOnly'> Vietcombank Hà Nội</TextInput>
                  </div>
                  <div>
                    <TextInput title='Nội dung chuyển khoản ' variant='ReadOnly ' rightIcon={<Copy width="1.25rem" height="1.25rem" strokeWidth={1.5} stroke='#5E6A6E' />}> ID01468790</TextInput>
                  </div>
                </div>
                <div className='body-large text-text-secondary flex flex-col pt-5'>
                  Tổng tiền:
                  <label for="" class="block mb-2 font-bold text-indigo-500 text-2xl  ">{formatAmountToVND(thongTinBaoGias.TongTien)}</label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='flex justify-center space-x-[24px] mt-10 mb-10'>
          <div className='cursor-pointer block'>
            <Link to="/trangchu" className='ease-in-out'>
              <Button variant='Outlined'> Trở về trang chủ</Button>
            </Link>
          </div>
          <div className='cursor-pointer block'>
            {/* <Link to="/thongtinthanhtoan/thanhtoanthanhcong" className='ease-in-out'>
              <Button onClick={handleSubmit}>Đã thanh toán</Button>
            </Link> */}
            <Button onClick={handleSubmit}>Đã thanh toán</Button>
          </div>
        </div>
      </div>

    </main>
  )
}

export default ThanhToan