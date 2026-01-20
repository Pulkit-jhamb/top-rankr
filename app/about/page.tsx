import TopRankerNavbar from "@/components/navbar";
import Image from "next/image";

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-100">
      <TopRankerNavbar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Founders Section */}
        <div className="bg-white border border-black mb-6">
          <div className="border-b border-black px-6 py-4">
            <h2 className="text-2xl font-bold text-black">Founders</h2>
          </div>
          <div className="grid grid-cols-2 divide-x divide-black">
            <div className="p-12 flex flex-col items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-gray-300 mb-4 overflow-hidden">
                <Image
                  src="/placeholder-avatar.jpg"
                  alt="Prof. Atulya Naga"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-blue-600 font-bold text-lg mb-2">Prof. Atulya Naga,</h3>
              <p className="text-black text-center text-sm">
                Department of Mathematics and Computer Science,
              </p>
              <p className="text-black text-center text-sm">
                Faculty of Science, Liverpool Hope University, UK.
              </p>
            </div>
            <div className="p-12 flex flex-col items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-gray-300 mb-4 overflow-hidden">
                <Image
                  src="/placeholder-avatar.jpg"
                  alt="Dr. Prashant Singh Rana"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-blue-600 font-bold text-lg mb-2">Dr. Prashant Singh Rana,</h3>
              <p className="text-black text-center text-sm">
                Computer Science and Engineering Department,
              </p>
              <p className="text-black text-center text-sm">
                Thapar University, Patiala, Punjab, India.
              </p>
            </div>
          </div>
        </div>

        {/* Mentors Section */}
        <div className="bg-white border border-black mb-6">
          <div className="border-b border-black px-6 py-4">
            <h2 className="text-2xl font-bold text-black">Mentors</h2>
          </div>
          <div className="grid grid-cols-4 divide-x divide-black">
            <div className="p-8 flex flex-col items-center justify-center">
              <div className="w-28 h-28 rounded-full bg-gray-300 mb-4 overflow-hidden">
                <Image
                  src="/placeholder-avatar.jpg"
                  alt="Prof. S G Deshmukh"
                  width={112}
                  height={112}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-black font-bold text-base mb-1">Prof. S G Deshmukh,</h3>
              <p className="text-black text-center text-xs">
                Director, ABV-IIITM Gwalior, MP, India.
              </p>
            </div>
            <div className="p-8 flex flex-col items-center justify-center">
              <div className="w-28 h-28 rounded-full bg-gray-300 mb-4 overflow-hidden">
                <Image
                  src="/placeholder-avatar.jpg"
                  alt="Prof. M K Tiwari"
                  width={112}
                  height={112}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-black font-bold text-base mb-1">Prof. M K Tiwari,</h3>
              <p className="text-black text-center text-xs">
                Department of Industrial and Systems Engineering, IIT, Kharagpur, India.
              </p>
            </div>
            <div className="p-8 flex flex-col items-center justify-center">
              <div className="w-28 h-28 rounded-full bg-gray-300 mb-4 overflow-hidden">
                <Image
                  src="/placeholder-avatar.jpg"
                  alt="Prof. Kusum Deep"
                  width={112}
                  height={112}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-black font-bold text-base mb-1">Prof. Kusum Deep,</h3>
              <p className="text-black text-center text-xs">
                Department of Mathematics, IIT Roorkee, India.
              </p>
            </div>
            <div className="p-8 flex flex-col items-center justify-center">
              <div className="w-28 h-28 rounded-full bg-gray-300 mb-4 overflow-hidden">
                <Image
                  src="/placeholder-avatar.jpg"
                  alt="Prof. Anupam Shukla"
                  width={112}
                  height={112}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-black font-bold text-base mb-1">Prof. Anupam Shukla,</h3>
              <p className="text-black text-center text-xs">
                Deptment of ICT<br />ABV-IIITM Gwalior, MP, India.
              </p>
            </div>
          </div>
        </div>

        {/* Experts Section */}
        <div className="bg-white border border-black mb-6">
          <div className="border-b border-black px-6 py-4">
            <h2 className="text-2xl font-bold text-black">Experts</h2>
          </div>
          <div className="grid grid-cols-2 divide-x divide-black">
            <div className="p-8">
              <ul className="space-y-2 text-black text-sm">
                <li>• Dr. Jagdish Chand Bansal, SAU, New Delhi</li>
                <li>• Dr. Manoj Thakur, IIT Mandi.</li>
                <li>• Prof. Deepak Garg, Bennett University, UP.</li>
                <li>• Prof. Maninder Singh, Thapar University, Patiala.</li>
                <li>• Prof. Seema Bawa, Thapar University, Patiala.</li>
                <li>• Prof. AK Verma, Thapar University, Patiala.</li>
                <li>• Prof Inder Veer Chana, Thapar University, Patiala.</li>
                <li>• Dr. PK Singh, ABV-IIITM, Gwalior.</li>
                <li>• Dr. Mahua Bhattacharya, ABV-IIITM, Gwalior.</li>
                <li>• Dr. AK Lal, Thapar University, Patiala.</li>
                <li>• Prof. KV Arya, IET, Lucknow.</li>
              </ul>
            </div>
            <div className="p-8">
              <ul className="space-y-2 text-black text-sm">
                <li>• Dr. Harish Sharma, RTU Kota, Raj.</li>
                <li>• Dr. Mukesh Saraswat, JIIT, Noida, UP.</li>
                <li>• Dr. Lokesh Chouchan, NIT Hamripur.</li>
                <li>• Dr. Vijay Kumar, Thapar University, Patiala.</li>
                <li>• Dr. Bhoopendra Pauchori, Manipal University, Jaipur.</li>
                <li>• Dr. Harish Garg, Thapar University, Patiala.</li>
                <li>• Dr. Anil Kumar, Munjal University. Gurugram.</li>
                <li>• Dr. Sandeep Kumar, IIT Mandi.</li>
                <li>• Dr. Suneel Yadav, IIIT Allahabad.</li>
                <li>• Dr. Rohit Singh, Symbiosis, Pune.</li>
                <li>• Dr. Nand Kishore Yadav, IIT Indore.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Design and Development Team Section */}
        <div className="bg-white border border-black mb-6">
          <div className="border-b border-black px-6 py-4">
            <h2 className="text-2xl font-bold text-black">Design and Development Team</h2>
          </div>
          <div className="grid grid-cols-2 divide-x divide-black">
            <div className="p-8">
              <ul className="space-y-2 text-black text-sm">
                <li>• Prathivi, Thapar University.</li>
                <li>• Rohan Piplani, Thapar University.</li>
                <li>• Gaurav, Thapar University.</li>
                <li>• Arush Nagpal, Thapar University.</li>
              </ul>
            </div>
            <div className="p-8">
              {/* Empty column */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}