const savedDayData = {}; // Store saved data for each day

function toggleDayConfig(checkbox) {
    const day = checkbox.value.toLowerCase();
    const configDiv = document.getElementById(`${day}-config`);
    configDiv.style.display = checkbox.checked ? "block" : "none";
}

function addPeriod(day) {
    const container = document.getElementById(`${day}-periods`);
    // Use savedDayData length for index to ensure increment after save
    const index = savedDayData[day] ? savedDayData[day].length : 0;

    // Check if there is already an unsaved period input form for this day
    const existingPeriodDiv = document.getElementById(`${day}-period-${index}`);
    if (existingPeriodDiv) {
        alert("Please save the current period before adding a new one.");
        return;
    }

    const periodDiv = document.createElement("div");
    periodDiv.className = "period-input";
    periodDiv.id = `${day}-period-${index}`;

    periodDiv.innerHTML = `
        <h4>Period ${index + 1}</h4>
        <label>Start Time: 
        <select class="time select">
            <option value="">Select Time</option>
            ${(() => {
                const options = [];
                const start = new Date();
                start.setHours(9, 0, 0, 0); // 09:00
            
                const end = new Date();
                end.setHours(17, 30, 0, 0); // 17:30
            
                while (start <= end) {
                    const hours = String(start.getHours()).padStart(2, "0");
                    const minutes = String(start.getMinutes()).padStart(2, "0");
                    options.push(`<option value="${hours}:${minutes}">${hours}:${minutes}</option>`);
                    start.setMinutes(start.getMinutes() + 50); // 45 min + 5 min break
                }
            
                return options.join("");
            })()}    
        </select>
        </label>
        <label>Subject: <input type="text" class="subject-name" placeholder="e.g. Math" required></label>
        <label>Teacher: <input type="text" class="teacher-name" placeholder="e.g. Mr. Sharma" required></label>
        <label>Subject Code: <input type="text" class="subject-code" placeholder="e.g. MATH101" required></label>
        <label>Room ID: <input type="text" class="room-id" placeholder="e.g. R101" required></label>
        <button onclick="savePeriod('${day}', ${index})">Save Period</button>
        <hr>
    `;

    container.appendChild(periodDiv);
}

function savePeriod(day, index) {
    const periodDiv = document.getElementById(`${day}-period-${index}`);
    if (!periodDiv) {
        alert("Period input not found.");
        return;
    }

    const startTime = periodDiv.querySelector(".start-time").value;
    const subject = periodDiv.querySelector(".subject-name").value.trim();
    const teacher = periodDiv.querySelector(".teacher-name").value.trim();
    const code = periodDiv.querySelector(".subject-code").value.trim();
    const roomId = periodDiv.querySelector(".room-id").value.trim();

    if (!startTime || !subject || !teacher || !code || !roomId) {
        alert("Please fill all fields before saving.");
        return;
    }

    const periodDurationInput = document.getElementById("periodDuration");
    let periodDuration = parseInt(periodDurationInput.value);
    if (isNaN(periodDuration) || periodDuration < 30 || periodDuration > 120) {
        periodDuration = 45; // default fallback
    }
    const endTime = calculateEndTime(startTime, periodDuration);

    if (!savedDayData[day]) {
        savedDayData[day] = [];
    }

    if (savedDayData[day][index]) {
        savedDayData[day][index] = { startTime, endTime, subject, teacher, code, roomId };
    } else {
        savedDayData[day].push({ startTime, endTime, subject, teacher, code, roomId });
    }

    periodDiv.remove();

    updateSavedPeriodsDisplay();

    alert(`Period for ${capitalize(day)} saved successfully.`);
}

function calculateEndTime(startTimeStr, periodDuration) {
    const [startHour, startMinute] = startTimeStr.split(":").map(Number);
    let endHour = startHour;
    let endMinute = startMinute + periodDuration;

    if (endMinute >= 60) {
        endHour += Math.floor(endMinute / 60);
        endMinute = endMinute % 60;
    }
    if (endHour >= 24) {
        endHour = endHour % 24;
    }

    return `${String(endHour).padStart(2, "0")}:${String(endMinute).padStart(2, "0")}`;
}

