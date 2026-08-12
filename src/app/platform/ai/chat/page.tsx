import { VideoText } from "@/registry/magicui/video-text"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default function VideoTextDemo() {
  return (
    <div className="flex flex-col min-h-screen bg-black overflow-hidden relative">
      <div className="absolute top-8 left-8 z-[9999]">
        <Link 
          href="/platform/ai"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black shadow-lg hover:scale-110 transition-transform"
        >
          <ChevronLeft className="h-6 w-6" />
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center w-full relative">
        <div className="relative h-full w-full overflow-hidden">
          <VideoText src="https://cdn.magicui.design/ocean-small.webm">
            under development
          </VideoText>
        </div>
      </div>
    </div>
  )
}
