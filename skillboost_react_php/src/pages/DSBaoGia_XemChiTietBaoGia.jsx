import axios from "axios"
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom'

import SidebarQL from '../components/ui/sidebar/SidebarQL';
import HeaderAdmin from '../components/ui/header_footer/admin/headerad/HeaderAdmin';
import LeadInfoTab from '../components/ui/tabs/LeadInfoTab';
import ActionIcon from '../components/ui/button/ActionIcon';
import Button from '../components/ui/button/Button';
import TextInput from '../components/ui/placeholder/TextInput';
import TextArea from '../components/ui/placeholder/TextArea';
import LeadProgressStatus from '../components/ui/chips/LeadProgressStatus';
import Nhantuvan from '../components/ui/header_footer/admin/progressbar/Nhantuvan';
import ActionPersonDetail from '../components/ui/button/ActionPersonDetail';
import AlertInfo from '../components/ui/inform/AlertInfo';
import InformSuccess from '../components/ui/inform/InformSuccess'
import InformFailure from '../components/ui/inform/InformFailure'

import ChevronLeft from '../components/icons/Arrow/ChevronLeft';
import CloseMd from '../components/icons/Menu/CloseMd'

const DSBaoGia_XemChiTietBaoGia = () => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const handleDelete = () => {
    // Show delete confirmation pop-up
    setShowDeleteConfirmation(true);
    // You can perform delete action here if needed
  };

  const handleCancelDelete = () => {
    // Hide delete confirmation pop-up
    setShowDeleteConfirmation(false);
  };

  //Hiển thị data dưới BE lên
  const [thongTinBaoGias, getThongTinBaoGias] = useState([]);
  const { baogiaid } = useParams();
 
  useEffect(() => {
    getBaoGia();
    console.log('ID use Params', baogiaid);
  }, []);

  function getBaoGia() {
    axios.get(`http://localhost:80/SkillBoost-API/api/BaoGia/read_single.php?MaBaoGia=${baogiaid}`).then(function (response) {
      console.log('Thông tin chi tiết báo giá của Lead', response.data);
      getThongTinBaoGias(response.data);
    });
  }

  //Đẩy khóa học YCTV lên bảng hiển thị
  const [selectedCourses, setSelectedCourses] = useState([]);

  useEffect(() => {
      getBaoGiaKhoaHoc();
  }, []);

  function getBaoGiaKhoaHoc() {
      axios.get(`http://localhost:80/SkillBoost-API/api/KhoaHoc/read_khoahoc_in_yctv.php?MaLead=${localStorage.getItem('MaLead')}`).then(function (response) {
          console.log('Khóa học trong YCTV của Lead', response.data);
          setSelectedCourses(response.data);
      });
  }

  //Kiểm tra trạng thái gửi email
  const [emailSent, setEmailSent] = useState(thongTinBaoGias.TrangThaiBaoGia = 'Chưa thanh toán' ? true : false);

  console.log(thongTinBaoGias.TrangThaiBaoGia)
  console.log(emailSent)


  //Ấn gửi email

  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setshowFailure] = useState(false);

  const handleOnClickEmailSend = (event) => {
    event.preventDefault();

    axios.patch('http://localhost:80/SkillBoost-API/api/BaoGia/sent_mail.php', {'MaBaoGia':thongTinBaoGias.MaBaoGia})
    .then(function(response) {
      console.log(response)

      console.log(response.data);
        setShowSuccess(true);
        setEmailSent(true);
        setTimeout(() => {
          setShowSuccess(false);
          navigate(`/`);
        }, 2000);
        })
        .catch(function(error) {
          console.error('Error occurred:', error);
          setshowFailure(true);
          setTimeout(() => {
            setshowFailure(false);
          }, 2000);
        })
    }

  return (
    <main id="DSBaoGia" className="w-full bg-background-secondary relative flex">
      <div id="Sidebar" className="sticky top-0 h-screen max-sm:relative">
        <SidebarQL />
      </div>
      <div id="ContentContainer" className="w-full h-full px-[64px] py-[32px] space-y-[24px]">
        <div id="Header">
          <HeaderAdmin progressBar={<Nhantuvan />}>{localStorage.getItem('HoTenLead')}</HeaderAdmin>
        </div>
        <div id="LeadInfoNavigation" className="flex space-x-[24px]">
          <div className="grow">
            <LeadInfoTab />
          </div>
          <LeadProgressStatus variant="DangTuVan" />
        </div>
        <div
          id="ContentInside"
          className="w-full h-full relative rounded-lg bg-background-primary shadow-[0px_4px_12px_rgba(0,_0,_0,_0.04)] p-[1.5rem] box-border gap-[1rem] space-y-[24px]"
        >
          <div id="Header" className="flex justify-between">
            <div className="flex space-x-[16px] items-center">
              <div className='cursor-pointer block'>
                  <Link to={`/lead/dsbaogia/${localStorage.getItem('MaLead')}`}>
                    <ActionIcon size="Medium" icon={<ChevronLeft width="1.5rem" height="1.5rem" />} />
                  </Link>
              </div>
              <div className="text-text-primary title-large">{thongTinBaoGias.TenBaoGia}</div>
            </div>
            {emailSent ? (
                <div className="flex space-x-[12px]">   
                <div className='cursor-pointer block'>
                    <Link to="/lead/dsbaogia/chinhsuabaogia">
                      <ActionPersonDetail variant="Edit" />
                    </Link>
                </div>
                <ActionPersonDetail variant="Delete" onClick={handleDelete} />
              </div>
              ) : (
                <div className="w-auto"></div>
              )}
          </div>
          <div id="Content" className="flex flex-col space-y-[24px] w-full h-full">
            <div>
              <TextInput variant="ReadOnly" title="Tên báo giá" previewText="Tên báo giá">
                {thongTinBaoGias.TenBaoGia}
              </TextInput>
            </div>
            <div className="space-y-[16px]">
              <div className="title-medium text-text-primary">Khóa học</div>
              <div id="Table" className="overflow-x-auto rounded-lg border border-outline-table">
                <table className="table-auto w-full">
                  <thead className="title-small text-text-secondary text-left">
                    <tr>
                      <th className="w-[649px] px-[16px] py-[24px]">Tên khóa học</th>
                      <th className="w-[649px] px-[16px] py-[24px]">Giảng viên</th>
                      <th className="w-[214px] px-[16px] py-[24px]">Giá tiền</th>
                    </tr>
                  </thead>
                  <tbody className="body-medium text-text-primary">
                  {selectedCourses.length > 0 ? (
                      selectedCourses.map((khoaHoc, key) => (
                        <tr className="hover:bg-background-secondary border-b border-t" key={key}>
                          <td className="px-[16px] py-[24px]">{khoaHoc.TenKhoaHoc}</td>
                          <td className="px-[16px] py-[24px]">{khoaHoc.GiangVien}</td>
                          <td className="w-[214px] px-[16px] py-[24px]">{khoaHoc.GiaTien}</td>
                        </tr>
                      ))
                    ) : (
                      <tr className="hover:bg-background-secondary border-b border-t">
                        <td colSpan={3} className="px-[16px] py-[24px]">Chưa có khóa học</td>
                      </tr>
                    )}
                    <tr className="border-b">
                      <td colspan="2" className="px-[16px] py-[24px] label-medium text-text-primary">
                        Tổng tiền:
                      </td>
                      <td className="px-[16px] py-[24px] label-medium text-brand-default">4.000.000đ</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex w-full space-x-[12px] items-center justify-end">
            <div className="flex w-full space-x-[12px] items-center justify-end">
              {emailSent ? (
                <Button variant="Primary" size="Medium" onClick={handleOnClickEmailSend}>
                  Gửi email
                </Button>
              ) : (
                <div className="body-medium text-text-secondary">Đã gửi email báo giá</div>
              )}
            </div>        
            </div>
          </div>
        </div>
        {showDeleteConfirmation && (
          <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-white bg-opacity-50">
            <div className="relative flex flex-col space-y-[24px] bg-white rounded-lg shadow-lg p-8">
              <div>
              <div className='flex w-full justify-center title-large text-text-primary'>Xác nhận xóa báo giá</div>
              <div className='absolute top-[36px] right-[36px]'>
              <ActionIcon size="Medium" icon={<CloseMd width="1.5rem" height="1.5rem" onClick={handleCancelDelete}/>} />
              </div>
              </div>
              <div className='flex flex-col space-y-[16px]'>
                <div className='h-[316px]'>
                  <TextArea title='Lý do xóa' previewText='Điền lý do'/>
                </div>
                <AlertInfo>Để xóa báo giá cần điền lý do xóa</AlertInfo>
              </div>
              <Button variant="Destructive" size='Big' onClick={handleDelete}>Xác nhận xóa</Button>
            </div>
          </div>
        )}
      </div>
      {showSuccess && <InformSuccess>Gửi Email báo giá thành công</InformSuccess>}
      {showFailure && <InformFailure>Gửi Email báo giá Lead thất bại</InformFailure>}
    </main>
  );
};

export default DSBaoGia_XemChiTietBaoGia;
