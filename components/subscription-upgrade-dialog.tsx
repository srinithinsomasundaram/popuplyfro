"use client"

import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Crown } from "lucide-react"

interface SubscriptionUpgradeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  feature?: string
}

export function SubscriptionUpgradeDialog({
  open,
  onOpenChange,
  feature = "this feature",
}: SubscriptionUpgradeDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-2xl">
        <AlertDialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-[#3A8DFF]/10 rounded-xl flex items-center justify-center">
              <Crown className="w-5 h-5 text-[#3A8DFF]" />
            </div>
            <AlertDialogTitle className="text-lg">Upgrade to Pro</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-sm leading-relaxed">
            Upgrade to Pro to unlock {feature}. Get access to advanced templates, custom branding, email integrations,
            and more!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-xl text-sm">Later</AlertDialogCancel>
          <Link href="/dashboard/billing">
            <AlertDialogAction className="bg-[#3A8DFF] hover:bg-[#2d7ce6] text-white rounded-xl text-sm">
              Upgrade Now
            </AlertDialogAction>
          </Link>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
