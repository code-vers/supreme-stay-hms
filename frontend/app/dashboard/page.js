"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      setError("You need to be logged in to access the dashboard.");
      setLoading(false);
      router.push("/login");
      return;
    }

    setUser(JSON.parse(storedUser));
    setLoading(false);

    // Optionally, you could fetch user data from the backend here
    // to ensure the token is still valid and get fresh data.
    // For now, we'll rely on the locally stored token and user.
  }, [router]);

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <p className='text-red-500'>{error}</p>
      </div>
    );
  }

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Dashboard</h1>
      {user && (
        <div>
          <p>
            Welcome, {user.firstName} {user.lastName}!
          </p>
          <p>Your email: {user.email}</p>
          {/* Add more user-specific or dashboard content here */}
        </div>
      )}
    </div>
  );
}
