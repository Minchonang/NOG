import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../App.js';
import axios from 'axios';
import style from './css/UserList.module.css';

function UserList() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [totalUsers, setTotalUsers] = useState('');

    // 휴대폰 번호를 010-0000 형식으로 변경
    function formatPhone(userPhone) {
        const part1 = userPhone.slice(0, 3);
        const part2 = userPhone.slice(3, 7);
        const part3 = userPhone.slice(7);

        return `${part1}-${part2}-${part3}`;
    }

    //   ----------------------------------
    //   회원정보 가져오기
    useEffect(() => {
        axios
            .get(`${API_BASE_URL}/api/userinfo/get`)
            .then((response) => {
                // setUsers(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data: ', error);
            });
        // 전체 회원 수 가져오기
        axios
            .get(`${API_BASE_URL}/api/userinfo/count`)
            .then((response) => {
                setTotalUsers(response.data);
            })
            .catch((error) => {
                console.error('Error fetching user count: ', error);
            });

        // 유저 회원 정보 가져오기
        // async function fetchUsers() {
        //     try {
        //         const response = await fetch('/api/userinfo/allusers');
        //         if (response.ok) {
        //             const data = await response.json();
        //             setUsers(data);
        //         } else {
        //             console.error('서버 연결 실패');
        //         }
        //     } catch (error) {
        //         console.error('네트워크 문제:', error);
        //     }
        // }
        // fetchUsers();
    }, []);

    //   ----------------------------------
    //   회원상세정보
    const handleUserClick = (user) => {
        setSelectedUser(user);
    };

    const handleCloseModal = () => {
        setSelectedUser(null);
    };

    //   ----------------------------------
    //   회원검색
    const handleSearch = async () => {
        if (!searchTerm) {
            // 검색어가 없으면 모든 회원을 조회합니다.
            try {
                const response = await axios.get(`${API_BASE_URL}/api/userinfo/get`);
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        } else {
            // 검색어가 있으면 해당하는 회원을 조회합니다.
            const searchedUsers = users.filter(
                (user) => user.name.includes(searchTerm) || user.id.includes(searchTerm)
            );
            setUsers(searchedUsers);
        }
    };

    //   ----------------------------------
    // 회원삭제
    const handleDeletion = async () => {
        if (selectedUser) {
            // user_id를 가져오기
            const user_id = selectedUser.id;

            const editUserDto = {
                user_id: user_id,
            };

            try {
                const response = await fetch(`${API_BASE_URL}/api/userinfo/userdelete`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(editUserDto),
                });

                if (response.ok) {
                    alert('회원삭제가 완료되었습니다.');
                    handleCloseModal();
                    axios
                        .get(`${API_BASE_URL}/api/userinfo/get`)
                        .then((response) => {
                            setUsers(response.data);
                        })
                        .catch((error) => {
                            console.error('Error fetching data: ', error);
                        });
                } else {
                    alert('회원삭제에 실패했습니다. 다시 시도해주세요.');
                }
            } catch (error) {
                console.error('회원삭제 중 오류가 발생했습니다.', error);
            }
        } else {
            // Handle the case where selectedUser is null
            console.error('Selected user is null. Cannot delete.');
        }
    };

    return (
        <div className={style.main_area}>
            <div className={style.title}>
                <div>회원목록</div>
            </div>

            <div className={style.searchBox}>
                <input
                    type="text"
                    className={style.searchInput}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="ID 또는 이름 검색"
                />
                <button className={style.searchButton} onClick={handleSearch}>
                    검색
                </button>
            </div>

            <div className={style.userList_container}>
                <div className={style.userList_table}>
                    <table>
                        <tbody>
                            <tr className={style.userList_title}>
                                <td>ID</td>
                                <td>이름</td>
                                <td>기기 정보</td>
                            </tr>
                            {users.map((user) => (
                                <tr key={user.id} onClick={() => handleUserClick(user)}>
                                    <td>{user.id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.homeId}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className={style.totalMember} style={{ textAlign: 'center' }}>
                    전체 회원 수: {totalUsers}명
                </div>
            </div>
            {selectedUser && (
                <div className={style.custom_modal}>
                    <div className={style.modal_container}>
                        <div className={style.modal_title}>{selectedUser.id}의 정보</div>
                        <div className={style.modal_content}>
                            <p>이름: {selectedUser.name}</p>
                            <p>이메일: {selectedUser.email}</p>
                            <p>번호: {formatPhone(selectedUser.phone)}</p>
                            <p>
                                지역: {selectedUser.address1} {selectedUser.address2}
                            </p>
                            <p>시리얼번호: {selectedUser.serialNum}</p>
                            <p>가입일자: {new Date(selectedUser.creDateTime).toLocaleString('ko-KR')}</p>
                        </div>
                        <button className={style.close_btn} onClick={handleCloseModal}>
                            닫기
                        </button>
                        <button className={style.delete_btn} onClick={handleDeletion}>
                            회원삭제
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserList;
