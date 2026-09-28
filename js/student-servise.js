const COOKIE_NAME = 'students_dormitory';


function getStudents() {
  const data = getCookie(COOKIE_NAME);
  if (!data) {
    return [];
  }
  try {
    return JSON.parse(data);
  } catch (error) {
    console.warn('Cookie data was corrupted', error);
    return [];
  }
}

function saveStudents(students) {
  const data = JSON.stringify(students);
  setCookie(COOKIE_NAME, data);
}

function addStudent(student) {
  if (isIsuIdExists(student.isuId)) {
    return { 
      success: false, 
      message: `Студент с ИСУ id "${student.isuId}" уже существует` 
    };
  }

  const students = getStudents();
  students.push(student);
  saveStudents(students);

  return { success: true, message: 'Студент добавлен' };
}

function updateStudent(isuId, updatedData) {
  const students = getStudents();
  const index = students.findIndex(s => s.isuId === isuId);

  if (index === -1) {
    return { 
      success: false, 
      message: `Студент с ИСУ id "${isuId}" не найден` 
    };
  }

  if (updatedData.isuId !== isuId && isIsuIdExists(updatedData.isuId)) {
    return { 
      success: false, 
      message: `ИСУ id "${updatedData.isuId}" уже используется другим студентом` 
    };
  }

  students[index] = updatedData;
  saveStudents(students);

  return { success: true, message: 'Данные студента обновлены' };
}

function deleteStudent(isuId) {
  const students = getStudents();
  const filtered = students.filter(s => s.isuId !== isuId);

  if (filtered.length === students.length) {
    return { 
      success: false, 
      message: `Студент с ИСУ id "${isuId}" не найден` 
    };
  }

  saveStudents(filtered);
  return { success: true, message: 'Студент удалён' };
}

function findStudentByIsuId(isuId) {
  const students = getStudents();
  return students.find(s => s.isuId === isuId) || null;
}


function isIsuIdExists(isuId) {
  const students = getStudents();
  return students.some(s => s.isuId === isuId);
}

function createStudentFromForm(form) {
  return {
    fullName: form.fullName.value.trim(),
    group: form.group.value.trim(),
    isuId: form.isuId.value.trim(),
    dormitory: parseInt(form.dormitory.value, 10),
    room: parseInt(form.room.value),
    settlementDate: form.settlementDate.value,
    isForeigner: form.isForeigner.checked,
    notes: form.notes.value.trim()
  };
}
