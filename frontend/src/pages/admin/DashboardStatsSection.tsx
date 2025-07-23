import { 
  chart, 
  vector2, 
  vector3, 
  vector4, 
  vector6, 
  vector5Svg, 
  vector7Svg, 
  activeBackground 
} from "../../assets/admin/images";

export const DashboardStatsSection = () => {
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: chart,
      isActive: true,
      iconClass: "w-[15px] h-4",
    },
    {
      id: "ai-analytics",
      label: "AI Analytics",
      icon: "/vector-5.svg",
      isActive: false,
      iconClass: "w-[15px] h-4",
    },
    {
      id: "faculty-management",
      label: "Faculty Management",
      icon: vector6,
      isActive: false,
      iconClass: "w-[11px] h-[15px]",
    },
    {
      id: "student-management",
      label: "Student Management",
      icon: "/vector-7.svg",
      isActive: false,
      iconClass: "w-4 h-[17px]",
    },
    {
      id: "research-ai",
      label: "Research AI",
      icon: vector2,
      isActive: false,
      iconClass: "w-3.5 h-[13px]",
    },
  ];

  const systemItems = [
    {
      id: "leadership-reports",
      label: "Leadership Reports",
      icon: vector3,
      iconClass: "w-2.5 h-[15px]",
    },
    {
      id: "system-settings",
      label: "System Settings",
      icon: vector4,
      iconClass: "w-3 h-3.5",
    },
  ];

  return (
    <nav
      className="absolute w-[248px] h-[1024px] top-0 left-0"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="relative h-[1024px]">
        <div className="absolute w-[248px] h-[1024px] top-0 left-0">
          <div className="relative w-60 h-[1024px] bg-[#f1f2f7]">
            {/* Logo Section */}
            <header className="absolute w-6 h-[26px] top-[21px] left-10">
              <div className="w-[26px] h-[26px]">
                <div className="relative h-7 -top-px -left-px bg-[#5a67ba] rounded-[13px/13.8px]">
                  <div className="absolute w-[9px] top-2 left-[9px] [font-family:'Poppins-Bold',Helvetica] font-bold text-white text-[11px] tracking-[0] leading-[11px] whitespace-nowrap">
                    G
                  </div>
                </div>
              </div>
            </header>

            <div className="absolute w-20 top-[26px] left-[75px] [font-family:'Poppins-Bold',Helvetica] font-bold text-[#ea7878] text-[15px] tracking-[0.50px] leading-[11px]">
              Predica
            </div>

            {/* Menu Section */}
            <section className="w-[202px] h-[69px] top-[111px] absolute left-5">
              <h2 className="w-[34px] top-0 opacity-50 [font-family:'Poppins-Regular',Helvetica] font-normal text-[#082431] text-[11px] tracking-[1.00px] leading-[11px] whitespace-nowrap absolute left-5">
                MENU
              </h2>

              {/* Dashboard - Active Item */}
              <div className="absolute w-[200px] h-[45px] top-[25px] left-0">
                <img src={activeBackground} alt="" className="w-full h-full" />
                <div className="relative w-[104px] h-[19px] top-[13px] left-5">
                  <div className="absolute w-[72px] top-[3px] left-[30px] [font-family:'Poppins-Medium',Helvetica] font-medium text-[#5969cf] text-xs tracking-[0.50px] leading-3 whitespace-nowrap">
                    Dashboard
                  </div>
                  <div className="absolute w-[18px] h-[19px] top-0 left-0">
                    <img
                      className="absolute w-[15px] h-4 top-0.5 left-0.5"
                      alt="Dashboard"
                      src={chart}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* AI Analytics */}
            <div className="absolute w-[15px] h-4 top-[203px] left-[42px]">
              <img src={vector5Svg} alt="AI Analytics" className="w-full h-full" />
            </div>
            <div className="absolute w-[75px] top-[201px] left-[71px] [font-family:'Poppins-Regular',Helvetica] font-normal text-[#273240] text-xs tracking-[0.50px] leading-[18px] whitespace-nowrap">
              AI Analytics
            </div>

            {/* Faculty Management */}
            <div className="absolute w-3 h-4 top-[244px] left-[42px]">
              <img
                className="absolute w-[11px] h-[15px] top-0 left-0"
                alt="Faculty Management"
                src={vector6}
              />
            </div>
            <div className="w-[137px] top-[242px] left-[69px] [font-family:'Poppins-Regular',Helvetica] font-normal text-[#273240] text-xs tracking-[0.50px] leading-[18px] absolute whitespace-nowrap">
              Faculty Management
            </div>

            {/* Student Management */}
            <div className="absolute w-4 h-[17px] top-[285px] left-10">
              <img src={vector7Svg} alt="Student Management" className="w-full h-full" />
            </div>
            <div className="absolute w-[141px] top-[284px] left-[69px] [font-family:'Poppins-Regular',Helvetica] font-normal text-[#273240] text-xs tracking-[0.50px] leading-[18px] whitespace-nowrap">
              Student Management
            </div>

            {/* Research AI */}
            <div className="absolute w-4 h-[17px] top-[325px] left-10">
              <img
                className="absolute w-3.5 h-[13px] top-0.5 left-px"
                alt="Research AI"
                src={vector2}
              />
            </div>
            <div className="absolute w-[76px] top-[324px] left-[69px] [font-family:'Poppins-Regular',Helvetica] font-normal text-[#273240] text-xs tracking-[0.50px] leading-[18px] whitespace-nowrap">
              Research AI
            </div>

            {/* System Section */}
            <section>
              <h2 className="w-[46px] top-[375px] left-10 text-[#082431] text-[11px] tracking-[1.00px] leading-[16.5px] absolute [font-family:'Poppins-Regular',Helvetica] font-normal whitespace-nowrap">
                SYSTEM
              </h2>

              {/* Leadership Reports */}
              <div className="absolute w-3.5 h-4 top-[425px] left-[42px]">
                <img
                  className="absolute w-2.5 h-[15px] top-px left-0.5"
                  alt="Leadership Reports"
                  src={vector3}
                />
              </div>
              <div className="absolute w-[124px] top-[423px] left-[70px] [font-family:'Poppins-Regular',Helvetica] font-normal text-[#273240] text-xs tracking-[0.50px] leading-[18px] whitespace-nowrap">
                Leadership Reports
              </div>

              {/* System Settings */}
              <div className="absolute w-3.5 h-4 top-[474px] left-[42px]">
                <img
                  className="absolute w-3 h-3.5 top-px left-px"
                  alt="System Settings"
                  src={vector4}
                />
              </div>
              <div className="w-[103px] top-[473px] left-[70px] text-[#273240] text-xs tracking-[0.50px] leading-[18px] absolute [font-family:'Poppins-Regular',Helvetica] font-normal whitespace-nowrap">
                System Settings
              </div>
            </section>
          </div>
        </div>
      </div>
    </nav>
  );
};
