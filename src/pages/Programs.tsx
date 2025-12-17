import { Link } from "react-router-dom";
import {
  Heart,
  GraduationCap,
  Users,
  Sprout,
  ShieldCheck,
  Smile,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import programImage1 from "@/assets/gallery/school-materials-new.jpeg";
import programImage2 from "@/assets/gallery/founder-with-children-1.jpeg";
import programImage3 from "@/assets/gallery/school-visit-2.jpeg";

const Programs = () => {
  const programs = [
    {
      icon: <Heart className="w-16 h-16 text-secondary" />,
      title: "Deworming in Schools",
      description:
        "Our flagship health initiative provides systematic deworming programs in schools across Lagos communities. This critical intervention substantially improves children's health, increases school attendance, and enhances learning outcomes for both treated and untreated children in participating and neighboring schools.",
      image: programImage1,
      impact: [
        "Improved child health and nutrition",
        "Increased school attendance rates",
        "Enhanced learning and concentration",
        "Reduced disease transmission in communities",
      ],
    },
    {
      icon: <GraduationCap className="w-16 h-16 text-accent" />,
      title: "School Materials Distribution",
      description:
        "We provide essential school supplies to children from underserved families, ensuring they can attend school with dignity and preparedness. Our distributions include notebooks, textbooks, writing materials, school uniforms, sandals, and school bags.",
      image: programImage2,
      impact: [
        "Enabled school attendance for hundreds of children",
        "Reduced financial burden on struggling families",
        "Boosted children's confidence and self-esteem",
        "Supported consistent academic participation",
      ],
    },
    {
      icon: <ShieldCheck className="w-16 h-16 text-primary" />,
      title: "Health Education & Preventive Care",
      description:
        "We conduct community health education sessions focusing on hygiene, nutrition, disease prevention, and mental wellness. Our programs empower individuals with knowledge to make informed health decisions and adopt healthier lifestyles.",
      image: programImage3,
      impact: [
        "Increased health awareness in communities",
        "Adoption of better hygiene practices",
        "Early disease detection and prevention",
        "Improved overall community wellbeing",
      ],
    },
    {
      icon: <Users className="w-16 h-16 text-secondary" />,
      title: "Women & Youth Empowerment",
      description:
        "We provide support, resources, and mentorship to women, youth, and widows, helping them develop skills, access opportunities, and achieve self-sufficiency. Our programs focus on building confidence, providing practical assistance, and creating pathways to independence.",
      image: null,
      impact: [
        "Skills development and capacity building",
        "Economic empowerment opportunities",
        "Emotional support and mentorship",
        "Community leadership development",
      ],
    },
    {
      icon: <Sprout className="w-16 h-16 text-accent" />,
      title: "Community Support Initiatives",
      description:
        "We provide direct assistance to families and individuals facing hardship, including food support, emergency aid, and resources for basic needs. Our approach emphasizes dignity, respect, and support without conditions or strings attached.",
      image: null,
      impact: [
        "Immediate relief for families in crisis",
        "Prevention of deeper poverty cycles",
        "Strengthened community bonds",
        "Hope and encouragement restored",
      ],
    },
    {
      icon: <Smile className="w-16 h-16 text-primary" />,
      title: "Mental Health & Wellbeing",
      description:
        "We offer support, encouragement, and resources for people struggling with depression, discouragement, and disappointment. Through compassionate listening, practical guidance, and community connection, we help individuals find healthier ways to cope with challenges.",
      image: null,
      impact: [
        "Lives saved through intervention and support",
        "Reduced isolation and loneliness",
        "Increased hope and resilience",
        "Stronger mental health awareness",
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading font-bold text-4xl md:text-6xl text-white mb-4">
            Our Programs
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
            Comprehensive initiatives addressing real needs and creating lasting
            positive change in communities across Lagos
          </p>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="space-y-16">
            {programs.map((program, index) => (
              <Card
                key={index}
                className="border-none shadow-xl rounded-2xl overflow-hidden"
              >
                <div
                  className={`grid grid-cols-1 ${
                    program.image ? "md:grid-cols-2" : "md:grid-cols-1"
                  } gap-0`}
                >
                  {program.image && (
                    <div
                      className={`${
                        index % 2 === 0 ? "md:order-1" : "md:order-2"
                      }`}
                    >
                      <img
                        src={program.image}
                        alt={program.title}
                        className="w-full h-full object-cover min-h-[300px]"
                      />
                    </div>
                  )}
                  <CardContent
                    className={`p-8 md:p-12 ${
                      program.image
                        ? index % 2 === 0
                          ? "md:order-2"
                          : "md:order-1"
                        : ""
                    }`}
                  >
                    <div className="mb-6">{program.icon}</div>
                    <h2 className="font-heading font-bold text-3xl mb-4">
                      {program.title}
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                      {program.description}
                    </p>

                    <div>
                      <h3 className="font-heading font-semibold text-xl mb-4 text-primary">
                        Impact & Outcomes
                      </h3>
                      <ul className="space-y-2">
                        {program.impact.map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <div className="bg-secondary/20 rounded-full p-1 mt-1">
                              <div className="w-2 h-2 bg-secondary rounded-full" />
                            </div>
                            <span className="text-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary mb-4">
            Support Our Programs
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Your contribution helps us expand these vital programs and reach
            more people in need
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/donate"
              className="inline-flex items-center justify-center px-8 py-3 bg-gradient-hero text-white font-secondary font-bold text-lg rounded-full hover:opacity-90 transition-opacity"
            >
              Make a Donation
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-primary text-primary font-secondary font-bold text-lg rounded-full hover:bg-primary hover:text-white transition-colors"
            >
              Partner With Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Programs;
