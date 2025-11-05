import { Heart, Target, Lightbulb } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import founderImage from "@/assets/gallery/founder-portrait-new.jpeg";
import secretaryEuodia from "@/assets/team/secretary-euodia.png";
import secretaryBlessing from "@/assets/team/secretary-blessing.png";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading font-bold text-4xl md:text-6xl text-white mb-4">
            About JAHEF
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
            Born from personal hardship, dedicated to transforming lives through
            genuine compassion and community support
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h2 className="font-heading font-bold text-3xl text-primary">
                  Our Mission
                </h2>
              </div>
              <p className="text-lg leading-relaxed text-foreground">
                Reducing the transmission of infection in the community as a
                whole. Deworming substantially improves health and school
                participation for both treated and untreated children, in
                treatment schools and in neighboring schools.
              </p>
            </div>
            <div className="bg-gradient-card rounded-2xl p-8 shadow-lg">
              <Heart className="w-12 h-12 text-secondary mb-4" />
              <h3 className="font-heading font-bold text-2xl mb-4">
                Our Approach
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                We believe in providing support without strings attached. Every
                person who comes to us receives genuine care, respect, and
                assistance because we understand firsthand what it means to be
                in need.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-accent/10 p-3 rounded-full">
                <Lightbulb className="w-8 h-8 text-accent" />
              </div>
              <h2 className="font-heading font-bold text-3xl text-primary">
                Our Vision
              </h2>
            </div>
            <p className="text-lg leading-relaxed text-foreground mb-6">
              Helping people who are struggling with depression, discouragement,
              and disappointment understand that there are better ways to deal
              with those problems without hurting yourself or others or even
              committing suicide, because life is a precious gift from the
              Creator of life, Jehovah God, who loves and cares for each and
              every one of us.
            </p>
            <p className="text-lg leading-relaxed text-foreground">
              Our vision also includes making people happy and laugh, for we
              believe that a single laugh can take away millions of sorrows and
              bring more happiness, good memories, and love, which contribute to
              good health.
            </p>
          </div>
        </div>
      </section>

      {/* Founder's Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl md:text-5xl text-primary mb-4">
              The Heart Behind JAHEF
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A story of overcoming adversity to create hope for others
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="bg-card rounded-2xl shadow-xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                <div className="md:col-span-2">
                  <img
                    src={founderImage}
                    alt="Jessica Akpobi - Founder of JAHEF"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:col-span-3 p-8 md:p-12">
                  <h3 className="font-heading font-bold text-2xl mb-6 text-primary">
                    Why JAHEF Exists
                  </h3>
                  <div className="space-y-4 text-foreground leading-relaxed">
                    <p>
                      The inspiration behind Jessica Akpobi Health Empowering
                      Foundation comes from deeply personal experience. Our
                      founder faced tremendous hardships and struggles with no
                      one to offer genuine help. When assistance did come, it
                      often came with strings attached, and refusing meant being
                      turned out in the middle of the night with nowhere to go.
                    </p>
                    <p>
                      She experienced the crushing disappointment of helping
                      others only to have them turn their backs when she needed
                      them most. She endured anxiety, discouragement, and
                      betrayal from people she loved, respected, and cared for.
                      She went hungry to help others, only to face theft and
                      blackmail from those who knew her vulnerable past.
                    </p>
                    <p className="font-semibold text-primary">
                      There is no feeling worse than this kind of rejection and
                      dejection.
                    </p>
                    <p>
                      During her darkest moments, thoughts of ending her life
                      seemed like the only escape. But through the Almighty's
                      intervention, she survived and found strength. These
                      experiences gave her profound understanding of the
                      critical importance of providing support and assistance to
                      people going through difficult situations.
                    </p>
                    <p>
                      From this pain emerged gratitude for overcoming those
                      challenges, which now motivates her desire to pay it
                      forward and help others. Her experiences instilled deep
                      empathy and compassion for those in need. Most
                      importantly, they ignited an unshakeable desire to make a
                      difference and create positive change in people's lives.
                    </p>
                    <p className="font-semibold text-accent">
                      This personal story serves as the powerful motivator
                      driving JAHEF's philanthropic efforts and inspiring others
                      to join our cause.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl md:text-5xl text-primary mb-4">
              Our Team
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Meet the dedicated secretaries supporting JAHEF's mission
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-card rounded-2xl shadow-xl overflow-hidden">
              <img
                src={secretaryEuodia}
                alt="Akpobi Euodia Oghenevwerhe"
                className="w-full h-80 object-cover"
              />
              <div className="p-6">
                <h3 className="font-heading font-bold text-xl mb-2 text-primary">
                  ✨ Akpobi Euodia Oghenevwerhe
                </h3>
                <p className="text-accent font-semibold mb-4">Secretary</p>
                <p className="text-foreground leading-relaxed">
                  Euodia is one of the most dedicated pillars of the Jessica Akpobi Health Empowering Foundation (JAHEF). With her calm presence and sharp organizational skills, she ensures that every outreach, school program, and empowerment event runs smoothly.
                </p>
                <p className="text-foreground leading-relaxed mt-3">
                  Her attention to detail, warm communication, and devotion to helping the less privileged make her an irreplaceable member of the JAHEF team. Whether it's organizing reports, welcoming partners, or assisting during school visits, Euodia brings a sense of joy and excellence to every effort.
                </p>
              </div>
            </div>

            <div className="bg-card rounded-2xl shadow-xl overflow-hidden">
              <img
                src={secretaryBlessing}
                alt="Osadolor Blessing Ngozi"
                className="w-full h-80 object-cover"
              />
              <div className="p-6">
                <h3 className="font-heading font-bold text-xl mb-2 text-primary">
                  💫 Osadolor Blessing Ngozi
                </h3>
                <p className="text-accent font-semibold mb-4">Secretary</p>
                <p className="text-foreground leading-relaxed">
                  Blessing is known for her bright energy and genuine empathy. As one of JAHEF's secretaries, she bridges the gap between planning and action, making sure every project reflects the Foundation's mission of care and community upliftment.
                </p>
                <p className="text-foreground leading-relaxed mt-3">
                  Behind the scenes, Blessing coordinates communication between volunteers, donors, and beneficiaries, keeping the heart of JAHEF beating with order and compassion. Her kindness and humility shine through every task, reminding everyone that true service begins with love and discipline.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
