// Registrasi Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('Service Worker registered successfully:', registration);
        })
        .catch(error => {
          console.log('Service Worker registration failed:', error);
        });
    });
  }
  
  // Fungsi untuk meminta izin notifikasi
  function requestNotificationPermission() {
    if (!("Notification" in window)) {
      showNotification('Error', 'Browser Anda tidak mendukung notifikasi', 'error');
      return;
    }
    
    if (Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          showNotification('Sukses', 'Notifikasi telah diaktifkan', 'success');
        }
      });
    }
  }
  
  // Panggil fungsi ini saat aplikasi pertama kali dimuat
  document.addEventListener('DOMContentLoaded', () => {
    // Kode yang sudah ada...
    
    // Tambahkan permintaan izin notifikasi
    requestNotificationPermission();
    
    // Lanjutkan dengan kode yang sudah ada...
  });

  // Fungsi untuk memeriksa tugas yang hampir deadline
function checkUpcomingDeadlines() {
    // Ambil semua tugas yang belum selesai
    const uncompletedTasks = tasks.filter(task => !task.completed);
    
    // Dapatkan tanggal hari ini dan besok
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Filter tugas yang deadline-nya hari ini atau besok
    uncompletedTasks.forEach(task => {
      if (!task.date) return;
      
      const taskDate = new Date(task.date);
      taskDate.setHours(0, 0, 0, 0);
      
      // Hitung selisih hari
      const timeDiff = taskDate.getTime() - today.getTime();
      const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      // Jika deadline hari ini
      if (diffDays === 0) {
        scheduleNotification(
          task.id,
          `Deadline Hari Ini: ${task.title}`,
          `Tugas "${task.title}" jatuh tempo hari ini pada ${task.time}`
        );
      }
      // Jika deadline besok
      else if (diffDays === 1) {
        scheduleNotification(
          task.id,
          `Deadline Besok: ${task.title}`,
          `Tugas "${task.title}" jatuh tempo besok pada ${task.time}`
        );
      }
    });
  }
  
  // Fungsi untuk mengirim notifikasi
  function scheduleNotification(taskId, title, body) {
    // Periksa izin notifikasi
    if (Notification.permission !== "granted") {
      return;
    }
    
    // Periksa apakah browser mendukung notifications
    if (!("Notification" in window)) {
      return;
    }
    
    // Periksa apakah tugas sudah dinotifikasi hari ini
    const notifiedTasks = JSON.parse(localStorage.getItem('notifiedTasks') || '{}');
    const today = new Date().toDateString();
    
    // Jika sudah dinotifikasi hari ini, jangan kirim lagi
    if (notifiedTasks[taskId] === today) {
      return;
    }
    
    // Kirim notifikasi
    const options = {
      body: body,
      icon: 'img/logo.png',
      badge: 'img/badge.png',
      data: {
        taskId: taskId
      }
    };
    
    // Gunakan serviceWorker untuk menampilkan notifikasi jika tersedia
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification(title, options);
      });
    } else {
      // Fallback ke notifikasi biasa
      new Notification(title, options);
    }
    
    // Catat bahwa tugas telah dinotifikasi hari ini
    notifiedTasks[taskId] = today;
    localStorage.setItem('notifiedTasks', JSON.stringify(notifiedTasks));
  }
  
  // Cek deadline setiap kali aplikasi dimuat
  document.addEventListener('DOMContentLoaded', () => {
    // Kode yang sudah ada...
    
    // Cek deadline
    checkUpcomingDeadlines();
    
    // Lanjutkan dengan kode yang sudah ada...
  });
  
  // Periksa deadline secara berkala (setiap 1 jam)
  setInterval(checkUpcomingDeadlines, 3600000);

  // Tambahkan fungsi untuk toggle notifikasi
function toggleNotifications() {
    if (Notification.permission === "granted") {
      // Simpan preferensi notifikasi pengguna
      const notificationsEnabled = localStorage.getItem('notificationsEnabled') === 'true';
      localStorage.setItem('notificationsEnabled', (!notificationsEnabled).toString());
      
      showNotification(
        'Notifikasi', 
        notificationsEnabled ? 'Notifikasi dinonaktifkan' : 'Notifikasi diaktifkan', 
        'info'
      );
    } else {
      requestNotificationPermission();
    }
  }
  
  // Tambahkan UI untuk toggle notifikasi (contoh: di header aplikasi)
  function addNotificationToggle() {
    const headerActions = document.querySelector('.header') || document.createElement('div');
    
    const notifBtn = document.createElement('button');
    notifBtn.className = 'notification-toggle-btn';
    notifBtn.innerHTML = '<i class="fas fa-bell"></i>';
    notifBtn.title = 'Toggle Notifikasi';
    notifBtn.addEventListener('click', toggleNotifications);
    
    headerActions.appendChild(notifBtn);
  }
  
  // Panggil fungsi ini saat aplikasi dimuat
  document.addEventListener('DOMContentLoaded', () => {
    // Kode yang sudah ada...
    
    // Tambahkan toggle notifikasi
    addNotificationToggle();
    
    // Lanjutkan dengan kode yang sudah ada...
  });