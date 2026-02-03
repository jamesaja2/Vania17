import React, { useState, useEffect, useRef } from 'react';

// ============================================
// REPLACE WITH YOUR SUPABASE CONFIG
// ============================================
// IMPORTANT: Get these values from your Supabase Dashboard:
// 1. Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api
// 2. Copy "Project URL" → paste as SUPABASE_URL
// 3. Copy "anon public" key → paste as SUPABASE_ANON_KEY

// Based on your database URL, your project ref is: pzlnyxgcpmfeckzirzqe
const SUPABASE_URL = 'https://pzlnyxgcpmfeckzirzqe.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_jwQoeq6kyij4g_d2pnaxlA_U_zMA29V'; // ⚠️ REPLACE THIS!

// Admin password for RSVP page access
const ADMIN_PASSWORD = 'vania17';

const SweetSeventeenInvitation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  
  // RSVP State
  const [rsvpAttendance, setRsvpAttendance] = useState('');
  const [rsvpCount, setRsvpCount] = useState(1);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  
  // Wishes State
  const [wishName, setWishName] = useState('');
  const [wishMessage, setWishMessage] = useState('');
  const [wishes, setWishes] = useState([]);
  const [wishSubmitted, setWishSubmitted] = useState(false);

  // Admin State
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [rsvpList, setRsvpList] = useState([]);
  const [isAdminPage, setIsAdminPage] = useState(false);
  
  // Gallery lightbox state
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  // Get guest info from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
  const name = params.get('to') || 'Guest';
    const pax = parseInt(params.get('pax')) || 1;
    const admin = params.get('admin');
    
    setGuestName(name);
    setGuestCount(pax);
    setRsvpCount(pax);
    
    // Check if admin page
    if (admin === 'true') {
      setIsAdminPage(true);
      setShowAdminModal(true);
    }
  }, []);

  // Load wishes when page opens
  useEffect(() => {
    if (isOpen) {
      loadWishes();
    }
  }, [isOpen]);

  const loadWishes = async () => {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/wishes?select=*&order=created_at.desc&limit=50`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });
      const data = await response.json();
      setWishes(data || []);
    } catch (error) {
      console.error('Error loading wishes:', error);
    }
  };

  const loadRSVPList = async () => {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rsvp?select=*&order=created_at.desc`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });
      const data = await response.json();
      setRsvpList(data || []);
    } catch (error) {
      console.error('Error loading RSVP list:', error);
    }
  };

  const handleOpenInvitation = () => {
    setIsOpen(true);
    // Force music to play with user interaction
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(e => {
            console.log('Audio autoplay failed, user interaction required:', e);
            // Try again after a short delay
            setTimeout(() => {
              if (audioRef.current) {
                audioRef.current.play()
                  .then(() => setIsPlaying(true))
                  .catch(() => {
                    // Silent fail if autoplay is blocked
                    setIsPlaying(false);
                  });
              }
            }, 500);
          });
      }
    }, 100);
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const submitRSVP = async () => {
    if (!rsvpAttendance) {
      alert('Please select your attendance first');
      return;
    }

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rsvp`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          guest_name: guestName,
          attendance: rsvpAttendance,
          guest_count: rsvpAttendance === 'hadir' ? rsvpCount : 0
        })
      });

      if (response.ok) {
        setRsvpSubmitted(true);
        setTimeout(() => setRsvpSubmitted(false), 5000);
      }
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      alert('Failed to send RSVP. Please try again.');
    }
  };

  const submitWish = async () => {
    if (!wishName || !wishMessage) {
      alert('Name and message are required');
      return;
    }

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/wishes`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          name: wishName,
          message: wishMessage
        })
      });

      if (response.ok) {
        setWishSubmitted(true);
        setWishName('');
        setWishMessage('');
        loadWishes();
        setTimeout(() => setWishSubmitted(false), 3000);
      }
    } catch (error) {
      console.error('Error submitting wish:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  const handleAdminLogin = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAdminAuth(true);
      loadRSVPList();
    } else {
      alert('Incorrect password!');
    }
  };

  const galleryImages = [];

  // Prepare audio on mount
  useEffect(() => {
    // Preload and prepare audio
    if (audioRef.current) {
      audioRef.current.load();
      audioRef.current.volume = 0.5;
    }
  }, []);

  const dressCodeColors = ['#F3E9D7', '#D6BFA6', '#E8DCCC', '#C9B195'];

  const openLightbox = (img, index) => {
    setSelectedImage(img);
    setSelectedImageIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    setSelectedImageIndex(null);
  };

  const nextImage = () => {
    const nextIndex = (selectedImageIndex + 1) % galleryImages.length;
    setSelectedImage(galleryImages[nextIndex]);
    setSelectedImageIndex(nextIndex);
  };

  const prevImage = () => {
    const prevIndex = (selectedImageIndex - 1 + galleryImages.length) % galleryImages.length;
    setSelectedImage(galleryImages[prevIndex]);
    setSelectedImageIndex(prevIndex);
  };

  const downloadImage = async () => {
    try {
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `karla-sweet17-${selectedImageIndex + 1}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      // Fallback: open in new tab
      window.open(selectedImage, '_blank');
    }
  };

  // Cover Page (Before Opening)
  if (!isOpen) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #F3E9D7 0%, #D6BFA6 100%)' }}>
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(214, 191, 166, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(243, 233, 215, 0.3) 0%, transparent 50%)'
          }} />
        </div>
        
        <audio ref={audioRef} loop preload="auto">
          <source src="/audio/background-music.mp3" type="audio/mpeg" />
        </audio>
        
        <div className="relative z-10 text-center max-w-md px-6">
          <div className="mb-8 animate-bounce text-8xl">
            💝
          </div>
          <h1 className="text-6xl mb-6 drop-shadow-md" style={{ fontFamily: 'Playfair Display, serif', color: '#7A5F42', fontWeight: '700' }}>
            Sweet Seventeen
          </h1>
          <div className="mb-10 backdrop-blur-sm bg-white/30 rounded-3xl p-6 shadow-xl">
              <p className="text-xl mb-3" style={{ fontFamily: 'Quicksand, sans-serif', color: '#8B7355', fontWeight: '500' }}>
                Dear
              </p>
            <p className="text-4xl font-semibold mb-2" style={{ fontFamily: 'Playfair Display, serif', color: '#7A5F42' }}>
              {guestName}
            </p>
            <p className="text-base" style={{ fontFamily: 'Quicksand, sans-serif', color: '#8B7355' }}>
              ({guestCount} {guestCount > 1 ? 'people' : 'person'})
            </p>
          </div>
          <button
            onClick={handleOpenInvitation}
            className="px-12 py-5 rounded-full font-bold transition-all hover:scale-110 hover:shadow-2xl shadow-xl"
            style={{ 
              background: 'linear-gradient(135deg, #D6BFA6 0%, #C9B195 100%)',
              fontFamily: 'Quicksand, sans-serif',
              color: '#FFFFFF',
              fontSize: '20px',
              border: '2px solid rgba(255, 255, 255, 0.5)'
            }}
          >
            ✉️ Open Invitation
          </button>
        </div>
      </div>
    );
  }

  // Main Content (After Opening)
  return (
    <div className="min-h-screen relative" style={{ fontFamily: 'Quicksand, sans-serif', background: 'linear-gradient(to bottom, #F3E9D7 0%, #E8DCCC 50%, #F3E9D7 100%)' }}>
      <audio ref={audioRef} loop preload="auto">
        <source src="/audio/background-music.mp3" type="audio/mpeg" />
      </audio>

      {/* Background Pattern */}
      <div 
        className="fixed inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D6BFA6' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      {/* Music Toggle Button */}
      <button
        onClick={toggleMusic}
        className="fixed top-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all hover:scale-110 border-2 border-white/50"
        style={{ background: 'linear-gradient(135deg, #D6BFA6 0%, #C9B195 100%)' }}
      >
        <span className={`text-3xl ${isPlaying ? 'animate-pulse' : 'opacity-50'}`}>🎵</span>
      </button>



      {/* Section 1: Hero Full Screen */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full opacity-30 animate-pulse" style={{ background: 'radial-gradient(circle, #D6BFA6 0%, transparent 70%)' }} />
        <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full opacity-20 animate-pulse" style={{ background: 'radial-gradient(circle, #C9B195 0%, transparent 70%)', animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-20 w-24 h-24 rounded-full opacity-25 animate-pulse" style={{ background: 'radial-gradient(circle, #D6BFA6 0%, transparent 70%)', animationDelay: '0.5s' }} />
        
        <div className="relative z-10 text-center px-6">
          <div className="backdrop-blur-sm bg-white/40 rounded-[3rem] p-12 shadow-2xl border-2 border-white/50">
            <div className="mb-6 text-7xl animate-pulse">
              💖
            </div>
            <h1 className="text-8xl mb-6 drop-shadow-md" style={{ fontFamily: 'Playfair Display, serif', color: '#7A5F42', fontWeight: '700' }}>
              Vania's
            </h1>
            <div className="text-9xl mb-6 drop-shadow-lg" style={{ fontFamily: 'Playfair Display, serif', color: '#D6BFA6', fontWeight: '700' }}>
              17th
            </div>
            <p className="text-3xl mb-4" style={{ fontFamily: 'Playfair Display, serif', color: '#7A5F42', fontWeight: '600' }}>
              Birthday Celebration
            </p>
            <div className="mt-8 pt-8 border-t-2 border-white/30">
              <p className="text-xl" style={{ fontFamily: 'Quicksand, sans-serif', color: '#8B7355', fontWeight: '500' }}>
                Join us for an unforgettable evening! 🎉
              </p>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 rounded-full flex items-start justify-center p-2" style={{ borderColor: '#D6BFA6' }}>
            <div className="w-1 h-3 rounded-full animate-pulse" style={{ background: '#D6BFA6' }} />
          </div>
        </div>
      </section>

      {/* Section 2: Event Details */}
      <section className="min-h-screen flex items-center justify-center py-20 px-6 relative">
        <div className="max-w-2xl w-full">

          {/* Event Details Card */}
          <div className="backdrop-blur-md rounded-3xl p-12 shadow-2xl border-2 border-white/50" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
            <h2 className="text-5xl text-center mb-14" style={{ fontFamily: 'Playfair Display, serif', color: '#7A5F42', fontWeight: '700' }}>
              📍 Save The Date
            </h2>
            
            <div className="space-y-10">
              <div className="flex items-start gap-6 p-6 rounded-2xl transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, #F3E9D7 0%, #E8DCCC 100%)' }}>
                <div className="p-4 rounded-full shadow-lg" style={{ background: '#D6BFA6' }}>
                  <span className="text-4xl">📅</span>
                </div>
                <div>
                  <p className="font-bold text-2xl mb-2" style={{ color: '#7A5F42' }}>Saturday, 28 February</p>
                  <p className="text-lg" style={{ color: '#8B7355' }}>Save this special day! 🗓️</p>
                </div>
              </div>

              <div className="flex items-start gap-6 p-6 rounded-2xl transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, #E8DCCC 0%, #F3E9D7 100%)' }}>
                <div className="p-4 rounded-full shadow-lg" style={{ background: '#C9B195' }}>
                  <span className="text-4xl">🕐</span>
                </div>
                <div>
                  <p className="font-bold text-2xl mb-2" style={{ color: '#7A5F42' }}>16:30 WIB</p>
                  <p className="text-lg" style={{ color: '#8B7355' }}>Don't be late! 🕔</p>
                </div>
              </div>

              <div className="flex items-start gap-6 p-6 rounded-2xl transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, #F3E9D7 0%, #E8DCCC 100%)' }}>
                <div className="p-4 rounded-full shadow-lg" style={{ background: '#D6BFA6' }}>
                  <span className="text-4xl">📍</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-2xl mb-2" style={{ color: '#7A5F42' }}>Whiz Luxe Hotel Spazio Surabaya</p>
                  <p className="text-lg mb-4" style={{ color: '#8B7355' }}>📍 Tap the button below for directions</p>
                  <a
                    href="https://maps.app.goo.gl/AiD3mkSu3Sdj97Q39"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-8 py-3 rounded-full font-bold transition-all hover:scale-110 shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #D6BFA6 0%, #C9B195 100%)', color: '#FFFFFF' }}
                  >
                    <span className="text-xl">📍</span>
                    Open Google Maps
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-6 p-6 rounded-2xl transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, #E8DCCC 0%, #F3E9D7 100%)' }}>
                <div className="p-4 rounded-full shadow-lg" style={{ background: '#C9B195' }}>
                  <span className="text-4xl">👗</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-2xl mb-4" style={{ color: '#7A5F42' }}>Dress Code: Semi-formal ✨</p>
                  <div className="flex gap-4">
                    {dressCodeColors.map((color, idx) => (
                      <div 
                        key={idx}
                        className="w-16 h-16 rounded-full shadow-xl border-4 border-white transform transition-all hover:scale-110"
                        style={{ background: color }}
                      />
                    ))}
                  </div>
                  <p className="text-base mt-4" style={{ color: '#8B7355' }}>Neutral & Earth Tone Colors Preferred 🤎</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: RSVP */}
      <section className="min-h-screen flex items-center justify-center py-20 px-6 relative">
        <div className="max-w-2xl w-full">
          <div className="backdrop-blur-md rounded-3xl p-12 shadow-2xl border-2 border-white/50" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
            <h2 className="text-5xl text-center mb-14" style={{ fontFamily: 'Playfair Display, serif', color: '#7A5F42', fontWeight: '700' }}>
              📝 RSVP
            </h2>

            <div className="space-y-8">
              <div>
                <label className="block mb-4 font-bold text-xl" style={{ color: '#7A5F42' }}>
                  👤 Guest Name
                </label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-6 py-5 rounded-2xl border-2 text-lg shadow-md transition-all focus:scale-105"
                  style={{ borderColor: '#D6BFA6', background: '#fff', color: '#7A5F42' }}
                />
              </div>

              <div>
                <label className="block mb-4 font-bold text-xl" style={{ color: '#7A5F42' }}>
                  📋 Attendance
                </label>
                <div className="grid grid-cols-2 gap-6">
                  <button
                    onClick={() => setRsvpAttendance('hadir')}
                    className={`py-5 rounded-2xl font-bold text-lg transition-all ${
                      rsvpAttendance === 'hadir' ? 'shadow-2xl scale-105' : 'opacity-50'
                    }`}
                    style={{
                      background: rsvpAttendance === 'hadir' ? 'linear-gradient(135deg, #D6BFA6 0%, #C9B195 100%)' : '#E8DCCC',
                      color: '#fff',
                      border: '2px solid rgba(255, 255, 255, 0.5)'
                    }}
                  >
                    ✓ Attending
                  </button>
                  <button
                    onClick={() => setRsvpAttendance('tidak_hadir')}
                    className={`py-5 rounded-2xl font-bold text-lg transition-all ${
                      rsvpAttendance === 'tidak_hadir' ? 'shadow-2xl scale-105' : 'opacity-50'
                    }`}
                    style={{
                      background: rsvpAttendance === 'tidak_hadir' ? 'linear-gradient(135deg, #8B7355 0%, #7A5F42 100%)' : '#E8DCCC',
                      color: '#fff',
                      border: '2px solid rgba(255, 255, 255, 0.5)'
                    }}
                  >
                    ✗ Not Attending
                  </button>
                </div>
              </div>

              {rsvpAttendance === 'hadir' && (
                <div>
                  <label className="block mb-4 font-bold text-xl" style={{ color: '#7A5F42' }}>
                    👥 Number of Guests Attending
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={rsvpCount}
                    onChange={(e) => setRsvpCount(Math.max(1, Math.min(parseInt(e.target.value) || 1, 10)))}
                    className="w-full px-6 py-5 rounded-2xl border-2 text-lg shadow-md transition-all focus:scale-105"
                    style={{ borderColor: '#D6BFA6', color: '#7A5F42' }}
                  />
                  <p className="text-base mt-3" style={{ color: '#8B7355' }}>
                    Maximum 10 guests
                  </p>
                </div>
              )}

              <button
                onClick={submitRSVP}
                disabled={rsvpSubmitted}
                className="w-full py-6 rounded-2xl font-bold text-xl transition-all hover:scale-105 shadow-2xl disabled:opacity-50 border-2 border-white/50"
                style={{ background: 'linear-gradient(135deg, #D6BFA6 0%, #C9B195 100%)', color: '#FFFFFF' }}
              >
                {rsvpSubmitted ? '✓ RSVP Sent!' : '📤 Send RSVP'}
              </button>

              {rsvpSubmitted && (
                <div className="text-center p-5 rounded-2xl animate-pulse" style={{ background: '#E8F5E9', color: '#2E7D32' }}>
                  <p className="font-semibold">Thank you! Your RSVP has been received.</p>
                  <p className="text-sm mt-1">We look forward to seeing you! 💕</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Ucapan */}
      <section className="min-h-screen flex items-center justify-center py-20 px-6 relative">
        <div className="max-w-2xl w-full">
          <div className="backdrop-blur-md rounded-3xl p-12 shadow-2xl mb-10 border-2 border-white/50" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
            <h2 className="text-5xl text-center mb-14" style={{ fontFamily: 'Playfair Display, serif', color: '#7A5F42', fontWeight: '700' }}>
              💌 Send a Message
            </h2>

            <div className="space-y-6">
              <div>
                <input
                  type="text"
                  placeholder="👤 Your Name"
                  value={wishName}
                  onChange={(e) => setWishName(e.target.value)}
                  className="w-full px-6 py-5 rounded-2xl border-2 text-lg shadow-md transition-all focus:scale-105"
                  style={{ borderColor: '#D6BFA6', color: '#7A5F42' }}
                />
              </div>

              <div>
                <textarea
                  placeholder="✍️ Write a message for Vania..."
                  value={wishMessage}
                  onChange={(e) => setWishMessage(e.target.value)}
                  rows="6"
                  className="w-full px-6 py-5 rounded-2xl border-2 resize-none text-lg shadow-md transition-all focus:scale-105"
                  style={{ borderColor: '#D6BFA6', color: '#7A5F42' }}
                />
              </div>

              <button
                onClick={submitWish}
                disabled={wishSubmitted}
                className="w-full py-6 rounded-2xl font-bold text-xl transition-all hover:scale-105 shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50 border-2 border-white/50"
                style={{ background: 'linear-gradient(135deg, #D6BFA6 0%, #C9B195 100%)', color: '#FFFFFF' }}
              >
                <span className="text-2xl">✉️</span>
                {wishSubmitted ? '✓ Message Sent!' : 'Send Message'}
              </button>
            </div>
          </div>

          {/* Wishes List */}
          <div className="space-y-6">
            <h3 className="text-4xl text-center mb-10" style={{ fontFamily: 'Playfair Display, serif', color: '#7A5F42', fontWeight: '700' }}>
              💬 Messages from Friends
            </h3>
            {wishes.length === 0 ? (
              <div className="text-center py-12 backdrop-blur-md rounded-2xl shadow-lg border-2 border-white/30" style={{ background: 'rgba(255, 255, 255, 0.7)', color: '#8B7355' }}>
                <p className="text-xl">No messages yet. Be the first! 💕</p>
              </div>
            ) : (
              wishes.map((wish) => (
                <div
                  key={wish.id}
                  className="backdrop-blur-md rounded-2xl p-8 shadow-xl border-2 border-white/30 transition-all hover:scale-105"
                  style={{ background: 'rgba(255, 255, 255, 0.9)' }}
                >
                  <p className="font-bold text-xl mb-3" style={{ color: '#7A5F42' }}>
                    💬 {wish.name}
                  </p>
                  <p className="text-lg leading-relaxed" style={{ color: '#8B7355' }}>
                    {wish.message}
                  </p>
                  <p className="text-sm mt-4 opacity-70" style={{ color: '#8B7355' }}>
                    📅 {new Date(wish.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>



      {/* Footer */}
      <section className="py-20 text-center">
        <div className="backdrop-blur-sm bg-white/40 rounded-3xl p-10 max-w-md mx-auto shadow-xl border-2 border-white/50">
          <div className="text-7xl mx-auto mb-6 animate-bounce">🎁</div>
          <p className="text-2xl mb-3" style={{ color: '#7A5F42', fontFamily: 'Playfair Display, serif', fontWeight: '600' }}>
            With Love,
          </p>
          <p className="text-4xl font-bold mb-6" style={{ color: '#D6BFA6', fontFamily: 'Playfair Display, serif' }}>
            Vania 💕
          </p>
          <p className="text-base mt-6 opacity-70" style={{ color: '#8B7355' }}>
            © 2026 <a 
              href="https://byjames.my.id" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-100 transition-all hover:underline"
              style={{ color: '#D6BFA6', fontWeight: '600', opacity: 1 }}
            >
              James Timothy
            </a>
          </p>
        </div>
      </section>

      {/* Image Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all z-10"
          >
            <span className="text-white text-2xl font-bold">✕</span>
          </button>

          {/* Download Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              downloadImage();
            }}
            className="absolute top-6 left-6 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 transition-all z-10 flex items-center gap-2 backdrop-blur-md"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span className="text-white font-medium">Download</span>
          </button>

          {/* Previous Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 hover:bg-white/20 transition-all z-10"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 hover:bg-white/20 transition-all z-10"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Image Counter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md">
            <span className="text-white font-medium">
              {selectedImageIndex + 1} / {galleryImages.length}
            </span>
          </div>

          {/* Image */}
          <div 
            className="relative max-w-5xl max-h-[85vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt={`Gallery ${selectedImageIndex + 1}`}
              loading="eager"
              decoding="async"
              fetchpriority="high"
              className="w-full h-full object-contain rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}

      {/* Admin Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-6">
          <div className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl" style={{ fontFamily: 'Playfair Display, serif', color: '#8B6F47' }}>
                Admin Panel - RSVP List
              </h2>
              <button onClick={() => {
                setShowAdminModal(false);
                setIsAdminAuth(false);
                setAdminPassword('');
              }} className="p-2 hover:bg-gray-100 rounded-full transition-all">
                <span className="text-2xl font-bold" style={{ color: '#8B6F47' }}>✕</span>
              </button>
            </div>

            {!isAdminAuth ? (
              <div className="space-y-4">
                <p style={{ color: '#A0826D' }}>Enter password to view the RSVP list:</p>
                <input
                  type="password"
                  placeholder="Password Admin"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                  className="w-full px-6 py-4 rounded-2xl border-2 text-lg"
                  style={{ borderColor: '#F9DCC4', color: '#8B6F47' }}
                />
                <button
                  onClick={handleAdminLogin}
                  className="w-full py-4 rounded-2xl text-white font-semibold transition-all hover:scale-105"
                  style={{ background: '#FCD2AF', color: '#8B6F47' }}
                >
                  Login
                </button>
                <p className="text-xs text-center" style={{ color: '#A0826D' }}>
                  Default password: vania17
                </p>
              </div>
            ) : (
              <div>
                <div className="mb-6 p-4 rounded-2xl" style={{ background: '#F8EDEB' }}>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-3xl font-bold" style={{ color: '#FCD2AF' }}>
                        {rsvpList.filter(r => r.attendance === 'hadir').length}
                      </p>
                      <p className="text-sm" style={{ color: '#8B6F47' }}>Attending</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold" style={{ color: '#A0826D' }}>
                        {rsvpList.filter(r => r.attendance === 'tidak_hadir').length}
                      </p>
                      <p className="text-sm" style={{ color: '#8B6F47' }}>Not Attending</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold" style={{ color: '#8B6F47' }}>
                        {rsvpList.filter(r => r.attendance === 'hadir').reduce((sum, r) => sum + (r.guest_count || 0), 0)}
                      </p>
                      <p className="text-sm" style={{ color: '#8B6F47' }}>Total Guests</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {rsvpList.length === 0 ? (
                    <p className="text-center py-8" style={{ color: '#A0826D' }}>
                      Belum ada RSVP
                    </p>
                  ) : (
                    rsvpList.map((rsvp) => (
                      <div
                        key={rsvp.id}
                        className="p-5 rounded-2xl border-2"
                        style={{ 
                          borderColor: rsvp.attendance === 'hadir' ? '#FCD2AF' : '#E0E0E0',
                          background: rsvp.attendance === 'hadir' ? '#FCD2AF10' : '#F5F5F5'
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-lg" style={{ color: '#8B6F47' }}>
                              {rsvp.guest_name}
                            </p>
                            <p className="text-sm mt-1" style={{ color: '#A0826D' }}>
                              Status: <span className="font-semibold">{rsvp.attendance === 'hadir' ? '✓ Hadir' : '✗ Tidak Hadir'}</span>
                            </p>
                            {rsvp.attendance === 'hadir' && (
                              <p className="text-sm" style={{ color: '#A0826D' }}>
                                Jumlah tamu: {rsvp.guest_count} orang
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-xs" style={{ color: '#A0826D' }}>
                              {new Date(rsvp.created_at).toLocaleDateString('id-ID', { 
                                day: 'numeric', 
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Quicksand:wght@300;400;500;600;700&display=swap');
        
        * {
          scroll-behavior: smooth;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        section {
          animation: fadeIn 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SweetSeventeenInvitation;