import { AccessTimeSection } from "./AccessTimeSection";
import { ChevronDown } from "../../components/icons/ChevronDown";
import { DashboardStatsSection } from "./DashboardStatsSection";
import { LucideChevronDown } from "../../components/icons/LucideChevronDown";
import { PerformanceRatingSection } from "./PerformanceRatingSection";
import { TopCoursesSection } from "./TopCoursesSection";
import { 
  image7, 
  image, 
  notifIcon, 
  separator2, 
  separator, 
  vector8, 
  vector9,
  vector10,
  vector11, 
  vector12, 
  vector13, 
  vector14, 
  vector15, 
  vector16, 
  vector18, 
  vector19, 
  vector20, 
  vector 
} from "../../assets/admin/images";

const statsData = [
  {
    title: "Total Students",
    value: "12,847",
    change: "+12%",
    changeText: "from last month",
    changeColor: "text-emerald-500",
    bgColor: "bg-[#ebf8ff]",
    icon: (
      <>
        <img
          className="absolute w-[18px] h-2 top-3.5 left-0"
          alt="Vector"
          src={vector11}
        />
        <img
          className="absolute w-2.5 h-2.5 top-0.5 left-1"
          alt="Vector"
          src={vector12}
        />
        <img
          className="absolute w-[5px] h-2 top-3.5 left-[19px]"
          alt="Vector"
          src={vector13}
        />
        <img
          className="absolute w-[5px] h-2.5 top-0.5 left-[15px]"
          alt="Vector"
          src={vector14}
        />
      </>
    ),
  },
  {
    title: "Faculty Members",
    value: "342",
    change: "+5%",
    changeText: "from last month",
    changeColor: "text-emerald-500",
    bgColor: "bg-green-50",
    icon: (
      <>
        <img
          className="absolute w-[18px] h-2 top-3.5 left-[3px]"
          alt="Vector"
          src={vector15}
        />
        <img
          className="absolute w-2.5 h-2.5 top-0.5 left-[7px]"
          alt="Vector"
          src={vector16}
        />
      </>
    ),
  },
  {
    title: "At-Risk Students",
    value: "15",
    change: "-3%",
    changeText: "from last week",
    changeColor: "text-red-500",
    bgColor: "bg-red-50",
    valueColor: "text-red-500",
    icon: (
      <div className="relative w-6 h-6 top-3 left-3">
        <div className="relative w-[23px] h-5 top-0.5 left-px bg-[url(/vector-17.svg)] bg-[100%_100%]">
          <img
            className="absolute w-0.5 h-1.5 top-1.5 left-2.5"
            alt="Vector"
            src={vector18}
          />
          <img
            className="absolute w-0.5 h-0.5 top-3.5 left-2.5"
            alt="Vector"
            src={vector19}
          />
        </div>
      </div>
    ),
  },
  {
    title: "Avg Performance",
    value: "87.3",
    suffix: "%",
    change: "+2.1%",
    changeText: "from last month",
    changeColor: "text-emerald-500",
    bgColor: "bg-amber-100",
    icon: (
      <div className="relative w-6 h-6 top-3 left-3">
        <img
          className="absolute w-5 h-[22px] top-px left-0.5"
          alt="Vector"
          src={vector20}
        />
      </div>
    ),
  },
];

