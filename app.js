const API_URL = "https://0kvpr64syd.execute-api.ap-southeast-2.amazonaws.com/prod";

const form = document.getElementById("studentForm");
const studentTable = document.getElementById("studentTable");

// Load student records
async function loadStudents() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to load students");
        }

        const students = await response.json();

        studentTable.innerHTML = "";

        students.forEach(student => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.email}</td>
                <td>${student.department}</td>
                <td>${student.year}</td>
                <td>
                    <button onclick="editStudent('${student.id}')">
                        Edit
                    </button>

                    <button onclick="deleteStudent('${student.id}')">
                        Delete
                    </button>
                </td>
            `;

            studentTable.appendChild(row);
        });

    } catch (error) {
        console.error("Error loading students:", error);
    }
}


// Add new student
form.addEventListener("submit", async function(event) {

    event.preventDefault();

    const student = {
        id: Date.now().toString(),
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        department: document.getElementById("department").value,
        year: document.getElementById("year").value
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(student)
        });

        if (!response.ok) {
            throw new Error("Failed to add student");
        }

        alert("Student added successfully!");

        form.reset();

        loadStudents();

    } catch (error) {

        alert("Unable to add student.");

        console.error(error);
    }
});


// Edit all student details
async function editStudent(id) {

    try {

        const response = await fetch(API_URL);

        const students = await response.json();

        const student = students.find(s => s.id === id);

        if (!student) {
            alert("Student not found!");
            return;
        }

        // Get updated details
        const name = prompt("Enter Student Name:", student.name);

        if (name === null || !name.trim()) return;

        const email = prompt("Enter Email Address:", student.email);

        if (email === null || !email.trim()) return;

        const department = prompt("Enter Department:", student.department);

        if (department === null || !department.trim()) return;

        const year = prompt("Enter Year:", student.year);

        if (year === null || !year.trim()) return;

        // Updated student information
        const updatedStudent = {

            id: student.id,

            name: name.trim(),

            email: email.trim(),

            department: department.trim(),

            year: year.trim()

        };

        const updateResponse = await fetch(API_URL, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(updatedStudent)

        });

        if (!updateResponse.ok) {
            throw new Error("Update failed");
        }

        alert("Student updated successfully!");

        loadStudents();

    } catch (error) {

        alert("Unable to update student.");

        console.error(error);
    }
}


// Delete student
async function deleteStudent(id) {

    if (!confirm("Are you sure you want to delete this student?")) {
        return;
    }

    try {

        const response = await fetch(API_URL, {

            method: "DELETE",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                id: id
            })

        });

        if (!response.ok) {
            throw new Error("Delete failed");
        }

        alert("Student deleted successfully!");

        loadStudents();

    } catch (error) {

        alert("Unable to delete student.");

        console.error(error);
    }
}


// Load records when website opens
loadStudents();