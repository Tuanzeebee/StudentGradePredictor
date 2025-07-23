import { ellipse17, ellipse172, ellipse173 } from "../../assets/admin/images";

export const PerformanceRatingSection = () => {
  const performanceData = [
    {
      percentage: "85%",
      label: "Excellent/Outstanding",
      bgColor: "bg-[#f89c2f]",
      size: "w-[169px] h-[169px]",
      containerSize: "w-[178px] h-[179px]",
      containerPosition: "top-5 left-[130px]",
      relativeSize: "w-[175px] h-[181px]",
      circlePosition: "top-1.5 left-0",
      percentagePosition: "top-[63px] left-[50px]",
      percentageFontSize: "text-[33.7px]",
      percentageTracking: "tracking-[0.53px]",
      percentageLeading: "leading-[33.7px]",
      labelPosition: "top-[105px] left-[7px]",
      labelWidth: "w-[159px]",
      labelFontSize: "text-[12.7px]",
      labelTracking: "tracking-[0.53px]",
      labelLeading: "leading-[12.7px]",
      imagePosition: "top-0 left-[5px]",
      imageSize: "w-[170px] h-[181px]",
      imageSrc: ellipse17,
      opacity: "opacity-90",
      borderRadius: "rounded-[84.36px]",
    },
    {
      percentage: "5%",
      label: "Average/Weak",
      bgColor: "bg-[#6463d6]",
      size: "w-[104px] h-[104px]",
      containerSize: "w-[111px] h-[110px]",
      containerPosition: "top-0 left-[49px]",
      relativeSize: "w-[108px] h-28",
      circlePosition: "top-1 left-0",
      percentagePosition: "top-[34px] left-[37px]",
      percentageFontSize: "text-[20.8px]",
      percentageTracking: "tracking-[0.32px]",
      percentageLeading: "leading-[20.8px]",
      labelPosition: "top-[59px] left-[5px]",
      labelWidth: "w-[99px]",
      labelFontSize: "text-xs",
      labelTracking: "tracking-[0.32px]",
      labelLeading: "leading-[7.8px]",
      imagePosition: "top-0 left-[3px]",
      imageSize: "w-[105px] h-28",
      imageSrc: ellipse172,
      opacity: "opacity-80",
      borderRadius: "rounded-[51.88px]",
    },
    {
      percentage: "10%",
      label: "Fair/Good",
      bgColor: "bg-[#2fbede]",
      size: "w-[122px] h-[122px]",
      containerSize: "w-[130px] h-[130px]",
      containerPosition: "top-[111px] left-0",
      relativeSize: "w-[127px] h-[132px]",
      circlePosition: "top-[5px] left-0",
      percentagePosition: "top-11 left-[37px]",
      percentageFontSize: "text-2xl",
      percentageTracking: "tracking-[0.38px]",
      percentageLeading: "leading-6",
      labelPosition: "top-[76px] left-[23px]",
      labelWidth: "w-[70px]",
      labelFontSize: "text-xs",
      labelTracking: "tracking-[0.38px]",
      labelLeading: "leading-3",
      imagePosition: "top-0 left-1",
      imageSize: "w-[123px] h-[132px]",
      imageSrc: ellipse173,
      opacity: "opacity-90",
      borderRadius: "rounded-[61.18px]",
    },
  ];

  return (
    <section
      className="absolute w-[317px] h-[321px] top-[569px] left-[280px]"
      role="region"
      aria-labelledby="performance-title"
    >
      <div className="absolute w-[308px] h-[241px] top-20 left-[9px]">
        {performanceData.map((item, index) => (
          <div
            key={index}
            className={`absolute ${item.containerSize} ${item.containerPosition}`}
          >
            <div className={`relative ${item.relativeSize} -top-px`}>
              <div
                className={`absolute ${item.size} ${item.circlePosition} ${item.bgColor} ${item.borderRadius} ${item.opacity}`}
              />

              <div
                className={`absolute ${item.percentagePosition} [font-family:'Poppins-Regular',Helvetica] font-normal text-white ${item.percentageFontSize} ${item.percentageTracking} ${item.percentageLeading} whitespace-nowrap`}
              >
                {item.percentage}
              </div>

              <div
                className={`absolute ${item.labelWidth} ${item.labelPosition} [font-family:'Poppins-Regular',Helvetica] font-normal text-white ${item.labelFontSize} ${item.labelTracking} ${item.labelLeading}`}
              >
                {item.label}
              </div>

              <img
                className={`absolute ${item.imageSize} ${item.imagePosition}`}
                alt={`Performance chart segment for ${item.label}`}
                src={item.imageSrc}
              />
            </div>
          </div>
        ))}
      </div>

      <h2
        id="performance-title"
        className="left-[83px] absolute top-0 [font-family:'Poppins-Regular',Helvetica] font-normal text-black text-sm tracking-[0.50px] leading-[22px] whitespace-nowrap"
      >
        PERCENTAGE STATISTICS
      </h2>

      <p className="w-[312px] absolute top-[30px] left-0 opacity-50 [font-family:'Poppins-Regular',Helvetica] font-normal text-black text-xs tracking-[0.50px] leading-[22px]">
        STUDENT STATISTICS BY ACADEMIC PERFORMANCE (GPA)
      </p>
    </section>
  );
};
