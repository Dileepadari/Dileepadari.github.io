function menuTodo(a, b) {
  document.querySelector(".modal_bg_transparent").style.display = a;
  document.querySelector("#todo_menu_container").style.display = b;
}

function createTask() {
  console.log("ihswodicioNIOFEJIOWNIONA");
  var createTaskSection = document.createElement("div");
  pageBody[0].appendChild(createTaskSection);
  createTaskSection.setAttribute("id", "create_list_section");
  createTaskSection.setAttribute("class", "modal_bg");
  createTaskSection.innerHTML = `
      <form class="modal_container form_input" autocomplete="off">
          <header class="modal_header">
              <b>Add a task</b>
              <i class="close_btn">&#xe8bb;</i>
          </header>
          <div class="line_dividerX"></div>
          <main class="form_body add_list_body">
              <div class="input_section">
                  <input type="text" id="name_list" class="input_text" placeholder="Enter a name" ><br>
                  <input type="text" id="description" class="input_text" placeholder="Enter a description" ><br>
                  <input type="date" id="deadline" class="input_text" placeholder="Enter a deadline" >
                  <button id="save_btn" disabled>Save</button>
              </div>
                  <p class="form_error hidden">There is an error creating your todo.</p>
          </main>
      </form>`;

  var inputField = document.querySelector("#name_list"),
    descriptionField = document.querySelector("#description"),
    deadlineField = document.querySelector("#deadline"),
    saveBtn = document.querySelector("#save_btn");

  closeMenu("create_list_section");
  inputField.focus();

  function saveAddTodo() {
    var taskData = {
      list_id: localStorage.getItem("list-selected"),
      uniqueid: localStorage.getItem("username"),
      task_name: inputField.value.trim().replace(/^\S/, (c) => c.toUpperCase()),
      description: descriptionField.value.trim(),
      deadline: deadlineField.value.trim(),
    };

    fetch("https://delhitodolist.pythonanywhere.com/task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.data);
        if (document.querySelector("#todo_container") != null) {
          document.querySelector("#todo_container").remove();
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  inputField.oninput = () => {
    if (inputField.value == "" || inputField.value.match(/^\s*$/)) {
      saveBtn.setAttribute("disabled", "");
    } else {
      saveBtn.removeAttribute("disabled");
    }
  };

  saveBtn.onclick = saveAddTodo;
}

function deleteTodo() {
  const listId = localStorage.getItem("list-selected");
  fetch(`https://delhitodolist.pythonanywhere.com/list/${listId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.message);
      location.reload();
      // Handle the response as needed
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function deleteTask(task_id) {
  fetch(`https://delhitodolist.pythonanywhere.com/task/${task_id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.message);
      location.reload();
      // Handle the response as needed
    });
}

function UpdateTask(task_id, task_data) {
  fetch(`https://delhitodolist.pythonanywhere.com/task/${task_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(task_data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.message);
      location.reload();
      // Handle the response as needed
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function deleteConfirm(title, msg, func) {
  menuTodo("none", "none");
  const deleteConfirmSection = document.createElement("div");
  pageBody[0].appendChild(deleteConfirmSection);
  deleteConfirmSection.setAttribute("id", "delete_confirm_section");
  deleteConfirmSection.setAttribute("class", "modal_bg");
  deleteConfirmSection.innerHTML = `
        <form class="modal_container form_input">
            <header class="modal_header">
                <b>${title}</b>
                <i class="close_btn">&#xe8bb;</i>
            </header>
            <div class="line_dividerX"></div>
            <main class="form_body add_list_body">
                <p>${msg}</p>
            </main>
            <div class="line_dividerX"></div>
            <footer class="form_footer flex-row">
                <button type="button" id="cancel-btn" class="secondary-btns">Cancel</button>
                <button type="button" id="delete-btn" class="error-btns">Delete</button>
            </footer>
        </form>`;

  closeMenu("delete_confirm_section");

  document.querySelector("#cancel-btn").onclick = () => {
    document.querySelector(".close_btn").click();
  };

  document.querySelector("#delete-btn").onclick = () => {
    func();
  };
}

const deleteListMsg = `You'll lose all the task inside this list. This cannot be recover once deleted.<br><br>Are you sure you want to permanently delete this list?`,
  deleteTaskMsg = `Are you sure you want to delete this task?`;

function handletaskStatus(id, item) {
  if (item.checked == true) {
    UpdateTask(id, { status: "completed" });
  } else {
    UpdateTask(id, { status: "created" });
  }
}

function handletasktitle(id, item) {
  UpdateTask(id, { task_name: item.value });
}

function todosection(list_name) {
  todoTaskSection.innerHTML = `
    <section class="todo_header_container">
            <h1 class="todo_header_title">${list_name}</h1>
            <div class="list_footer_group">
                <i class="icon_btns" onclick="menuTodo('block', 'flex')">&#xe712;</i>
                <div class="modal_bg_transparent" onclick="menuTodo('none', 'none')"></div>
                <ul id="todo_menu_container">
                    <li onclick="renameTodo()"><i>&#xe8ac;</i>Rename</li>
                    <li onclick="deleteConfirm('Delete List?', deleteListMsg, deleteTodo)"><i>&#xe74d;</i>Delete</li>
                </ul>
            </div>
        </section>
        <div class="line_dividerX"></div>
        <button type="button" id="add_task_btn" onclick=createTask()><i>&#xe710;</i>Add a task</button>`;
  fetch(
    "https://delhitodolist.pythonanywhere.com/tasks/" +
      list_name +
      "/" +
      localStorage.getItem("username")
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data.data);
      if (data.data.length > 0) {
        data.data.forEach((task) => {
          todoTaskSection.innerHTML += `
              <li class="task_list" id="${task[0]}">
              <input type="checkbox" class="task_checkbox" id="task_checkbox_${
                task[0]
              }" onchange="handletaskStatus(${task[0]}, this)" ${
            task[7] == "completed" ? "checked" : ""
          } />
              <input type="text" class="task_input" id="task_input" value="${
                task[3]
              }" onblur="handletasktitle(${task[0]}, this)" />
              <i class="task_delete" id="task_delete" onclick="deleteConfirm('Delete Task?', deleteTaskMsg, function() {deleteTask(${
                task[0]
              })})">&#xe8bb;</i>
              </li>`;
          const taskDetails = `
              <li class="task_list" id="${task[0]}" style="display: none;justify-content: space-around;flex-wrap: wrap;padding: 10px;">
                  <h2><b>Description: </b> ${task[4]}</h2><br>
                  <h2><b>Created At: </b> ${task[5]}</h2>
                  <h2><b>Deadline: </b> ${task[6]}</h2>
              </li>`;
          todoTaskSection.innerHTML += taskDetails;
        });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function display_todo() {
  if (localStorage.getItem("logstatus")) {
    fetch("https://delhitodolist.pythonanywhere.com/lists/" + localStorage.getItem("username"), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.data);
        if (data.data.length > 0) {
          listContainer.innerHTML = `<ul id="list_sub_container"></ul>`;
          data.data.forEach((list) => {
            document.getElementById("list_sub_container").innerHTML += `
              <li class="list_container" id="${list[0]}" onclick="
              document.getElementById(localStorage.getItem('list-selected')).classList.remove('active');
              localStorage.setItem('list-selected', this.id);
              todosection(this.querySelector('.list_name').innerHTML);
              this.classList.add('active');
              ">
              <p class="list_name">${list[1]}</p>
              </li>`;
          });
          if (!localStorage.getItem("list-selected")) {
            localStorage.setItem("list-selected", data.data[0][0]);
            document.getElementById(localStorage.getItem("list-selected")).classList.add("active");
            localStorage.setItem("selected-list-name", data.data[0][1]);
            todosection(data.data[0][1]);
            console.log(localStorage.getItem("selected-list-name"));
          } else {
            document
              .getElementById(localStorage.getItem("list-selected"))
              .classList.add("active");
            if (!localStorage.getItem("selected-list-name")) {
              localStorage.setItem(
                "selected-list-name",
                data.data.find(
                  (list) => list[0] === localStorage.getItem("list-selected")
                )[1]
              );
            }
            todosection(localStorage.getItem("selected-list-name"));
          }
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}

function createList() {
  var createListSection = document.createElement("div");
  pageBody[0].appendChild(createListSection);
  createListSection.setAttribute("id", "create_list_section");
  createListSection.setAttribute("class", "modal_bg");
  createListSection.innerHTML = `
        <form class="modal_container form_input" autocomplete="off">
            <header class="modal_header">
                <b>Add a list</b>
                <i class="close_btn">&#xe8bb;</i>
            </header>
            <div class="line_dividerX"></div>
            <main class="form_body add_list_body">
                <div class="input_section">
                    <input type="text" id="name_list" class="input_text" placeholder="Enter a name" >
                    <button id="save_btn" disabled>Save</button>
                </div>
                    <p class="form_error hidden">There is an error creating your list.</p>
            </main>
        </form>`;

  var inputField = document.querySelector("#name_list"),
    saveBtn = document.querySelector("#save_btn");

  closeMenu("create_list_section");
  inputField.focus();

  function saveAddList(e) {
    e.preventDefault();

    if (localStorage.getItem("username")) {
      saveBtn.setAttribute("disabled", "");
      display_todo();

      document.querySelector(".close_btn").click();

      // Send POST request to create_list endpoint
      fetch("https://delhitodolist.pythonanywhere.com/create_list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          list_name: inputField.value,
          username: localStorage.getItem("username"),
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data.message); // Handle the response as needed
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      document.querySelector(".form_error").classList.remove("hidden");
    }
  }

  inputField.oninput = () => {
    if (
      inputField.value == "" ||
      inputField.value.match(/^\s*$/) ||
      inputField.value.length > 32
    ) {
      saveBtn.setAttribute("disabled", "");
    } else {
      saveBtn.removeAttribute("disabled");
    }
  };

  saveBtn.onclick = saveAddList;
}

addListBtn.onclick = createList;

addListBtn2.onclick = createList;

display_todo();