// ===== AUTHENTICATION FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            tabContents.forEach(content => {
                content.style.display = 'none';
            });
            
            const tabId = button.getAttribute('data-tab');
            const contentId = `${tabId}-${window.location.pathname.includes('login') ? 'login' : 'register'}`;
            document.getElementById(contentId).style.display = 'block';
        });
    });

    // Form validation and submission
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (form.id.includes('Register')) {
                const passwordField = form.querySelector('input[type="password"]');
                const confirmPasswordField = form.querySelectorAll('input[type="password"]')[1];
                
                if (passwordField.value !== confirmPasswordField.value) {
                    alert('Passwords do not match!');
                    return;
                }
            }
            
            if (form.id === 'teacherRegisterForm') {
                const contactField = form.querySelector('input[type="tel"]');
                if (!contactField.value.match(/^[0-9]{10}$/)) {
                    alert('Please enter a valid 10-digit phone number for contact.');
                    return;
                }
            }
            
            alert('Form submitted successfully!');
            form.reset();
            
            if (form.id.includes('Register')) {
                setTimeout(() => {
                    window.location.href = '../teacher/index.html';
                }, 1000);
            }
        });
    });

    // Student profile fetch and update functions
    async function fetchStudentProfile() {
        const studentId = localStorage.getItem('studentId');
        if (!studentId) {
            console.error('No studentId found in localStorage');
            return;
        }
        try {
            const response = await fetch(`/profile/student/${studentId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch student profile');
            }
            const data = await response.json();
            // Update form fields
            document.getElementById('studentFullName').value = data.fullName || '';
            document.getElementById('studentEmail').value = data.email || '';
            document.getElementById('studentCourse').value = data.course || '';
            // Update navbar profile-info elements
            document.getElementById('profileName').textContent = data.fullName || 'N/A';
            document.getElementById('profileEmail').textContent = data.email || 'N/A';
            document.getElementById('profileDepartment').textContent = data.department || 'N/A';
            document.getElementById('profileCourses').textContent = data.course || 'N/A';
        } catch (error) {
            console.error('Error fetching student profile:', error);
        }
    }

    async function updateStudentProfile(updatedData) {
        const studentId = localStorage.getItem('studentId');
        if (!studentId) {
            console.error('No studentId found in localStorage');
            return;
        }
        try {
            const response = await fetch(`/profile/student/${studentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            });
            if (!response.ok) {
                throw new Error('Failed to update student profile');
            }
            const result = await response.json();
            alert(result.message || 'Profile updated successfully');
            // Refresh profile data after update
            fetchStudentProfile();
        } catch (error) {
            console.error('Error updating student profile:', error);
            alert('Error updating profile');
        }
    }

    // Expose student profile functions to global scope for UI event handlers
    window.fetchStudentProfile = fetchStudentProfile;
    window.updateStudentProfile = updateStudentProfile;

    // Call fetchStudentProfile on page load
    fetchStudentProfile();
});

