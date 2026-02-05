export default function ProfilePage() {
  const isLogin = false;
  const userList = ["홍길동", "홍길동동", "홍길똥"];
  const maxUser = 4;
  const emptyBoxes = maxUser - userList.length;
  const emptyProfiles = new Array(emptyBoxes).fill(null);
  return (
    <div className="bg-white h-screen w-screen flex flex-col justify-center gap-10">
      <div className="flex flex-col justify-around w-[467px] h-[292px] mx-auto">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-6xl font-bold text-black">SIMVEX</h1>
          <h2 className="text-xl font-semibold text-black">공학 학습의 새로운 기준</h2>
        </div>
        {!isLogin && (
          <strong className="text-xl text-black text-center leading-relaxed">
            교과서 그림만으로는 이해하기 어려운 복잡한 기계 구조, 이제 3D로 돌려보고 분해하며
            배우세요.
          </strong>
        )}
      </div>
      {isLogin ? (
        <div className="flex flex-col gap-20">
          <div className="w-[777px] h-[38px] bg-[#222222] mx-auto flex justify-center items-center rounded-lg">
            <p className="text-white font-medium text-xl text-center">프로필 선택</p>
          </div>
          <div className="flex space-x-10 w-[777px] mx-auto">
            {userList.map((user) => (
              <div className="flex  flex-col gap-4 justify-center items-center">
                <div className="bg-gray-100 rounded-lg h-40 w-40 shadow-lg"></div>
                <p>{user}</p>
              </div>
            ))}
            {emptyProfiles.map((_, index) => (
              <div key={index} className="flex flex-col gap-4 justify-center items-center">
                <div className="bg-white rounded-lg h-40 w-40 shadow-lg flex justify-center items-center">
                  <button className=" text-5xl">+</button>
                </div>
                <p>빈 프로필</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-[#F3F3F3] shadow-lg w-[476px] h-[261px] mx-auto rounded-lg ">
          <div className="p-12 flex flex-col justify-between h-full">
            <div className="flex w-full flex-col gap-2">
              <label htmlFor="nickname" className="font-medium">
                닉네임을 입력해주세요
              </label>
              <input
                type="text"
                placeholder="닉네임"
                className="w-full bg-white px-4 py-2 rounded-lg "
                name="nickname"
              />
            </div>
            <div className="mt-auto">
              <button className="w-full bg-gray-800 text-gray-200 py-3 px-6 rounded-lg cursor-pointer">
                프로필 생성하기{" "}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
