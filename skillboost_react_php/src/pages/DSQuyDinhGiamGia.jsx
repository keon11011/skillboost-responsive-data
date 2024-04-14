import axios from "axios"
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'

import SidebarQL from '../components/ui/sidebar/SidebarQL';
import HeaderAdmin from '../components/ui/header_footer/admin/headerad/HeaderAdmin';
import Pagination from '../components/ui/pagination/Pagination';
import ActionIcon from '../components/ui/button/ActionIcon'
import AddPlus from '../components/icons/Edit/AddPlus'
import SearchMagnifyingGlass from '../components/icons/Interface/SearchMagnifyingGlass'
import Filter from '../components/icons/Interface/Filter'
import ArrowDownUp from '../components/icons/Arrow/ArrowDownUp';
import SvgHamburgerMd from '../components/icons/Menu/HamburgerMd';
import ChevronRight from '../components/icons/Arrow/ChevronRight'
import DiscountListFilter from '../components/ui/SelectItems/DiscountListFilter';
import SearchBar from '../components/ui/placeholder/SearchBar';

const DSQuyDinhGiamGia = () => {
  const [qdgiamgias, setQdggs] = useState([]);
    useEffect(() => {
        getQdggs();
    }, []);

    function getQdggs() {
        axios.get('http://localhost:80/SkillBoost-API/api/QuyDinhGiamGia/read_all.php').then(function(response) {
            console.log(response.data);
            setQdggs(response.data);
        });
    }
  
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showDiscountListFilter, setDiscountListFilter] = useState(false);
  const [showOptionList, setShowOptionList] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const handleSearchIconClick = () => {
    setShowSearchBar(!showSearchBar);
  };

  const handleDiscountListFilterClick = () => {
    setDiscountListFilter(!showDiscountListFilter);
  };  

  const handleOptionIconClick = () => {
    setShowOptionList(!showOptionList);
  };

  const handleSortOptionSelect = (option) => {
    setSelectedSortOption(option);
  };

  return (
<main id = "DSQuyDinhGiamGia">
<div className='w-full bg-background-secondary flex'>
    <div id='Sidebar' className='sticky top-0 h-screen max-sm:relative'>
      <SidebarQL/>
    </div>
    <div id ="ContentContainer" className='w-full h-full sm:px-[64px] max-sm:px-[30px] sm:py-[32px] max-sm:py-[20px] space-y-[24px]'>
      <div className="max-sm:hidden">
        <HeaderAdmin>Quy định giảm giá</HeaderAdmin>
      </div>
      
      <div className="sm:hidden max-sm:font-bold max-sm:text-center max-sm:title-medium max-sm:text-text-primary">Quy định giảm giá</div>
      <div className='w-full h-full relative rounded-lg bg-background-primary shadow-[0px_4px_12px_rgba(0,_0,_0,_0.04)] flex-col items-start justify-between p-6 max-sm:pr-4 max-sm:pl-4 gap-[24px] '>
          <div className='pb-5 flex justify-between'>
            <div className="relative flex items-center sm:title-large max-sm:title-medium max-sm:w-[180px]">Danh sách quy định giảm giá</div>
            <div className="max-sm:hidden">{showSearchBar && <SearchBar previewText='Tìm kiếm hoạt động'/>}    </div>
            <div className='flex space-x-[16px] items-center'>
              <div className='cursor-pointer block'>
                  <Link to="/dsqdgg/taodsqdgg">
                    <ActionIcon size='Small' icon={<AddPlus width="1.25rem" height="1.25rem"/>}/>
                  </Link>
              </div>                 
              <ActionIcon size='Small' icon={<SearchMagnifyingGlass width="1.25rem" height="1.25rem"/>} onClick={handleSearchIconClick}/>
              <ActionIcon size='Small' icon={<Filter width="1.25rem" height="1.25rem"/>} onClick={handleDiscountListFilterClick}/>
              <ActionIcon size='Small' icon={<ArrowDownUp width="1.25rem" height="1.25rem"/>} onClick={handleOptionIconClick}/>
            </div>
            {showOptionList && (
                <div className="absolute top-[70px] right-[16px] z-50 bg-background-primary shadow-md rounded-md p-[12px]">
                <ul>
                    <li className='title-medium text-text-secondary p-[12px] text-right hover:bg-background-third cursor-pointer' onClick={() => handleSortOptionSelect('Option 1')}>Từ A-Z</li>
                    <li className='title-medium text-text-secondary p-[12px] text-right hover:bg-background-third cursor-pointer' onClick={() => handleSortOptionSelect('Option 2')}>Từ Z-A</li>
                    <li className='title-medium text-text-secondary p-[12px] text-right hover:bg-background-third cursor-pointer' onClick={() => handleSortOptionSelect('Option 3')}>Mới nhất</li>
                    <li className='title-medium text-text-secondary p-[12px] text-right hover:bg-background-third cursor-pointer' onClick={() => handleSortOptionSelect('Option 4')}>Cũ nhất</li>
                </ul>
              </div>
            )}
          </div>
          <div className='sm:hidden pb-5'>            
            {showSearchBar && <SearchBar previewText='Tìm kiếm hoạt động'/>}                     
          </div>
          <div className='flex-auto block pb-1'>
        <div className="overflow-x-auto  table-auto w-full flex flex-col space-y-[32px] h-auto">
          <table className="table-auto w-full" class="overflow-x-auto w-full rounded-lg border border-outline-table">
            <thead> 
            <tr class="title-small text-text-secondary text-center">
                  <th class="pb-3 px-5 max-sm:pl-5 py-3 text-left min-w-[100px] ">ID</th>
                  <th class="pb-3 px-3 py-3 text-left min-w-[250px] ">Mô tả</th>
                  <th class="pb-3 px-3 py-3 text-middle min-w-[150px]">Phần trăm giảm giá mặc định (%)</th>
                  <th class="pb-3 px-3 py-3 text-middle min-w-[150px] ">Phần trăm giảm giá tối đa (%)</th>
                  <th class="pb-3 px-3 py-3 text-middle min-w-[150px] ">Thời gian tạo</th>
                  <th class="pb-3 px-3 py-3 text-middle min-w-[150px] ">Tạo bởi</th>
                  <th class="pb-3 px-3 py-3 text-middle min-w-[50px] "> </th>
                </tr>             
            </thead>
            <tbody>
              {qdgiamgias.map((DSQDGG, key) => 
              <tr key ={key} className="body-medium text-text-primary border-t border-solid last:border-b-0 text-middle">
                <td class="text-left sm:pl-5 max-sm:pl-5 py-3 body-large">{DSQDGG.MaQuyDinhGiamGia}</td>
                <td class=" px-3 py-3 body-large text-left">{DSQDGG.MoTaLoaiGiamGia}</td>
                <td class=" px-3 py-3 body-large text-center">{DSQDGG.PhanTramGiamGiaMacDinh}</td>
                <td class=" px-3 py-3 body-large text-center">{DSQDGG.PhanTramGiamGiaToiDa}</td>
                <td class=" px-3 py-3 body-large text-center">{DSQDGG.TaoVaoLuc}</td>
                <td class=" px-3 py-3 body-large text-center">{DSQDGG.HoTenNV}</td>
                <td class="items-center text-center">
                <div className='cursor-pointer block'>
                    <Link to={`/dsqdgg/xemchitietdsqdgg/${DSQDGG.MaQuyDinhGiamGia}`}>
                        <ActionIcon size='Small' icon={<ChevronRight width="1rem" height="1rem"/>} />
                    </Link>
                </div>
                </td>
              </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      </div>
      
    </div>
</div>
    {showDiscountListFilter && 
      <div className="absolute top-[170px] max-sm:right-[30px] max-sm:left-[30px] sm:right-[60px] z-50">
          <DiscountListFilter/>
      </div>
    }
</main>
  )
}
export default DSQuyDinhGiamGia