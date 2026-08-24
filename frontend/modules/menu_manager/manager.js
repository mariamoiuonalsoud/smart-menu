// Manager functionality - send POST and PUT requests to the backend for adding categories, meals, and meal details
document.addEventListener("DOMContentLoaded", fetchItems);

function fetchItems() {
  fetch("/api/items")
    .then((res) => res.json())
    .then((data) => {
      renderTable(data);
    })
    .catch((err) => {
      console.error("Error loading items: ", err);
      alert("An error occurred in loading the data!");
    });
}

function renderTable(items) {
  const tbody = document.getElementById("items-body");
  const table = document.getElementById("menu-table");
  const loading = document.getElementById("loading");

  tbody.innerHTML = "";

  items.forEach((item) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td>
                <input type="text" value="${item.meal_name || ""}" id="name-${item._id}" />
            </td>
            <td>
                <input type="text" value="${item.meal_description || ""}" id="desc-${item._id}" style="width: 250px;" />
            </td>
            <td>
                <input type="text" value="${item.meal_size || ""}" id="size-${item._id}" style="width: 70px;" />
            </td>
            <td>
                <input type="number" value="${item.meal_price || 0}" id="price-${item._id}" style="width: 80px;" />
            </td>
            <td>
                <strong>${item.isHidden ? "Hidden ❌" : "Visible 👁️"}</strong>
                <br/>
                <button onclick="toggleHide('${item._id}')">
                    ${item.isHidden ? "Show" : "Hide"}
                </button>
            </td>
            <td>
                <button onclick="updateItem('${item._id}')">Save Updates 💾</button>
                <button onclick="deleteItem('${item._id}')">Delete 🗑️</button>
            </td>
        `;
    tbody.appendChild(tr);
  });
  loading.style.display = "none";
  table.style.display = "table";
}

function updateItem(id) {
  const meal_name = document.getElementById(`name-${id}`).value;
  const meal_description = document.getElementById(`desc-${id}`).value;
  const meal_size = document.getElementById(`size-${id}`).value;
  const meal_price = document.getElementById(`price-${id}`).value;

  fetch(`/api/items/${id}`, {
    method: "PUT",
    headers: { "content-Type": "application/json" },
    body: JSON.stringify({
      meal_name: meal_name,
      meal_description: meal_description,
      meal_size: meal_size,
      meal_price: Number(meal_price),
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      alert("Meal Updated Successfully!");
      fetchItems();
    })
    .catch((err) => console.error("Error updating item: ", err));
}

// 4. تبديل حالة الإخفاء/الإظهار (PATCH /api/items/:id)
function toggleHide(id) {
  fetch(`/api/items/${id}`, {
    method: "PATCH",
  })
    .then((res) => res.json())
    .then((data) => {
      fetchItems();
    })
    .catch((err) => console.error("Error toggling hide:", err));
}

// 5. حذف الوجبة (DELETE /api/items/:id)
function deleteItem(id) {
  if (!confirm("Are you sure you want to delete this meal?")) return;

  fetch(`/api/items/${id}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((data) => {
      fetchItems();
    })
    .catch((err) => console.error("Error deleting item:", err));
}
