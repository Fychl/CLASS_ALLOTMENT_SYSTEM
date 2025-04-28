document.getElementById("reportForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("teacherName").value;
    const email = document.getElementById("teacherEmail").value;
    const type = document.getElementById("issueType").value;
    const description = document.getElementById("issueDescription").value;

    if (!name || !email || !type || !description) {
        alert("Please fill out all fields.");
        return;
    }

    // For now, just show a confirmation
    console.log("Report submitted:", { name, email, type, description });

    // Simulate report submission
    document.getElementById("confirmationMsg").style.display = "block";
    document.getElementById("reportForm").reset();

    setTimeout(() => {
        document.getElementById("confirmationMsg").style.display = "none";
    }, 4000);
});
