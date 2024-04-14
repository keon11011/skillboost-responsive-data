import axios from "axios";
import { useEffect, useState} from "react";
import { Link, useParams, useNavigate } from 'react-router-dom'

import SidebarQL from '../components/ui/sidebar/SidebarQL'
import HeaderAdmin from '../components/ui/header_footer/admin/headerad/HeaderAdmin'
import LeadInfoTab from '../components/ui/tabs/LeadInfoTab'
import ActionIcon from '../components/ui/button/ActionIcon'
import Button from '../components/ui/button/Button'
import DropDown from '../components/ui/placeholder/DropDown'
import TextInput from '../components/ui/placeholder/TextInput'
import TextArea from '../components/ui/placeholder/TextArea'
import LeadProgressStatus from '../components/ui/chips/LeadProgressStatus'
import Nhantuvan from '../components/ui/header_footer/admin/progressbar/Nhantuvan'
import CourseSelectorNew from '../components/ui/SelectItems/CourseSelectorNew'
import DiscountListFilter from '../components/ui/SelectItems/DiscountListFilter';

import AddPlus from '../components/icons/Edit/AddPlus'
import ChevronLeft from '../components/icons/Arrow/ChevronLeft'

import InformSuccess from '../components/ui/inform/InformSuccess'
import InformFailure from '../components/ui/inform/InformFailure'

