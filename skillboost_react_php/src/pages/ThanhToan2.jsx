import axios from "axios"
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'

import SkillboostLogo from '../assets/logo/SkillboostLogo.svg'
import Background from '../assets/logo/Background.svg'
import qrcode from '../assets/logo/qrcode.svg'
import Copy from '../components/icons/Edit/Copy'
import Button from '../components/ui/button/Button'
import TextInput from '../components/ui/placeholder/TextInput'
import paid from '../assets/logo/paid.svg'

const ThanhToan2 = () => {
  //Hiển thị data dưới BE lên
  const [thongTinBaoGias, getThongTinBaoGias] = useState([]);

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

  return (

    <div className=''>
      <div className='absolute z-0 '>
        <img src={Background} alt="" />
      </div>

      <div className="relative z-10 flex flex-col ">
        <div className='py-[100px] w-full  items-center justify-center flex order-first'>
          <img src={SkillboostLogo} alt="" />
        </div>
        <div className=' bg-white py-[36px] px-[64px] rounded-lg self-center border border-sematic-green items-center justify-center flex flex-col 	'>
          <div className='headline-medium text-center  '>
            Thanh toán
          </div>
          <div className='flex flex-row mt-6 max-sm:flex-col max-sm:items-center max-sm:justify-center'>
            <div className='mr-14 max-sm:mr-0'>
              <img src={paid} alt="" />
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
                    <TextInput title='Mã giảm giá (nếu có) ' variant='ReadOnly'>{thongTinBaoGias.MaGiamGia}</TextInput>
                  </div>
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
              </div>
              <div className='body-large text-text-secondary flex flex-col pt-5'>
                Tổng tiền:
                <label for="" class="block mb-2  ">{formatAmountToVND(thongTinBaoGias.TongTien)}</label>
              </div>
            </div>
          </div>
        </div>


        <div className='flex justify-center space-x-[24px] mt-10 w-max self-center'>
          <div className='cursor-pointer block'>
            <Link to="/trangchu" className='ease-in-out'>
              <Button variant='Outlined'> Trở về trang chủ</Button>
            </Link>
          </div>
        </div>
      </div>



    </div >
  )
}

export default ThanhToan2