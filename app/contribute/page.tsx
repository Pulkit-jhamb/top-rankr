'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import toast from 'react-hot-toast'
import TopRankerNavbar from '@/components/navbar'

export default function ContributePage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    level: 'Easy',
    description: '',
    fitnessFormula: '',
    constraint: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const role = localStorage.getItem('role')
    if (role === 'admin') {
      toast.error('Admins cannot access the contribute page')
      router.replace('/admin')
    }
  }, [router])

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.name.trim()) { toast.error('Please enter a problem name'); return }
    if (!form.description.trim()) { toast.error('Please enter a problem description'); return }
    if (!form.fitnessFormula.trim()) { toast.error('Please enter the fitness function formula'); return }

    const token = localStorage.getItem('token')
    if (!token) { toast.error('You must be logged in to contribute'); return }

    setSubmitting(true)
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/problems/contribute`,
        { ...form },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success('Problem submitted! Admin will review it shortly.')
      setSubmitted(true)
      setForm({ name: '', level: 'Easy', description: '', fitnessFormula: '', constraint: '' })
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      toast.error(e.response?.data?.message || 'Failed to submit. Please try again.')
    } finally {
      setSubmitting(false)
    }
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
          Contribute a Problem
        </h1>
        <p className="text-gray-300 mt-1 text-sm">
          Submit a new optimization problem for admin review. Once approved it will appear on the platform.
        </p>
      </div>

      <div className="max-w-3xl mx-auto p-6">

        {submitted && (
          <div className="mb-6 bg-green-50 border border-green-300 rounded-lg px-6 py-4 flex items-start gap-3">
            <svg className="w-6 h-6 text-green-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <p className="font-bold text-green-800">Submitted successfully!</p>
              <p className="text-green-700 text-sm">Your problem is pending admin review. You can submit another one below.</p>
            </div>
            <button onClick={() => setSubmitted(false)} className="ml-auto text-green-500 hover:text-green-700 text-lg">✕</button>
          </div>
        )}

        <div className="bg-white border-2 border-gray-300 rounded-lg shadow-sm p-8">
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded px-4 py-3 text-sm text-blue-800">
            <strong>Instructions:</strong> The fitness function must be multi-dimensional (accepts an array of variables).
            Write it as a mathematical expression, e.g. <code className="bg-blue-100 px-1 rounded">sum(xi^2) for i=1..n</code>.
            Admin will convert it to executable code before publishing.
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Problem Name */}
            <div>
              <label className="block text-gray-800 font-semibold mb-1">
                Problem Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                className="w-full border-2 border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="e.g. Rastrigin Function"
              />
            </div>

            {/* Level */}
            <div>
              <label className="block text-gray-800 font-semibold mb-2">
                Difficulty Level <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-6">
                {(['Easy', 'Medium', 'Hard'] as const).map(lvl => (
                  <label key={lvl} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="level"
                      value={lvl}
                      checked={form.level === lvl}
                      onChange={e => set('level', e.target.value)}
                      className="w-4 h-4 accent-blue-600"
                    />
                    <span className={`font-medium ${lvl === 'Easy' ? 'text-green-700' : lvl === 'Medium' ? 'text-yellow-700' : 'text-red-700'}`}>{lvl}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-800 font-semibold mb-1">
                Problem Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.description}
                onChange={e => set('description', e.target.value)}
                rows={4}
                className="w-full border-2 border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500 resize-none"
                placeholder="Describe the problem background, real-world application, and what makes it interesting…"
              />
            </div>

            {/* Fitness Function Formula */}
            <div>
              <label className="block text-gray-800 font-semibold mb-1">
                Fitness Function Formula <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Write the mathematical formula. Use standard notation: <code className="bg-gray-100 px-1 rounded">x_i</code>, <code className="bg-gray-100 px-1 rounded">n</code>, <code className="bg-gray-100 px-1 rounded">sum</code>, <code className="bg-gray-100 px-1 rounded">cos</code>, <code className="bg-gray-100 px-1 rounded">sin</code>, <code className="bg-gray-100 px-1 rounded">exp</code>, etc.
              </p>
              <textarea
                value={form.fitnessFormula}
                onChange={e => set('fitnessFormula', e.target.value)}
                rows={5}
                className="w-full border-2 border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500 font-mono text-sm resize-none"
                placeholder="e.g. f(x) = 10n + sum(xi^2 - 10*cos(2*pi*xi)) for i=1..n"
              />
            </div>

            {/* Constraint */}
            <div>
              <label className="block text-gray-800 font-semibold mb-1">
                Search Space / Constraint <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={form.constraint}
                onChange={e => set('constraint', e.target.value)}
                className="w-full border-2 border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="e.g. -5.12 ≤ xi ≤ 5.12"
              />
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-lg disabled:opacity-50 transition"
              >
                {submitting ? 'Submitting…' : 'Submit Problem'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
