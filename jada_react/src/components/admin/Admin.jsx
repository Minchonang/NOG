import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../App';
import Header from '../common/jsx/Header';
import common from '../common/css/common.module.css';
import AdminNav from '../common/jsx/AdminNav.jsx';

import UserList from './UserList';
import Inquiry from './Inquiry';
import NogiAnalysis from './NogiAnalysis';
import swal from 'sweetalert';

function Admin() {
   const [currentTab, setCurrentTab] = useState('문의사항');
   const [userRole, setUserRole] = useState('');

   useEffect(() => {
      // 컴포넌트가 마운트될 때 한 번만 호출되도록 useEffect 사용
      getUserRole();
   }, []);

   const handleTabChange = (tab) => {
      setCurrentTab(tab);
   };

   const userId = sessionStorage.getItem('user_id');

   const getUserRole = async () => {
      try {
         const response = await fetch(`${API_BASE_URL}/api/userinfo/getRole`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: userId,
         });

         if (response.ok) {
            const result = await response.json();
            // console.log("Response Data(role):", result.role);
            setUserRole(result.role);

            if (!result.role) {
               // userRole이 "1"이 아닌 경우 알림 창 띄우고 접근 차단
               swal('', '접근 권한이 없습니다.', 'error');
               window.location.href = '/'; // 혹은 다른 페이지로 리다이렉트
            }
         } else {
            console.log('서버 오류');
         }
      } catch (error) {
         console.error('서버 통신 오류', error);
      }
   };

   return (
      <div className={common.background}>
         {userRole && (
            <>
               <AdminNav currentTab={currentTab} onTabChange={handleTabChange} />
               <Header sub_title="관리자" />

               {currentTab === '회원정보' && <UserList currentTab={currentTab} />}
               {currentTab === '문의사항' && <Inquiry currentTab={currentTab} />}
               {currentTab === '유저분석' && <NogiAnalysis currentTab={currentTab} />}
            </>
         )}
      </div>
   );
}

export default Admin;
