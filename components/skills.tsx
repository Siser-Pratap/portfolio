"use client"


import { Card } from "./ui/card"
import { skills } from "@/constants/constant"

const Skills = () => {
  

  
  

 

  return (
    <section  id="skills" className="py-24 overflow-x-hidden">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-16">
          <h2 className=" animate-slide-in-y text-2xl md:text-2xl font-bold mb-8">
            <span  className="text-purple-600/75 section-title hover:text-white/80 rounded-full px-6 py-4 shadow-lg shadow-purple-500/25">
              SKILLS.
            </span>
          </h2>
        </div>
      <div className="max-w-4xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12">
          {skills.map((skill, index) => (
            <div key={index} className=" animate-slide-in-x px-4 hover:scale-105 shadow-2xl md:shadow-lg shadow-purple-500/25 bg-black md:hover:bg-gradient-to-t from-purple-500 to-transparent">
             <Card >
                 <div className="flex h-[30vh] w-[20vw] shadow-none border-transparent md:shadow-md  md:shadow-purple-500/25 md:border md:border-purple-600/75 justify-between items-center mb-3 text-center p-8 bg-black">
                    <span className="text-lg font-medium text-white text-center">{skill.name}</span>
                </div>
              </Card>
              
            </div>
          ))}
        </div>
      </div>
    </div>
     


    </section>
  )
}

export default Skills
