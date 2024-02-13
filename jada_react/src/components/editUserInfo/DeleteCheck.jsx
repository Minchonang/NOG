import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import common from "../common/css/common.module.css";
import style from "./css/DeleteCheck.module.css";
import BottomNav from "../common/jsx/BottomNav";
import { API_BASE_URL } from "../../App";
import Header from "../common/jsx/Header";

function DeleteCheck() {
  const activeUser = true;
  const [deletionReasonOption, setDeletionReasonOption] = useState(""); // 선택한 이유
  const [otherReason, setOtherReason] = useState(""); // 기타 이유 입력
  const [isCheck, setIsCheck] = useState(false);

  // 이전 페이지로 돌아가는 기능
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  // 서버에서 받아온 유저 정보
  const [userId, setUserId] = useState("");

  const serverlink = async () => {
    // user_id를 가져오기
    const user_id = sessionStorage.getItem("user_id");

    const editUserDto = {
      user_id: user_id,
    };

    try {
      // 회원정보 조회
      const response = await fetch(`${API_BASE_URL}/api/userinfo/userfind`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editUserDto),
      });
      if (response.ok) {
        // // 서버 응답이 성공인 경우
        const result = await response.json();
        // 추출된 데이터 사용
        setUserId(result.userId);
      } else {
        alert("오류가 발생하였습니다.");
      }
    } catch (error) {
      console.error("서버 통신 오류", error);
    }
  };

  // 회원탈퇴
  const handleDeletion = async () => {
    if (!isCheck) {
      alert("안내 사항 내용에 동의를 해주세요.");
    } else {
      if (!deletionReasonOption) {
        alert("회원탈퇴 사유를 입력해주세요.");
      } else {
        // user_id를 가져오기
        const user_id = sessionStorage.getItem("user_id");
        let exitContent = deletionReasonOption;

        // deletionReasonOption이 'other'일 때만 otherReason 값을 exitContent에 할당
        if (deletionReasonOption === "other") {
          exitContent = otherReason;
        }

        const userExitDto = {
          userId: user_id,
          exitContent: exitContent,
        };

        try {
          const response = await fetch(
            `${API_BASE_URL}/api/userexit/userdelete`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(userExitDto),
            }
          );

          if (response.ok) {
            alert("회원탈퇴가 완료되었습니다.");
            window.location.href = "/";
          } else {
            console.log(user_id);
            alert("회원탈퇴에 실패했습니다. 다시 시도해주세요.");
          }
        } catch (error) {
          console.error("회원탈퇴 중 오류가 발생했습니다.", error);
        }
      }
    }
  };

  useEffect(() => {
    serverlink();
  }, []);

  return (
    <>
      <div className={common.background}>
        <Header sub_title="회원탈퇴" />

        <div className={style.main_area}>
          <div className={style.topGuide_area}>
            <li> 회원탈퇴를 하기 전에 안내 사항을 꼭 확인해 주세요.</li>
          </div>
          <div className={style.info_main}>
            <div className={style.info_main_title}>아이디 복구 불가 안내</div>
            <div className={style.info_main_detail}>
              <div>
                사용하고 계신 아이디(
                <span className={style.userId}>{userId}</span>
                )를 탈퇴하시면 복구가 불가하오니 신중하게 선택하시기 바랍니다.
              </div>
            </div>
          </div>

          <div className={style.reason_area}>
            <div className={style.reason_area_title}>탈퇴사유</div>
            <div className={style.reason_area_detail}>
              <div className={style.reason_thx}>
                소중한 의견이 저희에게 큰 도움이 됩니다.
              </div>
              <select
                id="deletion_reason"
                value={deletionReasonOption}
                onChange={(e) => setDeletionReasonOption(e.target.value)}
              >
                <option value="">-- 선택하세요 --</option>
                <option value="unhappy">서비스 불만족</option>
                <option value="moveToOtherService">다른 서비스로 이전</option>
                <option value="privacyConcern">개인정보 보안 우려</option>
                <option value="decreasedFrequency">
                  서비스 이용 빈도 감소
                </option>
                <option value="other">기타</option>
              </select>

              {deletionReasonOption === "other" && (
                <textarea
                  id="other_reason"
                  value={otherReason}
                  onChange={(e) => setOtherReason(e.target.value)}
                  placeholder="이유를 입력해주세요."
                ></textarea>
              )}
            </div>
          </div>

          <div className={style.info_sub}>
            <div className={style.info_sub_title}>
              회원정보/개인형 서비스 이용 기록 삭제
            </div>
            <div className={style.info_sub_detail}>
              <div>
                회원 정보 및 개인형 서비스 이용기록은 모두 삭제되며, 삭제된
                데이터는 복구되지 않습니다.
              </div>
              <div className={style.checkbox_area}>
                <input
                  id="confirm_msg"
                  type="checkbox"
                  checked={isCheck}
                  onChange={(e) => setIsCheck(e.target.checked)}
                />
                <label htmlFor="confirm_msg">
                  위 내용을 모두 확인하였으며, 이에 동의합니다.
                </label>
              </div>
            </div>
          </div>

          {/* 정보 수정 완료 */}
          <div className={`${common.btn_area} ${style.deleteBtn_area}`}>
            <button onClick={goBack}>돌아가기</button>
            <button className={common.themeBgrColor} onClick={handleDeletion}>
              회원탈퇴
            </button>
          </div>
        </div>
        <BottomNav activeUser={activeUser} />
      </div>
    </>
  );
}

export default DeleteCheck;
