import { redirect } from 'next/navigation';

/** Satu pintu masuk untuk warga dan perangkat desa. */
export default function DashboardLoginPage() {
  redirect('/login');
}
