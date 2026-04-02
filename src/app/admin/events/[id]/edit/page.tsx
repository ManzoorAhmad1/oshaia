'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import EventForm from '@/components/admin/EventForm';
import { Loader2 } from 'lucide-react';

export default function EditEventPage() {
  const params = useParams();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/events/admin/${params.id}`)
      .then(({ data }) => setEvent(data.event))
      .catch(() => setError('Event not found.'))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return (
    <div className="p-8 flex items-center gap-2 text-gray-500">
      <Loader2 className="w-5 h-5 animate-spin" /> Loading event...
    </div>
  );
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Event</h1>
        <p className="text-gray-500 text-sm mt-0.5">{event?.title?.en}</p>
      </div>
      <EventForm mode="edit" initialData={event} />
    </div>
  );
}
