import axios from "axios";
import { useEffect, useState} from "react";
import { Link, useNavigate } from 'react-router-dom'

import BackgroundGradient from '../assets/img/BackgroundGradient.svg';
import SkillboostLogo from '../assets/logo/SkillboostLogo.svg';

import TextInput from '../components/ui/placeholder/TextInput';
import Button from '../components/ui/button/Button';
import InformFailure from '../components/ui/inform/InformFailure'

import Hide from '../components/icons/Edit/Hide';

const DangNhap = () => {

    //var _MaNV = '3';
    // localStorage.setItem('MaNV',_MaNV);
    // console.log(localStorage.getItem('MaNV'));

  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevVisible) => !prevVisible);
  };

  //Thông tin đăng nhập
  const [thongTinDangNhap, setThongTinDangNhap] = useState({})

  const handleTextChange = (event) => {
    const id = event.target.id;
    const value = event.target.value;
    setThongTinDangNhap(values => ({...values, [id]: value}));
  }

  const navigate = useNavigate();

  const [showFailure, setshowFailure] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
  
    axios.post('http://localhost:80/SkillBoost-API/api/TaiKhoan/validate.php', thongTinDangNhap)
      .then(function(response){
        console.log('Kết quả trả về', response.data);
  
        if (response.data.valid === true) { // Adjusted condition
          navigate(`/dashboard`);
        } else {
          console.error('Validation failed');
          setshowFailure(true);
          setTimeout(() => {
            setshowFailure(false);
          }, 2000);
        }
      })
      .catch(function(error) { // Added error handling
        console.error('Error occurred:', error);
        setshowFailure(true);
        setTimeout(() => {
          setshowFailure(false);
        }, 2000);
      });
  }

  console.log('Thông tin đăng nhập',thongTinDangNhap)

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-no-repeat bg-cover bg-[url('./assets/logo/Background.svg')] relative">
      <div className="relative mb-[56px] w-auto cursor-pointer">
        <Link to="/trangchu">
          <img
            src={SkillboostLogo}
            alt="Logo"
          />
        </Link>
      </div>
      <div className="relative z-10 bg-background-primary w-[540px] p-[36px] rounded-2xl shadow-md flex flex-col items-center justify-center space-y-[36px]">
        <div className="flex flex-col space-y-8 w-full">
          <div className="flex w-full justify-center headline-small text-text-primary">
            Đăng nhập
          </div>
          <form className="w-full space-y-[36px]" onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-8">
              <TextInput id='email' title="Email" previewText="Email" onChange={handleTextChange}/>
              <TextInput
                id='password'
                title="Mật khẩu"
                previewText="Mật khẩu"
                rightIcon={
                  <Hide
                    width="1.25rem"
                    height="1.25rem"
                    strokeWidth={1.5}
                    stroke="#5E6A6E"
                  />
                }
                onClickRightIcon={togglePasswordVisibility}
                onChange={handleTextChange}
                type={passwordVisible ? 'text' : 'password'}
              />
            </div>
            <div className="flex w-full justify-center">
              <Button type='submit' size="Big" stretch="full">
                Đăng nhập
              </Button>
            </div>
          </form>
        </div>
      </div>
      {showFailure && <InformFailure>Thông tin đăng nhập bị sai, vui lòng thử lại</InformFailure>}
    </main>
  );
};

export default DangNhap;