// ===== CLASS STATS FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', function() {
    // College-level statistics
    const collegeData = {
        weeklySubjects: [
            { code: 'CS101', name: 'Intro to Programming', count: 12 },
            { code: 'MA201', name: 'Calculus II', count: 8 },
            { code: 'PH301', name: 'Quantum Physics', count: 10 },
            { code: 'EE401', name: 'Circuit Design', count: 6 }
        ],
        weeklyTeachers: [
            { id: 'CS-101', name: 'Dr. Smith', count: 8 },
            { id: 'MA-201', name: 'Prof. Johnson', count: 6 },
            { id: 'PH-301', name: 'Dr. Williams', count: 7 },
            { id: 'EE-401', name: 'Dr. Brown', count: 5 }
        ],
        rooms: {
            available: [
                { id: 'BLD1-101', type: 'Lecture Hall', capacity: 50, dept: 'CS' },
                { id: 'BLD2-205', type: 'Lab', capacity: 30, dept: 'EE' },
                { id: 'BLD1-301', type: 'Seminar', capacity: 20, dept: 'MA' }
            ],
            total: [
                { id: 'BLD1-101', type: 'Lecture Hall', capacity: 50, dept: 'CS' },
                { id: 'BLD1-102', type: 'Lecture Hall', capacity: 50, dept: 'CS' },
                { id: 'BLD2-205', type: 'Lab', capacity: 30, dept: 'EE' },
                { id: 'BLD3-301', type: 'Seminar', capacity: 20, dept: 'MA' },
                { id: 'BLD2-305', type: 'Lab', capacity: 30, dept: 'PH' }
            ]
        }
    };

    function renderCollegeStats(containerId, items, isRoom = false) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        
        items.forEach(item => {
            const statItem = document.createElement('div');
            statItem.className = 'stat-item';
            
            const idSpan = document.createElement('span');
            idSpan.className = 'stat-name';
            idSpan.textContent = isRoom ? item.id : item.code || item.id;
            
            const detailSpan = document.createElement('span');
            detailSpan.className = 'stat-detail';
            detailSpan.textContent = isRoom ? `${item.type} (${item.capacity})` : item.name;
            
            const countSpan = document.createElement('span');
            countSpan.className = 'stat-value';
            countSpan.textContent = item.count || 'Available';
            
            statItem.appendChild(idSpan);
            statItem.appendChild(detailSpan);
            statItem.appendChild(countSpan);
            container.appendChild(statItem);
        });
    }

    // General statistics
    const exampleData = {
        weeklySubjects: [
            { code: 'MATH101', count: 12 },
            { code: 'PHYS201', count: 8 },
            { code: 'CHEM301', count: 10 },
            { code: 'BIO401', count: 6 }
        ],
        monthlySubjects: [
            { code: 'MATH101', count: 48 },
            { code: 'PHYS201', count: 32 },
            { code: 'CHEM301', count: 40 },
            { code: 'BIO401', count: 24 }
        ],
        weeklyTeachers: [
            { id: 'T001', count: 8 },
            { id: 'T002', count: 6 },
            { id: 'T003', count: 7 },
            { id: 'T004', count: 5 }
        ],
        monthlyTeachers: [
            { id: 'T001', count: 32 },
            { id: 'T002', count: 24 },
            { id: 'T003', count: 28 },
            { id: 'T004', count: 20 }
        ],
        availableRooms: [
            { number: '101', status: 'Available' },
            { number: '102', status: 'Available' },
            { number: '205', status: 'Occupied' },
            { number: '301', status: 'Available' },
            { number: '305', status: 'Occupied' }
        ],
        totalRooms: [
            { number: '101', type: 'Lecture Hall' },
            { number: '102', type: 'Lecture Hall' },
            { number: '205', type: 'Lab' },
            { number: '301', type: 'Seminar' },
            { number: '305', type: 'Lab' }
        ]
    };

    function renderStats(containerId, items, prefix = '') {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        
        items.forEach(item => {
            const statItem = document.createElement('div');
            statItem.className = 'stat-item';
            
            const nameSpan = document.createElement('span');
            nameSpan.className = 'stat-name';
            nameSpan.textContent = prefix + (item.code || item.id || item.number);
            
            const valueSpan = document.createElement('span');
            valueSpan.className = 'stat-value';
            valueSpan.textContent = item.count || item.status || item.type;
            
            statItem.appendChild(nameSpan);
            statItem.appendChild(valueSpan);
            container.appendChild(statItem);
        });
    }

    renderCollegeStats('weekly-subjects', collegeData.weeklySubjects);
    renderCollegeStats('weekly-teachers', collegeData.weeklyTeachers);
    renderStats('total-rooms', exampleData.totalRooms);
});

