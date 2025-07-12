import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, FileText, Search, Award, Mic, Users } from 'lucide-react';
import BlockchainCube from '../components/BlockchainCube';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: FileText,
      title: 'Issue Certificates',
      description: 'Create and mint blockchain certificates as NFTs',
      link: '/issue',
      color: 'purple'
    },
    {
      icon: Search,
      title: 'Verify Credentials',
      description: 'Instantly verify any certificate authenticity',
      link: '/verify',
      color: 'pink'
    },
    {
      icon: Award,
      title: 'My Certificates',
      description: 'View and manage your credential portfolio',
      link: '/my-certificates',
      color: 'blue'
    },
    {
      icon: Mic,
      title: 'Voice Assistant',
      description: 'Use AI voice commands to interact with the platform',
      link: '/voice-agent',
      color: 'green'
    },
    {
      icon: Users,
      title: 'Bulk Issue',
      description: 'Issue multiple certificates at once via CSV',
      link: '/bulk-issue',
      color: 'orange'
    },
    {
      icon: Shield,
      title: 'Admin Dashboard',
      description: 'Manage institution settings and analytics',
      link: '/admin',
      color: 'red'
    }
  ];

  const colorClasses = {
    purple: 'from-purple-500 to-purple-600',
    pink: 'from-pink-500 to-pink-600',
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600'
  };

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-slate-900 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-20 w-48 h-48 bg-pink-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                  The Future of{' '}
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Academic Credentials
                  </span>{' '}
                  is Here.
                </h1>
                
                <p className="text-xl text-slate-300 leading-relaxed max-w-2xl">
                  EduCred leverages blockchain and IPFS to issue secure, tamper-proof digital certificates as NFTs. 
                  Say goodbye to academic fraud, manual verification delays, and third-party dependencies.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/verify" 
                  className="group bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-purple-500/25 flex items-center justify-center space-x-2"
                >
                  <span>Verify a Credential Now</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link 
                  to="/issue"
                  className="group border border-slate-600 text-slate-300 px-8 py-4 rounded-lg font-medium hover:border-purple-400 hover:text-purple-400 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <FileText className="w-5 h-5" />
                  <span>Issue Certificate</span>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-slate-800">
                <div>
                  <div className="text-2xl font-bold text-white">10M+</div>
                  <div className="text-slate-400 text-sm">Credentials Issued</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">500+</div>
                  <div className="text-slate-400 text-sm">Institutions</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">99.9%</div>
                  <div className="text-slate-400 text-sm">Uptime</div>
                </div>
              </div>
            </div>

            {/* Right Content - Blockchain Cube */}
            <div className="relative">
              <BlockchainCube />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Complete Credential Management Platform
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Everything you need to issue, verify, and manage blockchain credentials
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Link
                  key={index}
                  to={feature.link}
                  className="group relative p-8 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-all duration-300 hover:transform hover:scale-105"
                >
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[feature.color]} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
                  
                  <div className="relative">
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${colorClasses[feature.color]} mb-6`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-purple-400 transition-colors">
                      {feature.title}
                    </h3>
                    
                    <p className="text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>

                    <div className="mt-6 flex items-center text-purple-400 group-hover:text-purple-300 transition-colors">
                      <span className="text-sm font-medium">Get Started</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;