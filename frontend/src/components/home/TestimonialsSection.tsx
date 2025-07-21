import React from 'react';
import TestimonialCard from './TestimonialCard';

interface Testimonial {
  name: string;
  role: string;
  avatar: string;
  testimonial: string;
  rating: string;
  hasGap?: boolean;
  testimonialWidth?: number | string | null;
}

const TestimonialsSection: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      name: 'Jessica Smith',
      role: 'Computer Science Major',
      avatar: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/N1bPFEGoXY/yyp527bk_expires_30_days.png',
      testimonial:
        '"ScorePredict helped me identify which subjects needed more attention. The predictions were incredibly accurate and helped me plan my study schedule effectively."',
      rating: '★★★★★',
      hasGap: true,
      testimonialWidth: 281,
    },
    {
      name: 'Michael Johnson',
      role: 'Business Administration',
      avatar: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/N1bPFEGoXY/a9ilgzwt_expires_30_days.png',
      testimonial:
        '"The AI predictions gave me confidence in my academic planning. I could see exactly what grades I needed to achieve my target GPA."',
      rating: '★★★★★',
      hasGap: false,
      testimonialWidth: null,
    },
    {
      name: 'Emily Lee',
      role: 'Psychology Student',
      avatar: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/N1bPFEGoXY/k0o5j2l7_expires_30_days.png',
      testimonial:
        '"Amazing tool! It predicted my final grades with 95% accuracy. The study recommendations were spot-on and really helped improve my performance."',
      rating: '★★★★★',
      hasGap: false,
      testimonialWidth: null,
    },
  ];

  return (
    <div id="testimonials-section" className="self-stretch flex flex-col mb-[198px]">
      <div className="self-stretch flex flex-col items-center mb-[26px]">
        <span className="text-[#3C315B] text-[42px] font-bold">
          What Students Say
        </span>
      </div>
      <span className="text-[#666666] text-[18px] text-center mb-[62px] mx-[428px]">
        Discover how ScorePredict has transformed academic planning for thousands of students
      </span>
      <div className="self-stretch flex items-start mx-[132px] gap-[32px]">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard key={index} {...testimonial} />
        ))}
      </div>
    </div>
  );
};

export default TestimonialsSection;
