

// Welcome loading overlay (5 seconds)
document.addEventListener('DOMContentLoaded', () => {
  const loading = document.getElementById('loading-overlay');
  setTimeout(() => {
    if (loading) {
      loading.style.opacity = '0';
      setTimeout(() => loading.remove(), 400);
    }
  }, 5000);

  // Year in footer
  const year = new Date().getFullYear();
  document.getElementById('year').textContent = year;

  // Navigation buttons
  const bookingSection = document.getElementById('booking-section');
  const myBookingsSection = document.getElementById('mybookings-section');
  document.getElementById('btn-book').addEventListener('click', () => {
    bookingSection.scrollIntoView({behavior:'smooth'});
    bookingSection.classList.remove('hidden');
    myBookingsSection.classList.add('hidden');
  });
  document.getElementById('btn-mybookings').addEventListener('click', () => {
    myBookingsSection.classList.remove('hidden');
    bookingSection.classList.add('hidden');
    renderBookings();
  });
  document.getElementById('hero-book').addEventListener('click', () => {
    bookingSection.scrollIntoView({behavior:'smooth'});
    bookingSection.classList.remove('hidden');
    myBookingsSection.classList.add('hidden');
  });

  // Booking form handling with localStorage mock + optional API call
  const form = document.getElementById('booking-form');
  const responseBox = document.getElementById('booking-response');
  const locInput = document.getElementById('location');
  const mapsLink = document.getElementById('maps-link');

  // live maps link update
  if (locInput && mapsLink) {
    locInput.addEventListener('input', () => {
      const v = locInput.value.trim();
      if (!v) {
        mapsLink.classList.add('hidden');
        mapsLink.removeAttribute('href');
      } else {
        const href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(v);
        mapsLink.href = href;
        mapsLink.classList.remove('hidden');
      }
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      date: form.date.value,
      time: form.time.value,
      location: form.location ? form.location.value.trim() : '',
      guests: parseInt(form.guests.value,10) || 1,
      notes: form.notes.value.trim(),
      id: 'bk_' + Date.now()
    };

    // simple validation
    if (!data.name || !data.email || !data.date || !data.time) {
      responseBox.textContent = 'Please complete all required fields.';
      return;
    }

    // Save locally (demo) so user can see bookings without a server
    const stored = JSON.parse(localStorage.getItem('site_see_bookings') || '[]');
    stored.push(data);
    localStorage.setItem('site_see_bookings', JSON.stringify(stored));

    responseBox.textContent = 'Booking saved. Please proceed to payment.';

    // Calculate total (example: 5000 Naira per guest = ~$13.50)
    const amountInNaira = Math.round(data.guests * 5000);
    
    // Render Paystack button
    renderPaystackButton(data, amountInNaira);

    form.reset();
    if (mapsLink) { mapsLink.classList.add('hidden'); mapsLink.removeAttribute('href'); }
  });

  document.getElementById('cancel').addEventListener('click', () => {
    form.reset();
    responseBox.textContent = '';
  });

  // Render bookings list
  window.renderBookings = function() {
    const list = document.getElementById('bookings-list');
    list.innerHTML = '';
    const items = JSON.parse(localStorage.getItem('site_see_bookings') || '[]');
    if (items.length === 0) {
      list.innerHTML = '<p>No bookings yet.</p>';
      return;
    }
    items.reverse().forEach(b => {
      const card = document.createElement('div');
      card.className = 'booking-card';
      const meta = document.createElement('div');
      meta.className = 'booking-meta';
      const locHtml = b.location ? `<a class="maps-link" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.location)}" target="_blank" rel="noopener">${escapeHtml(b.location)}</a>` : '';
      meta.innerHTML = `<strong>${escapeHtml(b.name)}</strong><span>${b.date} @ ${b.time}</span><small>${b.guests} visitor(s)</small>${locHtml}`;
      const actions = document.createElement('div');
      actions.className = 'booking-actions';
      const del = document.createElement('button');
      del.className = 'btn-outline';
      del.textContent = 'Cancel';
      del.addEventListener('click', () => cancelBooking(b.id));
      actions.appendChild(del);

      // Add 'Show route' button when a location exists
      if (b.location) {
        const route = document.createElement('button');
        route.className = 'route-btn';
        route.textContent = 'Show route';
        route.addEventListener('click', () => {
          openRoute(b.location);
        });
        actions.appendChild(route);
      }
      card.appendChild(meta);
      card.appendChild(actions);
      list.appendChild(card);
    });
  };

  function cancelBooking(id) {
    const items = JSON.parse(localStorage.getItem('site_see_bookings') || '[]');
    const filtered = items.filter(i => i.id !== id);
    localStorage.setItem('site_see_bookings', JSON.stringify(filtered));
    renderBookings();
  }

  // Attempt to open a Google Maps directions URL. If geolocation allowed, use coords
  function openRoute(destination) {
    if (!destination) {
      alert('No destination available');
      return;
    }
    // Build fallback URL without origin
    const destEnc = encodeURIComponent(destination);
    const openMaps = (origin) => {
      let url = 'https://www.google.com/maps/dir/?api=1';
      if (origin) url += '&origin=' + encodeURIComponent(origin);
      url += '&destination=' + destEnc + '&travelmode=driving';
      window.open(url, '_blank');
    };

    if (navigator.geolocation) {
      // try to get user's current location (short timeout)
      const opts = {timeout:5000};
      navigator.geolocation.getCurrentPosition((pos) => {
        const origin = pos.coords.latitude + ',' + pos.coords.longitude;
        openMaps(origin);
      }, (err) => {
        // permission denied or failed — open without origin
        openMaps();
      }, opts);
    } else {
      openMaps();
    }
  }

  // Paystack payment handler
  function renderPaystackButton(bookingData, amountInNaira) {
    const container = document.getElementById('payment-container');
    if (!container) return;
    
    container.innerHTML = '';
    container.classList.remove('hidden');
    
    // Check if Paystack SDK is loaded
    if (typeof PaystackPop === 'undefined') {
      container.innerHTML = '<p style="color:red">⚠️ Paystack SDK not loaded. Replace YOUR_PAYSTACK_PUBLIC_KEY in index.html.</p>';
      return;
    }

    const publicKey = window.PAYSTACK_PUBLIC_KEY;
    if (!publicKey || publicKey === 'YOUR_PAYSTACK_PUBLIC_KEY') {
      container.innerHTML = '<p style="color:red">⚠️ Paystack Public Key not set. Check index.html script tag.</p>';
      return;
    }

    const button = document.createElement('button');
    button.className = 'btn-primary';
    button.textContent = 'Pay with Paystack ₦' + amountInNaira.toLocaleString();
    button.addEventListener('click', (e) => {
      e.preventDefault();
      
      const handler = PaystackPop.setup({
        key: publicKey,
        email: bookingData.email,
        amount: amountInNaira * 100, // Paystack expects amount in kobo (cents)
        ref: bookingData.id,
        currency: 'NGN',
        onClose: () => {
          container.innerHTML = '<p style="color:var(--text-dark)">Payment window closed.</p>';
        },
        onSuccess: async (response) => {
          // Payment successful — verify with backend
          try {
            const verification = await fetch('/backend/php/verify_paystack.php', {
              method: 'POST',
              headers: {'Content-Type':'application/json'},
              body: JSON.stringify({
                reference: response.reference,
                bookingId: bookingData.id,
                amount: amountInNaira
              })
            });
            
            if (verification.ok) {
              container.innerHTML = `<div style="padding:12px;background:rgba(76,200,100,0.1);border-radius:8px;color:var(--text-dark)"><strong>✓ Payment confirmed!</strong><br>Your booking is now confirmed. A confirmation email has been sent to ${escapeHtml(bookingData.email)}.</div>`;
              updateBookingPaymentStatus(bookingData.id, 'paid');
            } else {
              container.innerHTML = '<div style="color:red">Payment verification failed. Please contact support.</div>';
            }
          } catch (err) {
            container.innerHTML = `<div style="color:red">Error: ${err.message}</div>`;
          }
        }
      });
      handler.openIframe();
    });
    
    container.appendChild(button);
  }

  // Update booking status to 'paid'
  function updateBookingPaymentStatus(bookingId, status) {
    const items = JSON.parse(localStorage.getItem('site_see_bookings') || '[]');
    const updated = items.map(b => b.id === bookingId ? {...b, paymentStatus: status} : b);
    localStorage.setItem('site_see_bookings', JSON.stringify(updated));
  }

  function escapeHtml(str){
    if (!str) return '';
    return str.replace(/[&<>"']/g, function(s){return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[s];});
  }

});