const DSBaoGia_TaoBaoGia = () => {
  const [showPromotionInputs, setShowPromotionInputs] = useState(false);
  const [showEmailInputs, setShowEmailInputs] = useState(false);
  
  const [selectedDoiTuongUuTien, setSelectedDoiTuongUuTien] = useState(null);
  const [selectedDipDacBiet, setSelectedDipDacBiet] = useState(null);

  // Lấy cả quy định giảm giá nữa
  const handleAddPromotionClick = () => {
    setShowPromotionInputs(!showPromotionInputs);
  };

  const handleEmailClick = () => {
    setShowEmailInputs(!showEmailInputs);
  };

  //Hiển thị data khóa học
  //const [baoGiaKhoaHocs, setBaoGiaKhoaHocs] = useState([]);
  //Tạo mảng chứa khóa học đc chọn
  const [selectedCourses, setSelectedCourses] = useState([]);

    const { leadid } = useParams();

    useEffect(() => {
        getBaoGiaKhoaHoc();
    }, []);

    function getBaoGiaKhoaHoc() {
        axios.get(`http://localhost:80/SkillBoost-API/api/KhoaHoc/read_khoahoc_in_yctv.php?MaLead=${leadid}`).then(function (response) {
            console.log(response.data);
            setSelectedCourses(response.data);
        });
    }




    // Tính tổng tiền trước giảm giá
    const calculateTotalCostBeforeDiscount = () => {
      let totalCost = 0;

      selectedCourses.forEach((khoaHoc) => {
        totalCost += parseFloat(khoaHoc.GiaTien);
      });

      return totalCost;
    };

    //Tính tổng tiền sau giảm giá
    const calculateTotalCost = () => {
      let totalCost = 0;

      selectedCourses.forEach((khoaHoc) => {
        totalCost += parseFloat(khoaHoc.GiaTien);
      });

      if (dcount !== null) {
        const discountFactor = dcount / 100; 
        totalCost = totalCost * (1 - discountFactor); 
      }

      return totalCost;
    };




    //Hiển thị thêm khóa học
    const [showCourseSelector, setShowCourseSelector] = useState(false);

    const handleCourseSelectorClick = () => {
 
      let totalCostBeforeDiscount = calculateTotalCostBeforeDiscount();

      let totalCost = calculateTotalCostBeforeDiscount();

      setTongTienTruocGiam(totalCostBeforeDiscount);

      if (dcount !== null) {
        const discountFactor = dcount / 100;
        totalCost = totalCost * (1 - discountFactor);
      }

      setTongTien(totalCost);

      console.log('Tổng tiền sau cùng:', totalCost);

      setShowCourseSelector(!showCourseSelector);
    };
  
  
    const handleCourseSelection = (selectedCourses) => {
      console.log("Khóa học được chọn:", selectedCourses); // Check if this logs the selected courses array
      setSelectedCourses(selectedCourses);
    };

    // Tạo mảng chứa quy định giảm giá
    const [qdggs, setQDGGs] = useState([]);
    useEffect(() => {
      getQDGGs();
    }, []);

    function getQDGGs() {
        axios.get('http://localhost:80/SkillBoost-API/api/QuyDinhGiamGia/read_sort.php').then(function(response) {
            //console.log(response.data);
            setQDGGs(response.data);
        });
    }
    //console.log('qdgg vừa lấy ra', qdggs);

    // Tạo số khóa học mua chung
    const [selectedCoursesLength, setSelectedCoursesLength] = useState(0);
    useEffect(() => {
      setSelectedCoursesLength(selectedCourses.length);
      localStorage.setItem('SoLuongKhoaHocDangKy', selectedCourses.length);
      
    }, [selectedCourses]);  
      //console.log('số khóa học mua chung', selectedCoursesLength);

    // lấy Lead lên để lấy nghề nghiệp
    const [lead, setLead] = useState([]);
    const [leadNgheNghiep, setLeadNgheNghiep] = useState('');
  
    useEffect(() => {
      getLead();
    }, []);

    function getLead() {
      axios.get(`http://localhost:80/SkillBoost-API/api/Lead/read_single.php?MaLead=${leadid}`).then(function (response) {
        //console.log('Data lead', response.data);
        setLead(response.data);
      });
    }

    useEffect(() => {
      setLeadNgheNghiep(lead.MaNgheNghiep);
    }, [lead]);  

    //console.log("mã nghề nghiệp của lead là:", leadNgheNghiep);

    // Lấy hàng quy định giảm giá và biến thỏa quy định giảm giá
    const[qdggThoa, setQDGGThoa] = useState(false);

    // Dịp đặc biệt
    const [specialOccasion, setSpecialOccasion] = useState('Không');

    // Mảng chứa phần trăm giảm giá nhân viên có thể chọn
    const [discountArray, setDiscountArray] = useState([]);

    const evaluateDiscountConditions = () => {
      let discountFound = false;
      let currentRule = null;

      const foundQDGG = qdggs.find(dr => {
          const qdSoLuongKhoaHocDangKy = parseInt(dr.SoLuongKhoaHocDangKy);
          const qdNgheNghiep = dr.MaNgheNghiep;
          const strNgayBatDau = dr.NgayBatDau;
          const strNgayKetThuc = dr.NgayKetThuc;

          // Convert string dates to Date objects
          const qdNgayBatDau = strNgayBatDau ? new Date(strNgayBatDau) : null;
          const qdNgayKetThuc = strNgayKetThuc ? new Date(strNgayKetThuc) : null;
          const currentDate = new Date();

          
          if (qdNgayBatDau == null && qdNgayKetThuc == null)
            {
              setSpecialOccasion('Không');
            }
            else
            {
              setSpecialOccasion('Có');
            }

          return (selectedCoursesLength >= qdSoLuongKhoaHocDangKy) &&
          ((leadNgheNghiep == null) || (leadNgheNghiep == qdNgheNghiep)) &&
          ((qdNgayBatDau == null && qdNgayKetThuc == null) || (currentDate >= qdNgayBatDau && currentDate <= qdNgayKetThuc))
          
          
      });
      if(foundQDGG){
          console.log("Quy định giảm giá tìm được:", foundQDGG);
          currentRule = foundQDGG;
          setQDGGThoa(true);
          discountFound = true;

          setMaGiamGiaInputs(values => ({...values, 'MaQuyDinhGiamGia': currentRule.MaQuyDinhGiamGia}));
      }
      if (discountFound == true) {
        const newDiscountArray = [];
        for (let discount = currentRule.PhanTramGiamGiaMacDinh; discount <= currentRule.PhanTramGiamGiaToiDa; discount += 5) {
            newDiscountArray.push(discount);
        }
        setDiscountArray(newDiscountArray);
        console.log('array mã giảm giá nè', newDiscountArray);
      }
      else{
        //setQDGGThoa(false);
        setDiscountArray([]);
      }
  };
  
    useEffect(() => {
        evaluateDiscountConditions();
        // console.log('Dịp đặc biệt', specialOccasion);
        // console.log('Quy định giảm giá được chọn', qdggRow);
        // console.log('Có mã giảm giá hay không?', qdggThoa);

        localStorage.setItem('DipDacBiet', specialOccasion);

    }, [selectedCoursesLength]);

    // Phần trăm giảm giá thực tế
    const[dcount, setDcount] = useState(null);

    //Phần trăm giảm giá Dropdown
    const handlePhanTramGiamGiaChange = (event) => {
    const id = 'PhanTramGiamGia';
    if (qdggThoa) {
        setDcount(event.value);
        setMaGiamGiaInputs(values => ({...values, 'PhanTramGiamGia': event.value}));
        setBaoGiaInputs(values => ({...values, 'PhanTramGiamGia': event.value}));
        localStorage.setItem('PhanTramGiamGia', event.value);
    } else {
        setDcount(null);
        localStorage.setItem('PhanTramGiamGia', 'Không tìm thấy mã giảm giá phù hợp');
    }
      //setInputs(values => ({...values, [id]: event.value}));
    }

    //console.log("Phần trăm giảm giá được chọn = ", dcount);

    //Xử lý ấn nút button Submit
    const[maGiamGiaInputs, setMaGiamGiaInputs] = useState({});
    const[baoGiaInputs, setBaoGiaInputs] = useState({'MaLead': leadid});
    const[TongTienTruocGiam, setTongTienTruocGiam] = useState(null);
    const[TongTien, setTongTien] = useState(null);

    const [showTaoMaGiamGiaSuccess, setShowTaoMaGiamGiaSuccess] = useState(false);
    const [showTaoMaGiamGiaFailure, setshowTaoMaGiamGiaFailure] = useState(false);
    const [showTaoBaoGiaSuccess, setShowTaoBaoGiaSuccess] = useState(false);
    const [showTaoBaoGiaFailure, setShowTaoBaoGiaFailure] = useState(false);

    useEffect(() => {
      setBaoGiaInputs(values => ({
          ...values,
          'HoTenLead': lead.HoTenLead,
          'TongTien': TongTien,
          'TongTienTruocGiam': TongTienTruocGiam,

      }));
  }, [lead.HoTenLead, TongTien]);

  // useEffect(() => {
  //   console.log('Tổng tiền sau giảm:', TongTien);
  // }, [handleCourseSelectorClick]);
  

    // Xử lý TextInput
    const handleTextChange = (event) => {
      const id = event.target.id;
      const value = event.target.value;
      setBaoGiaInputs(values => ({...values, [id]: value}));
    }


    const navigate = useNavigate()

    const handleSubmit = (event) => {
      event.preventDefault();
      
      if (qdggThoa == true) {
        // Tạo mã giảm giá mới
        axios.post('http://localhost:80/SkillBoost-API/api/MaGiamGia/create.php', maGiamGiaInputs)
          .then(function(response1) {
            console.log('Post Mã giảm giá', response1.data);
    
            // Lấy id của mã giảm giá mới tạo
            axios.get('http://localhost:80/SkillBoost-API/api/MaGiamGia/read_new.php')
              .then(function(response2) {
                console.log('ID của mã giảm giá mới tạo', response2.data);
    
                // Thêm trường MaGiamGia vào inputs Báo giá
                const updatedBaoGiaInputs = { ...baoGiaInputs, 'MaGiamGia': response2.data.MaGiamGia };
                setBaoGiaInputs(updatedBaoGiaInputs);
    
                // Tạo báo giá mới
                axios.post('http://localhost:80/SkillBoost-API/api/BaoGia/create.php', updatedBaoGiaInputs)
                  .then(function(response3) {
                    console.log(response3.data);
    
                    // Lấy id của báo giá mới tạo
                    axios.get('http://localhost:80/SkillBoost-API/api/BaoGia/read_new.php')
                      .then(function(response4) {
                        console.log('ID của báo giá mới tạo', response4.data);

                        // Thêm khóa học vào bảng ChiTietKhoaHocThuocBaoGia
                        selectedCourses.forEach(item => {
                          axios.post('http://localhost:80/SkillBoost-API/api/ChiTietKhoaHocThuocBaoGia/create.php', item)
                            .then(function(response5){
                              console.log('Khóa học thuộc Báo giá', response5.data);

                              // Sửa lại mã báo giá trong bảng ChiTietKhoaHocThuocBaoGia
                              axios.patch('http://localhost:80/SkillBoost-API/api/ChiTietKhoaHocThuocBaoGia/update_mabaogia.php', response4.data)
                                .then(function(response6){
                                  console.log('Đổi Mã báo giá', response6.data);
                                  setShowTaoBaoGiaSuccess(true);
                                  setTimeout(() => {
                                    setShowTaoBaoGiaSuccess(false);
                                    navigate(`/lead/dsbaogia/${localStorage.getItem('MaLead')}/xemchitietbaogia/${response4.data.MaBaoGia}`)
                                  }, 2000);
            
                            })
                              .catch(function(error6) {
                                console.error('Error Update id BaoGia in ChiTietKhoaHocThuocBaoGia:', error6);
                                // Handle error here, such as showing a failure message or taking other appropriate action.
                            });
                            })
                            .catch(function(error5) {
                              console.error('Error Post ChiTietKhoaHocThuocBaoGia:', error5);
                            })
                        });
                      })
                      .catch(function(error4) {
                        console.error('Error Get id báo giá mới occurred:', error4);
                      });
                  })
                  .catch(function(error3) {
                    console.error('Error Tạo báo giá occurred:', error3);
                    setShowTaoBaoGiaFailure(true);
                    setTimeout(() => {
                      setShowTaoBaoGiaFailure(false);
                    }, 2000);
                  });
              })
              .catch(function(error2) {
                console.error('Error Get id mã giảm giá mới occurred:', error2);
              });
          })
          .catch(function(error1) {
            console.error('Error Tạo mã giảm giá occurred:', error1);
            setShowTaoMaGiamGiaFailure(true);
            setTimeout(() => {
              setShowTaoMaGiamGiaFailure(false);
            }, 2000);
          });
      }

      if(qdggThoa == false){
        // Nếu không có mã giảm giá
      //console.log('baoGiaInputs không có mã giảm giá', baoGiaInputs);
      // Tạo báo giá mới
      axios.post('http://localhost:80/SkillBoost-API/api/BaoGia/create.php', baoGiaInputs)
      .then(function(response7) {
        console.log('Báo giá mới tạo (không mã giảm giá)', response7.data);

        // Lấy id của báo giá mới tạo
        axios.get('http://localhost:80/SkillBoost-API/api/BaoGia/read_new.php')
          .then(function(response8) {
            console.log('ID của báo giá mới tạo (không mã giảm giá)', response8.data);

            // Thêm khóa học vào bảng ChiTietKhoaHocThuocBaoGia
            selectedCourses.forEach(item => {
              axios.post('http://localhost:80/SkillBoost-API/api/ChiTietKhoaHocThuocBaoGia/create.php', item)
                .then(function(response9){
                  console.log('Khóa học thuộc Báo giá (không mã giảm giá)', response9.data);

                  // Sửa lại mã báo giá trong bảng ChiTietKhoaHocThuocBaoGia
                  axios.patch('http://localhost:80/SkillBoost-API/api/ChiTietKhoaHocThuocBaoGia/update_mabaogia.php', response8.data)
                    .then(function(response10){
                      console.log('Đổi Mã báo giá (không mã giảm giá)', response10.data);
                      setShowTaoBaoGiaSuccess(true);

                      setTimeout(() => {
                        setShowTaoBaoGiaSuccess(false);
                        navigate(`/lead/dsbaogia/${localStorage.getItem('MaLead')}/xemchitietbaogia/${response8.data.MaBaoGia}`)
                      }, 2000);

                })
                  .catch(function(error10) {
                    console.error('Error Update id BaoGia in ChiTietKhoaHocThuocBaoGia: (không mã giảm giá)', error10);
                    // Handle error here, such as showing a failure message or taking other appropriate action.
                });
                })
                .catch(function(error9) {
                  console.error('Error Post ChiTietKhoaHocThuocBaoGia: (không mã giảm giá)', error9);
                })
            });
          })
          .catch(function(error8) {
            console.error('Error Get id báo giá mới occurred: (không mã giảm giá)', error8);
          });
      })
      .catch(function(error7) {
        console.error('Error Tạo báo giá occurred: (không mã giảm giá)', error7);
        setShowTaoBaoGiaFailure(true);
        setTimeout(() => {
          setShowTaoBaoGiaFailure(false);
        }, 2000);
      });
      }
  
      // Log thằng local storage
      // console.log('Local Storage Số lượng khóa học mua chung', localStorage.getItem('SoLuongKhoaHocDangKy'));
      // console.log('Local Storage Dịp đặc biệt', localStorage.getItem('DipDacBiet'));
      // console.log('Local Storage Phần trăm giảm giá', localStorage.getItem('PhanTramGiamGia'));
    };
    


  return (
    <main id='DSBaoGia' className='w-full bg-background-secondary flex'>
      <div id='Sidebar' className='sticky top-0 h-screen  max-sm:relative'>
        <SidebarQL/>
      </div>
      <div id='ContentContainer' className='w-full h-full px-[64px] py-[32px] space-y-[24px]'>
        <div id='Header'>
          <HeaderAdmin progressBar={<Nhantuvan />}>{localStorage.getItem('HoTenLead')}</HeaderAdmin>
        </div>
        <div id='LeadInfoNavigation' className='flex space-x-[24px]'>
          <div className='grow'><LeadInfoTab/></div>
          <LeadProgressStatus variant='DangTuVan' />
        </div>
        <div id='ContentInside' className="w-full h-full rounded-lg bg-background-primary shadow-[0px_4px_12px_rgba(0,_0,_0,_0.04)] p-[1.5rem] box-border gap-[1rem] space-y-[24px]">
        <form onSubmit={handleSubmit} className="space-y-[24px]">
          <div id='Header' className='flex items-center space-x-[16px]'>
            <div className='cursor-pointer block'>
                <Link to={`/lead/dsbaogia/${leadid}`}>
                  <ActionIcon size='Medium' icon={<ChevronLeft width="1.5rem" height="1.5rem"/>}/>
                </Link>
            </div>
            <div className='text-text-primary title-large'>Tạo báo giá</div>
          </div>
          <div id='Content' className='flex flex-col space-y-[24px] w-full h-full'>
            <div>
              <TextInput 
                id='TenBaoGia'
                title='Tên báo giá' 
                previewText='Nhập tên báo giá'
                onChange={handleTextChange}
              >
              </TextInput>
            </div>
            <div className='space-y-[16px]'>
              <div className='title-medium text-text-primary'>Khóa học</div>
              <div id='Table' className="overflow-x-auto rounded-lg border border-outline-table">
                <table className="table-auto w-full">
                  <thead className='title-small text-text-secondary text-left'>
                    <tr>
                      <th className="w-[649px] px-[16px] py-[24px]">Tên khóa học</th>
                      <th className="w-[649px] px-[16px] py-[24px]">Giảng viên</th>
                      <th className="w-[214px] px-[16px] py-[24px]">Giá tiền</th>
                    </tr>
                  </thead>
                  <tbody className='body-medium text-text-primary'>
                  {selectedCourses.map((khoaHoc, key) =>
                    <tr className="hover:bg-background-secondary border-b border-t" key={key}>
                      <td className="px-[16px] py-[24px]">{khoaHoc.TenKhoaHoc}</td>
                      <td className="px-[16px] py-[24px]">{khoaHoc.GiangVien}</td>
                      <td className="w-[214px] px-[16px] py-[24px]">{khoaHoc.GiaTien}</td>
                    </tr>
                  )}
                  <tr>
                    <td colSpan="2" className="px-[16px] py-[24px]">Tổng tiền</td>
                    <td className="px-[16px] py-[24px] text-brand-default title-medium font-bold">{calculateTotalCost()}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="px-[16px] py-[16px] border-t">
                      <Button variant='Neutral' size='Medium' leftIcon={<AddPlus width="1.25rem" height="1.25rem" strokeWidth={1.5}/>} onClick={handleCourseSelectorClick}>
                        Thêm khóa học
                      </Button>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
            {showPromotionInputs ? (
              <>
                <div className='title-medium text-text-primary'>Khuyến mãi</div>
                <div className='flex overflow-x-auto w-full space-x-[16px] '>
                  <TextInput 
                    title="Số khóa học mua chung" 
                    previewText="Nhập số khóa học" 
                    value={selectedCoursesLength} 
                    type="text"
                  />
                  {/* <DropDown
                    title="Đối tượng ưu tiên"
                    previewText="Chọn đối tượng ưu tiên"
                    options={["Học sinh - Sinh Viên", "Giảng viên đại học", "Không có"]}
                    selectedOption={selectedDoiTuongUuTien}
                    setSelectedOption={setSelectedDoiTuongUuTien}
                  /> */}
                  <TextInput 
                    title="Đối tượng ưu tiên" 
                    previewText="Chọn đối tượng ưu tiên" 
                    value={lead.TenNgheNghiep} 
                    type="text"
                  />
                  {/* <DropDown
                    title="Dịp đặc biệt"
                    previewText="Chọn dịp đặc biệt"
                    options={["Ngày lễ", "Không có"]}
                    selectedOption={selectedDipDacBiet}
                    setSelectedOption={setSelectedDipDacBiet}
                  /> */}
                  <TextInput 
                    title="Dịp đặc biệt" 
                    previewText="Chọn dịp đặc biệt" 
                    value={specialOccasion} 
                    type="text"
                  />
                </div>
                <div className='flex w-1/3 pr-[16px]'>
                  {qdggThoa ? (
                      // Render DropDown if qdggThoa is true
                      <DropDown
                          id="PhanTramGiamGia"
                          title="Phần trăm giảm giá (%)"
                          previewText="Chọn Phần trăm giảm giá (%)"
                          options={discountArray.map(i => ({
                            value: i, 
                            label:i
                        }))}
                          onHandleChange={handlePhanTramGiamGiaChange}
                      />
                  ) : (
                      <TextInput
                          title="Phần trăm giảm giá (%)"
                          previewText="Nhập phần trăm giảm giá"
                          value="Không tìm thấy mã giảm giá phù hợp!"
                      />
                  )}
                </div>
                <div className='flex'>
                  <Button variant='Neutral' size='Medium' onClick={handleAddPromotionClick}>Ẩn khuyến mãi</Button>
                </div>
              </>
            ) : (
              <div className='space-y-[16px]'>
                <div className='title-medium text-text-primary'>Khuyến mãi</div>
                <Button variant='Neutral' size='Medium' leftIcon={<AddPlus width="1.25rem" height="1.25rem" strokeWidth={1.5} />} onClick={handleAddPromotionClick}>Thêm khuyến mãi</Button>
              </div>
            )}
            {showEmailInputs ? (
              <div className='space-y-[16px]'>
                <div className='title-medium text-text-primary'>Email báo giá</div>
                <TextArea
                  previewText="Email báo giá"
                />
                <Button variant='Neutral' size='Medium' onClick={handleEmailClick}>Ẩn email</Button>
              </div>
            ) : (
              <div className='space-y-[16px]'>
                <div className='title-medium text-text-primary'>Email báo giá</div>
                <Button variant='Neutral' size='Medium' leftIcon={<AddPlus width="1.25rem" height="1.25rem" strokeWidth={1.5}/>} onClick={handleEmailClick}>Tạo email</Button>
              </div>
            )}
            <div className='flex w-full space-x-[12px] items-center justify-end'>
              <div className='cursor-pointer block'>
                  <Link to="/lead/dsbaogia">
                    <Button variant='Destructive-plain' size='Medium'>Hủy chỉnh sửa</Button>
                  </Link>
              </div>
              <Button type='submit' variant='Primary' size='Medium'>Lưu thay đổi</Button>
            </div>
          </div>
        </form>
          </div>
      </div>
      {showCourseSelector && (
        <div className="absolute top-[170px] left-[520px] z-50">
          <CourseSelectorNew
            onSubmit={handleCourseSelection}
            onCancel={setShowCourseSelector}
          />
        </div>
        )}
      {showTaoMaGiamGiaSuccess && <InformSuccess>Tạo mã giảm giá mới thành công</InformSuccess>}
      {showTaoMaGiamGiaFailure && <InformFailure>Tạo mã giảm giá mới thất bại</InformFailure>}
      {showTaoBaoGiaSuccess && <InformSuccess>Tạo báo giá mới thành công</InformSuccess>}
      {showTaoBaoGiaFailure && <InformFailure>Tạo báo giá mới thất bại</InformFailure>}
    </main>
  );
};

export default DSBaoGia_TaoBaoGia;