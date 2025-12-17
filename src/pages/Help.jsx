import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Mail, Phone, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react'

export default function Help() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('general')
  const [openFaqs, setOpenFaqs] = useState({})

  const faqCategories = {
    general: [
      {
        question: 'What is LoanSewa and how does it work?',
        answer: 'LoanSewa is an AI-powered digital lending platform that provides quick and transparent loans to entrepreneurs. Our system uses advanced algorithms to assess creditworthiness based on both traditional repayment history and alternative data sources like utility bills and mobile usage patterns.'
      },
      {
        question: 'Who is eligible to apply for loans?',
        answer: 'Any Indian entrepreneur or small business owner above 18 years of age with a valid business can apply. We specifically focus on supporting marginalized communities and small enterprises that may not have access to traditional banking services.'
      },
      {
        question: 'How is my credit score calculated?',
        answer: 'Your credit score is calculated using our dual-assessment framework that evaluates both your business viability (repayment history, business longevity) and financial need (income verification through consumption patterns). This comprehensive approach ensures fair assessment.'
      }
    ],
    application: [
      {
        question: 'What documents do I need to apply for a loan?',
        answer: 'You need basic KYC documents (Aadhaar, PAN), business registration proof, and optional consumption data like electricity bills or mobile recharge history. The more documents you provide, the better we can assess your application.'
      },
      {
        question: 'How long does the application process take?',
        answer: 'Most applications are processed within 24 hours. Eligible applicants with high credit scores may receive instant approval and same-day disbursement through our auto-approval system.'
      },
      {
        question: 'Can I track my application status?',
        answer: 'Yes, you can track your application in real-time through your dashboard. You will receive notifications at every stage of the process.'
      }
    ],
    scoring: [
      {
        question: 'What factors affect my credit score?',
        answer: 'Your score is influenced by repayment history, business stability, income patterns, document completeness, and consumption behavior. Regular bill payments and consistent business activity positively impact your score.'
      },
      {
        question: 'How can I improve my credit score?',
        answer: 'Upload recent utility bills, maintain consistent repayment patterns, keep your business information updated, and ensure all documents are current. Our dashboard provides personalized improvement tips.'
      },
      {
        question: 'How often is my score updated?',
        answer: 'Your score is updated in real-time as new data becomes available. Major updates occur when you upload new documents or complete loan repayments.'
      }
    ],
    technical: [
      {
        question: 'Is my data secure with LoanSewa?',
        answer: 'Yes, we use bank-level encryption and follow strict data privacy protocols. Your personal and financial information is protected with multiple security layers and is never shared without your consent.'
      },
      {
        question: 'What is the AI assessment process?',
        answer: 'Our AI analyzes multiple data points including your repayment capacity, business health, and consumption patterns to create a comprehensive risk profile. This ensures fair and unbiased lending decisions.'
      },
      {
        question: 'How does the blockchain audit work?',
        answer: 'Every loan decision is recorded on a secure blockchain, creating an immutable audit trail. This ensures complete transparency and prevents any manipulation of decision records.'
      }
    ]
  }

  const tutorials = [
    {
      title: 'Complete Application Guide',
      steps: [
        'Create your account with basic details',
        'Fill the loan application form',
        'Upload required documents',
        'Submit for AI assessment',
        'Track your application status'
      ],
      duration: '10 minutes'
    },
    {
      title: 'Improving Your Credit Score',
      steps: [
        'Update your business information regularly',
        'Upload recent utility bills',
        'Maintain consistent repayment patterns',
        'Complete your profile with all documents',
        'Follow personalized improvement tips'
      ],
      duration: 'Ongoing'
    },
    {
      title: 'Document Upload Process',
      steps: [
        'Prepare digital copies of your documents',
        'Ensure documents are clear and readable',
        'Upload through secure portal',
        'Verify document acceptance',
        'Track verification status'
      ],
      duration: '5 minutes'
    }
  ]

  const toggleFaq = (category, index) => {
    const key = `${category}-${index}`
    setOpenFaqs(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const filteredFaqs = Object.entries(faqCategories).reduce((acc, [category, faqs]) => {
    if (category === activeCategory || activeCategory === 'all') {
      acc[category] = faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help & Support</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions and get support for your LoanSewa journey
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Categories */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {[
                  { id: 'all', label: 'All Questions' },
                  { id: 'general', label: 'General' },
                  { id: 'application', label: 'Application Process' },
                  { id: 'scoring', label: 'Credit Scoring' },
                  { id: 'technical', label: 'Technical' }
                ].map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      activeCategory === category.id
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>

              {/* Contact Support */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Still need help?</h3>
                <div className="space-y-3">
                  <a href="tel:+1800-123-4567" className="flex items-center text-gray-700 hover:text-blue-600">
                    <Phone className="w-5 h-5 mr-3" />
                    <span>+1 800-123-4567</span>
                  </a>
                  <a href="mailto:support@LoanSewa.com" className="flex items-center text-gray-700 hover:text-blue-600">
                    <Mail className="w-5 h-5 mr-3" />
                    <span>support@LoanSewa.com</span>
                  </a>
                  <button className="flex items-center text-gray-700 hover:text-blue-600">
                    <MessageCircle className="w-5 h-5 mr-3" />
                    <span>Live Chat</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* FAQs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              
              <div className="space-y-4">
                {Object.entries(filteredFaqs).map(([category, faqs]) => (
                  <div key={category}>
                    {faqs.length > 0 && activeCategory === 'all' && (
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 capitalize">
                        {category} Questions
                      </h3>
                    )}
                    {faqs.map((faq, index) => {
                      const key = `${category}-${index}`
                      const isOpen = openFaqs[key]
                      
                      return (
                        <div key={key} className="border border-gray-200 rounded-lg">
                          <button
                            onClick={() => toggleFaq(category, index)}
                            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 rounded-lg"
                          >
                            <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                            {isOpen ? (
                              <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                            )}
                          </button>
                          {isOpen && (
                            <div className="px-4 pb-4">
                              <p className="text-gray-600">{faq.answer}</p>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Tutorials */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Step-by-Step Guides</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {tutorials.map((tutorial, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{tutorial.title}</h3>
                    <div className="space-y-3 mb-4">
                      {tutorial.steps.map((step, stepIndex) => (
                        <div key={stepIndex} className="flex items-start">
                          <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-sm flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                            {stepIndex + 1}
                          </div>
                          <span className="text-sm text-gray-600">{step}</span>
                        </div>
                      ))}
                    </div>
                    <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full inline-block">
                      Duration: {tutorial.duration}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Support Team</h2>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Brief description of your issue"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Please describe your issue in detail..."
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}