// ===== PROFILE DROPDOWN FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', function() {
    const profileLogo = document.getElementById('profileLogo');
    const profileDropdown = document.getElementById('profileDropdown');
    const profileButton = document.getElementById('profileButton');
    const uploadImageBtn = document.getElementById('uploadImageBtn');
    const uploadImageInput = document.getElementById('uploadImageInput');

    // Toggle profile dropdown visibility
    profileLogo.addEventListener('click', function() {
        profileDropdown.classList.toggle('show');
        if (profileDropdown.classList.contains('show')) {
            profileDropdown.style.display = 'block'; // Show the dropdown
        } else {
            profileDropdown.style.display = 'none'; // Hide the dropdown
        }
    });

    // Handle image upload
    uploadImageBtn.addEventListener('click', function() {
        uploadImageInput.click();
    });

    uploadImageInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const profileImage = document.getElementById('profileImage');
                profileImage.src = e.target.result; 
                profileAvatar.src = e.target.result;
                // Update the profile image
            };
            reader.readAsDataURL(file);
        }
    });

    // Additional: Toggle profile dropdown on button click inside .profile-logo-container
    if (profileButton && profileDropdown) {
        profileButton.addEventListener('click', function() {
            if (profileDropdown.style.display === 'block') {
                profileDropdown.style.display = 'none';
            } else {
                profileDropdown.style.display = 'block';
            }
        });
    }
});

// ===== MENU ICON FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', function() {
    const menuIcon = document.getElementById('menuIcon');
    const navLinks = document.querySelector('.nav-links');

    menuIcon.addEventListener('click', function() {
        if (window.innerWidth <= 768) { // Check if the screen width is less than or equal to 768px
            menuIcon.style.visibility = 'visible';
            navLinks.classList.toggle('show');
            if (navLinks.classList.contains('show')) {
                navLinks.style.display = 'none'; // Show the nav links
            } else {
                navLinks.style.display = 'flex'; // Hide the nav links
            }
        }
    });

    // Hide nav links on larger screens
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navLinks.style.display = 'none'; // Show nav links
        } else {
            navLinks.style.display = 'flex'; // Hide nav links
        }
    });
});

// ===== TIMETABLE FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', function() {
    const viewToggle = document.getElementById('view-toggle');
    const container = document.querySelector('.container');
    const contentEl = document.getElementById('timetable-content');
    
    // Load timetable data from localStorage or use default (7 days)
    const timetableData = JSON.parse(localStorage.getItem('timetableData')) || {
        "Monday": [],
        "Tuesday": [],
        "Wednesday": [],
        "Thursday": [],
        "Friday": [],
        "Saturday": [],
        "Sunday": []
    };

    function setupViewToggle() {
        viewToggle.textContent = 'Show Weekly Class';
        
        // Remove click handler since we don't need toggling
        viewToggle.onclick = null;
    }

    function renderTimetable(selectedDay = null) {
        let html = '';
        
        // Show Monday-Friday in weekly view, or just selected day
        const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
        const daysToRender = selectedDay ? 
            { [selectedDay]: timetableData[selectedDay] || [] } : 
            Object.fromEntries(
                weekdays.map(day => [day, timetableData[day] || []])
            );

        for (const [day, classes] of Object.entries(daysToRender)) {
            html += `
            <div class="day-section">
                <div class="day-header">
                    <h2>${day}</h2>
                </div>`;
            
            if (classes.length === 0) {
                // Empty container for the weekday
                html += `<div class="empty-day"></div>`;
            } else {
                classes.forEach((cls, i) => {
                    const classDiv = cls.status === 'active' ? 'current-class' : 'cancelled-class';
                    html += `
                    <div class="period">
                        <h3>Period ${i+1} (${cls.time})</h3>
                        <div class="${classDiv}">
                            <div class="class-info">
                                <div class="info-item"><strong>Code:</strong> <span class="subject-code">${cls.code}</span></div>
                                <div class="info-item"><strong>Room:</strong> <span class="room-number">${cls.room}</span></div>
                                ${cls.status === 'active' ? `<div class="info-item"><strong>Time:</strong> <span class="time-display">${cls.time}</span></div>` : ''}
                            </div>
                        </div>
                    </div>`;
                });
            }

            html += `</div>`;
        }

        if (html === '') {
            html = '<p>No timetable data available. Please generate a timetable first.</p>';
        }
        contentEl.innerHTML = html;
    }

    // Add day selection functionality
    const daySelect = document.getElementById('day-select');
    if (daySelect) {
        daySelect.addEventListener('change', function() {
            const selectedDay = this.value;
            renderTimetable(selectedDay);
        });
    }

    function init() {
        renderTimetable();
        setupViewToggle();
    }

    init();
});
