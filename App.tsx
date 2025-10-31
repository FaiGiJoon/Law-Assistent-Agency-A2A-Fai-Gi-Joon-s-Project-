import React, { useState } from 'react';
import ChatView from './components/ChatView';
import Header from './components/Header';
import Footer from './components/Footer';
import BookingModal from './components/BookingModal';

function App() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen font-sans bg-slate-900 text-slate-100">
      <Header onBookAppointmentClick={() => setIsBookingModalOpen(true)} />
      <main className="flex-1 overflow-hidden">
        <ChatView />
      </main>
      <Footer />
      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)} 
      />
    </div>
  );
}

export default App;