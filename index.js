document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("task-input");
    const addTaskbtn = document.getElementById("add-task-btn");
    const taskList = document.getElementById("task-list");
    const emptyimage = document.querySelector(".empty-image");
    const todoscontainer = document.querySelector(".todos-container");
    const progressBar = document.getElementById("progress");
    const progressNumbers = document.getElementById("numbers");


    const saveTasks = () => {
        const tasks = Array.from(taskList.querySelectorAll('li')).map(li => ({
            text: li.querySelector('span').textContent,
            completed: li.querySelector('.checkbox').checked
        }));

        localStorage.setItem("tasks", JSON.stringify(tasks));
    };

    const toggleEmptystate = () => {
        emptyimage.style.display =
            taskList.children.length === 0 ? "block" : "none";
        todoscontainer.style.width = taskList.children.length > 0 ? "100%" : "50%";
    };

    const updateprogress = (checkcompletion = true) => {
        const totalTasks = taskList.children.length;
        const completedTasks =
            taskList.querySelectorAll('.checkbox:checked').length;

        progressBar.style.width = totalTasks
            ? `${(completedTasks / totalTasks) * 100}%`
            : "0%";

        progressNumbers.textContent = `${completedTasks} / ${totalTasks}`;

        if (checkcompletion && totalTasks > 0 && completedTasks === totalTasks) {
            runconfetti();
        }
     
    };

    const addTask = (text, completed = false, isNewTask = true) => {

        if (isNewTask) {
            text = taskInput.value.trim();
            if (!text) {
                return;
            }
        }
        
        const li = document.createElement("li");
        li.innerHTML = `
        <input type="checkbox" class="checkbox" ${completed ? 'checked' : ''} />
        <span>${text}</span>
        <div class="task-buttons">
           <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
           <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
        </div>
        `;

        const checkbox = li.querySelector(".checkbox");
        const editBtn = li.querySelector(".edit-btn");

        if (completed) {
            li.classList.add('completed');
        }


        checkbox.addEventListener("change", () => {
            if (checkbox.checked) {
                li.classList.add("completed"); 
            } else {
                li.classList.remove("completed"); 
            }
            updateprogress(true);
            saveTasks(); 
        });


        editBtn.addEventListener("click", () => {
            if (!checkbox.checked) {
                taskInput.value = li.querySelector("span").textContent;
                li.remove();
                toggleEmptystate();
                updateprogress();
                saveTasks();
               
            } else {
                alert("Completed tasks cannot be edited. Please uncheck first.");
            }
        });

        li.querySelector(".delete-btn").addEventListener("click", () => {
            li.remove();
            toggleEmptystate();
            updateprogress();
            saveTasks();
        });

        taskList.appendChild(li);
        
        if (isNewTask) {
             taskInput.value = "";
             saveTasks(); 
        }

        toggleEmptystate();
        
    };

    const loadTasks = () => {
        const savedTask = JSON.parse(localStorage.getItem("tasks")) || [];
        savedTask.forEach(({text, completed}) => addTask(text, completed, false)); 
        toggleEmptystate();
        updateprogress(true);
    };


    const handleAddTask = (e) => {
        e.preventDefault(); refresh
        addTask(null, false, true);  
    };

    addTaskbtn.addEventListener("click", handleAddTask);
    taskInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            handleAddTask(e);
        }
    });

    loadTasks();
});

const runconfetti = () => {
    const count = 200,
        defaults = {
            origin: { y: 0.7 },
        };

    function fire(particleRatio, opts) {
        window.confetti(
            Object.assign({}, defaults, opts, {
                particleCount: Math.floor(count * particleRatio),
            })
        );
    }

    fire(0.25, {
        spread: 26,
        startVelocity: 55,
    });

    fire(0.2, {
        spread: 60,
    });

    fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
    });

    fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
    });

    fire(0.1, {
        spread: 120,
        startVelocity: 45,
    });
};