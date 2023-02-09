const timeOption = document.querySelector("#time-option");

timeOption.addEventListener("change", (event) => {
  const val = event.target.value;
  console.log(val);
  if (val < 1 || val > 60) {
    timeOption.value = 25;
  }
});

const saveBtn = document.querySelector("#save-btn");
saveBtn.addEventListener("click", () => {
  chrome.storage.local.set(
    {
      timer: 0,
      timeOption: timeOption.value,
      isRunning: false,
    },
    function () {}
  );
});

chrome.storage.local.get(["timeOption"], function (result) {
  timeOption.value = result.timeOption;
});
