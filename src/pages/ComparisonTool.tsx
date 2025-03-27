
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { BadgeCheck, Building, DollarSign, BriefcaseBusiness, Scale, Award } from 'lucide-react';

const companies = [
  { id: 1, name: 'Tata Consultancy Services', logo: '/tcs.svg' },
  { id: 2, name: 'Infosys', logo: '/infosys.svg' },
  { id: 3, name: 'Wipro', logo: '/wipro.svg' },
  { id: 4, name: 'HCL Technologies', logo: '/hcl.svg' },
  { id: 5, name: 'Tech Mahindra', logo: '/techmahindra.svg' },
  { id: 6, name: 'Accenture', logo: '/accenture.svg' },
  { id: 7, name: 'Cognizant', logo: '/cognizant.svg' },
  { id: 8, name: 'Capgemini', logo: '/capgemini.svg' },
  { id: 9, name: 'IBM India', logo: '/ibm.svg' },
  { id: 10, name: 'Microsoft India', logo: '/microsoft.svg' },
];

interface CompanyStats {
  workLifeBalance: number;
  salaryBenefits: number;
  culture: number;
  careerGrowth: number;
  management: number;
  avgSalary: string;
  hiringSeasonal: boolean;
  remoteFriendly: boolean;
  hiringVolume: 'High' | 'Medium' | 'Low';
}

const companyStats: Record<number, CompanyStats> = {
  1: { 
    workLifeBalance: 3.5, 
    salaryBenefits: 3.8, 
    culture: 4.0, 
    careerGrowth: 4.2, 
    management: 3.7,
    avgSalary: '₹6-18L',
    hiringSeasonal: true,
    remoteFriendly: false,
    hiringVolume: 'High'
  },
  2: { 
    workLifeBalance: 3.7, 
    salaryBenefits: 4.0, 
    culture: 3.9, 
    careerGrowth: 4.3, 
    management: 3.8,
    avgSalary: '₹7-22L',
    hiringSeasonal: true,
    remoteFriendly: true,
    hiringVolume: 'High'
  },
  3: { 
    workLifeBalance: 3.8, 
    salaryBenefits: 3.6, 
    culture: 3.7, 
    careerGrowth: 3.9, 
    management: 3.5,
    avgSalary: '₹6-16L',
    hiringSeasonal: true,
    remoteFriendly: true,
    hiringVolume: 'Medium'
  },
  4: { 
    workLifeBalance: 3.4, 
    salaryBenefits: 3.9, 
    culture: 3.6, 
    careerGrowth: 4.0, 
    management: 3.6,
    avgSalary: '₹7-20L',
    hiringSeasonal: false,
    remoteFriendly: true,
    hiringVolume: 'Medium'
  },
  5: { 
    workLifeBalance: 3.6, 
    salaryBenefits: 3.7, 
    culture: 3.8, 
    careerGrowth: 3.8, 
    management: 3.4,
    avgSalary: '₹5-18L',
    hiringSeasonal: false,
    remoteFriendly: true,
    hiringVolume: 'Medium'
  },
  6: { 
    workLifeBalance: 3.2, 
    salaryBenefits: 4.2, 
    culture: 4.1, 
    careerGrowth: 4.5, 
    management: 4.0,
    avgSalary: '₹8-25L',
    hiringSeasonal: true,
    remoteFriendly: false,
    hiringVolume: 'High'
  },
  7: { 
    workLifeBalance: 3.4, 
    salaryBenefits: 3.9, 
    culture: 3.7, 
    careerGrowth: 4.1, 
    management: 3.6,
    avgSalary: '₹6-20L',
    hiringSeasonal: true,
    remoteFriendly: true,
    hiringVolume: 'Medium'
  },
  8: { 
    workLifeBalance: 3.3, 
    salaryBenefits: 3.8, 
    culture: 3.9, 
    careerGrowth: 4.0, 
    management: 3.7,
    avgSalary: '₹7-19L',
    hiringSeasonal: false,
    remoteFriendly: true,
    hiringVolume: 'Medium'
  },
  9: { 
    workLifeBalance: 3.9, 
    salaryBenefits: 4.1, 
    culture: 4.0, 
    careerGrowth: 4.2, 
    management: 3.9,
    avgSalary: '₹8-28L',
    hiringSeasonal: false,
    remoteFriendly: true,
    hiringVolume: 'Medium'
  },
  10: { 
    workLifeBalance: 4.3, 
    salaryBenefits: 4.7, 
    culture: 4.5, 
    careerGrowth: 4.6, 
    management: 4.4,
    avgSalary: '₹15-60L',
    hiringSeasonal: false,
    remoteFriendly: true,
    hiringVolume: 'Low'
  }
};

