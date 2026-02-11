import {
  inputEnabled,
  setDiv,
  message,
  setToken,
  token,
  enableInput,
} from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showAddEdit } from "./addEdit.js";

let profilesDiv = null;
let profilesTable = null;
let profilesTableHeader = null;

export const handleProfiles = () => {
  profilesDiv = document.getElementById("profiles");
  const logoff = document.getElementById("logoff");
  const addProfile = document.getElementById("add-profile");
  profilesTable = document.getElementById("profiles-table");
  profilesTableHeader = document.getElementById("profiles-table-header");

  profilesDiv.addEventListener("click", async (e) => {
    if (!inputEnabled) return;

    if (e.target.nodeName === "BUTTON") {
      if (e.target === addProfile) {
        showAddEdit(null);
      } else if (e.target === logoff) {
        setToken(null);
        message.textContent = "You have been logged off.";
        profilesTable.replaceChildren(profilesTableHeader);
        showLoginRegister();
      } else if (e.target.classList.contains("editButton")) {
        message.textContent = "";
        showAddEdit(e.target.dataset.id);
      } else if (e.target.classList.contains("deleteButton")) {
        await deleteProfile(e.target.dataset.id);
      }
    }
  });
};

const deleteProfile = async (profileId) => {
  enableInput(false);
  try {
    const response = await fetch(`/api/v1/profiles/${profileId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (response.status === 200) {
      message.textContent = data.msg || "The entry was deleted.";
      await showProfiles(); // refresh list
    } else {
      message.textContent = data.msg || "Delete failed.";
    }
  } catch (err) {
    console.error(err);
    message.textContent = "A communication error occurred.";
  }
  enableInput(true);
};

export const showProfiles = async () => {
  try {
    enableInput(false);

    const response = await fetch("/api/v1/profiles", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    const children = [profilesTableHeader];

    if (response.status === 200) {
      if (data.count === 0) {
        profilesTable.replaceChildren(...children);
      } else {
        for (let i = 0; i < data.profiles.length; i++) {
          const p = data.profiles[i];
          const rowEntry = document.createElement("tr");

          const editBtn = `<td><button type="button" class="editButton" data-id="${p._id}">edit</button></td>`;
          const delBtn = `<td><button type="button" class="deleteButton" data-id="${p._id}">delete</button></td>`;

          rowEntry.innerHTML = `
            <td>${p.fullName}</td>
            <td>${p.positionType}</td>
            <td>${p.yearsExperience}</td>
            <td>${p.state}</td>
            ${editBtn}
            ${delBtn}
          `;
          children.push(rowEntry);
        }
        profilesTable.replaceChildren(...children);
      }
    } else {
      message.textContent = data.msg || "Could not load profiles.";
    }
  } catch (err) {
    console.error(err);
    message.textContent = "A communication error occurred.";
  }

  enableInput(true);
  setDiv(profilesDiv);
};
