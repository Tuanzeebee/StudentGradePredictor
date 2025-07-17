import React from "react";

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: "Jessica Smith",
      role: "Computer Science Major",
      image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/N1bPFEGoXY/yyp527bk_expires_30_days.png",
      quote: "ScorePredict helped me identify which subjects needed more attention. The predictions were incredibly accurate and helped me plan my study schedule effectively."
    },
    {
      name: "Michael Johnson", 
      role: "Business Administration",
      image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/N1bPFEGoXY/a9ilgzwt_expires_30_days.png",
      quote: "The AI predictions gave me confidence in my academic planning. I could see exactly what grades I needed to achieve my target GPA."
    },
    {
      name: "Emily Lee",
      role: "Psychology Student", 
      image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/N1bPFEGoXY/k0o5j2l7_expires_30_days.png",
      quote: "Amazing tool! It predicted my final grades with 95% accuracy. The study recommendations were spot-on and really helped improve my performance."
    }
  ];

  return (
    <div className="mb-[198px]">
      <div className="flex flex-col items-center self-stretch mb-[26px]">
        <h2 className="text-[#3C315B] text-3xl md:text-[42px] font-bold">
          What Students Say
        </h2>
      </div>
      <p className="text-[#666666] text-lg text-center mb-[62px] max-w-4xl mx-auto px-4">
        Discover how ScorePredict has transformed academic planning for thousands of students
      </p>
      <div className="flex flex-col md:flex-row items-start justify-center gap-8 px-4 md:px-8 lg:px-[132px]">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="flex-1 flex flex-col items-start bg-white py-[33px] rounded-[20px] border border-solid border-[#F0F0F0]">
            <div className="flex items-center ml-8 gap-4 mb-6">
              <img
                src={testimonial.image} 
                className="w-[60px] h-[60px] object-fill rounded-full"
                alt={testimonial.name}
              />
              <div className="flex flex-col shrink-0 items-start">
                <h4 className="text-[#3C315B] text-lg font-bold">
                  {testimonial.name}
                </h4>
                <p className="text-[#666666] text-sm">
                  {testimonial.role}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-start self-stretch mx-8">
              <p className="text-[#666666] text-base mb-3.5">
                "{testimonial.quote}"
              </p>
              <div className="text-[#FF9933] text-xl">
                ★★★★★
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsSection;