const ComparisonTool = () => {
  const [selectedCompanies, setSelectedCompanies] = useState<number[]>([]);

  const handleSelectCompany = (id: number) => {
    if (selectedCompanies.includes(id)) {
      setSelectedCompanies(selectedCompanies.filter(companyId => companyId !== id));
    } else if (selectedCompanies.length < 3) {
      setSelectedCompanies([...selectedCompanies, id]);
    }
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center">
        <span className="text-lg font-semibold mr-2">{rating.toFixed(1)}</span>
        <div className="flex">
          {Array.from({ length: fullStars }).map((_, i) => (
            <svg key={`full-${i}`} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
          ))}
          {hasHalfStar && (
            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="half-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="50%" stopColor="currentColor"></stop>
                  <stop offset="50%" stopColor="#D1D5DB"></stop>
                </linearGradient>
              </defs>
              <path fill="url(#half-gradient)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
          )}
          {Array.from({ length: 5 - fullStars - (hasHalfStar ? 1 : 0) }).map((_, i) => (
            <svg key={`empty-${i}`} className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Company Comparison Tool</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Compare top Indian companies across key metrics like work culture, 
              salary benefits, career growth opportunities, and more.
            </p>
          </div>

          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-4">Select Companies to Compare (Max 3)</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {companies.map(company => (
                <div 
                  key={company.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedCompanies.includes(company.id) 
                      ? 'border-accent bg-accent/10' 
                      : 'border-border hover:border-accent/50'
                  }`}
                  onClick={() => handleSelectCompany(company.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Building className="h-6 w-6 mr-3 text-muted-foreground" />
                      <span className="font-medium">{company.name}</span>
                    </div>
                    <div>
                      {selectedCompanies.includes(company.id) && (
                        <BadgeCheck className="h-5 w-5 text-accent" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedCompanies.length > 0 && (
            <div className="space-y-8">
              <section>
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <Award className="mr-2 h-5 w-5 text-accent" />
                  <span>Company Ratings</span>
                </h2>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">Rating Category</TableHead>
                        {selectedCompanies.map(id => (
                          <TableHead key={id}>{companies.find(c => c.id === id)?.name}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Work-Life Balance</TableCell>
                        {selectedCompanies.map(id => (
                          <TableCell key={id}>{renderStars(companyStats[id].workLifeBalance)}</TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Salary & Benefits</TableCell>
                        {selectedCompanies.map(id => (
                          <TableCell key={id}>{renderStars(companyStats[id].salaryBenefits)}</TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Company Culture</TableCell>
                        {selectedCompanies.map(id => (
                          <TableCell key={id}>{renderStars(companyStats[id].culture)}</TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Career Growth</TableCell>
                        {selectedCompanies.map(id => (
                          <TableCell key={id}>{renderStars(companyStats[id].careerGrowth)}</TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Management</TableCell>
                        {selectedCompanies.map(id => (
                          <TableCell key={id}>{renderStars(companyStats[id].management)}</TableCell>
                        ))}
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <DollarSign className="mr-2 h-5 w-5 text-accent" />
                  <span>Salary & Hiring Insights</span>
                </h2>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">Category</TableHead>
                        {selectedCompanies.map(id => (
                          <TableHead key={id}>{companies.find(c => c.id === id)?.name}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Avg. Salary Range (Annual)</TableCell>
                        {selectedCompanies.map(id => (
                          <TableCell key={id} className="font-semibold">{companyStats[id].avgSalary}</TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Seasonal Hiring</TableCell>
                        {selectedCompanies.map(id => (
                          <TableCell key={id}>
                            {companyStats[id].hiringSeasonal ? 
                              <span className="text-green-600">Yes</span> : 
                              <span className="text-amber-600">No</span>
                            }
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Remote Friendly</TableCell>
                        {selectedCompanies.map(id => (
                          <TableCell key={id}>
                            {companyStats[id].remoteFriendly ? 
                              <span className="text-green-600">Yes</span> : 
                              <span className="text-amber-600">No</span>
                            }
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Hiring Volume</TableCell>
                        {selectedCompanies.map(id => (
                          <TableCell key={id}>
                            <span className={
                              companyStats[id].hiringVolume === 'High' 
                                ? 'text-green-600' 
                                : companyStats[id].hiringVolume === 'Medium'
                                  ? 'text-amber-600'
                                  : 'text-red-600'
                            }>
                              {companyStats[id].hiringVolume}
                            </span>
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </section>
            </div>
          )}

          {selectedCompanies.length === 0 && (
            <div className="bg-muted/50 rounded-lg p-8 text-center">
              <Scale className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Select Companies to Compare</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Choose up to 3 companies from the list above to see a detailed comparison 
                of ratings, salaries, and other key metrics.
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ComparisonTool;
