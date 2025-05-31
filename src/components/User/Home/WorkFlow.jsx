import React, { useEffect } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import { UserPlus, Palette, Handshake, CheckCircle, MessageCircle, Star, TrendingUp, ChevronRight } from "lucide-react"

const WorkflowStep = ({ icon, title, delay, isActive = false }) => {
  const controls = useAnimation()
  const ref = React.useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: delay * 0.2 } },
      }}
      className={`flex flex-col items-center ${isActive ? "scale-110" : ""}`}
    >
      <div
        className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center
        ${
          isActive
            ? "bg-gradient-to-br from-[#6d28d2] to-[#8a3dff] text-white shadow-lg shadow-purple-300"
            : "bg-white text-[#6d28d2] shadow-md border border-gray-100"
        }`}
      >
        {icon}
      </div>
      <div className="h-12 w-0.5 bg-gradient-to-b from-[#6d28d2] to-gray-300 my-2"></div>
      <div
        className={`bg-white rounded-lg p-3 shadow-md w-40 text-center border ${isActive ? "border-[#6d28d2]" : "border-gray-100"}`}
      >
        <p className={`text-sm font-medium ${isActive ? "text-[#6d28d2]" : "text-gray-700"}`}>{title}</p>
      </div>
    </motion.div>
  )
}

const Workflow = () => {
  const steps = [
    { icon: <UserPlus size={28} />, title: "Create Profile/Login" },
    { icon: <Palette size={28} />, title: "Showcase Skills" },
    { icon: <Handshake size={28} />, title: "Match & Send Request" },
    { icon: <CheckCircle size={28} />, title: "Accept Request", active: true },
    { icon: <MessageCircle size={28} />, title: "Start Swap (Chat/Video)" },
    { icon: <Star size={28} />, title: "Complete Swap & Assess" },
    { icon: <TrendingUp size={28} />, title: "Update Profile Score" },
  ]

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-16 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 font-sora">
            How <span className="text-[#6d28d2]">SkillBridge</span> Works
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Follow these simple steps to start exchanging skills and growing your network
          </p>
        </motion.div>

        {/* Desktop Workflow */}
        <div className="hidden md:block relative">
          {/* Horizontal line */}
          <div className="absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-gray-200 via-[#6d28d2] to-gray-200"></div>

          <div className="flex justify-between">
            {steps.map((step, index) => (
              <WorkflowStep key={index} icon={step.icon} title={step.title} delay={index} isActive={step.active} />
            ))}
          </div>
        </div>

        {/* Mobile Workflow */}
        <div className="md:hidden">
          <div className="flex flex-col items-center space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center w-full max-w-xs">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center
                  ${
                    step.active
                      ? "bg-gradient-to-br from-[#6d28d2] to-[#8a3dff] text-white"
                      : "bg-white text-[#6d28d2] border border-gray-200"
                  }`}
                >
                  {step.icon}
                </div>
                <div className="ml-4 flex-1">
                  <div
                    className={`p-3 rounded-lg shadow-sm border ${step.active ? "border-[#6d28d2]" : "border-gray-100"}`}
                  >
                    <p className={`text-sm font-medium ${step.active ? "text-[#6d28d2]" : "text-gray-700"}`}>
                      {step.title}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <ChevronRight className="text-gray-400 transform rotate-90 mt-16 absolute" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Workflow
