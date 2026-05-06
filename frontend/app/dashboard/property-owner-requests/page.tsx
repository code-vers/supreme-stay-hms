"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

type RequestUser = {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  nidNumber?: string;
  dob?: string;
  presentAddress?: string;
  permanentAddress?: string;
  profession?: string;
  companyName?: string;
  documents?: { url: string; name?: string; type?: string }[];
  status: string;
  rejectionReason?: string;
  createdAt?: string;
};

type StoredUser = {
  role?: { name?: string } | string;
};

export default function PropertyOwnerRequestsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<RequestUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadRequests = async () => {
    try {
      setLoading(true);
      const result = await api.get("/users/owner-requests");
      setRequests(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }

    const user = JSON.parse(storedUser) as StoredUser;
    const roleName =
      typeof user.role === "string" ? user.role : user.role?.name;
    if (roleName !== "SUPER_ADMIN") {
      setError("You do not have permission to view this page.");
      setLoading(false);
      router.push("/dashboard");
      return;
    }

    loadRequests();
  }, [router]);

  const approve = async (id: string) => {
    try {
      setActionLoading(id);
      await api.post(`/users/owner-requests/${id}/approve`, {});
      await loadRequests();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to approve request",
      );
    } finally {
      setActionLoading(null);
    }
  };

  const reject = async (id: string) => {
    const reason = window.prompt("Enter rejection reason");
    if (!reason) return;

    try {
      setActionLoading(id);
      await api.post(`/users/owner-requests/${id}/reject`, { reason });
      await loadRequests();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reject request");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <div className='p-6'>Loading property owner requests...</div>;
  }

  return (
    <div className='mx-auto max-w-6xl p-4 md:p-8'>
      <div className='mb-6 flex items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-semibold text-gray-900'>
            Property Owner Requests
          </h1>
          <p className='text-sm text-gray-600'>
            Review pending registrations, documents, and approval actions.
          </p>
        </div>
      </div>

      {error && (
        <div className='mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700'>
          {error}
        </div>
      )}

      {requests.length === 0 ? (
        <div className='rounded border border-dashed border-gray-300 p-8 text-center text-gray-600'>
          No pending property owner requests.
        </div>
      ) : (
        <div className='grid gap-4'>
          {requests.map((request) => (
            <div
              key={request.id}
              className='rounded-xl border border-gray-200 bg-white p-5 shadow-sm'>
              <div className='flex flex-col gap-4 md:flex-row md:items-start md:justify-between'>
                <div className='space-y-2'>
                  <div className='flex items-center gap-3'>
                    <h2 className='text-lg font-semibold text-gray-900'>
                      {(request.firstName || "") +
                        " " +
                        (request.lastName || "")}
                    </h2>
                    <span className='rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700'>
                      {request.status}
                    </span>
                  </div>
                  <p className='text-sm text-gray-600'>{request.email}</p>
                  <p className='text-sm text-gray-600'>
                    Phone: {request.phoneNumber || "N/A"}
                  </p>
                  <p className='text-sm text-gray-600'>
                    NID/Passport: {request.nidNumber || "N/A"}
                  </p>
                  <p className='text-sm text-gray-600'>
                    Profession: {request.profession || "N/A"}
                  </p>
                  <p className='text-sm text-gray-600'>
                    Company: {request.companyName || "N/A"}
                  </p>
                  <p className='text-sm text-gray-600'>
                    Present address: {request.presentAddress || "N/A"}
                  </p>
                  <p className='text-sm text-gray-600'>
                    Permanent address: {request.permanentAddress || "N/A"}
                  </p>
                  {request.rejectionReason && (
                    <p className='text-sm text-red-700'>
                      Rejected: {request.rejectionReason}
                    </p>
                  )}
                </div>

                <div className='flex flex-wrap gap-2'>
                  <button
                    onClick={() => approve(request.id)}
                    disabled={actionLoading === request.id}
                    className='rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50'>
                    Approve
                  </button>
                  <button
                    onClick={() => reject(request.id)}
                    disabled={actionLoading === request.id}
                    className='rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50'>
                    Reject
                  </button>
                </div>
              </div>

              {Array.isArray(request.documents) &&
                request.documents.length > 0 && (
                  <div className='mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
                    {request.documents.map((doc) => (
                      <a
                        key={doc.url}
                        href={doc.url}
                        target='_blank'
                        rel='noreferrer'
                        className='rounded-lg border border-gray-200 p-3 text-sm text-blue-700 hover:bg-blue-50'>
                        {doc.name || doc.type || "Document"}
                      </a>
                    ))}
                  </div>
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
