"use client"

const Contact = () => {
  return (
    <section id="contact" className="w-full bg-[#F7F7F7] py-[120px]">
      <div className="max-w-[1400px] mx-auto px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[60px] items-start">
          
          {/* Left: Info */}
          <div className="flex flex-col pt-4">
            <span className="text-[#8A8A8A] text-sm font-medium mb-6 italic">{'(/ Contact )'}</span>
            <h2 className="text-[56px] font-[700] leading-[1.1] text-[#0D0505] tracking-tight mb-16 max-w-[400px]">
              Fill Out Our Form To Get In Touch
            </h2>

            <div className="flex flex-col gap-8">
              <div className="border-t border-[#EAEAEA] pt-6">
                <p className="text-[#8A8A8A] text-sm mb-2 font-medium">Phone</p>
                <p className="text-[#0D0505] font-semibold">+(2)579 -1245-893</p>
              </div>
              <div className="border-t border-[#EAEAEA] pt-6">
                <p className="text-[#8A8A8A] text-sm mb-2 font-medium">Email</p>
                <p className="text-[#0D0505] font-semibold">hello@siser.com</p>
              </div>
              <div className="border-t border-[#EAEAEA] pt-6 border-b pb-6">
                <p className="text-[#8A8A8A] text-sm mb-2 font-medium">Address</p>
                <p className="text-[#0D0505] font-semibold">New York, USA</p>
              </div>
            </div>
          </div>

          {/* Right: Form Card */}
          <div className="bg-white rounded-[24px] p-10 shadow-[0_10px_50px_-15px_rgba(0,0,0,0.05)] border border-[#EAEAEA]">
            <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[12px] font-semibold text-[#0D0505]">Name *</label>
                  <input type="text" placeholder="Name" className="w-full border-b border-[#EAEAEA] pb-2 text-sm text-[#0D0505] placeholder-[#8A8A8A] outline-none focus:border-[#FF4B1F] transition-colors" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[12px] font-semibold text-[#0D0505]">Email *</label>
                  <input type="email" placeholder="Email" className="w-full border-b border-[#EAEAEA] pb-2 text-sm text-[#0D0505] placeholder-[#8A8A8A] outline-none focus:border-[#FF4B1F] transition-colors" />
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-4">
                <label className="text-[12px] font-semibold text-[#0D0505]">Phone Number *</label>
                <input type="tel" placeholder="Phone Number" className="w-full border-b border-[#EAEAEA] pb-2 text-sm text-[#0D0505] placeholder-[#8A8A8A] outline-none focus:border-[#FF4B1F] transition-colors" />
              </div>

              <div className="flex flex-col gap-2 mt-4">
                <label className="text-[12px] font-semibold text-[#0D0505]">Company *</label>
                <input type="text" placeholder="Company" className="w-full border-b border-[#EAEAEA] pb-2 text-sm text-[#0D0505] placeholder-[#8A8A8A] outline-none focus:border-[#FF4B1F] transition-colors" />
              </div>

              <div className="flex flex-col gap-2 mt-4">
                <label className="text-[12px] font-semibold text-[#0D0505]">How can I help you *</label>
                <textarea placeholder="Write your message..." rows={3} className="w-full border-b border-[#EAEAEA] pb-2 text-sm text-[#0D0505] placeholder-[#8A8A8A] outline-none focus:border-[#FF4B1F] transition-colors resize-none"></textarea>
              </div>

              <button className="w-full bg-[#0D0505] text-white font-bold py-4 rounded-full mt-8 hover:bg-[#FF4B1F] transition-colors text-sm tracking-wide">
                SEND MESSAGE
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  )
}

export default Contact