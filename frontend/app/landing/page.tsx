"use client"
import { useState } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, Wallet, ShieldCheck, Globe, ChevronDown, ChevronUp } from 'lucide-react'

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const features = [
    { icon: <CreditCard className="w-6 h-6" />, title: 'Web3 Credit Card', description: 'Get a credit card linked directly to your crypto wallet' },
    { icon: <Wallet className="w-6 h-6" />, title: 'Wallet Integration', description: 'Seamlessly connect your existing Web3 wallet' },
    { icon: <ShieldCheck className="w-6 h-6" />, title: 'Secure Transactions', description: 'Enhanced security with blockchain technology' },
    { icon: <Globe className="w-6 h-6" />, title: 'Global Acceptance', description: 'Use your card anywhere in the world' },
  ]

  const steps = [
    { title: 'Connect Wallet', description: 'Link your Web3 wallet to our platform' },
    { title: 'Verify Identity', description: 'Complete a quick KYC process' },
    { title: 'Receive Card', description: 'Get your virtual card instantly, physical card mailed to you' },
    { title: 'Start Spending', description: 'Use your card for online and offline purchases' },
  ]

  const faqs = [
    { question: 'How does the Web3 credit card work?', answer: 'Our Web3 credit card is directly linked to your cryptocurrency wallet. When you make a purchase, the equivalent amount is deducted from your crypto balance.' },
    { question: 'Is my cryptocurrency safe?', answer: 'Yes, we use advanced blockchain technology and secure smart contracts to ensure the safety of your funds.' },
    { question: 'Where can I use this credit card?', answer: 'You can use our Web3 credit card anywhere that accepts traditional credit cards, both online and in physical stores.' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-blue-100">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.h1 
          className="text-5xl font-bold mb-6 text-blue-800"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          The Future of Payments is Here
        </motion.h1>
        <motion.p 
          className="text-xl mb-8 text-gray-600"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Get your Web3 Credit Card today and spend your crypto anywhere
        </motion.p>
        <motion.button 
          className="bg-purple-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-purple-700 transition duration-300"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Apply Now
        </motion.button>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-12 text-center text-blue-800">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              className="bg-white p-6 rounded-lg shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="text-blue-600 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="container mx-auto px-4 py-16 bg-white rounded-lg shadow-lg my-16">
        <h2 className="text-3xl font-bold mb-12 text-center text-blue-800">How It Works</h2>
        <div className="flex flex-wrap justify-center">
          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              className="w-full md:w-1/2 lg:w-1/4 px-4 mb-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold text-blue-600 mb-4">
                {index + 1}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-12 text-center text-blue-800">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((_, index) => (
            <motion.div 
              key={index} 
              className="bg-white p-6 rounded-lg shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* <p className="text-gray-600 mb-4">"This Web3 credit card has revolutionized how I spend my crypto. It's so convenient!"</p> */}
              <p className="font-semibold">- Happy User {index + 1}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-12 text-center text-blue-800">Frequently Asked Questions</h2>
        {faqs.map((faq, index) => (
          <motion.div 
            key={index} 
            className="mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <button
              className="flex justify-between items-center w-full text-left p-4 bg-white rounded-lg shadow-md"
              onClick={() => setOpenFaq(openFaq === index ? null : index)}
            >
              <span className="font-semibold">{faq.question}</span>
              {openFaq === index ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            {openFaq === index && (
              <div className="p-4 bg-gray-100 rounded-b-lg">
                <p>{faq.answer}</p>
              </div>
            )}
          </motion.div>
        ))}
      </section>

      {/* CTA Footer */}
      <section className="bg-purple-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8">Join the future of finance with our Web3 Credit Card</p>
          <button className="bg-white text-blue-800 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition duration-300">
            Apply Now
          </button>
        </div>
      </section>
    </div>
  )
}