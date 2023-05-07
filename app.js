document.addEventListener('DOMContentLoaded', function (event) {
  const todoForm = document.querySelector('.todo-form');
  const todoTasks = document.querySelector('.todo-tbody');
  let arrayTasks = [];
  // Вывод всех тасков из Local Storage на экран
  if (localStorage.getItem('task')) {
    arrayTasks = JSON.parse(localStorage.getItem('task'));
    arrayTasks.forEach((task) => {
      renderTask(task);
    });
  }

  // Вывод месяца словами
  function checkMonth(month) {
    const arrMonth = [
      'января',
      'февраля',
      'марта',
      'апреля',
      'мая',
      'июня',
      'июля',
      'августа',
      'сентября',
      'октября',
      'ноября',
      'декабря',
    ];
    return arrMonth[month];
  }

  // Добавление таска
  function addTask(e) {
    e.preventDefault();
    const input = document.querySelector('.todo-form input');
    if (input.value.length > 3 && input.value.trim() !== '') {
      const formData = {
        id: new Date().getTime(),
        name: input.value.trim(),
        date: {
          hours: new Date().getHours(),
          minutes: new Date().getMinutes(),
          seconds: new Date().getSeconds(),
          year: new Date().getFullYear(),
          month: new Date().getMonth(),
          day: new Date().getDate(),
        },
      };
      arrayTasks.push(formData);
      renderTask(formData);
      saveLocalStorage();
      input.value = '';
    } else {
      alert('Название должно быть больше 3 символов!');
    }
  }

  // Отображение всех тасков
  function renderTask(task) {
    const taskHTML = `<tr id="${task.id}" class="task-item">
              <td>
                <div class="task-meta">
                  <div class="task-date">
									<span class="task-time">
                    ${task.date.hours}:${task.date.minutes}:${task.date.seconds}
										</span>
                    <span class="task-time2">
										${task.date.day} ${checkMonth(task.date.month)} ${task.date.year}
									</span>
                  </div>
                </div>
              </td>
              <td><div class="task-name"><input type="text" readonly value="${
                task.name
              }"><div class="accept" data-action="rename"></div></div></td>
              <td>
                <div class="task-btns">
                  <div class="task-btn task-remove" data-action="remove">Удалить</div>
                  <div class="task-btn task-change" data-action="change">Изменить</div>
                </div>
              </td>
            </tr>`;
    todoTasks.insertAdjacentHTML('afterbegin', taskHTML);
  }

  // Удаление таска из DOM и Local Storage
  function removeTask(e) {
    if (e.target.dataset.action !== 'remove') return;

    const item = e.target.closest('.task-item');
    const id = Number(item.id);

    const findedIdTask = arrayTasks.findIndex((item) => item.id == id);
    arrayTasks.splice(findedIdTask, 1);
    item.remove();
    saveLocalStorage();
  }

  function changeTask(e) {
    if (e.target.dataset.action == 'change') {
      const item = e.target.closest('.task-item');

      const input = item.querySelector('.task-name input');
      inputValue = input.value;
      item.querySelector('.accept').classList.add('show');
      input.focus();
      input.removeAttribute('readonly');
      input.classList.add('active');
    }

    if (e.target.dataset.action == 'rename') {
      const item = e.target.closest('.task-item');
      const id = Number(item.id);

      const input = item.querySelector('.task-name input');
      let taskTime = item.querySelector('.task-time');
      let taskTime2 = item.querySelector('.task-time2');
      inputValue = input.value;
      taskTime.innerText = `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`;
      taskTime2.innerText = `${new Date().getDate()} ${checkMonth(
        new Date().getMonth()
      )} ${new Date().getFullYear()}`;
      arrayTasks.forEach((task) => {
        if (task.id === Number(id)) {
          task.name = inputValue;
          task.date.hours = new Date().getHours();
          task.date.minutes = new Date().getMinutes();
          task.date.seconds = new Date().getSeconds();
          task.date.year = new Date().getFullYear();
          task.date.month = new Date().getMonth();
          task.date.day = new Date().getDate();
        }
      });
      if (input.value.length > 3) {
        e.target.classList.remove('show');
        input.classList.remove('active');
        input.readOnly = true;
        saveLocalStorage();
        console.log(arrayTasks);
      } else {
        alert('Название должно быть больше 3 символов!');
        input.focus();
      }
    }
  }

  // Сохранение данных в Local Storage
  function saveLocalStorage() {
    localStorage.setItem('task', JSON.stringify(arrayTasks));
  }
  todoForm.addEventListener('submit', addTask);
  todoTasks.addEventListener('click', removeTask);
  todoTasks.addEventListener('click', changeTask);
});
