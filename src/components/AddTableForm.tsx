'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase'

export default function AddTableForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    uniqueCode: '',
    latitude: '',
    longitude: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const { error: insertError } = await supabase
        .from('wedding_tables')
        .insert({
          name: formData.name,
          address: formData.address,
          unique_code: formData.uniqueCode,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
        })

      if (insertError) {
        if (insertError.code === '23505') {
          setError('This unique code is already in use. Please choose a different one.')
        } else {
          setError('Failed to create table. Please check your inputs.')
        }
        setIsSubmitting(false)
        return
      }

      router.push('/admin')
    } catch {
      setError('Something went wrong. Please try again.')
      setIsSubmitting(false)
    }
  }

  const generateCodeFromName = () => {
    const code = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
    setFormData({ ...formData, uniqueCode: code })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Table Name *
        </label>
        <Input
          id="name"
          required
          placeholder="e.g., Table 1, Brooklyn Bridge"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
          Address *
        </label>
        <Input
          id="address"
          required
          placeholder="e.g., 123 Main St, New York, NY"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />
      </div>

      <div>
        <label htmlFor="uniqueCode" className="block text-sm font-medium text-gray-700 mb-1">
          Unique Code *
        </label>
        <div className="flex gap-2">
          <Input
            id="uniqueCode"
            required
            placeholder="e.g., table-1, brooklyn-bridge"
            value={formData.uniqueCode}
            onChange={(e) => setFormData({ ...formData, uniqueCode: e.target.value })}
            pattern="[a-z0-9\-]+"
            title="Only lowercase letters, numbers, and hyphens"
          />
          <Button type="button" variant="outline" onClick={generateCodeFromName}>
            Generate
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          This will be used in the URL: /checkin/{formData.uniqueCode || 'your-code'}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-1">
            Latitude *
          </label>
          <Input
            id="latitude"
            type="number"
            step="any"
            required
            placeholder="40.7128"
            value={formData.latitude}
            onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-1">
            Longitude *
          </label>
          <Input
            id="longitude"
            type="number"
            step="any"
            required
            placeholder="-74.0060"
            value={formData.longitude}
            onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Creating...' : 'Create Table'}
      </Button>
    </form>
  )
}
