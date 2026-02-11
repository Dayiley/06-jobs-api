import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { showProfiles } from "./profiles.js";

let addEditDiv = null;
let fullName = null;
let positionType = null;
let yearsExperience = null;
let state = null;
let saveProfile = null;

export const handleAddEdit = () => {
  addEditDiv = document.getElementById("edit-profile");
  fullName = document.getElementById("fullName");
  positionType = document.getElementById("positionType");
  yearsExperience = document.getElementById("yearsExperience");
  state = document.getElementById("state");
  saveProfile = document.getElementById("save-profile");
  const editCancel = document.getElementById("edit-cancel");

  addEditDiv.addEventListener("click", async (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === saveProfile) {
        enableInput(false);

        let method = "POST";
        let url = "/api/v1/profiles";

        if (saveProfile.textContent === "update") {
          method = "PATCH";
          url = `/api/v1/profiles/${addEditDiv.dataset.id}`;
        }

        try {
          const response = await fetch(url, {
            method,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              fullName: fullName.value,
              positionType: positionType.value,
              yearsExperience: Number(yearsExperience.value),
              state: state.value,
            }),
          });

          const data = await response.json();
          if (response.status === 201 || response.status === 200) {
            message.textContent =
              response.status === 200
                ? "The profile was updated."
                : "The profile was created.";

            fullName.value = "";
            positionType.value = "driver";
            yearsExperience.value = "";
            state.value = "";

            showProfiles();
          } else {
            message.textContent = data.msg || "Save failed.";
          }
        } catch (err) {
          console.error(err);
          message.textContent = "A communication error occurred.";
        }

        enableInput(true);
      } else if (e.target === editCancel) {
        message.textContent = "";
        showProfiles();
      }
    }
  });
};

export const showAddEdit = async (profileId) => {
  if (!profileId) {
    fullName.value = "";
    positionType.value = "driver";
    yearsExperience.value = "";
    state.value = "";
    saveProfile.textContent = "add";
    message.textContent = "";
    setDiv(addEditDiv);
    return;
  }

  enableInput(false);
  try {
    const response = await fetch(`/api/v1/profiles/${profileId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (response.status === 200) {
      fullName.value = data.profile.fullName;
      positionType.value = data.profile.positionType;
      yearsExperience.value = data.profile.yearsExperience;
      state.value = data.profile.state;

      saveProfile.textContent = "update";
      addEditDiv.dataset.id = profileId;
      message.textContent = "";
      setDiv(addEditDiv);
    } else {
      message.textContent = "The profile entry was not found.";
      showProfiles();
    }
  } catch (err) {
    console.error(err);
    message.textContent = "A communications error has occurred.";
    showProfiles();
  }
  enableInput(true);
};
