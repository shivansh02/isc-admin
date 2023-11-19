'use client'
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import NavBlack from 'components/NavBlack.jsx';
import 'tailwindcss/tailwind.css';

const supabaseUrl = "https://uxklmuwfhfwrwfvtjszi.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4a2xtdXdmaGZ3cndmdnRqc3ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk3MjM4MDYsImV4cCI6MjAxNTI5OTgwNn0.jOSjVvG_40c-sDKi8wrL_aJQPGMf6M48pwB_NlqhlDU";


const supabase = createClient(supabaseUrl, supabaseKey);

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [sports, setSports] = useState([]);
  const [cancelBookingId, setCancelBookingId] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

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

  const openConfirmationModal = (bookingId) => {
    setCancelBookingId(bookingId);
    setShowConfirmationModal(true);
  };

  const closeConfirmationModal = () => {
    setShowConfirmationModal(false);
    setShowSuccessMessage(false);
  };

  const confirmCancellation = async () => {
    try {
      const { error } = await supabase.from('bookings').delete().eq('booking_id', cancelBookingId);
      if (error) {
        throw error;
      }
      // Refresh bookings after cancellation
      fetchBookings();
      closeConfirmationModal();
      setShowSuccessMessage(true);
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (error) {
      console.error('Error canceling booking:', error.message);
    }
  };

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
          <thead>
            <tr>
              <th className="py-2 px-4 border-b bg-gray-100">Booking ID</th>
              <th className="py-2 px-4 border-b bg-gray-100">User ID</th>
              <th className="py-2 px-4 border-b bg-gray-100">Booking Time</th>
              <th className="py-2 px-4 border-b bg-gray-100">Status</th>
              <th className="py-2 px-4 border-b bg-gray-100">Cost</th>
              <th className="py-2 px-4 border-b bg-gray-100">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sportBookings.map((booking) => (
              <tr key={booking.booking_id}>
                <td className="py-2 px-4 border-b">{booking.booking_id}</td>
                <td className="py-2 px-4 border-b">{booking.user_id}</td>
                <td className="py-2 px-4 border-b">{booking.booking_time}</td>
                <td className={`py-2 px-4 border-b ${booking.status === 'Cancelled' ? 'text-red-500' : ''}`}>
                  {booking.status}
                </td>
                <td className="py-2 px-4 border-b">{booking.cost}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => openConfirmationModal(booking.booking_id)}
                    className="bg-red-500 text-white px-2 py-1 rounded focus:outline-none focus:shadow-outline-red"
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
    <div className="container mx-auto my-2 bg-white p-8">
      <NavBlack />
      <h1 className="text-4xl font-bold mb-8">Bookings</h1>
      {Object.entries(groupedBookings).map(([sportName, sportBookings]) =>
        renderBookingTable(sportName, sportBookings)
      )}

      {showConfirmationModal && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-lg">
            <p className="text-lg font-semibold mb-4">Are you sure you want to cancel this booking?</p>
            <div className="flex justify-end">
              <button
                onClick={confirmCancellation}
                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
              >
                Confirm
              </button>
              <button
                onClick={closeConfirmationModal}
                className="border border-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessMessage && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-green-500 text-white px-4 py-2 rounded">
            Booking canceled successfully!
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;
