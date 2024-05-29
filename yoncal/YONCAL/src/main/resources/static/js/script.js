let courseDatabase = [];

document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/subjects')
        .then(response => response.json())
        .then(data => {
            coursesDatabase = data;
        })
        .catch(error => console.error('Error fetching courses:', error));
});

function addCourse(button) {
    const courseHtml = `
        <div class="course">
            <input type="text" oninput="searchCourse(this)" placeholder="새 과목">
            <div class="course-dropdown"></div>
            <i class="fas fa-trash-alt" onclick="deleteCourse(this)"></i>
        </div>`;
    button.insertAdjacentHTML('beforebegin', courseHtml);
    adjustScroll(button.closest('.semester'));
}

function addSemester() {
    const semesterHtml = `
        <div class="semester">
            <div class="semester-header">
                <input type="text" value="새 학기" readonly class="semester-title">
                <div class="actions">
                    <i class="fas fa-pencil-alt" onclick="editSemesterTitle(this)"></i>
                    <span class="delete-semester" onclick="deleteSemester(this)">학기 지우기</span>
                </div>
            </div>
            <div class="add-course" onclick="addCourse(this)">
                <i class="fas fa-plus"></i>
            </div>
        </div>`;
    const leftPanel = document.getElementById('left-panel');
    const addSemesterButton = document.querySelector('.add-semester');
    addSemesterButton.insertAdjacentHTML('beforebegin', semesterHtml);
    adjustScroll(leftPanel);
}

function deleteSemester(button) {
    const semester = button.closest('.semester');
    semester.remove();
    adjustAddSemesterButtonPosition();
    calculateCredits();
}

function deleteCourse(button) {
    const course = button.closest('.course');
    course.remove();
    calculateCredits();
}

function editSemesterTitle(button) {
    const titleInput = button.closest('.semester-header').querySelector('.semester-title');
    titleInput.readOnly = false;
    titleInput.focus();
    titleInput.addEventListener('blur', function() {
        titleInput.readOnly = true;
    });
}

function adjustAddSemesterButtonPosition() {
    const leftPanel = document.getElementById('left-panel');
    const addSemesterButton = document.querySelector('.add-semester');
    leftPanel.appendChild(addSemesterButton);
}

function adjustScroll(container) {
    container.scrollLeft = container.scrollWidth;
}

function searchCourse(input) {
    const query = input.value.toLowerCase();
    const dropdown = input.nextElementSibling;
    dropdown.innerHTML = '';

    if (query.length > 0) {
        const filteredCourses = coursesDatabase.filter(course =>
            course.name.toLowerCase().includes(query)
        );

        filteredCourses.forEach(course => {
            const courseElement = document.createElement('div');
            courseElement.textContent = `${course.name} (${course.credits} 학점, ${course.category})`;
            courseElement.onclick = () => {
                selectCourse(input, course)
                input.value = course.name;
                dropdown.innerHTML = '';
            };
            dropdown.appendChild(courseElement);
        });
    }
}
function selectCourse(input, course) {
    try {
        input.value = course.name;
        const dropdown = input.nextElementSibling;
        dropdown.innerHTML = '';
        input.setAttribute('data-credits', course.credits);
        input.setAttribute('data-category', course.category);
        calculateCredits();
        updateRequiredCredits();
    } catch (error) {
        console.error('Error selecting course:', error);
    }
}

function calculateCredits() {
    const creditCategories = {
        "교양기초": 0,
        "교양": 0,
        "필수영역": 0,
        "전필영역": 0,
        "1전공": 0,
        "2전공": 0
    };

    document.querySelectorAll('.course input').forEach(input => {
        const credits = parseInt(input.getAttribute('data-credits')) || 0;
        const category = input.getAttribute('data-category');
        if (category) {
            creditCategories[category] += credits;
        }
    });

    document.getElementById('current-basic-credits').textContent = `교양기초: ${creditCategories["교양기초"]}학점`;
    document.getElementById('current-liberal-credits').textContent = `교양: ${creditCategories["교양"]}학점`;
    document.getElementById('current-essential-credits').textContent = `필수영역: ${creditCategories["필수영역"]}학점`;
    document.getElementById('current-major-credits').textContent = `전필영역: ${creditCategories["전필영역"]}학점`;
    document.getElementById('current-major1-credits').textContent = `1전공: ${creditCategories["1전공"]}학점`;
    document.getElementById('current-major2-credits').textContent = `2전공: ${creditCategories["2전공"]}학점`;
}

