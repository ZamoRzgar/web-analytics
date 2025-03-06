import { redirect } from 'next/navigation'

// This is a server component that redirects to the dashboard
export default function Home() {
  // Use server-side redirect
  redirect('/dashboard')
}
