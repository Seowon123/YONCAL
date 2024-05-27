const coursesDatabase = [
    { name: "교양영어", credits: 3, category: "교양기초" },
    { name: "전공강의", credits: 3, category: "전필영역" },
    { name: "역사", credits: 2, category: "교양" },
    { name: "수학", credits: 4, category: "필수영역" },
    { name: "물리학", credits: 3, category: "필수영역" },
    { name: "화학", credits: 3, category: "필수영역" },
    { name: "생물학", credits: 3, category: "필수영역" },
    { name: "컴퓨터 과학", credits: 3, category: "전필영역" },
    { name: "경제학", credits: 3, category: "교양" },
    { name: "경영학", credits: 3, category: "1전공" }
];

const requiredCredits = {
    1: {
        "1전공": 42,
        "2전공": 42,
        "교양": 21,
        "필수영역": 12,
        "전필영역": 18
    },
    // Add more majors and their required credits here
};

document.addEventListener('click', function(event) {
    if (event.target.matches('.add-course i')) {
        addCourse(event.target.closest('.add-course'));
    } else if (event.target.matches('.delete-semester')) {
        deleteSemester(event.target);
    } else if (event.target.matches('.fas.fa-pencil-alt')) {
        editSemesterTitle(event.target);
    } else if (event.target.matches('.fas.fa-trash-alt')) {
        deleteCourse(event.target);
    }
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
    const dropdown = input.nextElementSibling;
    const query = input.value.toLowerCase();
    dropdown.innerHTML = '';
    if (query) {
        const results = coursesDatabase.filter(course => course.name.toLowerCase().includes(query));
        results.forEach(result => {
            const option = document.createElement('div');
            option.textContent = result.name;
            option.classList.add('course-option');
            option.onclick = () => selectCourse(input, result);
            dropdown.appendChild(option);
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
    const majorId = select.value;
    if (requiredCredits[majorId]) {
        document.getElementById('required-major1-credits').textContent = `1전공: ${requiredCredits[majorId]["1전공"]}학점`;
        document.getElementById('required-major2-credits').textContent = `2전공: ${requiredCredits[majorId]["2전공"]}학점`;
        document.getElementById('required-liberal-credits').textContent = `교양: ${requiredCredits[majorId]["교양"]}학점`;
        document.getElementById('required-essential-credits').textContent = `필수영역: ${requiredCredits[majorId]["필수영역"]}학점`;
        document.getElementById('required-major-credits').textContent = `전필영역: ${requiredCredits[majorId]["전필영역"]}학점`;
    } else {
        // Reset if no major is selected or if the major has no defined requirements
        document.getElementById('required-major1-credits').textContent = "1전공: 0학점";
        document.getElementById('required-major2-credits').textContent = "2전공: 0학점";
        document.getElementById('required-liberal-credits').textContent = "교양: 0학점";
        document.getElementById('required-essential-credits').textContent = "필수영역: 0학점";
        document.getElementById('required-major-credits').textContent = "전필영역: 0학점";
    }
}
