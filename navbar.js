// ===== PROFILE DROPDOWN FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', function() {
    const profileLogo = document.getElementById('profileLogo');
    const profileDropdown = document.getElementById('profileDropdown');
    const profileButton = document.getElementById('profileButton');
    const uploadImageBtn = document.getElementById('uploadImageBtn');
    const uploadImageInput = document.getElementById('uploadImageInput');

    // Function to fetch profile data from backend and update dropdown
    async function fetchAndUpdateProfile() {
        console.log('fetchAndUpdateProfile called');
        // Check localStorage for teacherId first
        const teacherId = localStorage.getItem('teacherId') || window.teacherId;
        console.log('Using teacherId:', teacherId);
        if (!teacherId) {
            console.error('teacherId is not defined');
            return;
        }
        try {
            const response = await fetch(`/profile/teacher/${teacherId}`);
            console.log('Fetch response status:', response.status);
            if (!response.ok) {
                console.error('Failed to fetch profile data');
                return;
            }
            const profile = await response.json();
            console.log('Profile data received:', profile);
            // Update DOM elements with profile data
            document.getElementById('profileName').textContent = profile.fullName || '';
            document.getElementById('profileNumber').textContent = profile.teacherId || '';
            document.getElementById('profileEmail').textContent = profile.email || '';
            document.getElementById('profileDepartment').textContent = profile.department || '';
            document.getElementById('profileSubject').textContent = (profile.courses && profile.courses.join(', ')) || '';
        } catch (error) {
            console.error('Error fetching profile data:', error);
        }
    }
    

    // Toggle profile dropdown visibility and fetch profile data when shown
    function toggleProfileDropdown() {
        profileDropdown.classList.toggle('show');
        if (profileDropdown.classList.contains('show')) {
            profileDropdown.style.display = 'block'; // Show the dropdown
            fetchAndUpdateProfile();
        } else {
            profileDropdown.style.display = 'none'; // Hide the dropdown
        }
    }

    profileLogo.addEventListener('click', toggleProfileDropdown);

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
                const profileAvatar = document.getElementById('profileAvatar');
                profileImage.src = e.target.result; // Update the profile image
                profileAvatar.src = e.target.result; // Update the profile avatar
            };
            reader.readAsDataURL(file);
        }
    });

    // Additional: Toggle profile dropdown on button click inside .profile-logo-container
    if (profileButton && profileDropdown) {
        profileButton.addEventListener('click', toggleProfileDropdown);
    }
});
