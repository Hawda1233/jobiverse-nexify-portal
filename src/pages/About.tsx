
import React from 'react';
import { Building, Globe, Layers, Users } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen">
      <main className="py-16 mt-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-6">About Nexify</h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-muted-foreground mb-8">
                Revolutionizing the way people find their dream careers and employers discover ideal candidates in India.
              </p>
              
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Building className="mr-2 h-6 w-6 text-primary" />
                Our Story
              </h2>
              <p className="mb-6">
                Founded in 2023, Nexify was born from a simple observation: the job search process in India was fragmented, inefficient, and often frustrating for both job seekers and employers. We set out to create a platform that leverages cutting-edge technology to make career transitions seamless and recruitment processes more effective.
              </p>
              
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Globe className="mr-2 h-6 w-6 text-primary" />
                Our Mission
              </h2>
              <p className="mb-6">
                At Nexify, our mission is to bridge the gap between talent and opportunity. We're committed to empowering professionals at every stage of their career journey while helping organizations build diverse, skilled teams that drive innovation and growth.
              </p>
              
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Layers className="mr-2 h-6 w-6 text-primary" />
                What Sets Us Apart
              </h2>
              <ul className="space-y-2 mb-6">
                <li><strong>AI-Powered Matching:</strong> Our intelligent algorithms analyze skills, experience, and preferences to create meaningful connections between candidates and employers.</li>
                <li><strong>Comprehensive Resources:</strong> Beyond job listings, we provide career guidance, skill development resources, and industry insights tailored to the Indian market.</li>
                <li><strong>Focus on Transparency:</strong> We believe in creating an ecosystem where information flows freely, empowering better career decisions and hiring choices.</li>
                <li><strong>Community-Centered:</strong> We're building a supportive community of professionals who share knowledge, mentorship, and opportunities.</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Users className="mr-2 h-6 w-6 text-primary" />
                Our Team
              </h2>
              <p className="mb-6">
                Nexify is powered by a diverse team of technologists, HR professionals, and career development experts who are passionate about creating a platform that truly serves the needs of the Indian workforce. Based in Solapur, Maharashtra, our team combines deep industry knowledge with technical expertise to continuously evolve our platform.
              </p>
              
              <div className="bg-muted/30 p-6 rounded-lg border mt-10">
                <h3 className="text-xl font-semibold mb-3">Join Us in Shaping the Future of Work</h3>
                <p className="mb-4">
                  Whether you're looking for your next career opportunity, searching for top talent, or interested in partnering with us, we invite you to be part of the Nexify community.
                </p>
                <p className="text-muted-foreground">
                  Together, we can create a more efficient, transparent, and equitable job market in India.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
