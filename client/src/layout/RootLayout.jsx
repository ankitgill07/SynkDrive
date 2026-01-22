import { Toaster } from "@/components/ui/sonner"

export default function RootLayout({ children }) {
    return (
        <>
            {children}
            <Toaster position="bottom-right" />
        </>
    )
}