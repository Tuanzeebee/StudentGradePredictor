import { 
  line25, 
  line252, 
  line253, 
  group245, 
  group23, 
  group232, 
  studentImage 
} from "../../assets/admin/images";

export const TopCoursesSection = () => {
  const outstandingStudents = [
    {
      id: 282,
      name: "Nguyễn Đình Tuấn",
      avatar: group245,
      showLine: true,
      lineImage: line25,
    },
    {
      id: 282,
      name: "Hồ Trọng Vỹ",
      avatar: group23,
      showLine: true,
      lineImage: line252,
    },
    {
      id: 282,
      name: "Võ Hoàng Mai Khanh",
      avatar: studentImage,
      showLine: true,
      lineImage: line253,
    },
    {
      id: 282,
      name: "Võ Văn Phương",
      avatar: group232,
      showLine: false,
      lineImage: null,
    },
  ];

  return (
    <section
      className="absolute w-[335px] h-[310px] top-[402px] left-[379px]"
      role="region"
      aria-labelledby="outstanding-title"
    >
      <h2
        id="outstanding-title"
        className="left-[104px] text-center absolute top-0 [font-family:'Poppins-Regular',Helvetica] font-normal text-black text-sm tracking-[0.50px] leading-[22px] whitespace-nowrap"
      >
        OUTSTANDING
      </h2>

      <p className="w-[331px] absolute top-[30px] left-0 opacity-50 [font-family:'Poppins-Regular',Helvetica] font-normal text-black text-xs tracking-[0.50px] leading-[22px]">
        TOP STUDENTS WITH OUTSTANDING ACHIEVEMENTS
      </p>

      <ul className="list-none p-0 m-0" role="list">
        {outstandingStudents.map((student, index) => (
          <li
            key={`${student.name}-${index}`}
            className={`absolute w-[280px] h-11 left-[19px] ${
              index === 0
                ? "top-[102px]"
                : index === 1
                  ? "top-[162px]"
                  : index === 2
                    ? "top-[222px]"
                    : "top-[282px] w-[259px]"
            }`}
            role="listitem"
          >
            {student.showLine && student.lineImage && (
              <img
                className="absolute w-[280px] h-px top-11 left-0"
                alt=""
                src={student.lineImage}
                role="presentation"
              />
            )}

            <div
              className={`absolute h-7 top-0 left-0 ${index === 3 ? "w-[259px]" : "w-[259px]"}`}
            >
              <div
                className="absolute w-7 h-7 top-0 left-0 bg-[#c4c4c4] rounded-[14px] shadow-[0px_10px_20px_#40485259]"
                style={{
                  backgroundImage: `url(${student.avatar})`,
                  backgroundSize: "100% 100%",
                }}
                role="img"
                aria-label={`${student.name} profile picture`}
              />

              <div className="absolute top-1 left-12 [font-family:'Poppins-Regular',Helvetica] font-normal text-[#273240] text-xs tracking-[0.50px] leading-5 whitespace-nowrap">
                {student.name}
              </div>

              <div className="absolute top-1 left-[213px] opacity-70 [font-family:'Poppins-Regular',Helvetica] font-normal text-[#273240] text-xs tracking-[0.50px] leading-5 whitespace-nowrap">
                ID: {student.id}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};
