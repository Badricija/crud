import axios from 'axios';
import sum from './utils/sum/sum';

type Task = {
    id: number;
    name: string;
};
const taskWrapper = document.querySelector('.js-task-wrapper') as HTMLElement;
const drawTask = () => {
    axios.get<Task[]>('http://localhost:3000/tasks').then(response => {
        taskWrapper.innerHTML = '';
        const tasks = response.data;
        console.log('tasks', tasks);
        tasks.forEach((task: Task) => { 
            const taskDiv = document.createElement('div');
            taskDiv.className = 'task';
            taskDiv.innerHTML = `
                <button class="js-add-picture" data-task-id="${task.id}">Add Picture</button>
                <h1 class="task-heading">${task.name}</h1>
                <p class="task-paragraph"> bla bla bla bla blaaa</p>
                <button class="js-task-delete task-button" data-task-id="${task.id}">Delete</button>
            `;
            taskWrapper.appendChild(taskDiv);
            const addPictureButton = taskDiv.querySelector('.js-add-picture') as HTMLElement;
            const fileInput = document.createElement('input');
            fileInput.setAttribute('type', 'file');
            fileInput.style.display = 'none';
            fileInput.setAttribute('accept', 'image/*'); 
            addPictureButton.addEventListener('click', () => {
                fileInput.click();
            });
            fileInput.addEventListener('change', (event) => {
                const input = event.target as HTMLInputElement; 
                const files = input.files;
                if (files && files.length > 0) {
                    const file = files[0];
                    const reader = new FileReader();
                    reader.onload = (readerEvent) => {
                        const src = typeof readerEvent.target.result === "string" ? readerEvent.target.result : "";
                        const imageElement = `<img src="${src}" alt="Picture for task" />`;
                        const now = new Date();
                        const createdAtElement = `<p>Uploaded at: ${now.toLocaleString()}</p>`;
                        taskDiv.insertAdjacentHTML('afterbegin', createdAtElement);
                        taskDiv.insertAdjacentHTML('afterbegin', imageElement);
                    };
                    reader.readAsDataURL(file);
                }
            });
            const deleteButton = taskDiv.querySelector('.js-task-delete') as HTMLElement;
            deleteButton.onclick = () => {
                const taskId = deleteButton.dataset.taskId;
                axios.delete(`http://localhost:3000/tasks/${taskId}`).then(drawTask);
            };
        });
    });
};
drawTask()
const taskForm = document.querySelector('.js-task-form');

taskForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const taskNameInput = taskForm.querySelector('input[name="task"]') as HTMLInputElement;
    const taskNameInputValue = taskNameInput.value;
    axios.post('http://localhost:3000/tasks', {
        name: taskNameInputValue,
    }).then(() => {
        taskNameInput.value = '';
        drawTask();
    });
});