function updateRequiredCredits(select) {

    const requiredCredits = {
        "교양기초": 11,
        "1전공": 42,
        "2전공": 42,
        "교양": 21,
        "필수영역": 12,
        "전필영역": 18
        // Add more majors and their required credits here
    };

    document.querySelectorAll('.course input').forEach(input => {
        const credits = parseInt(input.getAttribute('data-credits')) || 0;
        const category = input.getAttribute('data-category');
        if (category) {
            requiredCredits[category] -= credits;
        }
    });

    document.getElementById('required-basic-credits').textContent = `교양기초: ${requiredCredits["교양기초"]}학점`;
    document.getElementById('required-liberal-credits').textContent = `교양: ${requiredCredits["교양"]}학점`;
    document.getElementById('required-essential-credits').textContent = `필수영역: ${requiredCredits["필수영역"]}학점`;
    document.getElementById('required-major-credits').textContent = `전필영역: ${requiredCredits["전필영역"]}학점`;
    document.getElementById('required-major1-credits').textContent = `1전공: ${requiredCredits["1전공"]}학점`;
    document.getElementById('required-major2-credits').textContent = `2전공: ${requiredCredits["2전공"]}학점`;
}

function handleLoginLogout() {
    const emailSpan = document.querySelector('.logged-in-email');
    const loginLogoutBtn = document.querySelector('.login-logout-btn');
    if (loginLogoutBtn.textContent === 'Login') {
        window.location.href = '/login';
    } else {
        emailSpan.textContent = 'Guest';
        loginLogoutBtn.textContent = 'Login';
    }
}

function downloadCourses() {
    const courses = [];
    document.querySelectorAll('.semester').forEach(semester => {
        const semesterTitle = semester.querySelector('.semester-title').value;
        const semesterCourses = [];
        semester.querySelectorAll('.course input').forEach(course => {
            const courseName = course.value;
            const credits = course.getAttribute('data-credits');
            const category = course.getAttribute('data-category');
            semesterCourses.push({ courseName, credits, category });
        });
        courses.push({ semesterTitle, semesterCourses });
    });

    const selectedMajor = document.querySelector('.dropdown').value;
    const data = { selectedMajor, courses };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "courses.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}
function uploadCourses() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = function(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            const data = JSON.parse(content);
            loadCourses(data);
        };
        reader.readAsText(file);
    };
    input.click();
}

function loadCourses(data) {
    const { selectedMajor, courses } = data;
    const leftPanel = document.getElementById('left-panel');
    const addSemesterButton = document.querySelector('.add-semester');

    // Set the selected major
    document.querySelector('.dropdown').value = selectedMajor;
    updateRequiredCredits(document.querySelector('.dropdown'));

    // Clear existing semesters except the add-semester button
    leftPanel.innerHTML = '';
    leftPanel.appendChild(addSemesterButton);

    // Iterate through the uploaded courses to create the necessary HTML elements
    courses.forEach(course => {
        const semesterHtml = `
            <div class="semester">
                <div class="semester-header">
                    <input type="text" value="${course.semesterTitle}" readonly class="semester-title">
                    <div class="actions">
                        <i class="fas fa-pencil-alt" onclick="editSemesterTitle(this)"></i>
                        <span class="delete-semester" onclick="deleteSemester(this)">학기 지우기</span>
                    </div>
                </div>
                ${course.semesterCourses.map(c => `
                    <div class="course">
                        <input type="text" value="${c.courseName}" data-credits="${c.credits}" data-category="${c.category}">
                        <i class="fas fa-trash-alt" onclick="deleteCourse(this)"></i>
                    </div>
                `).join('')}
                <div class="add-course" onclick="addCourse(this)">
                    <i class="fas fa-plus"></i>
                </div>
            </div>`;
        addSemesterButton.insertAdjacentHTML('beforebegin', semesterHtml);
    });

    calculateCredits();
}