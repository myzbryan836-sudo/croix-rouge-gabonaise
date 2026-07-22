export default function LoadingSpinner({ full = false }) {
  return (
    <div className={`flex items-center justify-center ${full ? 'min-h-screen' : 'py-16'}`}>
      <div className="w-10 h-10 border-4 border-cr-gray border-t-cr-red rounded-full animate-spin" />
    </div>
  )
}
