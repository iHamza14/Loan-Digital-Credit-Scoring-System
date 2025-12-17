import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { Upload, FileText, IndianRupee, Calendar, Briefcase, Camera, UserCheck, Shield } from 'lucide-react'

export default function ApplyLoan() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Personal Details
    fullName: '',
    age: '',
    contactNumber: '',
    address: '',
    
    // Loan Details
    loanAmount: '',
    loanPurpose: '',
    tenure: '',
    
    // Income Details
    businessType: '',
    monthlyIncome: '',
    electricityBill: null,
    mobileRecharge: null,
    utilityBills: null,

    // Identity Verification (NEW)
    aadhaarFront: null,
    aadhaarBack: null,
    panCard: null,
    videoKYC: null,
    identityVerified: false
  })

  const steps = [
    { number: 1, title: 'Personal Details' },
    { number: 2, title: 'Loan Request' },
    { number: 3, title: 'Income Verification' },
    { number: 4, title: 'Identity Verification' } // NEW STEP
  ]

  const handleNext = () => {
    if (currentStep < 4) { // Updated to 4 steps
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle loan application submission
    console.log('Loan application submitted:', formData)
  }

  const handleFileUpload = (field, file) => {
    setFormData(prev => ({ ...prev, [field]: file }))
  }

  const handleVideoKYC = () => {
    // Mock video KYC process
    setTimeout(() => {
      setFormData(prev => ({ ...prev, videoKYC: 'completed', identityVerified: true }))
      alert('Video KYC completed successfully!')
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Tracker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                      currentStep >= step.number
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-gray-300 text-gray-500'
                    }`}
                  >
                    {step.number}
                  </div>
                  <span
                    className={`mt-2 text-sm ${
                      currentStep >= step.number ? 'text-blue-600 font-medium' : 'text-gray-500'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 ${
                      currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-colors duration-300"
        >
          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Details */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.age}
                      onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
                      placeholder="Enter your age"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.contactNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactNumber: e.target.value }))}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
                      placeholder="Enter 10-digit mobile number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <textarea
                      required
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
                      placeholder="Enter your complete address"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-8">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Continue to Loan Details
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Loan Request */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Loan Request</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loan Amount (₹)
                    </label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="number"
                        required
                        value={formData.loanAmount}
                        onChange={(e) => setFormData(prev => ({ ...prev, loanAmount: e.target.value }))}
                        className="w-full pl-10 px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
                        placeholder="Enter loan amount"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loan Purpose
                    </label>
                    <select
                      required
                      value={formData.loanPurpose}
                      onChange={(e) => setFormData(prev => ({ ...prev, loanPurpose: e.target.value }))}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
                    >
                      <option value="">Select purpose</option>
                      <option value="business-expansion">Business Expansion</option>
                      <option value="working-capital">Working Capital</option>
                      <option value="equipment-purchase">Equipment Purchase</option>
                      <option value="inventory">Inventory Purchase</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Tenure (Months)
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="number"
                        required
                        value={formData.tenure}
                        onChange={(e) => setFormData(prev => ({ ...prev, tenure: e.target.value }))}
                        className="w-full pl-10 px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
                        placeholder="Enter loan tenure in months"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Continue to Income Verification
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Income Verification */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Income Verification</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Type
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={formData.businessType}
                        onChange={(e) => setFormData(prev => ({ ...prev, businessType: e.target.value }))}
                        className="w-full pl-10 px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
                        placeholder="Enter your business type"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Monthly Income (₹)
                    </label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="number"
                        required
                        value={formData.monthlyIncome}
                        onChange={(e) => setFormData(prev => ({ ...prev, monthlyIncome: e.target.value }))}
                        className="w-full pl-10 px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
                        placeholder="Enter monthly income"
                      />
                    </div>
                  </div>

                  {/* Document Uploads */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { field: 'electricityBill', label: 'Electricity Bill', icon: FileText },
                      { field: 'mobileRecharge', label: 'Mobile Recharge History', icon: FileText },
                      { field: 'utilityBills', label: 'Other Utility Bills', icon: FileText }
                    ].map((doc) => (
                      <div key={doc.field} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center transition-colors duration-300">
                        <doc.icon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600 mb-3">{doc.label}</p>
                        <button
                          type="button"
                          onClick={() => document.getElementById(doc.field).click()}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload
                        </button>
                        <input
                          id={doc.field}
                          type="file"
                          className="hidden"
                          onChange={(e) => handleFileUpload(doc.field, e.target.files[0])}
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                        {formData[doc.field] && (
                          <p className="mt-2 text-sm text-green-600">✓ Document uploaded</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Continue to Identity Verification
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Identity Verification (NEW) */}
            {currentStep === 4 && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-8"
              >
                <div className="flex items-center mb-6">
                  <Shield className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Identity Verification</h2>
                </div>
                
                <div className="space-y-8">
                  {/* Aadhaar Card Upload */}
                  <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <UserCheck className="w-5 h-5 mr-2 text-blue-600" />
                      Aadhaar Card Verification
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-3">Front Side</p>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 transition-colors duration-300">
                          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                          <button
                            type="button"
                            onClick={() => document.getElementById('aadhaarFront').click()}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Front
                          </button>
                          <input
                            id="aadhaarFront"
                            type="file"
                            className="hidden"
                            onChange={(e) => handleFileUpload('aadhaarFront', e.target.files[0])}
                            accept=".jpg,.jpeg,.png"
                          />
                          {formData.aadhaarFront && (
                            <p className="mt-2 text-sm text-green-600">✓ Uploaded</p>
                          )}
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-3">Back Side</p>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 transition-colors duration-300">
                          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                          <button
                            type="button"
                            onClick={() => document.getElementById('aadhaarBack').click()}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Back
                          </button>
                          <input
                            id="aadhaarBack"
                            type="file"
                            className="hidden"
                            onChange={(e) => handleFileUpload('aadhaarBack', e.target.files[0])}
                            accept=".jpg,.jpeg,.png"
                          />
                          {formData.aadhaarBack && (
                            <p className="mt-2 text-sm text-green-600">✓ Uploaded</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* PAN Card Upload */}
                  <div className="bg-orange-50 rounded-2xl p-6 border border-orange-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">PAN Card Verification</h3>
                    <div className="text-center">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 transition-colors duration-300">
                        <FileText className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600 mb-3">Upload your PAN card</p>
                        <button
                          type="button"
                          onClick={() => document.getElementById('panCard').click()}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload PAN Card
                        </button>
                        <input
                          id="panCard"
                          type="file"
                          className="hidden"
                          onChange={(e) => handleFileUpload('panCard', e.target.files[0])}
                          accept=".jpg,.jpeg,.png"
                        />
                        {formData.panCard && (
                          <p className="mt-2 text-sm text-green-600">✓ PAN Card uploaded</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Video KYC */}
                  <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Camera className="w-5 h-5 mr-2 text-green-600" />
                      Video KYC Verification
                    </h3>
                    <div className="text-center">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 transition-colors duration-300">
                        <Camera className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600 mb-3">
                          Complete quick video verification for enhanced security
                        </p>
                        <button
                          type="button"
                          onClick={handleVideoKYC}
                          disabled={formData.videoKYC}
                          className={`inline-flex items-center px-6 py-3 rounded-md text-sm font-medium ${
                            formData.videoKYC
                              ? 'bg-green-600 text-white cursor-not-allowed'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          } transition-colors`}
                        >
                          <Camera className="w-4 h-4 mr-2" />
                          {formData.videoKYC ? '✓ KYC Completed' : 'Start Video KYC'}
                        </button>
                        {formData.videoKYC && (
                          <p className="mt-2 text-sm text-green-600">
                            ✓ Identity verification completed successfully
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={!formData.identityVerified}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                      formData.identityVerified
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    }`}
                  >
                    {formData.identityVerified ? 'Submit Application' : 'Complete Identity Verification'}
                  </button>
                </div>
              </motion.div>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  )
}