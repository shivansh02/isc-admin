'use client';
// pages/bookings.jsx

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';


const supabaseUrl = "https://uxklmuwfhfwrwfvtjszi.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4a2xtdXdmaGZ3cndmdnRqc3ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk3MjM4MDYsImV4cCI6MjAxNTI5OTgwNn0.jOSjVvG_40c-sDKi8wrL_aJQPGMf6M48pwB_NlqhlDU";

const supabase = createClient(supabaseUrl, supabaseKey);

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [sports, setSports] = useState([]);

  useEffect(() => {
    fetchBookings();
    fetchSports();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase.from('bookings').select('*');
      if (error) {
        throw error;
      }
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error.message);
    }
  };

  const fetchSports = async () => {
    try {
      const { data, error } = await supabase.from('sports').select('*').order('sport_name');
      if (error) {
        throw error;
      }
      setSports(data || []);
    } catch (error) {
      console.error('Error fetching sports:', error.message);
    }
  };
  

  const cancelBooking = async (bookingId) => {
    try {
      const { error } = await supabase.from('bookings').delete().eq('booking_id', bookingId);
      if (error) {
        throw error;
      }
      // Refresh bookings after cancellation
      fetchBookings();
    } catch (error) {
      console.error('Error canceling booking:', error.message);
    }
  };

  // Function to group bookings by sport
  const groupBookingsBySport = () => {
    const sortedSports = [...sports].sort((a, b) => a.sport_name.localeCompare(b.sport_name));
    const groupedBookings = {};

    bookings.forEach((booking) => {
      const sport = sortedSports.find((s) => s.sport_id === booking.slot_id);
      const sportName = sport ? sport.sport_name : 'Unknown Sport';
      
      if (!groupedBookings[sportName]) {
        groupedBookings[sportName] = [];
      }

      groupedBookings[sportName].push(booking);
    });

    return groupedBookings;
  };

  const renderBookingTable = (sportName, sportBookings) => {
    return (
      <div key={sportName} className="my-8">
        <h2 className="text-2xl font-bold mb-4">{sportName}</h2>
        <table className="min-w-full bg-white border border-gray-300">
          {/* Table headers */}
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Booking ID</th>
              <th className="py-2 px-4 border-b">User ID</th>
              <th className="py-2 px-4 border-b">Booking Time</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Cost</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          {/* Table body */}
          <tbody>
            {sportBookings.map((booking) => (
              <tr key={booking.booking_id}>
                <td className="py-2 px-4 border-b">{booking.booking_id}</td>
                <td className="py-2 px-4 border-b">{booking.user_id}</td>
                <td className="py-2 px-4 border-b">{booking.booking_time}</td>
                <td className="py-2 px-4 border-b">{booking.status}</td>
                <td className="py-2 px-4 border-b">{booking.cost}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => cancelBooking(booking.booking_id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const groupedBookings = groupBookingsBySport();

  return (
    <div className="container mx-auto my-8">
      <h1 className="text-4xl font-bold mb-8">Bookings</h1>
      {Object.entries(groupedBookings).map(([sportName, sportBookings]) =>
        renderBookingTable(sportName, sportBookings)
      )}
    </div>
  );
};

export default BookingsPage;
