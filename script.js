document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements - Common
    const searchInput = document.getElementById('search-input');
    const allTasksSearchInput = document.getElementById('all-tasks-search');
    const filterBtn = document.getElementById('filter-btn');
    const filterMenu = document.getElementById('filter-menu');
    const allTasksFilterBtn = document.getElementById('all-tasks-filter-btn');
    const allTasksFilterMenu = document.getElementById('all-tasks-filter-menu');
    const modal = document.getElementById('taskModal');
    const openModalBtn = document.getElementById('openModalBtn');
    const openModalBtnCalendar = document.getElementById('openModalBtnCalendar');
    const openModalBtnAll = document.getElementById('openModalBtnAll');
    const openModalBtnPriority = document.getElementById('openModalBtnPriority');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelModalBtn = document.getElementById('cancelModalBtn');
    const saveTaskBtn = document.getElementById('saveTaskBtn');
    const toggleCompletedBtn = document.getElementById('toggle-completed');
    const modalTitle = document.getElementById('modal-title');
    const notification = document.getElementById('notification');
    const notificationTitle = document.getElementById('notification-title');
    const notificationMessage = document.getElementById('notification-message');
    
    // DOM Elements - Categories
    const manageCategoriesBtn = document.getElementById('manage-categories-btn');
    const categoriesModal = document.getElementById('categoriesModal');
    const closeCategoriesModalBtn = document.getElementById('closeCategoriesModalBtn');
    const categoriesList = document.getElementById('categories-list');
    const newCategoryNameInput = document.getElementById('newCategoryName');
    const newCategoryColorInput = document.getElementById('newCategoryColor');
    const addCategoryBtn = document.getElementById('addCategoryBtn');
    const saveCategoriesBtn = document.getElementById('saveCategoriesBtn');
    const categoryListContainer = document.getElementById('category-list');
    const colorPreview = document.querySelector('.color-preview');
    
    // DOM Elements - Tasks Lists
    const activeTasksList = document.getElementById('active-tasks');
    const completedTasksList = document.getElementById('completed-tasks');
    const allTasksList = document.getElementById('all-tasks-list');
    const calendarTasksList = document.getElementById('calendar-tasks');
    const highPriorityTasksList = document.getElementById('high-priority-tasks');
    const mediumPriorityTasksList = document.getElementById('medium-priority-tasks');
    const lowPriorityTasksList = document.getElementById('low-priority-tasks');
    
    // DOM Elements - Task form
    const taskTitleInput = document.getElementById('taskTitle');
    const taskDescriptionInput = document.getElementById('taskDescription');
    const taskCategorySelect = document.getElementById('taskCategory');
    const taskPrioritySelect = document.getElementById('taskPriority');
    const taskDateInput = document.getElementById('taskDate');
    const taskTimeInput = document.getElementById('taskTime');
    
    // DOM Elements - Progress and Stats
    const todayProgressEl = document.getElementById('today-progress');
    const todayProgressFillEl = document.getElementById('today-progress-fill');
    const todayCompletedEl = document.getElementById('today-completed');
    const todayRemainingEl = document.getElementById('today-remaining');
    const priorityProgressEl = document.getElementById('priority-progress');
    const priorityProgressFillEl = document.getElementById('priority-progress-fill');
    const priorityCompletedEl = document.getElementById('priority-completed');
    const priorityRemainingEl = document.getElementById('priority-remaining');
    const totalProgressEl = document.getElementById('total-progress');
    const totalProgressFillEl = document.getElementById('total-progress-fill');
    const totalCompletedEl = document.getElementById('total-completed');
    const totalRemainingEl = document.getElementById('total-remaining');
    
    // DOM Elements - Counts
    const activeCountEl = document.getElementById('active-count');
    const completedCountEl = document.getElementById('completed-count');
    const allTasksCountEl = document.getElementById('all-tasks-count');
    const highPriorityCountEl = document.getElementById('high-priority-count');
    const mediumPriorityCountEl = document.getElementById('medium-priority-count');
    const lowPriorityCountEl = document.getElementById('low-priority-count');
    
    // DOM Elements - Statistics
    const statsTotalTasksEl = document.getElementById('stats-total-tasks');
    const statsCompletedTasksEl = document.getElementById('stats-completed-tasks');
    const statsActiveTasksEl = document.getElementById('stats-active-tasks');
    const categoryChartEl = document.getElementById('category-chart');
    const priorityChartEl = document.getElementById('priority-chart');
    
    // DOM Elements - Calendar
    const calendarMonthYearEl = document.getElementById('calendar-month-year');
    const calendarDaysEl = document.getElementById('calendar-days');
    const prevMonthBtn = document.getElementById('prev-month-btn');
    const nextMonthBtn = document.getElementById('next-month-btn');
    const selectedDateTitleEl = document.getElementById('selected-date-title');
    
    // DOM Elements - Navigation
    const menuItems = document.querySelectorAll('.menu-item, .mobile-nav-item');
    const pageSections = document.querySelectorAll('.page-section');
    
    // State
    let tasks = [];
    let categories = [
        { id: 'work', name: 'Pekerjaan', color: '#4361ee', isDefault: true, icon: 'briefcase' },
        { id: 'personal', name: 'Pribadi', color: '#fbbf24', isDefault: true, icon: 'user' },
        { id: 'shopping', name: 'Belanja', color: '#4ade80', isDefault: true, icon: 'shopping-bag' },
        { id: 'health', name: 'Kesehatan', color: '#f87171', isDefault: true, icon: 'heart' }
    ];
    let currentTaskId = null;
    let isEditMode = false;
    let showCompletedTasks = true;
    let currentFilter = 'all';
    let searchQuery = '';
    let currentSection = 'dashboard';
    let currentDate = new Date();
    let selectedDate = new Date();
    let currentPage = 1;
    const itemsPerPage = 5; // Jumlah tugas per halaman
    
    // Format Date for display
    const currentDateEl = document.getElementById('current-date');
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    currentDateEl.textContent = today.toLocaleDateString('id-ID', options);
    
    // Set today's date for the task date input
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1;
    let dd = today.getDate();
    
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    
    const formattedToday = yyyy + '-' + mm + '-' + dd;
    taskDateInput.value = formattedToday;
    
    // Set default time (current hour:minute)
    const hours = today.getHours().toString().padStart(2, '0');
    const minutes = today.getMinutes().toString().padStart(2, '0');
    taskTimeInput.value = `${hours}:${minutes}`;
    
    // Load tasks from localStorage
    function loadTasks() {
        const storedTasks = localStorage.getItem('tasks');
        tasks = storedTasks ? JSON.parse(storedTasks) : [];
        renderAllTaskViews();
        updateStats();
        renderCalendar();
    }
    
    // Load categories from localStorage
    function loadCategories() {
        const storedCategories = localStorage.getItem('categories');
        if (storedCategories) {
            categories = JSON.parse(storedCategories);
        }
        renderCategories();
        updateCategoryFilters();
    }
    
    // Save tasks to localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderAllTaskViews();
        updateStats();
        renderCalendar();
    }
    
    // Save categories to localStorage
    function saveCategories() {
        localStorage.setItem('categories', JSON.stringify(categories));
        renderCategories();
    }
    
    // Generate a unique ID
    function generateId() {
        return Date.now().toString();
    }
    
    // Filter tasks based on current filter and search query
    function getFilteredTasks(filter = currentFilter, query = searchQuery) {
        return tasks.filter(task => {
            const matchesSearch = 
                task.title.toLowerCase().includes(query.toLowerCase()) ||
                (task.description && task.description.toLowerCase().includes(query.toLowerCase()));
            
            if (filter === 'all') return matchesSearch;
            if (filter === 'today') {
                return task.date === formattedToday && matchesSearch;
            }
            if (filter === 'completed') {
                return task.completed && matchesSearch;
            }
            if (filter === 'high' || filter === 'medium' || filter === 'low') {
                return task.priority === filter && matchesSearch;
            }
            
            // Category filters - check if any of our categories match
            const matchingCategory = categories.find(cat => cat.id === filter);
            if (matchingCategory) {
                return task.category === filter && matchesSearch;
            }
            
            return matchesSearch;
        });
    }
    
    // Get tasks for a specific date
    function getTasksForDate(dateString) {
        return tasks.filter(task => task.date === dateString);
    }
    
    // Memisahkan data menjadi halaman
    function paginateData(data, page, itemsPerPage) {
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return data.slice(startIndex, endIndex);
    }
    
    // Membuat elemen pagination
    function createPaginationControls(totalItems, container, renderFunction) {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        
        // Jika hanya ada 1 halaman atau tidak ada data, tidak perlu pagination
        if (totalPages <= 1) return;
        
        const paginationContainer = document.createElement('div');
        paginationContainer.className = 'pagination-container';
        paginationContainer.innerHTML = `
            <div class="pagination">
                <button class="pagination-btn" id="prev-page" ${currentPage === 1 ? 'disabled' : ''}>
                    <i class="fas fa-chevron-left"></i>
                </button>
                <div class="pagination-info">Halaman ${currentPage} dari ${totalPages}</div>
                <button class="pagination-btn" id="next-page" ${currentPage === totalPages ? 'disabled' : ''}>
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        `;
        
        container.appendChild(paginationContainer);
        
        // Event listener untuk navigasi pagination
        const prevBtn = paginationContainer.querySelector('#prev-page');
        const nextBtn = paginationContainer.querySelector('#next-page');
        
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderFunction();
            }
        });
        
        nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderFunction();
            }
        });
    }
    
    // Render kategori di sidebar
    function renderCategories() {
        categoryListContainer.innerHTML = '';
        
        categories.forEach(category => {
            const categoryEl = document.createElement('div');
            categoryEl.className = 'category';
            categoryEl.dataset.category = category.id;
            
            categoryEl.innerHTML = `
                <div class="category-left">
                    <div class="category-icon" style="background-color: ${category.color}">
                        <i class="fas fa-${category.icon || getCategoryIcon(category.id)}"></i>
                    </div>
                    <span>${category.name}</span>
                </div>
                <div class="category-count" id="${category.id}-count">0</div>
            `;
            
            categoryEl.addEventListener('click', () => {
                currentFilter = category.id;
                currentPage = 1; // Reset to page 1 when filter changes
                changeSection('dashboard');
                renderDashboardTasks();
                showNotification('Filter Kategori', `Menampilkan kategori: ${category.name}`, 'info');
            });
            
            categoryListContainer.appendChild(categoryEl);
        });
        
        // Update task category dropdown
        updateCategoryDropdown();
        updateCategoryStats();
    }
    
    // Update kategori dropdown di form tugas
    function updateCategoryDropdown() {
        if (!taskCategorySelect) return;
        
        taskCategorySelect.innerHTML = '';
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            taskCategorySelect.appendChild(option);
        });
    }
    
    // Update filter dropdown dengan kategori
    function updateCategoryFilters() {
        const filterMenus = [filterMenu, allTasksFilterMenu];
        
        filterMenus.forEach(menu => {
            if (!menu) return;
            
            // Hapus filter kategori yang ada
            const existingCategoryFilters = menu.querySelectorAll('.filter-option[data-filter-type="category"]');
            existingCategoryFilters.forEach(filter => filter.remove());
            
            // Tambahkan filter kategori baru
            categories.forEach(category => {
                const filterOption = document.createElement('div');
                filterOption.className = 'filter-option';
                filterOption.dataset.filter = category.id;
                filterOption.dataset.filterType = 'category';
                filterOption.innerHTML = `Kategori: ${category.name}`;
                
                filterOption.addEventListener('click', e => {
                    // Get parent menu
                    const menu = e.target.closest('.filter-menu');
                    currentFilter = e.target.dataset.filter;
                    
                    // Reset to page 1 when filter changes
                    currentPage = 1;
                    
                    // Update active class
                    menu.querySelectorAll('.filter-option').forEach(opt => {
                        if (opt.dataset.filter === currentFilter) {
                            opt.classList.add('active');
                        } else {
                            opt.classList.remove('active');
                        }
                    });
                    
                    // Hide menu
                    menu.classList.remove('show');
                    
                    // Render tasks
                    renderAllTaskViews();
                    
                    showNotification('Filter Diterapkan', `Menampilkan: Kategori: ${category.name}`, 'info');
                });
                
                // Tambahkan ke menu filter
                menu.appendChild(filterOption);
            });
        });
    }
    
    // Render kategori dalam modal pengelolaan
    function renderCategoriesInModal() {
        categoriesList.innerHTML = '';
        
        categories.forEach(category => {
            const categoryItem = document.createElement('div');
            categoryItem.className = 'category-item';
            if (category.isDefault) {
                categoryItem.classList.add('default-category');
            }
            
            categoryItem.innerHTML = `
                <div class="category-item-left">
                    <div class="category-color" style="background-color: ${category.color}"></div>
                    <span>${category.name}</span>
                    ${category.isDefault ? '<span class="category-badge">Default</span>' : ''}
                </div>
                ${!category.isDefault ? `
                    <button class="category-delete-btn" data-id="${category.id}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                ` : ''}
            `;
            
            categoriesList.appendChild(categoryItem);
        });
        
        // Add event listeners for delete buttons
        document.querySelectorAll('.category-delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const categoryId = e.currentTarget.dataset.id;
                deleteCategory(categoryId);
            });
        });
    }
    
    // Get icon for category
    function getCategoryIcon(categoryId) {
        const icons = {
            work: 'briefcase',
            personal: 'user',
            shopping: 'shopping-bag',
            health: 'heart'
        };
        
        return icons[categoryId] || 'tag';
    }
    
    // Get color for category
    function getCategoryColor(categoryId) {
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.color : '#cccccc';
    }
    
    // Get name for category
    function getCategoryName(categoryId) {
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.name : 'Tidak diketahui';
    }
    
    // Add new category
    function addCategory() {
        const name = newCategoryNameInput.value.trim();
        const color = newCategoryColorInput.value;
        
        if (!name) {
            showNotification('Error', 'Nama kategori tidak boleh kosong', 'error');
            return;
        }
        
        // Generate unique ID based on name (slug)
        const id = name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now().toString().slice(-4);
        
        // Check if ID already exists
        if (categories.some(cat => cat.id === id)) {
            showNotification('Error', 'Kategori dengan nama yang sama sudah ada', 'error');
            return;
        }
        
        // Add new category
        categories.push({
            id,
            name,
            color,
            isDefault: false,
            icon: 'tag'
        });
        
        // Clear input
        newCategoryNameInput.value = '';
        
        // Re-render categories in modal
        renderCategoriesInModal();
        
        showNotification('Sukses', 'Kategori baru ditambahkan', 'success');
    }
    
    // Delete category
    function deleteCategory(categoryId) {
        // Check if category is used by any tasks
        const tasksWithCategory = tasks.filter(task => task.category === categoryId);
        
        if (tasksWithCategory.length > 0) {
            const confirmModal = document.createElement('div');
            confirmModal.className = 'modal';
            confirmModal.style.display = 'flex';
            
            const modalContent = document.createElement('div');
            modalContent.className = 'modal-content';
            modalContent.style.maxWidth = '450px';
            
            const categoryName = categories.find(cat => cat.id === categoryId).name;
            
            modalContent.innerHTML = `
                <div class="modal-body">
                    <div style="text-align: center; margin: 20px 0;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 48px; color: var(--warning-color); margin-bottom: 15px;"></i>
                        <h3 style="margin-bottom: 15px; font-size: 18px;">Perhatian: Kategori Sedang Digunakan</h3>
                        <p style="color: var(--text-secondary); margin-bottom: 15px;">
                            Kategori "${categoryName}" digunakan oleh ${tasksWithCategory.length} tugas.
                            Jika Anda menghapus kategori ini, semua tugas tersebut juga akan dihapus.
                        </p>
                        <p style="color: var(--text-secondary);">Apakah Anda yakin ingin melanjutkan?</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-cancel" id="cancelDeleteCategoryBtn">Batal</button>
                    <button class="btn" id="confirmDeleteCategoryBtn" style="background-color: var(--danger-color); color: white; border: none;">Hapus Kategori & Tugas</button>
                </div>
            `;
            
            confirmModal.appendChild(modalContent);
            document.body.appendChild(confirmModal);
            
            const cancelDeleteCategoryBtn = document.getElementById('cancelDeleteCategoryBtn');
            const confirmDeleteCategoryBtn = document.getElementById('confirmDeleteCategoryBtn');
            
            // Function to close the modal
            const closeConfirmModal = () => {
                document.body.removeChild(confirmModal);
            };
            
            cancelDeleteCategoryBtn.addEventListener('click', closeConfirmModal);
            
            confirmDeleteCategoryBtn.addEventListener('click', () => {
                // Hapus tugas dengan kategori ini
                tasks = tasks.filter(task => task.category !== categoryId);
                
                // Hapus kategori
                categories = categories.filter(category => category.id !== categoryId);
                
                // Simpan tugas
                saveTasks();
                
                // Re-render kategori dalam modal
                renderCategoriesInModal();
                
                closeConfirmModal();
                showNotification('Sukses', 'Kategori dan tugas terkait berhasil dihapus', 'success');
            });
            
            // Close modal when clicking outside
            confirmModal.addEventListener('click', (e) => {
                if (e.target === confirmModal) {
                    closeConfirmModal();
                }
            });
        } else {
            // No tasks using this category, delete directly
            categories = categories.filter(category => category.id !== categoryId);
            renderCategoriesInModal();
            showNotification('Sukses', 'Kategori berhasil dihapus', 'success');
        }
    }
    
    // Update category statistics
    function updateCategoryStats() {
        // Update category counts in sidebar
        categories.forEach(category => {
            const countEl = document.getElementById(`${category.id}-count`);
            if (countEl) {
                const count = tasks.filter(task => task.category === category.id).length;
                countEl.textContent = count;
            }
        });
    }
    
    // Render all task views
    function renderAllTaskViews() {
        renderDashboardTasks();
        renderAllTasks();
        renderPriorityTasks();
        renderCalendarTasks();
    }
    
    // Render dashboard tasks
    function renderDashboardTasks() {
        const filteredTasks = getFilteredTasks();
        const activeTasks = filteredTasks.filter(task => !task.completed);
        const completedTasks = filteredTasks.filter(task => task.completed);
        
        // Reset current page jika filter berubah
        if (activeTasks.length <= (currentPage - 1) * itemsPerPage) {
            currentPage = 1;
        }
        
        // Render active tasks dengan pagination
        if (activeTasks.length === 0) {
            activeTasksList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-clipboard-list"></i>
                    <p>Tidak ada tugas aktif untuk ditampilkan</p>
                </div>
            `;
        } else {
            // Ambil subset dari data untuk halaman saat ini
            const paginatedActiveTasks = paginateData(activeTasks, currentPage, itemsPerPage);
            
            activeTasksList.innerHTML = '';
            paginatedActiveTasks.forEach(task => {
                activeTasksList.appendChild(createTaskElement(task));
            });
            
            // Tambahkan kontrol pagination
            createPaginationControls(activeTasks.length, activeTasksList, renderDashboardTasks);
        }
        
        // Render completed tasks
        if (completedTasks.length === 0) {
            completedTasksList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-check-circle"></i>
                    <p>Tidak ada tugas yang telah diselesaikan</p>
                </div>
            `;
        } else {
            completedTasksList.innerHTML = '';
            
            // Batasi jumlah tugas selesai yang ditampilkan tanpa pagination
            const limitedCompletedTasks = completedTasks.slice(0, itemsPerPage);
            limitedCompletedTasks.forEach(task => {
                completedTasksList.appendChild(createTaskElement(task));
            });
            
            // Tambahkan tombol "Lihat Semua" jika ada lebih banyak tugas
            if (completedTasks.length > itemsPerPage) {
                const viewAllBtn = document.createElement('button');
                viewAllBtn.className = 'view-all-btn';
                viewAllBtn.innerHTML = `Lihat Semua (${completedTasks.length})`;
                viewAllBtn.addEventListener('click', () => {
                    // Pindah ke tampilan semua tugas dengan filter tugas selesai
                    currentFilter = 'completed';
                    changeSection('all-tasks');
                    renderAllTasks();
                });
                completedTasksList.appendChild(viewAllBtn);
            }
        }
        
        // Update visibility of completed tasks section
        document.querySelector('.completed-section').style.display = 
            showCompletedTasks ? 'block' : 'none';
    }
    
    // Render all tasks
    function renderAllTasks() {
        const filteredTasks = getFilteredTasks(currentFilter, allTasksSearchInput ? allTasksSearchInput.value : '');
        
        // Reset current page jika filter berubah atau jumlah data berubah
        if (filteredTasks.length <= (currentPage - 1) * itemsPerPage) {
            currentPage = 1;
        }
        
        if (filteredTasks.length === 0) {
            allTasksList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-clipboard-list"></i>
                    <p>Tidak ada tugas untuk ditampilkan</p>
                </div>
            `;
        } else {
            // Ambil subset dari data untuk halaman saat ini
            const paginatedTasks = paginateData(filteredTasks, currentPage, itemsPerPage);
            
            allTasksList.innerHTML = '';
            paginatedTasks.forEach(task => {
                allTasksList.appendChild(createTaskElement(task));
            });
            
            // Tambahkan kontrol pagination
            createPaginationControls(filteredTasks.length, allTasksList, renderAllTasks);
        }
        
        // Update count
        allTasksCountEl.textContent = filteredTasks.length;
    }
    
    // Render priority tasks
    function renderPriorityTasks() {
        const highPriorityTasks = tasks.filter(task => task.priority === 'high' && !task.completed);
        const mediumPriorityTasks = tasks.filter(task => task.priority === 'medium' && !task.completed);
        const lowPriorityTasks = tasks.filter(task => task.priority === 'low' && !task.completed);
        
        // Render high priority tasks dengan pagination
        if (highPriorityTasks.length === 0) {
            highPriorityTasksList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Tidak ada tugas prioritas tinggi</p>
                </div>
            `;
        } else {
            // Ambil subset dari data untuk halaman saat ini
            const paginatedHighTasks = paginateData(highPriorityTasks, currentPage, itemsPerPage);
            
            highPriorityTasksList.innerHTML = '';
            paginatedHighTasks.forEach(task => {
                highPriorityTasksList.appendChild(createTaskElement(task));
            });
            
            // Tambahkan kontrol pagination jika perlu
            if (highPriorityTasks.length > itemsPerPage) {
                createPaginationControls(highPriorityTasks.length, highPriorityTasksList, renderPriorityTasks);
            }
        }
        
        // Render medium priority tasks (tanpa pagination untuk kesederhanaan)
        if (mediumPriorityTasks.length === 0) {
            mediumPriorityTasksList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Tidak ada tugas prioritas sedang</p>
                </div>
            `;
        } else {
            mediumPriorityTasksList.innerHTML = '';
            mediumPriorityTasks.slice(0, itemsPerPage).forEach(task => {
                mediumPriorityTasksList.appendChild(createTaskElement(task));
            });
            
            // Tambahkan tombol "Lihat Semua" jika ada lebih banyak tugas
            if (mediumPriorityTasks.length > itemsPerPage) {
                const viewAllBtn = document.createElement('button');
                viewAllBtn.className = 'view-all-btn';
                viewAllBtn.innerHTML = `Lihat Semua (${mediumPriorityTasks.length})`;
                viewAllBtn.addEventListener('click', () => {
                    currentFilter = 'medium';
                    changeSection('all-tasks');
                    renderAllTasks();
                });
                mediumPriorityTasksList.appendChild(viewAllBtn);
            }
        }
        
        // Render low priority tasks (tanpa pagination untuk kesederhanaan)
        if (lowPriorityTasks.length === 0) {
            lowPriorityTasksList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Tidak ada tugas prioritas rendah</p>
                </div>
            `;
        } else {
            lowPriorityTasksList.innerHTML = '';
            lowPriorityTasks.slice(0, itemsPerPage).forEach(task => {
                lowPriorityTasksList.appendChild(createTaskElement(task));
            });
            
            // Tambahkan tombol "Lihat Semua" jika ada lebih banyak tugas
            if (lowPriorityTasks.length > itemsPerPage) {
                const viewAllBtn = document.createElement('button');
                viewAllBtn.className = 'view-all-btn';
                viewAllBtn.innerHTML = `Lihat Semua (${lowPriorityTasks.length})`;
                viewAllBtn.addEventListener('click', () => {
                    currentFilter = 'low';
                    changeSection('all-tasks');
                    renderAllTasks();
                });
                lowPriorityTasksList.appendChild(viewAllBtn);
            }
        }
        
        // Update counts
        highPriorityCountEl.textContent = highPriorityTasks.length;
        mediumPriorityCountEl.textContent = mediumPriorityTasks.length;
        lowPriorityCountEl.textContent = lowPriorityTasks.length;
    }
    
    // Render calendar tasks
    function renderCalendarTasks() {
        const selectedDateString = formatDateForStorage(selectedDate);
        const tasksForDate = getTasksForDate(selectedDateString);
        
        // Update the date title
        const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        selectedDateTitleEl.textContent = `Tugas untuk ${selectedDate.toLocaleDateString('id-ID', dateOptions)}`;
        
        // Render tasks for selected date
        if (tasksForDate.length === 0) {
            calendarTasksList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar-day"></i>
                    <p>Tidak ada tugas untuk tanggal ini</p>
                </div>
            `;
        } else {
            calendarTasksList.innerHTML = '';
            tasksForDate.forEach(task => {
                calendarTasksList.appendChild(createTaskElement(task));
            });
        }
    }
    
    // Create task DOM element
    function createTaskElement(task) {
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';
        taskItem.dataset.id = task.id;
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTaskCompletion(task.id));
        
        const taskContent = document.createElement('div');
        taskContent.className = 'task-content';
        
        const taskTitle = document.createElement('div');
        taskTitle.className = 'task-title';
        taskTitle.textContent = task.title;
        
        const taskMeta = document.createElement('div');
        taskMeta.className = 'task-meta';
        
        // Find the category
        const taskCategory = categories.find(cat => cat.id === task.category) ||
                          { id: 'unknown', name: 'Tidak diketahui', color: '#cccccc' };
        
        const taskCategoryEl = document.createElement('div');
        taskCategoryEl.className = 'task-category';
        
        const categoryDot = document.createElement('div');
        categoryDot.className = 'category-dot';
        categoryDot.style.backgroundColor = taskCategory.color;
        
        const categoryText = document.createElement('span');
        categoryText.textContent = taskCategory.name;
        
        taskCategoryEl.appendChild(categoryDot);
        taskCategoryEl.appendChild(categoryText);
        
        // Task date
        const taskDate = document.createElement('div');
        taskDate.className = 'task-date';
        
        const calendarIcon = document.createElement('i');
        calendarIcon.className = 'far fa-calendar-alt';
        
        const dateText = document.createElement('span');
        // Format date to Indonesian format
        const formattedDate = formatDateDisplay(task.date);
        dateText.textContent = formattedDate;
        
        taskDate.appendChild(calendarIcon);
        taskDate.appendChild(dateText);
        
        // Due time
        const taskDue = document.createElement('div');
        taskDue.className = 'task-due';
        
        const clockIcon = document.createElement('i');
        clockIcon.className = 'far fa-clock';
        
        const timeText = document.createElement('span');
        timeText.textContent = task.time;
        
        taskDue.appendChild(clockIcon);
        taskDue.appendChild(timeText);
        
        // Priority
        const taskPriority = document.createElement('div');
        taskPriority.className = `task-priority priority-${task.priority}`;
        
        const priorityLabels = {
            high: 'Prioritas Tinggi',
            medium: 'Prioritas Sedang',
            low: 'Prioritas Rendah'
        };
        
        taskPriority.textContent = priorityLabels[task.priority];
        
        // Add meta elements
        // taskMeta.appendChild(taskCategoryEl);
        taskMeta.appendChild(taskDate); 
        // taskMeta.appendChild(taskDue);
        taskMeta.appendChild(taskPriority);
        
        // Add elements to task content
        taskContent.appendChild(taskTitle);
        taskContent.appendChild(taskMeta);
        
        // Task actions
        const taskActions = document.createElement('div');
        taskActions.className = 'task-actions';
        
        // View details button
        const viewBtn = document.createElement('button');
        viewBtn.className = 'task-btn';
        viewBtn.setAttribute('data-tooltip', 'Lihat Detail');
        viewBtn.innerHTML = '<i class="fas fa-eye"></i>';
        viewBtn.addEventListener('click', () => viewTaskDetails(task.id));
        
        const editBtn = document.createElement('button');
        editBtn.className = 'task-btn';
        editBtn.setAttribute('data-tooltip', 'Edit');
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.addEventListener('click', () => editTask(task.id));
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'task-btn';
        deleteBtn.setAttribute('data-tooltip', 'Hapus');
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));
        
        taskActions.appendChild(viewBtn); // Added view button
        taskActions.appendChild(editBtn);
        taskActions.appendChild(deleteBtn);
        
        // Add all elements to task item
        taskItem.appendChild(checkbox);
        taskItem.appendChild(taskContent);
        taskItem.appendChild(taskActions);
        
        return taskItem;
    }
    
    // View task details
    function viewTaskDetails(id) {
        const task = tasks.find(task => task.id === id);
        if (!task) return;
        
        // Find the category
        const taskCategory = categories.find(cat => cat.id === task.category) ||
                          { id: 'unknown', name: 'Tidak diketahui', color: '#cccccc' };
        
        // Create a task details modal
        const detailsModal = document.createElement('div');
        detailsModal.className = 'modal';
        detailsModal.style.display = 'flex';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        
        // Format date for display
        const formattedDate = formatDateDisplay(task.date);
        
        const priorityLabels = {
            high: 'Tinggi',
            medium: 'Sedang',
            low: 'Rendah'
        };
        
        modalContent.innerHTML = `
            <div class="modal-header">
                <div class="modal-title">Detail Tugas</div>
                <button class="close-btn" id="closeDetailsBtn">&times;</button>
            </div>
            <div class="modal-body">
                <h2 style="margin-bottom: 20px; color: var(--primary-color);">${task.title}</h2>
                
                <div style="margin-bottom: 20px;">
                    <h3 style="margin-bottom: 8px; font-size: 16px;">Deskripsi</h3>
                    <p style="padding: 15px; background-color: var(--light-bg); border-radius: 8px;">${task.description || 'Tidak ada deskripsi'}</p>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                    <div>
                        <h3 style="margin-bottom: 8px; font-size: 16px;">Kategori</h3>
                        <p style="padding: 8px 15px; background-color: var(--light-bg); border-radius: 8px; display: inline-flex; align-items: center; gap: 8px;">
                            <span class="category-dot" style="background-color: ${taskCategory.color}"></span>
                            ${taskCategory.name}
                        </p>
                    </div>
                    <div>
                        <h3 style="margin-bottom: 8px; font-size: 16px;">Prioritas</h3>
                        <p class="task-priority priority-${task.priority}" style="display: inline-block; padding: 8px 15px;">
                            ${priorityLabels[task.priority]}
                        </p>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                    <div>
                        <h3 style="margin-bottom: 8px; font-size: 16px;">Tanggal</h3>
                        <p style="padding: 8px 15px; background-color: var(--light-bg); border-radius: 8px; display: inline-flex; align-items: center; gap: 8px;">
                            <i class="far fa-calendar-alt"></i>
                            ${formattedDate}
                        </p>
                    </div>
                    <div>
                        <h3 style="margin-bottom: 8px; font-size: 16px;">Waktu</h3>
                        <p style="padding: 8px 15px; background-color: var(--light-bg); border-radius: 8px; display: inline-flex; align-items: center; gap: 8px;">
                            <i class="far fa-clock"></i>
                            ${task.time}
                        </p>
                    </div>
                </div>
                
                <div>
                    <h3 style="margin-bottom: 8px; font-size: 16px;">Status</h3>
                    <p style="padding: 8px 15px; background-color: ${task.completed ? 'rgba(74, 222, 128, 0.2)' : 'rgba(251, 191, 36, 0.2)'}; color: ${task.completed ? 'var(--success-color)' : 'var(--warning-color)'}; border-radius: 8px; display: inline-block;">
                        ${task.completed ? 'Selesai' : 'Belum Selesai'}
                    </p>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" id="editFromDetailsBtn">Edit Tugas</button>
                <button class="btn btn-cancel" id="closeDetailsFooterBtn">Tutup</button>
            </div>
        `;
        
        detailsModal.appendChild(modalContent);
        document.body.appendChild(detailsModal);
        
        // Close button event
        const closeDetailsBtn = document.getElementById('closeDetailsBtn');
        const closeDetailsFooterBtn = document.getElementById('closeDetailsFooterBtn');
        const editFromDetailsBtn = document.getElementById('editFromDetailsBtn');
        
        closeDetailsBtn.addEventListener('click', () => {
            document.body.removeChild(detailsModal);
        });
        
        closeDetailsFooterBtn.addEventListener('click', () => {
            document.body.removeChild(detailsModal);
        });
        
        editFromDetailsBtn.addEventListener('click', () => {
            document.body.removeChild(detailsModal);
            editTask(id);
        });
        
        // Close when clicking outside
        detailsModal.addEventListener('click', (e) => {
            if (e.target === detailsModal) {
                document.body.removeChild(detailsModal);
            }
        });
    }
    
    // Format date for display (DD Bulan YYYY)
    function formatDateDisplay(dateString) {
        if (!dateString) return '';
        
        const [year, month, day] = dateString.split('-');
        const date = new Date(year, month - 1, day);
        
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('id-ID', options);
    }
    
    // Add new task
    function addTask() {
        const title = taskTitleInput.value.trim();
        const description = taskDescriptionInput.value.trim();
        const category = taskCategorySelect.value;
        const priority = taskPrioritySelect.value;
        const date = taskDateInput.value;
        const time = taskTimeInput.value;
        
        if (!title) {
            showNotification('Error', 'Judul tugas tidak boleh kosong', 'error');
            return;
        }
        
        // Validate that category still exists
        if (!categories.some(cat => cat.id === category)) {
            showNotification('Error', 'Kategori tidak valid, silakan pilih kategori lain', 'error');
            return;
        }
        
        const newTask = {
            id: generateId(),
            title,
            description,
            category,
            priority,
            date,
            time,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        tasks.push(newTask);
        saveTasks();
        closeModal();
        showNotification('Sukses', 'Tugas baru berhasil ditambahkan', 'success');
    }
    
    // Toggle task completion status
    function toggleTaskCompletion(id) {
        tasks = tasks.map(task => {
            if (task.id === id) {
                const updatedTask = { ...task, completed: !task.completed };
                const message = updatedTask.completed ? 
                    'Tugas telah ditandai sebagai selesai' : 
                    'Tugas ditandai sebagai belum selesai';
                showNotification('Status Diperbarui', message, 'success');
                return updatedTask;
            }
            return task;
        });
        
        saveTasks();
    }
    
    // Edit task
    function editTask(id) {
        const task = tasks.find(task => task.id === id);
        if (!task) return;
        
        currentTaskId = id;
        isEditMode = true;
        
        // Fill the form with task data
        taskTitleInput.value = task.title;
        taskDescriptionInput.value = task.description || '';
        
        // Check if the category still exists, if not, select first available category
        if (categories.some(cat => cat.id === task.category)) {
            taskCategorySelect.value = task.category;
        } else {
            taskCategorySelect.value = categories[0].id;
        }
        
        taskPrioritySelect.value = task.priority;
        taskDateInput.value = task.date;
        taskTimeInput.value = task.time;
        
        // Update modal title
        modalTitle.textContent = 'Edit Tugas';
        
        // Open the modal
        openModal();
    }
    
    // Update task
    function updateTask() {
        const title = taskTitleInput.value.trim();
        const description = taskDescriptionInput.value.trim();
        const category = taskCategorySelect.value;
        const priority = taskPrioritySelect.value;
        const date = taskDateInput.value;
        const time = taskTimeInput.value;
        
        if (!title) {
            showNotification('Error', 'Judul tugas tidak boleh kosong', 'error');
            return;
        }
        
        // Validate that category still exists
        if (!categories.some(cat => cat.id === category)) {
            showNotification('Error', 'Kategori tidak valid, silakan pilih kategori lain', 'error');
            return;
        }
        
        tasks = tasks.map(task => {
            if (task.id === currentTaskId) {
                return {
                    ...task,
                    title,
                    description,
                    category,
                    priority,
                    date,
                    time,
                    updatedAt: new Date().toISOString()
                };
            }
            return task;
        });
        
        saveTasks();
        closeModal();
        showNotification('Sukses', 'Tugas berhasil diperbarui', 'success');
    }
    
    // Delete task dengan konfirmasi modal kustom
    function deleteTask(id) {
        // Buat modal konfirmasi hapus
        const confirmModal = document.createElement('div');
        confirmModal.className = 'modal';
        confirmModal.style.display = 'flex';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        modalContent.style.maxWidth = '400px';
        
        // Cari data tugas yang akan dihapus
        const task = tasks.find(task => task.id === id);
        
        modalContent.innerHTML = `
            <div class="modal-body">
                <div style="text-align: center; margin: 20px 0;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 48px; color: var(--danger-color); margin-bottom: 15px;"></i>
                    <h3 style="margin-bottom: 15px; font-size: 18px;">Apakah Anda yakin ingin menghapus tugas ini?</h3>
                    <p style="color: var(--text-secondary);">"${task.title}"</p>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-cancel" id="cancelDeleteBtn">Batal</button>
                <button class="btn" id="confirmDeleteBtn" style="background-color: var(--danger-color); color: white; border: none;">Hapus Tugas</button>
            </div>
        `;
        
        confirmModal.appendChild(modalContent);
        document.body.appendChild(confirmModal);
        
        // Event handler untuk tombol-tombol
        const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
        const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
        
        // Fungsi untuk menutup dan menghapus modal
        const closeConfirmModal = () => {
            document.body.removeChild(confirmModal);
        };
        
        cancelDeleteBtn.addEventListener('click', closeConfirmModal);
        
        // Konfirmasi hapus
        confirmDeleteBtn.addEventListener('click', () => {
            // Hapus tugas dari array
            tasks = tasks.filter(task => task.id !== id);
            saveTasks();
            closeConfirmModal();
            showNotification('Sukses', 'Tugas berhasil dihapus', 'success');
        });
        
        // Tutup modal saat klik di luar area
        confirmModal.addEventListener('click', (e) => {
            if (e.target === confirmModal) {
                closeConfirmModal();
            }
        });
    }
    
    // Update statistics
    function updateStats() {
        // Get counts
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.completed).length;
        const activeTasks = totalTasks - completedTasks;
        
        // Today's tasks
        const todayTasks = tasks.filter(task => task.date === formattedToday);
        const todayCompleted = todayTasks.filter(task => task.completed).length;
        const todayRemaining = todayTasks.length - todayCompleted;
        const todayProgress = todayTasks.length ? Math.round((todayCompleted / todayTasks.length) * 100) : 0;
        
        // Priority tasks (high and medium)
        const priorityTasks = tasks.filter(task => task.priority === 'high' || task.priority === 'medium');
        const priorityCompleted = priorityTasks.filter(task => task.completed).length;
        const priorityRemaining = priorityTasks.length - priorityCompleted;
        const priorityProgress = priorityTasks.length ? Math.round((priorityCompleted / priorityTasks.length) * 100) : 0;
        
        // Total progress
        const totalProgress = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;
        
        // Update the UI
        todayProgressEl.textContent = `${todayProgress}%`;
        todayProgressFillEl.style.width = `${todayProgress}%`;
        todayCompletedEl.textContent = `${todayCompleted} dari ${todayTasks.length} tugas`;
        todayRemainingEl.textContent = `${todayRemaining} tersisa`;
        
        priorityProgressEl.textContent = `${priorityProgress}%`;
        priorityProgressFillEl.style.width = `${priorityProgress}%`;
        priorityCompletedEl.textContent = `${priorityCompleted} dari ${priorityTasks.length} tugas`;
        priorityRemainingEl.textContent = `${priorityRemaining} tersisa`;
        
        totalProgressEl.textContent = `${totalProgress}%`;
        totalProgressFillEl.style.width = `${totalProgress}%`;
        totalCompletedEl.textContent = `${completedTasks} dari ${totalTasks} tugas`;
        totalRemainingEl.textContent = `${activeTasks} tersisa`;
        
        // Update counts
        activeCountEl.textContent = activeTasks;
        completedCountEl.textContent = completedTasks;
        
        // Update category counts and charts
        updateCategoryStats();
        updateCategoryChart();
        updatePriorityChart();
        
        // Update statistics section
        statsTotalTasksEl.textContent = totalTasks;
        statsCompletedTasksEl.textContent = completedTasks;
        statsActiveTasksEl.textContent = activeTasks;
    }
    
    // Update category chart
    function updateCategoryChart() {
        // Clear chart
        categoryChartEl.innerHTML = '';
        
        // Skip if there are no tasks or categories
        if (tasks.length === 0 || categories.length === 0) {
            categoryChartEl.innerHTML = `<div class="empty-chart">Tidak ada data</div>`;
            return;
        }
        
        // Count tasks for each category
        const categoryCounts = {};
        categories.forEach(category => {
            categoryCounts[category.id] = tasks.filter(task => task.category === category.id).length;
        });
        
        // Calculate max height
        const maxCount = Math.max(...Object.values(categoryCounts), 1);
        
        // Create chart bars
        const visibleCategories = categories.filter(cat => categoryCounts[cat.id] > 0);
        
        visibleCategories.forEach((category, index) => {
            const count = categoryCounts[category.id];
            const height = count ? (count / maxCount) * 180 : 0; // 180px max height
            
            const bar = document.createElement('div');
            bar.className = 'chart-bar';
            bar.style.height = `${height}px`;
            bar.style.left = `${index * (100 / (visibleCategories.length)) + (100 / (visibleCategories.length * 2))}%`;
            bar.style.backgroundColor = category.color;
            
            const label = document.createElement('div');
            label.className = 'chart-label';
            label.textContent = count;
            label.style.left = `${index * (100 / (visibleCategories.length)) + (100 / (visibleCategories.length * 2))}%`;
            
            categoryChartEl.appendChild(bar);
            categoryChartEl.appendChild(label);
        });
        
        // Update legend
        const statsLegend = categoryChartEl.closest('.stats-card').querySelector('.stats-legend');
        statsLegend.innerHTML = '';
        
        visibleCategories.forEach(category => {
            const legendItem = document.createElement('div');
            legendItem.className = 'legend-item';
            legendItem.innerHTML = `
                <div class="legend-color" style="background-color: ${category.color}"></div>
                <span>${category.name}</span>
            `;
            statsLegend.appendChild(legendItem);
        });
    }
    
    // Update priority chart
    function updatePriorityChart() {
        const priorityCounts = {
            high: tasks.filter(task => task.priority === 'high').length,
            medium: tasks.filter(task => task.priority === 'medium').length,
            low: tasks.filter(task => task.priority === 'low').length
        };
        
        // Clear chart
        priorityChartEl.innerHTML = '';
        
        // Skip if there are no tasks
        if (tasks.length === 0) {
            priorityChartEl.innerHTML = `<div class="empty-chart">Tidak ada data</div>`;
            return;
        }
        
        // Calculate max height
        const maxCount = Math.max(...Object.values(priorityCounts), 1);
        const priorities = ['high', 'medium', 'low'];
        
        // Create chart bars
        priorities.forEach((priority, index) => {
            const count = priorityCounts[priority];
            const height = count ? (count / maxCount) * 180 : 0; // 180px max height
            
            const barClasses = {
                high: 'danger-color',
                medium: 'warning-color',
                low: 'success-color'
            };
            
            const bar = document.createElement('div');
            bar.className = 'chart-bar';
            bar.style.height = `${height}px`;
            bar.style.left = `${index * 30 + 15}%`;
            bar.style.backgroundColor = `var(--${barClasses[priority]})`;
            
            const label = document.createElement('div');
            label.className = 'chart-label';
            label.textContent = count;
            label.style.left = `${index * 30 + 15}%`;
            
            priorityChartEl.appendChild(bar);
            priorityChartEl.appendChild(label);
        });
    }
    
    // Render calendar
    function renderCalendar() {
        // Update month/year display
        const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                           'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        calendarMonthYearEl.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
        
        // Clear calendar days
        calendarDaysEl.innerHTML = '';
        
        // Get first day of month and total days
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        
        // Get day of week for first day (0 = Sunday)
        const firstDayOfWeek = firstDay.getDay();
        
        // Create days from previous month
        const prevMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
        for (let i = 0; i < firstDayOfWeek; i++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day other-month';
            dayEl.textContent = prevMonthLastDay - firstDayOfWeek + i + 1;
            calendarDaysEl.appendChild(dayEl);
        }
        
        // Create days for current month
        for (let i = 1; i <= lastDay.getDate(); i++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
            const dateString = formatDateForStorage(date);
            const tasksForDay = getTasksForDate(dateString);
            
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day';
            dayEl.textContent = i;
            
            // Mark today
            if (date.toDateString() === today.toDateString()) {
                dayEl.classList.add('today');
            }
            
            // Mark if has tasks
            if (tasksForDay.length > 0) {
                dayEl.classList.add('has-tasks');
            }
            
            // Mark selected date
            if (date.toDateString() === selectedDate.toDateString()) {
                dayEl.classList.add('selected');
            }
            
            // Add click event
            dayEl.addEventListener('click', () => {
                selectedDate = new Date(date);
                renderCalendarTasks();
                
                // Update selected class
                document.querySelectorAll('.calendar-day.selected').forEach(el => {
                    el.classList.remove('selected');
                });
                dayEl.classList.add('selected');
            });
            
            calendarDaysEl.appendChild(dayEl);
        }
        
        // Fill remaining grid with days from next month
        const totalDaysShown = firstDayOfWeek + lastDay.getDate();
        const nextMonthDays = 42 - totalDaysShown; // 6 rows of 7 days
        
        for (let i = 1; i <= nextMonthDays; i++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day other-month';
            dayEl.textContent = i;
            calendarDaysEl.appendChild(dayEl);
        }
    }
    
    // Format date for storage (YYYY-MM-DD)
    function formatDateForStorage(date) {
        const d = new Date(date);
        const year = d.getFullYear();
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        
        return [year, month, day].join('-');
    }

    // Show notification
    function showNotification(title, message, type = 'info') {
        notificationTitle.textContent = title;
        notificationMessage.textContent = message;
        
        notification.className = 'notification';
        notification.classList.add(type);
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    // Modal functions
    function openModal() {
        modal.style.display = 'flex';
    }

    function closeModal() {
        modal.style.display = 'none';
        resetForm();
    }

    function resetForm() {
        taskTitleInput.value = '';
        taskDescriptionInput.value = '';
        taskCategorySelect.value = categories.length > 0 ? categories[0].id : '';
        taskPrioritySelect.value = 'medium';
        taskDateInput.value = formattedToday;
        
        const hours = today.getHours().toString().padStart(2, '0');
        const minutes = today.getMinutes().toString().padStart(2, '0');
        taskTimeInput.value = `${hours}:${minutes}`;
        
        currentTaskId = null;
        isEditMode = false;
        modalTitle.textContent = 'Tambah Tugas Baru';
    }

    // Change current section
    function changeSection(section) {
        currentSection = section;
        
        // Reset current page when changing section
        currentPage = 1;
        
        // Update active menu item
        menuItems.forEach(item => {
            if (item.dataset.section === section) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        // Show/hide sections
        pageSections.forEach(pageSection => {
            if (pageSection.id === `${section}-section`) {
                pageSection.classList.add('active');
            } else {
                pageSection.classList.remove('active');
            }
        });
    }

    // ===== Event Listeners =====

    // Navigation
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            changeSection(item.dataset.section);
        });
    });

    // Filter dropdown toggle
    filterBtn.addEventListener('click', () => {
        filterMenu.classList.toggle('show');
    });

    allTasksFilterBtn.addEventListener('click', () => {
        allTasksFilterMenu.classList.toggle('show');
    });

    // Filter options
    document.querySelectorAll('.filter-option').forEach(option => {
        option.addEventListener('click', e => {
            // Get parent menu
            const menu = e.target.closest('.filter-menu');
            currentFilter = e.target.dataset.filter;
            
            // Reset to page 1 when filter changes
            currentPage = 1;
            
            // Update active class
            menu.querySelectorAll('.filter-option').forEach(opt => {
                if (opt.dataset.filter === currentFilter) {
                    opt.classList.add('active');
                } else {
                    opt.classList.remove('active');
                }
            });
            
            // Hide menu
            menu.classList.remove('show');
            
            // Render tasks
            renderAllTaskViews();
            
            // Show notification
            const filterLabels = {
                all: 'Semua Tugas',
                today: 'Tugas Hari Ini',
                completed: 'Tugas Selesai',
                high: 'Prioritas Tinggi',
                medium: 'Prioritas Sedang',
                low: 'Prioritas Rendah',
                work: 'Kategori: Pekerjaan',
                personal: 'Kategori: Pribadi',
                shopping: 'Kategori: Belanja',
                health: 'Kategori: Kesehatan'
            };
            
            // Get category name if it's a category filter
            const category = categories.find(cat => cat.id === currentFilter);
            const filterLabel = category ? `Kategori: ${category.name}` : filterLabels[currentFilter] || 'Filter Kustom';
            
            showNotification('Filter Diterapkan', `Menampilkan: ${filterLabel}`, 'info');
        });
    });

    // Search
    searchInput.addEventListener('input', e => {
        searchQuery = e.target.value.trim();
        currentPage = 1; // Reset to page 1 when search changes
        renderDashboardTasks();
    });

    allTasksSearchInput.addEventListener('input', e => {
        currentPage = 1; // Reset to page 1 when search changes
        renderAllTasks();
    });

    // Toggle completed tasks
    toggleCompletedBtn.addEventListener('click', () => {
        showCompletedTasks = !showCompletedTasks;
        toggleCompletedBtn.innerHTML = showCompletedTasks ? 
            '<i class="fas fa-eye-slash"></i><span>Sembunyikan</span>' : 
            '<i class="fas fa-eye"></i><span>Tampilkan</span>';
        document.querySelector('.completed-section').style.display = 
            showCompletedTasks ? 'block' : 'none';
    });

    // Calendar navigation
    prevMonthBtn.addEventListener('click', () => {
        currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        renderCalendar();
    });

    // Modal events
    openModalBtn.addEventListener('click', () => {
        resetForm();
        openModal();
    });

    openModalBtnCalendar.addEventListener('click', () => {
        resetForm();
        taskDateInput.value = formatDateForStorage(selectedDate);
        openModal();
    });

    openModalBtnAll.addEventListener('click', () => {
        resetForm();
        openModal();
    });

    openModalBtnPriority.addEventListener('click', () => {
        resetForm();
        openModal();
    });

    closeModalBtn.addEventListener('click', closeModal);
    cancelModalBtn.addEventListener('click', closeModal);

    saveTaskBtn.addEventListener('click', () => {
        if (isEditMode) {
            updateTask();
        } else {
            addTask();
        }
    });

    // Category management events
    if (manageCategoriesBtn) {
        manageCategoriesBtn.addEventListener('click', () => {
            renderCategoriesInModal();
            categoriesModal.style.display = 'flex';
        });
    }

    if (closeCategoriesModalBtn) {
        closeCategoriesModalBtn.addEventListener('click', () => {
            categoriesModal.style.display = 'none';
        });
    }

    if (newCategoryColorInput && colorPreview) {
        newCategoryColorInput.addEventListener('input', (e) => {
            colorPreview.style.backgroundColor = e.target.value;
        });
    }

    if (addCategoryBtn) {
        addCategoryBtn.addEventListener('click', addCategory);
    }

    if (saveCategoriesBtn) {
        saveCategoriesBtn.addEventListener('click', () => {
            saveCategories();
            updateCategoryFilters();
            categoriesModal.style.display = 'none';
            showNotification('Sukses', 'Perubahan kategori berhasil disimpan', 'success');
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', e => {
        if (e.target === modal) {
            closeModal();
        }
        
        if (e.target === categoriesModal) {
            categoriesModal.style.display = 'none';
        }
    });

    // Close filter menus when clicking outside
    window.addEventListener('click', e => {
        if (!e.target.closest('.filter-dropdown')) {
            filterMenu.classList.remove('show');
            allTasksFilterMenu.classList.remove('show');
        }
    });

    // Initial load
    loadTasks();
    loadCategories();
});