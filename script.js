const inputValue = document.getElementById("input-value");
const list = document.getElementById('list');
const toggleBtn = document.getElementById("theme-toggle");
const errorMsg = document.getElementById('error-msg');

window.addEventListener('DOMContentLoaded', () => {
  const savedItems = JSON.parse(localStorage.getItem("todoItems") || "[]");
  savedItems.forEach(({ text, done }) => addItem(text, done));
});

inputValue.addEventListener('keyup', function (e)  {
  if (e.key === 'Enter') {
    addItem(this.value);
    this.value = '';
  }
});


  let addItem = (inputValue, isDone = false) => {
    const trimmed = inputValue.trim();
    if (trimmed === '') {
      errorMsg.textContent = "Please enter something!";
      return;
    }
    errorMsg.textContent = "";

    const listItem = document.createElement('li');
    listItem.textContent = trimmed;
    if (isDone) listItem.classList.add('done');

    const icon = document.createElement('i');
    listItem.appendChild(icon);

    listItem.addEventListener('click', function() {
      this.classList.toggle('done');
      saveList();
    });

    icon.addEventListener('click', function(e) {
      e.stopPropagation();
      listItem.style.transition = "opacity 0.3s ease-out, transform 0.3s ease-out";
      listItem.style.opacity = "0";
      listItem.style.transform = "translateX(20px)";
      setTimeout(() => {
        listItem.remove();
        saveList();
      }, 300); 
    });

    enableSwipeToDelete(listItem, () => {
      listItem.remove();
      saveList();
    });

    list.appendChild(listItem);
    saveList();
  };

  function saveList() {
    const items = Array.from(list.querySelectorAll('li')).map(li => ({
      text: li.firstChild.textContent,
      done: li.classList.contains('done')
    }));
    localStorage.setItem("todoItems", JSON.stringify(items));
  }

  function enableSwipeToDelete(element, callback) {
    let startX;
  
    element.addEventListener("touchstart", e => {
      startX = e.touches[0].clientX;
    });
  
    element.addEventListener("touchend", e => {
      let endX = e.changedTouches[0].clientX;
      if (startX - endX > 100) {
        // Swiped left
        element.style.transition = "opacity 0.3s ease-out, transform 0.3s ease-out";
        element.style.opacity = "0";
        element.style.transform = "translateX(-20px)";
        setTimeout(() => {
          callback();
        }, 300);
      }
    });
  }

  toggleBtn.addEventListener("click", () => {
    const isLight = document.body.classList.toggle("light");
    localStorage.setItem("theme", isLight ? "light" : "dark");
    updateThemeIcon();
  });
  
  function updateThemeIcon() {
    const icon = document.getElementById("theme-toggle");
  
    // Swap icon based on theme
    if (document.body.classList.contains("light")) {
      icon.textContent = "☀️";
    } else {
      icon.textContent = "🌙";
    }
  
    // Trigger bounce
    icon.classList.remove("bounce"); // reset animation
    void icon.offsetWidth; // force reflow to restart animation
    icon.classList.add("bounce");
  }
  
  
  // Also call it on page load
  window.addEventListener("DOMContentLoaded", () => {
    const theme = localStorage.getItem("theme");
    if (theme === "light") {
      document.body.classList.add("light");
    }
    updateThemeIcon();
  });
  

  