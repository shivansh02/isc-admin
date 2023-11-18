'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';


const supabaseUrl = "https://uxklmuwfhfwrwfvtjszi.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4a2xtdXdmaGZ3cndmdnRqc3ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk3MjM4MDYsImV4cCI6MjAxNTI5OTgwNn0.jOSjVvG_40c-sDKi8wrL_aJQPGMf6M48pwB_NlqhlDU";

const supabase = createClient(supabaseUrl, supabaseKey);


const IssuedInventoryPage = () => {
    const [issuedInventory, setIssuedInventory] = useState([]);
    const [sports, setSports] = useState([]);
  
    useEffect(() => {
      fetchIssuedInventory();
      fetchSports();
    }, []);
  
    const fetchIssuedInventory = async () => {
      try {
        const { data, error } = await supabase.from('inventorybookings').select('*').eq('status', 'issued');
        if (error) {
          throw error;
        }
        setIssuedInventory(data || []);
      } catch (error) {
        console.error('Error fetching issued inventory:', error.message);
      }
    };
  
    // Similar to the BookingsPage, fetch sports information
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
  
    const markAsReturned = async (bookingId) => {
      try {
        const currentTimestamp = new Date();
// console.log(currentTimestamp);
        const { error } = await supabase.from('inventorybookings').update({ status: 'returned' }).eq('booking_id', bookingId);
        const { error2 } = await supabase.from('inventorybookings').update({ returned_at: currentTimestamp }).eq('booking_id', bookingId);

        if (error) {
          throw error;
        }
        if (error2) {
            throw error2;
          }
        // Refresh issued inventory after marking as returned
        fetchIssuedInventory();
      } catch (error) {
        console.error('Error marking inventory as returned:', error.message);
      }
    };
  
    const groupIssuedInventoryBySport = () => {
      const sortedSports = [...sports].sort((a, b) => a.sport_name.localeCompare(b.sport_name));
      const groupedIssuedInventory = {};
  
      issuedInventory.forEach((item) => {
        const sport = sortedSports.find((s) => s.sport_id === item.sport_id);
        const sportName = sport ? sport.sport_name : 'Unknown Sport';
  
        if (!groupedIssuedInventory[sportName]) {
          groupedIssuedInventory[sportName] = [];
        }
  
        groupedIssuedInventory[sportName].push(item);
      });
  
      return groupedIssuedInventory;
    };
  
    const renderIssuedInventoryTable = (sportName, sportInventory) => {
      return (
        <div key={sportName} className="my-8">
          <h2 className="text-2xl font-bold mb-4">{sportName}</h2>
          <table className="min-w-full bg-white border border-gray-300">
            {/* Table headers */}
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Booking ID</th>
                <th className="py-2 px-4 border-b">User ID</th>
                <th className="py-2 px-4 border-b">Issued At</th>
                <th className="py-2 px-4 border-b">Returned At</th>
                {/* Add other columns as needed */}
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody>
              {sportInventory.map((item) => (
                <tr key={item.booking_id}>
                  <td className="py-2 px-4 border-b">{item.booking_id}</td>
                  <td className="py-2 px-4 border-b">{item.user_id}</td>
                  <td className="py-2 px-4 border-b">{item.issued_at}</td>
                  <td className="py-2 px-4 border-b">{item.returned_at || 'Not Returned'}</td>
                  {/* Add other columns as needed */}
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => markAsReturned(item.booking_id)}
                      className="bg-green-500 text-white px-2 py-1 rounded"
                    >
                      Mark as Returned
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    };
  
    const groupedIssuedInventory = groupIssuedInventoryBySport();
  
    return (
      <div className="container mx-auto my-8">
        <h1 className="text-4xl font-bold mb-8">Issued Inventory</h1>
        {Object.entries(groupedIssuedInventory).map(([sportName, sportInventory]) =>
          renderIssuedInventoryTable(sportName, sportInventory)
        )}
      </div>
    );
  };
  
  export default IssuedInventoryPage;
  