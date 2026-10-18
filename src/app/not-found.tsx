import Link from "next/link"
import Shell from "@/components/shell"
import T from "@/components/t"

export default function NotFound() {
  return (
    <Shell>
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <h1 className="text-[120px] font-black text-zinc-200 leading-none">404</h1>
        <h2 className="mt-4 text-[24px] font-bold text-zinc-900"><T k="notFound.title" /></h2>
        <p className="mt-2 text-[15px] text-zinc-500 max-w-[400px]">
          <T k="notFound.text" />
        </p>
        <Link href="/" className="mt-8 rounded-full bg-zinc-900 px-8 py-3.5 text-[14px] font-bold text-white transition hover:bg-black">
          <T k="notFound.back" />
        </Link>
      </div>
    </Shell>
  )
}