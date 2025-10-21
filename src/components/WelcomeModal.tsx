'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export function WelcomeModal() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenPostWeddingWelcome')
    if (!hasSeenWelcome) {
      setOpen(true)
    }
  }, [])

  const handleClose = () => {
    localStorage.setItem('hasSeenPostWeddingWelcome', 'true')
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-3xl font-serif text-[#7B2D26] text-center">
            Thank You for Celebrating with Us!
          </DialogTitle>
          <DialogDescription className="text-center pt-4 text-base">
            <div className="space-y-4">
              <p className="text-[#5a4a42]">
                We're so grateful you were part of our special day. This map is now open for everyone to explore and leave messages at any location.
              </p>
              <p className="text-[#5a4a42]">
                Feel free to revisit your favorite spots and share your memories with us!
              </p>
              <p className="font-serif text-lg text-[#5a4a42] pt-2">
                Anna & Adam
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="pt-4">
          <Button 
            onClick={handleClose} 
            className="w-full bg-[#7B2D26] hover:bg-[#5a1f1a]" 
            size="lg"
          >
            Explore the Map
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
