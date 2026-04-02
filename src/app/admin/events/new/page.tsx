'use client';

import React from 'react';
import EventForm from '@/components/admin/EventForm';

export default function NewEventPage() {
  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create New Event</h1>
        <p className="text-gray-500 text-sm mt-0.5">Fill in the details to add a new event.</p>
      </div>
      <EventForm mode="create" />
    </div>
  );
}