export const AdminDashboard = () => {
  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white w-[1440px] h-[1024px]">
        <div className="relative h-[1024px]">
          <div className="absolute w-[1160px] h-[724px] top-[167px] left-[280px]">
            <img
              className="absolute w-px h-[724px] top-0 left-[718px]"
              alt="Vector"
              src={vector}
            />

            <img
              className="absolute w-px h-[362px] top-[362px] left-[359px]"
              alt="Separator"
              src={separator}
            />

            <img
              className="absolute w-[1120px] h-px top-[362px] left-0"
              alt="Separator"
              src={image}
            />

            <TopCoursesSection />
            <img
              className="absolute w-[391px] h-[237px] top-[465px] left-[769px] object-cover"
              alt="Image"
              src={image7}
            />

            <div className="absolute w-[178px] top-[575px] left-[659px] rotate-[-89.76deg] [font-family:'Poppins-Medium',Helvetica] font-medium text-[#938b8b] text-sm tracking-[0.50px] leading-5">
              Number of candidates
            </div>
          </div>

          <div className="absolute w-[151px] h-[22px] top-[569px] left-[1143px]">
            <div className="absolute top-0 left-0 [font-family:'Poppins-Regular',Helvetica] font-normal text-black text-sm tracking-[0.50px] leading-[22px] whitespace-nowrap">
              SCORE DISTRIBUTION
            </div>
          </div>

          <PerformanceRatingSection />
          <AccessTimeSection />
          <div className="absolute w-[154px] h-8 top-4 left-[1251px]">
            <div className="absolute w-8 h-8 top-0 left-0 bg-[#ffe6cc] rounded-2xl">
              <div className="absolute top-[9px] left-2 [font-family:'Poppins-Regular',Helvetica] font-normal text-white text-base tracking-[0.50px] leading-[13px] whitespace-nowrap">
                🍔
              </div>
            </div>

            <div className="absolute w-[60px] h-5 top-[7px] left-11">
              <div className="absolute top-[3px] left-0 [font-family:'Poppins-Regular',Helvetica] font-normal text-[#1f384c] text-xs tracking-[0.50px] leading-[13px] whitespace-nowrap">
                ADMIN
              </div>

              <ChevronDown className="!absolute !w-5 !h-5 !top-0 !left-10" />
            </div>

            <div className="absolute w-[15px] h-[18px] top-1.5 left-[136px]">
              <img
                className="absolute w-[13px] h-4 top-0.5 left-0"
                alt="Notif icon"
                src={notifIcon}
              />

              <div className="absolute w-2 h-2 top-0 left-[7px] bg-[#eb5151] rounded-[4.2px] border-[1.2px] border-solid border-white" />
            </div>
          </div>

          <div className="absolute w-[1440px] h-[1024px] top-0 left-0">
            <img
              className="absolute w-[1440px] h-px top-16 left-0"
              alt="Separator"
              src={separator2}
            />

            <DashboardStatsSection />
          </div>

          {statsData.map((stat, index) => {
            const positions = [
              { top: 167, left: 295 },
              { top: 167, left: 635 },
              { top: 328, left: 295 },
              { top: 328, left: 635 },
            ];

            return (
              <div
                key={index}
                className={`absolute w-[316px] h-[137px] top-[${positions[index].top}px] left-[${positions[index].left}px] bg-white rounded-lg border border-solid border`}
              >
                {index === 1 && (
                  <>
                    <div className="absolute w-5 h-5 top-[27px] left-[88px]">
                      <img
                        className="absolute w-3 h-3 top-px left-1"
                        alt="Vector"
                        src={vector9}
                      />
                      <img
                        className="absolute w-[5px] h-0.5 top-[17px] left-2"
                        alt="Vector"
                        src={vector10}
                      />
                    </div>
                    <div className="absolute w-3 h-3 top-[15px] left-[108px] bg-red-500 rounded-[20132700px]" />
                    <div className="absolute w-8 h-8 top-[21px] left-[132px] bg-[#5a67ba] rounded-[20132700px]" />
                    <div className="absolute top-[26px] left-[143px] [font-family:'Poppins-Medium',Helvetica] font-medium text-white text-sm tracking-[0] leading-5 whitespace-nowrap">
                      A
                    </div>
                    <div className="absolute top-4 left-44 [font-family:'Poppins-Medium',Helvetica] font-medium text-gray-900 text-sm tracking-[0] leading-5 whitespace-nowrap">
                      Admin User
                    </div>
                  </>
                )}

                {index === 0 && (
                  <div className="absolute w-5 h-5 top-[27px] left-2">
                    <img
                      className="absolute w-[17px] h-3 top-1 left-0.5"
                      alt="Vector"
                      src={vector8}
                    />
                  </div>
                )}

                {index === 0 && (
                  <p className="absolute top-10 left-[52px] [font-family:'Poppins-Regular',Helvetica] font-normal text-gray-500 text-sm tracking-[0] leading-5 whitespace-nowrap">
                    Manage your educational AI platform
                  </p>
                )}

                <div className="absolute top-[23px] left-6 [font-family:'Poppins-Medium',Helvetica] font-medium text-gray-500 text-sm tracking-[0] leading-5 whitespace-nowrap">
                  {stat.title}
                </div>

                <div
                  className={`absolute top-[42px] left-6 [font-family:'Poppins-Bold',Helvetica] font-bold ${stat.valueColor || "text-gray-900"} text-2xl tracking-[0] leading-8 whitespace-nowrap`}
                >
                  {stat.value}
                  {stat.suffix && (
                    <span className="[font-family:'Poppins-Bold',Helvetica] font-bold text-gray-900 text-2xl tracking-[0] leading-8">
                      {stat.suffix}
                    </span>
                  )}
                </div>

                <div
                  className={`absolute w-12 h-12 top-[26px] left-[243px] ${stat.bgColor} rounded-lg`}
                >
                  <div className="absolute w-6 h-6 top-[12px] left-3">
                    {stat.icon}
                  </div>
                </div>

                <div
                  className={`absolute top-[91px] left-6 [font-family:'Poppins-Regular',Helvetica] font-normal ${stat.changeColor} text-sm tracking-[0] leading-5 whitespace-nowrap`}
                >
                  {stat.change}
                </div>

                <div className="absolute top-[91px] left-[61px] [font-family:'Poppins-Regular',Helvetica] font-normal text-gray-500 text-sm tracking-[0] leading-5 whitespace-nowrap">
                  {stat.changeText}
                </div>
              </div>
            );
          })}

          <div className="absolute w-[107px] h-[29px] top-[595px] left-[1016px]">
            <div className="relative w-[94px] h-[26px] top-0.5 left-[13px]">
              <div className="absolute w-[75px] top-px left-0 [font-family:'Poppins-Medium',Helvetica] font-medium text-[#1d1b1b] text-sm tracking-[0.50px] leading-5">
                MÔN HỌC
              </div>

              <LucideChevronDown className="!absolute !w-[23px] !h-6 !top-0 !left-[71px]" />
            </div>
          </div>

          <div className="absolute w-[107px] h-[29px] top-[595px] left-[1139px]">
            <div className="relative w-[94px] h-[26px] top-0.5 left-[13px]">
              <div className="absolute w-[75px] top-px left-0 [font-family:'Poppins-Medium',Helvetica] font-medium text-[#1d1b1b] text-sm tracking-[0.50px] leading-5">
                NĂM HỌC
              </div>

              <LucideChevronDown className="!absolute !w-[23px] !h-6 !top-0 !left-[71px]" />
            </div>
          </div>

          <div className="absolute w-[167px] h-8 top-[594px] left-[1264px]">
            <div className="relative w-[165px] h-8 bg-[#f5f6fa] rounded-[5px]">
              <p className="absolute w-[143px] top-2 left-3 [font-family:'Poppins-Italic',Helvetica] font-normal italic text-[#a2a2a2] text-xs tracking-[0.50px] leading-[13px]">
                Nhập mã số môn học
              </p>
            </div>
          </div>

          <div className="absolute w-[50px] top-[878px] left-[1206px] [font-family:'Poppins-Medium',Helvetica] font-medium text-[#938b8b] text-sm tracking-[0.50px] leading-5">
            Score
          </div>
        </div>
      </div>
    </div>
  );
};
