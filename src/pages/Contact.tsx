
import React from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

const Contact = () => {
  return (
    <div className="min-h-screen">
      <main className="py-12 md:py-16 mt-16 md:mt-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">Contact Us</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
              <div>
                <p className="text-lg md:text-xl text-muted-foreground mb-6 md:mb-8">
                  Have questions or feedback? We'd love to hear from you. Reach out to our team using any of the methods below.
                </p>
                
                <div className="space-y-4 md:space-y-6">
                  <Card className="p-3 md:p-4">
                    <div className="flex items-start">
                      <div className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3 md:mr-4 flex-shrink-0">
                        <MapPin className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Visit Us</h3>
                        <address className="not-italic text-muted-foreground text-sm md:text-base">
                          Walchand Institute of Technology<br />
                          Walchand Hirachand Marg<br />
                          Ashok Chowk, Solapur<br />
                          Maharashtra, India<br />
                          PIN: 413005
                        </address>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="p-3 md:p-4">
                    <div className="flex items-start">
                      <div className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3 md:mr-4 flex-shrink-0">
                        <Mail className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Email Us</h3>
                        <p className="text-muted-foreground text-sm md:text-base">
                          <a href="mailto:nexify@gmail.com" className="hover:text-primary transition-colors">
                            nexify@gmail.com
                          </a>
                        </p>
                        <p className="text-xs md:text-sm text-muted-foreground mt-1">
                          We aim to respond to all inquiries within 24 hours.
                        </p>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="p-3 md:p-4">
                    <div className="flex items-start">
                      <div className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3 md:mr-4 flex-shrink-0">
                        <Phone className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Call Us</h3>
                        <p className="text-muted-foreground text-sm md:text-base">
                          <a href="tel:+918888888888" className="hover:text-primary transition-colors">
                            +91 8888 888 888
                          </a>
                        </p>
                        <p className="text-xs md:text-sm text-muted-foreground mt-1">
                          Available Monday-Friday, 9:00 AM - 6:00 PM IST
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
              
              <div>
                <div className="bg-card rounded-lg border p-4 md:p-6">
                  <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Send Us a Message</h2>
                  
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" placeholder="Your name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="Your email" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input id="subject" placeholder="What is this regarding?" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea id="message" placeholder="Your message" rows={4} />
                    </div>
                    
                    <Button type="submit" className="w-full">
                      Send Message
                      <Send className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;
