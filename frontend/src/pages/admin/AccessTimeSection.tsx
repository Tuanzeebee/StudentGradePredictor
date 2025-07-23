import { ellipse12, ellipse14, ellipse15, rectangle23, rectangle25 } from "../../assets/admin/images";

export const AccessTimeSection = () => {
  const timeData = [
    {
      id: 1,
      label: "Afternoon",
      percentage: "40%",
      color: "#5969cf",
      position: "left-0",
    },
    {
      id: 2,
      label: "Evening",
      percentage: "32%",
      color: "#8593ec",
      position: "left-[142px]",
    },
    {
      id: 3,
      label: "Morning",
      percentage: "28%",
      color: "#c7ceff",
      position: "left-[281px]",
    },
  ];

  return (
    <section
      className="absolute w-[366px] h-[322px] top-[167px] left-[1038px]"
      role="region"
      aria-labelledby="access-time-heading"
    >
      <header>
        <h2
          id="access-time-heading"
          className="absolute top-0 left-0 [font-family:'Poppins-Regular',Helvetica] font-normal text-black text-sm tracking-[0.50px] leading-[22px] whitespace-nowrap"
        >
          Access Time
        </h2>

        <p className="absolute top-[30px] left-0 opacity-50 [font-family:'Poppins-Regular',Helvetica] font-normal text-black text-[13px] tracking-[0.50px] leading-[21px] whitespace-nowrap">
          From 1-30 Dec, 2025
        </p>
      </header>

        <button
          className="all-[unset] box-border absolute w-[111px] h-8 top-0 left-[253px] cursor-pointer focus:outline-2 focus:outline-blue-500 focus:outline-offset-2"
          aria-label="View detailed access time report"
        >
          <div className="relative h-[35px] -left-px">
            <img src={rectangle25} alt="" className="w-full h-full" />
            <span className="absolute top-1.5 left-[17px] [font-family:'Poppins-Medium',Helvetica] font-medium text-[#5969cf] text-xs tracking-[0.50px] leading-5 whitespace-nowrap">
              View Report
            </span>
          </div>
        </button>      <div className="absolute w-56 h-[171px] top-[54px] left-[120px]">
        <div className="absolute w-[124px] h-[124px] top-[47px] left-0">
          <div
            className="relative w-[154px] h-[154px] top-[-18px] -left-3"
            role="img"
            aria-label="Donut chart showing access time distribution"
          >
            <div className="absolute w-[148px] h-[148px] top-1.5 left-0 rounded-[74px] border-[24px] border-solid border-[#c7ceff]" />

            <img
              className="absolute w-36 h-[148px] top-1.5 left-1"
              alt=""
              src={ellipse14}
              role="presentation"
            />

            <img
              className="absolute w-20 h-36 top-0 left-[74px]"
              alt=""
              src={ellipse12}
              role="presentation"
            />

            <img
              className="absolute w-[74px] h-[133px] top-1.5 left-[74px]"
              alt=""
              src={ellipse15}
              role="presentation"
            />
          </div>
        </div>

        <div className="absolute w-[146px] h-[109px] top-0 left-[78px]">
          <div className="relative w-[140px] h-[108px]">
            <img src={rectangle23} alt="" className="w-full h-full" />
            <div className="absolute w-[118px] top-[39px] left-4 opacity-50 [font-family:'Poppins-Regular',Helvetica] font-normal text-white text-xs tracking-[0.30px] leading-3 whitespace-nowrap">
              1pm - 4pm
            </div>

            <div className="absolute top-4 left-4 [font-family:'Poppins-Medium',Helvetica] font-medium text-white text-xs tracking-[0.30px] leading-[13.0px] whitespace-nowrap">
              Afternoon
            </div>

            <div className="absolute w-[119px] top-[67px] left-2.5 [font-family:'Poppins-Medium',Helvetica] font-medium text-white text-sm tracking-[0.30px] leading-4">
              890 access hits
            </div>
          </div>
        </div>
      </div>

      <div
        className="absolute top-72"
        role="list"
        aria-label="Access time breakdown by period"
      >
        {timeData.map((item) => (
          <div
            key={item.id}
            className={`absolute w-[85px] h-[34px] ${item.position}`}
            role="listitem"
          >
            <div
              className={`absolute w-[9px] h-[9px] top-0.5 left-0 rounded-[4.5px]`}
              style={{ backgroundColor: item.color }}
              role="presentation"
            />

            <div className="absolute top-0 left-[17px] opacity-70 [font-family:'Poppins-Medium',Helvetica] font-medium text-[#121212] text-xs tracking-[0.50px] leading-3 whitespace-nowrap">
              {item.label}
            </div>

            <div className="absolute top-[22px] left-[17px] opacity-70 [font-family:'Poppins-Regular',Helvetica] font-normal text-[#121212] text-xs tracking-[0.50px] leading-3 whitespace-nowrap">
              {item.percentage}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
