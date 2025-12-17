import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ArrowRight, Shield, Zap, Users, CheckCircle } from 'lucide-react'
import { ThreeBackground, FloatingParticles } from '../components/ThreeBackground'

export default function Home() {
  const heroRef = useRef()
  const featuresRef = useRef()

  useEffect(() => {
    // Hero section animation
    gsap.fromTo('.hero-title', 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, delay: 0.2 }
    )
    
    gsap.fromTo('.hero-subtitle', 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, delay: 0.5 }
    )
    
    gsap.fromTo('.hero-cta', 
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.8, delay: 0.8 }
    )

    // Features animation on scroll
    gsap.fromTo('.feature-card',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.2,
        scrollTrigger: {
          trigger: featuresRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      }
    )
  }, [])

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Fast Approvals',
      description: 'Get loan decisions in hours, not weeks with our AI-powered assessment'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Transparent Process',
      description: 'Clear terms, no hidden charges, and complete visibility into your application'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Financial Inclusion',
      description: 'Special focus on marginalized entrepreneurs and small business owners'
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: 'Low Risk Auto-Approval',
      description: 'Qualified applicants get instant approval and same-day disbursement'
    }
  ]

  const steps = [
    {
      step: '1',
      title: 'Apply Online',
      description: 'Fill simple digital application with basic details and documents'
    },
    {
      step: '2',
      title: 'AI Credit Scoring',
      description: 'Our system analyzes your business health and repayment capacity'
    },
    {
      step: '3',
      title: 'Get Approved',
      description: 'Receive instant decision and quick disbursement to your account'
    }
  ]

  return (
    <div className="min-h-screen bg-white  transition-colors duration-300">
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="absolute inset-0 z-0">
          <Canvas>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <ThreeBackground />
            <FloatingParticles />
          </Canvas>
        </div>
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <motion.h1 
            className="hero-title text-5xl md:text-7xl font-bold mb-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Fast, Transparent,<br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Digital Loans
            </span>
          </motion.h1>
          
          <motion.p 
            className="hero-subtitle text-xl md:text-2xl text-gray-300  mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Empowering entrepreneurs with AI-driven credit assessment and instant loan approvals
          </motion.p>
          
          <motion.div 
            className="hero-cta"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link
              to="/apply-loan"
              className="inline-flex items-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100  transition-colors shadow-2xl"
            >
              Apply Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white  transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900  mb-4">How It Works</h2>
            <p className="text-xl text-gray-600  max-w-2xl mx-auto">
              Simple, transparent process from application to disbursement
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="feature-card text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50  border border-blue-100"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900  mb-4">{step.title}</h3>
                <p className="text-gray-600 ">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section ref={featuresRef} className="py-20 bg-gray-50  transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 ">Why Choose LoanSewa</h2>
            <p className="text-xl text-gray-600  max-w-2xl mx-auto">
              Innovative features designed for modern entrepreneurs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card bg-white  p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all"
                whileHover={{ y: -5 }}
              >
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Grow Your Business?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of entrepreneurs who have transformed their businesses with LoanSewa
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-2xl"
          >
            Get Started Today
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}