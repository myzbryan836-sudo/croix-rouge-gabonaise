import { MessageCircle } from 'lucide-react'

const PHONE = '24174162213'

export default function WhatsAppButton() {
  return (
    
      href={`https://wa.me/${PHONE}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Contacter sur WhatsApp"
      className="fixed bottom-24 right-5 z-[90] w-14 h-14 rounded-full bg-[#25D366] shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
    >
      <MessageCircle className="text-white" size={26} fill="white" strokeWidth={0} />
    </a>
  )
}
