import { DocsLayout } from "@/components/docs-layout"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SetupGuidePage() {
  return (
    <DocsLayout>
      <div className="prose prose-gray max-w-none">
        <h1 className="text-4xl font-bold mb-4">Setup Guide</h1>
        <p className="text-xl text-gray-500 mb-8">Platform-specific installation instructions</p>

        <Card className="bg-[#007bff]/5 border-[#007bff]/20 rounded-2xl p-6 mb-8">
          <p className="text-gray-700 leading-relaxed">
            Follow the instructions below for your specific platform. The setup process takes less than 5 minutes.
          </p>
        </Card>

        <Tabs defaultValue="html" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="html">HTML</TabsTrigger>
            <TabsTrigger value="wordpress">WordPress</TabsTrigger>
            <TabsTrigger value="shopify">Shopify</TabsTrigger>
            <TabsTrigger value="other">Other CMS</TabsTrigger>
          </TabsList>

          <TabsContent value="html" className="space-y-6">
            <h2 className="text-2xl font-bold">HTML Website Setup</h2>
            <p className="text-gray-600 leading-relaxed">For standard HTML websites, follow these simple steps:</p>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-bold mb-2">Step 1: Locate your HTML file</h3>
                <p className="text-sm text-gray-600">Open your website's main HTML file (usually index.html)</p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-bold mb-2">Step 2: Find the {"<head>"} section</h3>
                <p className="text-sm text-gray-600">Look for the {"<head>"} tag near the top of your HTML file</p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-bold mb-2">Step 3: Paste the embed code</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Paste the Popuply embed code before the closing {"</head>"} tag
                </p>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto text-xs">
                  <code>{`<!DOCTYPE html>
<html>
<head>
  <title>My Website</title>
  
  <!-- Popuply Embed Code -->
  <script>
    (function(){
      window.popuply = window.popuply || {};
      window.popuply.websiteId = "wb_12345";
      var s = document.createElement("script");
      s.src = "https://cdn.popuply.in/popuply-client-v0.js";
      s.async = true;
      document.head.appendChild(s);
    })();
  </script>
  <!-- End Popuply Embed Code -->
  
</head>
<body>
  ...
</body>
</html>`}</code>
                </pre>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-bold mb-2">Step 4: Save and upload</h3>
                <p className="text-sm text-gray-600">Save your file and upload it to your web server</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="wordpress" className="space-y-6">
            <h2 className="text-2xl font-bold">WordPress Setup</h2>
            <p className="text-gray-600 leading-relaxed">Add Popuply to your WordPress site:</p>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-bold mb-2">Option A: Using Theme Editor</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 mt-3">
                  <li>Go to Appearance → Theme File Editor</li>
                  <li>Select header.php from the right sidebar</li>
                  <li>Find the {"</head>"} tag</li>
                  <li>Paste the Popuply embed code before {"</head>"}</li>
                  <li>Click "Update File"</li>
                </ol>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-bold mb-2">Option B: Using a Plugin</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 mt-3">
                  <li>Install "Insert Headers and Footers" plugin</li>
                  <li>Go to Settings → Insert Headers and Footers</li>
                  <li>Paste the Popuply code in the "Scripts in Header" section</li>
                  <li>Click "Save"</li>
                </ol>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="shopify" className="space-y-6">
            <h2 className="text-2xl font-bold">Shopify Setup</h2>
            <p className="text-gray-600 leading-relaxed">Add Popuply to your Shopify store:</p>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-bold mb-2">Installation Steps</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 mt-3">
                  <li>Go to Online Store → Themes</li>
                  <li>Click "Actions" → "Edit Code"</li>
                  <li>Find and open theme.liquid</li>
                  <li>Locate the {"</head>"} tag</li>
                  <li>Paste the Popuply embed code before {"</head>"}</li>
                  <li>Click "Save"</li>
                </ol>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="other" className="space-y-6">
            <h2 className="text-2xl font-bold">Other CMS Platforms</h2>
            <p className="text-gray-600 leading-relaxed">General instructions for other platforms:</p>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-bold mb-2">Wix</h3>
                <p className="text-sm text-gray-600">
                  Go to Settings → Custom Code → Add Custom Code → Paste in Head section
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-bold mb-2">Webflow</h3>
                <p className="text-sm text-gray-600">
                  Go to Project Settings → Custom Code → Head Code → Paste the embed code
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-bold mb-2">Squarespace</h3>
                <p className="text-sm text-gray-600">
                  Go to Settings → Advanced → Code Injection → Header → Paste the embed code
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Card className="bg-[#ffd93d]/20 border-[#ffd93d] rounded-2xl p-6 mt-8">
          <h3 className="text-lg font-bold mb-2">Verification</h3>
          <p className="text-gray-700 leading-relaxed">
            After installation, Popuply will automatically verify your domain when someone visits your website. This
            usually takes just a few seconds.
          </p>
        </Card>
      </div>
    </DocsLayout>
  )
}
