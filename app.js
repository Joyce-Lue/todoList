document.addEventListener("DOMContentLoaded", () => {
  const navbarItems = document.querySelectorAll(".navbarLi");
  let activeItem = document.querySelector(".navbarLi[data-default]");

  // 確保預設選中的項目正確顯示
  if (activeItem) {
    activeItem.classList.add("active");
    activeItem.querySelector(".Line").style.opacity = "1";
  }

  navbarItems.forEach((item) => {
    const button = item.querySelector(".navbarHeader");
    const line = item.querySelector(".Line");

    // 滑鼠進入時，顯示對應的 .Line（如果目前沒有 activeItem）
    button.addEventListener("mouseenter", () => {
      if (!item.classList.contains("active")) {
        line.style.opacity = "1";
      }
    });

    // 滑鼠離開時，如果該項目不是 active，則隱藏 .Line
    button.addEventListener("mouseleave", () => {
      if (!item.classList.contains("active")) {
        line.style.opacity = "0";
      }
    });

    // 點擊時，隱藏所有 .Line，並讓當前 .Line 顯示
    button.addEventListener("click", () => {
      // 取消所有 active 狀態
      navbarItems.forEach((nav) => {
        nav.classList.remove("active");
        nav.querySelector(".Line").style.opacity = "0";
      });

      // 設定當前 item 為 active
      item.classList.add("active");
      line.style.opacity = "1";
      activeItem = item;
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const todoText = document.getElementById("todoText");
  const addTodoBtn = document.getElementById("addTodo");
  const todoList = document.getElementById("todoList");
  const filterButtons = document.querySelectorAll(".filter button");
  const leftDiv = document.querySelector(".left");
  const completedDiv = document.querySelector(".completed");

  let todos = JSON.parse(localStorage.getItem("todos")) || [];

  function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
  }

  // 更新剩餘數量
  function updateTaskCount() {
    const leftTasks = todos.filter((todo) => !todo.done).length;
    leftDiv.textContent = `${leftTasks} tasks left`;
    completedDiv.style.display = "none";
    leftDiv.style.display = "block";
  }

  // 更新已完成數量
  function updateCompletedCount() {
    const completedTasks = todos.filter((todo) => todo.done).length;
    completedDiv.textContent = `${completedTasks} task completed`;
    leftDiv.style.display = "none";
    completedDiv.style.display = "block";
  }

  function renderTodos(filter = "all") {
    todoList.innerHTML = "";
    let filteredTodos = todos.filter((todo) => {
      if (filter === "active") return !todo.done;
      if (filter === "completed") return todo.done;
      return true;
    });

    // console.log("看todos內容");
    // console.log(todos);
    // console.log("看todos內容");

    // 代辦事項樣式
    filteredTodos.forEach((todo) => {
      const div = document.createElement("div");
      div.classList.add("add-item");
      div.style.height = "102px";

      div.innerHTML = `
          <input type="checkbox" name="completed" id="completed" ${
            todo.done ? "checked" : ""
          } data-id="${todo.id}">
          <input type="text" id="todoText" placeholder="Type Something Here…" value="${
            todo.text
          }" class="${todo.done ? "completed" : ""}" data-id="${todo.id}">
          <span class="star ${todo.important ? "important" : ""}" data-id="${
        todo.id
      }">★</span>
          <i class="fa-solid fa-pen" data-id="${todo.id}"></i>
          <div>
              <i class="fa-solid fa-calendar-days"></i>
              <span>${todo.date || ""}</span>
              <i class="fa-solid fa-file"></i>
              <i class="fa-solid fa-comment"></i>
          </div>
      `;
      // <button class="delete" data-id="${todo.id}">刪除</button>

      // 點擊星星後改變背景顏色
      if (todo.important) {
        div.style.backgroundColor = "#FFF2DC";
        const inputText = div.querySelector("#todoText");
        inputText.style.backgroundColor = "#FFF2DC";
      }

      todoList.appendChild(div);
    });

    // 待辦事項統計
    filter === "completed" ? updateCompletedCount() : updateTaskCount();
  }

  addTodoBtn.addEventListener("click", () => {
    if (todoText.value.trim() === "") return;
    todos.push({
      id: Date.now(),
      text: todoText.value.trim(),
      done: false,
      important: false,
    });
    todoText.value = "";
    saveTodos();
    renderTodos();
  });

  todoList.addEventListener("click", (e) => {
    const id = Number(e.target.dataset.id);
    if (e.target.tagName === "INPUT") {
      todos = todos.map((todo) =>
        todo.id === id ? { ...todo, done: e.target.checked } : todo
      );
      saveTodos();
      renderTodos();
    }
    // if (e.target.classList.contains("delete")) {
    //   todos = todos.filter((todo) => todo.id !== id);
    //   saveTodos();
    //   renderTodos();
    // }
  });

  todoList.addEventListener("input", (e) => {
    if (e.target.tagName === "SPAN") {
      const id = Number(e.target.dataset.id);
      todos = todos.map((todo) =>
        todo.id === id ? { ...todo, text: e.target.innerText } : todo
      );
      saveTodos();
    }
  });

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderTodos(btn.dataset.filter);
    });
  });

  // 星號切換
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("star")) {
      e.target.classList.toggle("important");
      const id = Number(e.target.dataset.id);

      // 更新 todos 陣列中的 important 屬性
      todos = todos.map((todo) =>
        todo.id === id ? { ...todo, important: !todo.important } : todo
      );

      // 讓重要的事項排在最前面
      todos.sort((a, b) => b.important - a.important || b.id - a.id);

      saveTodos();
      renderTodos();
    }
  });

  renderTodos();
});