function updateSavedPeriodsDisplay() {
    const displayContainer = document.getElementById("saved-periods-content");
    if (!displayContainer) return;
    displayContainer.innerHTML = "";

    const table = document.createElement("table");
    table.style.width = "100%";
    table.border = "1";

    const headerRow = document.createElement("tr");

    const days = ["monday", "tuesday", "wednesday", "thursday", "friday"];
    days.forEach(day => {
        const th = document.createElement("th");
        th.textContent = capitalize(day);
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    let maxPeriods = 8;

    for (let i = 0; i < maxPeriods; i++) {
        const row = document.createElement("tr");

        days.forEach(day => {
            const cell = document.createElement("td");
            if (savedDayData[day] && savedDayData[day][i]) {
                const period = savedDayData[day][i];
                cell.innerHTML = `
                    <strong>Subject:</strong> ${period.subject}<br>
                    <strong>Subject Code:</strong> ${period.code}<br>
                    Time: ${period.startTime} - ${period.endTime}<br>
                    Teacher: ${period.teacher}<br>
                    Room ID: ${period.roomId}<br>
                    <button onclick="editPeriod('${day}', ${i})">Edit</button>
                    <button onclick="deletePeriod('${day}', ${i})" style="color:red">Delete</button>
                `;
            } else {
                cell.textContent = "-";
            }
            row.appendChild(cell);
        });

        table.appendChild(row);
    }

    displayContainer.appendChild(table);
}

function editPeriod(day, index) {
    const data = savedDayData[day][index];
    if (!data) {
        alert("Period data not found.");
        return;
    }
    const container = document.getElementById(`${day}-periods`);
    if (!container) return;

    const periodDiv = document.createElement("div");
    periodDiv.className = "period-input";
    periodDiv.id = `${day}-period-${index}`;

    periodDiv.innerHTML = `
        <h4>Edit Period ${index + 1}</h4>
        <label>Start Time: <input type="time" class="start-time" value="${data.startTime}" required></label>
        <label>Subject: <input type="text" class="subject-name" value="${data.subject}" required></label>
        <label>Teacher: <input type="text" class="teacher-name" value="${data.teacher}" required></label>
        <label>Subject Code: <input type="text" class="subject-code" value="${data.code}" required></label>
        <label>Room ID: <input type="text" class="room-id" value="${data.roomId}" required></label>
        <button onclick="savePeriod('${day}', ${index})">Save Changes</button>
        <hr>
    `;

    container.appendChild(periodDiv);
}

function deletePeriod(day, index) {
    if (!savedDayData[day] || !savedDayData[day][index]) {
        alert("Period data not found.");
        return;
    }
    if (confirm("Are you sure you want to delete this period?")) {
        savedDayData[day].splice(index, 1);
        updateSavedPeriodsDisplay();
    }
}

function generateTimetable() {
    if (Object.keys(savedDayData).length === 0) {
        alert("No period data to generate timetable. Please save periods first.");
        return;
    }

    fetch('http://localhost:5000/api/timetable/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(savedDayData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
            // Fetch updated timetable from backend
            fetch('http://localhost:5000/api/timetable')
            .then(res => res.json())
            .then(timetableData => {
                localStorage.setItem('generatedTimetableData', JSON.stringify(timetableData));
                renderTimetablePreview();
            })
            .catch(err => {
                alert("Error fetching updated timetable: " + err);
            });
        } else if (data.error) {
            alert("Error saving timetable: " + data.error);
        }
    })
    .catch(error => {
        alert("Error saving timetable: " + error);
    });
}

function renderTimetablePreview() {
    const timetablePreview = document.getElementById("timetable-preview");
    if (!timetablePreview) return;

    const timetableData = JSON.parse(localStorage.getItem("generatedTimetableData") || "{}");
    if (Object.keys(timetableData).length === 0) {
        timetablePreview.innerHTML = "<p>No timetable data found. Please generate the timetable first.</p>";
        return;
    }

    let html = "<h2>Final Timetable Preview</h2>";

    for (const day of ["monday", "tuesday", "wednesday", "thursday", "friday"]) {
        const periods = timetableData[day] || [];
        if (periods.length > 0) {
            html += `<h3>${capitalize(day)}</h3><ul>`;
            periods.forEach((period, index) => {
                html += `
                    <li>
                        <strong>Period ${index + 1}</strong>: ${period.subject} 
                        (Time: ${period.startTime} - ${period.endTime}, Teacher: ${period.teacher}, Code: ${period.code}, Room ID: ${period.roomId})
                    </li>
                `;
            });
            html += "</ul>";
        }
    }

    timetablePreview.innerHTML = html;
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
