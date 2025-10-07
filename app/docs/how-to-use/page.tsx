import { DocsLayout } from "@/components/docs-layout"
import { Card } from "@/components/ui/card"

export default function HowToUsePage() {
  return (
    <DocsLayout>
      <div className="prose prose-gray max-w-none">
        <h1 className="text-4xl font-bold mb-4">How to Use Popuply</h1>
        <p className="text-xl text-gray-500 mb-8">Quick start guide to creating your first popup</p>

        <Card className="bg-[#007bff]/5 border-[#007bff]/20 rounded-2xl p-6 mb-8">
          <p className="text-gray-700 leading-relaxed">
            Popuply makes it easy to create beautiful popups for your website without any coding knowledge. Follow these
            simple steps to get started.
          </p>
        </Card>

        <div className="space-y-8">
          <section>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-[#007bff] text-white rounded-full flex items-center justify-center font-bold text-lg">
                1
              </div>
              <h2 className="text-2xl font-bold m-0">Sign up on Popuply</h2>
            </div>
            <p className="text-gray-600 leading-relaxed ml-14">
              Create your free account at Popuply. No credit card required to get started. You'll get access to all the
              basic features immediately.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-[#007bff] text-white rounded-full flex items-center justify-center font-bold text-lg">
                2
              </div>
              <h2 className="text-2xl font-bold m-0">Add your website</h2>
            </div>
            <p className="text-gray-600 leading-relaxed ml-14">
              From your dashboard, click "Add Website" and enter your website name and URL. You'll receive a unique
              website ID and embed code.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-[#007bff] text-white rounded-full flex items-center justify-center font-bold text-lg">
                3
              </div>
              <h2 className="text-2xl font-bold m-0">Copy the code snippet</h2>
            </div>
            <p className="text-gray-600 leading-relaxed ml-14">
              Copy the provided embed code and paste it into the {"<head>"} section of your website, before the closing{" "}
              {"</head>"} tag.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-[#007bff] text-white rounded-full flex items-center justify-center font-bold text-lg">
                4
              </div>
              <h2 className="text-2xl font-bold m-0">Create your first popup</h2>
            </div>
            <p className="text-gray-600 leading-relaxed ml-14">
              Click "Create Popup" from your dashboard. Choose a template or start from scratch. Customize the title,
              description, button text, and colors.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-[#007bff] text-white rounded-full flex items-center justify-center font-bold text-lg">
                5
              </div>
              <h2 className="text-2xl font-bold m-0">Set trigger conditions</h2>
            </div>
            <p className="text-gray-600 leading-relaxed ml-14">
              Choose when your popup should appear: on page load, after scrolling, with a time delay, or on exit intent.
              Pick what works best for your audience.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-[#007bff] text-white rounded-full flex items-center justify-center font-bold text-lg">
                6
              </div>
              <h2 className="text-2xl font-bold m-0">Publish and go live</h2>
            </div>
            <p className="text-gray-600 leading-relaxed ml-14">
              Click "Publish" and your popup goes live instantly. Visit your website to see it in action. You can edit
              or pause it anytime from your dashboard.
            </p>
          </section>
        </div>

        <Card className="bg-[#ffd93d]/20 border-[#ffd93d] rounded-2xl p-6 mt-8">
          <h3 className="text-lg font-bold mb-2">Need More Help?</h3>
          <p className="text-gray-700 leading-relaxed">
            Check out our detailed Setup Guide for platform-specific instructions, or contact our support team if you
            have any questions.
          </p>
        </Card>
      </div>
    </DocsLayout>
  )
}
