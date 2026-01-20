'use client'
import { useState } from 'react'
import { Upload } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import TopRankerNavbar from '@/components/navbar'

export default function ContributePage() {
  const [problemName, setProblemName] = useState('')
  const [problemLevel, setProblemLevel] = useState('Easy')
  const [problemDescription, setProblemDescription] = useState('')
  const [fitnessFile, setFitnessFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFitnessFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!problemName.trim()) {
      toast.error('Please enter a problem name')
      return
    }

    if (!problemDescription.trim()) {
      toast.error('Please enter a problem description')
      return
    }

    if (!fitnessFile) {
      toast.error('Please upload a fitness function file')
      return
    }

    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('name', problemName)
      formData.append('level', problemLevel)
      formData.append('description', problemDescription)
      formData.append('fitnessFunction', fitnessFile)

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/problems/contribute`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      toast.success('Problem submitted successfully!')
      setProblemName('')
      setProblemLevel('Easy')
      setProblemDescription('')
      setFitnessFile(null)
      
      const fileInput = document.getElementById('fitness-file') as HTMLInputElement
      if (fileInput) fileInput.value = ''
    } catch {
      toast.error('Failed to submit problem. Please login and try again.')
    }
    setSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <TopRankerNavbar />
      {/* Header Banner */}
      <div className="bg-black text-white py-6 px-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
          Contribute
        </h1>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white border-2 border-gray-300 rounded-lg shadow-sm p-8">
          <div className="mb-6">
            <p className="text-gray-700 font-medium">
              <span className="font-bold">Instruction:</span> Fintess Function must of multi-dimentional type
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Problem Name */}
            <div>
              <label htmlFor="problem-name" className="block text-gray-800 font-medium mb-2">
                Problem Name:
              </label>
              <input
                id="problem-name"
                type="text"
                value={problemName}
                onChange={(e) => setProblemName(e.target.value)}
                className="w-full max-w-md border-2 border-gray-400 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Enter problem name"
              />
            </div>

            {/* Problem Level */}
            <div>
              <label className="block text-gray-800 font-medium mb-2">
                Problem Level: Easy/ Medium/ Hard
              </label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="level"
                    value="Easy"
                    checked={problemLevel === 'Easy'}
                    onChange={(e) => setProblemLevel(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span>Easy</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="level"
                    value="Medium"
                    checked={problemLevel === 'Medium'}
                    onChange={(e) => setProblemLevel(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span>Medium</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="level"
                    value="Hard"
                    checked={problemLevel === 'Hard'}
                    onChange={(e) => setProblemLevel(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span>Hard</span>
                </label>
              </div>
            </div>

            {/* Problem Description */}
            <div>
              <label htmlFor="problem-description" className="block text-gray-800 font-medium mb-2">
                Problem Description:
              </label>
              <textarea
                id="problem-description"
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                className="w-full max-w-2xl h-32 border-2 border-gray-400 rounded px-4 py-2 focus:outline-none focus:border-blue-500 resize-none"
                placeholder="Enter problem description"
              />
            </div>

            {/* Fitness Function Upload */}
            <div>
              <label htmlFor="fitness-file" className="block text-gray-800 font-medium mb-2">
                Fitness Function in image form:
              </label>
              <div className="flex items-center gap-4">
                <label
                  htmlFor="fitness-file"
                  className="inline-flex items-center gap-2 px-6 py-2 border-2 border-gray-400 rounded bg-white hover:bg-gray-50 cursor-pointer transition"
                >
                  <Upload className="w-5 h-5" />
                  <span>Upload</span>
                </label>
                <input
                  id="fitness-file"
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*,.pdf"
                  className="hidden"
                />
                {fitnessFile && (
                  <span className="text-sm text-gray-600">
                    {fitnessFile.name}
                  </span>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg disabled:bg-gray-400 transition"
              >
                {submitting ? 'Submitting...' : 'Submit Problem'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
