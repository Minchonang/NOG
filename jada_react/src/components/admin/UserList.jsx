import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../../App.js";
import axios from "axios";
import style from "./css/UserList.module.css";
import LoadingNog from "../common/jsx/LoadingNog";

function UserList() {
	const [users, setUsers] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedUser, setSelectedUser] = useState(null);
	const [selectedUserId, setSelectedUserId] = useState("");
	const [totalUsers, setTotalUsers] = useState("");
	const [isLoading, setIsLoading] = useState(true);

	const [editMode, setEditMode] = useState(false);
	const [updatedName, setUpdatedName] = useState("");
	const [updatedEmail, setUpdatedEmail] = useState("");
	const [updatedPhone, setUpdatedPhone] = useState("");
	const [updatedAddress1, setUpdatedAddress1] = useState("");
	const [updatedAddress2, setUpdatedAddress2] = useState("");

	//   ----------------------------------
	// 2초 후에 로딩 완료
	const timeoutId = setTimeout(() => {
		setIsLoading(false);

		return () => {
			clearTimeout(timeoutId);
		};
	}, []);

	//   ----------------------------------
	// 휴대폰 번호를 010-0000 형식으로 변경
	const formatPhone = (userPhone) => {
		const part1 = userPhone.slice(0, 3);
		const part2 = userPhone.slice(3, 7);
		const part3 = userPhone.slice(7);

		return `${part1}-${part2}-${part3}`;
	};

	//   ----------------------------------
	//   회원상세정보
	const handleUserClick = (user) => {
		setSelectedUser(user);
		setEditMode(false);
	};
	const handleCloseModal = () => {
		setSelectedUser(null);
	};

	const handleEditButtonClick = () => {
		setUpdatedName(selectedUser.name);
		setUpdatedEmail(selectedUser.email);
		setUpdatedPhone(selectedUser.phone);
		setUpdatedAddress1(selectedUser.address1);
		setUpdatedAddress2(selectedUser.address2);

		setEditMode(true);
	};

	const handleCancelEdit = () => {
		setEditMode(false);
		// Optionally, you may want to reset the updated values as well.
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
				console.error("Error fetching data: ", error);
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
	//   회원정보 가져오기
	useEffect(() => {
		// 전체 회원 수 가져오기
		axios
			.get(`${API_BASE_URL}/api/userinfo/count`)
			.then((response) => {
				setTotalUsers(response.data);
			})
			.catch((error) => {
				console.error("Error fetching user count: ", error);
			});

		// 유저 회원 정보 가져오기
		axios
			.get(`${API_BASE_URL}/api/userinfo/allusers`)
			.then((response) => {
				setUsers(response.data);
				console.log(response.data);
			})
			.catch((error) => {
				console.error("Error fetching data: ", error);
			});
	}, []);

	//   ----------------------------------
	// 회원삭제
	const handleDeletion = async () => {
		if (selectedUser) {
			// user_id를 가져오기
			const user_id = selectedUser.id;

			// 확인 창을 띄우고 사용자가 확인을 누르면 삭제를 진행
			const shouldDelete = window.confirm("정말로 회원을 삭제하시겠습니까?");
			if (!shouldDelete) {
				alert("삭제 취소");
				return false;
			}
			const userInput = prompt(
				`삭제하려는 회원의 아이디가 맞는지 확인 하겠습니다.\n${user_id}를 삭제하시려는게 맞다면 다음 문구를 입력하세요.\n입력 할 문구 >> 삭제${user_id}`
			);

			if (userInput === `삭제${user_id}`) {
				const editUserDto = {
					user_id: user_id,
				};

				try {
					const response = await fetch(
						`${API_BASE_URL}/api/userinfo/userdelete`,
						{
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify(editUserDto),
						}
					);

					if (response.ok) {
						alert("회원삭제가 완료되었습니다.");
						handleCloseModal();
						axios
							.get(`${API_BASE_URL}/api/userinfo/get`)
							.then((response) => {
								setUsers(response.data);
							})
							.catch((error) => {
								console.error("Error fetching data: ", error);
							});
					} else {
						alert("회원삭제에 실패했습니다. 다시 시도해주세요.");
					}
				} catch (error) {
					console.error("회원삭제 중 오류가 발생했습니다.", error);
				}
			} else {
				alert("삭제 실패");
			}
		} else {
			// Handle the case where selectedUser is null
			console.error("Selected user is null. Cannot delete.");
		}
	};

	//   ----------------------------------
	// 회원수정
	const handleUserUpdate = async () => {
		if (selectedUser) {
			const user_id = selectedUser.id;

			const editUserDto = {
				user_id: user_id,
				name: updatedName,
				email: updatedEmail,
				phone: updatedPhone,
				address1: updatedAddress1,
				address2: updatedAddress2,
			};

			console.log("Updated User DTO:", editUserDto);

			try {
				const response = await fetch(
					`${API_BASE_URL}/api/userinfo/admineditUser`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(editUserDto),
					}
				);

				console.log("Response:", response);

				if (response.ok) {
					alert("회원수정이 완료되었습니다.");

					axios
						.get(`${API_BASE_URL}/api/userinfo/get`)
						.then((response) => {
							setUsers(response.data);
						})
						.catch((error) => {
							console.error("Error fetching data: ", error);
						});
				} else {
					alert("회원수정에 실패했습니다. 다시 시도해주세요.");
				}
			} catch (error) {
				console.error("회원수정 중 오류가 발생했습니다.", error);
			}
		} else {
			console.error("Selected user is null. Cannot update.");
		}
	};

	// enter 입력 시 채팅 내용 전송
	const pressEnter = (e) => {
		if (e.key === "Enter") {
			handleSearch(e);
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
					onKeyDown={pressEnter}
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
									<td>{user.homeDevice ? user.homeDevice.homeId : ""}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<div className={style.totalMember} style={{ textAlign: "center" }}>
					전체 회원 수: {totalUsers}명
				</div>
			</div>
			{selectedUser && (
				<div className={style.custom_modal}>
					<div className={style.close} onClick={handleCloseModal}>
						&times;
					</div>
					<div className={style.modal_container}>
						<div className={style.modal_title}>{selectedUser.id}의 정보</div>
						<div className={style.modal_content}>
							{!editMode ? (
								<>
									<p>이름: {selectedUser.name}</p>
									<p>이메일: {selectedUser.email}</p>
									<p>번호: {formatPhone(selectedUser.phone)}</p>
									<p>
										지역: {selectedUser.address1} {selectedUser.address2}{" "}
										{selectedUser.address3}
									</p>
									<p>
										시리얼번호:{" "}
										{selectedUser.homeDevice &&
										selectedUser.homeDevice.serialNum
											? selectedUser.homeDevice.serialNum
											: ""}{" "}
									</p>
									<p>
										가입일자:{" "}
										{new Date(selectedUser.creDateTime).toLocaleString("ko-KR")}
									</p>
								</>
							) : (
								<>
									<div className={style.input_area}>
										<p>이름: </p>
										<input
											type="text"
											placeholder="이름"
											value={updatedName}
											onChange={(e) => setUpdatedName(e.target.value)}
											className={style.input_new}
										/>
									</div>

									<div className={style.input_area}>
										<p>이메일: </p>
										<input
											type="text"
											placeholder="이메일"
											value={updatedEmail}
											onChange={(e) => setUpdatedEmail(e.target.value)}
											className={style.input_new}
										/>
									</div>

									<div className={style.input_area}>
										<p>번호: </p>
										<input
											type="text"
											placeholder="번호"
											value={updatedPhone}
											onChange={(e) => setUpdatedPhone(e.target.value)}
											className={style.input_new}
										/>
									</div>

									<div className={style.input_area}>
										<p>지역1: </p>
										<input
											type="text"
											placeholder="지역1"
											value={updatedAddress1}
											onChange={(e) => setUpdatedAddress1(e.target.value)}
											className={style.input_new}
										/>
									</div>

									<div className={style.input_area}>
										<p>지역2: </p>
										<input
											type="text"
											placeholder="지역2"
											value={updatedAddress2}
											onChange={(e) => setUpdatedAddress2(e.target.value)}
											className={style.input_new}
										/>
									</div>
								</>
							)}
						</div>
						<div className={style.btn_area}>
							{!editMode && (
								<button
									className={style.update_btn}
									onClick={handleEditButtonClick}
								>
									회원수정
								</button>
							)}
							{editMode && (
								<>
									<div className={style.update_btn_box}>
										<button
											className={`${style.update_btn_on} ${style.save_btn}`}
											onClick={handleUserUpdate}
										>
											저장
										</button>
										<button
											className={`${style.update_btn_on} ${style.cancel_btn}`}
											onClick={handleCancelEdit}
										>
											취소
										</button>
									</div>
								</>
							)}
							<button className={style.delete_btn} onClick={handleDeletion}>
								회원삭제
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default UserList;
