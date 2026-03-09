let currentTab = "all";

function switchTab(tab) {
  const tabs = ["all", "open", "closed"];
  for (let t of tabs) {
    const btn = document.getElementById(`tab-${t}`);
    if (btn) {
      btn.classList.remove("bg-[#4A00FF]", "text-white");
      btn.classList.add("bg-gray-200");
    }
  }
  const activeBtn = document.getElementById(`tab-${tab}`);
  if (activeBtn) {
    activeBtn.classList.remove("bg-gray-200");
    activeBtn.classList.add("bg-[#4A00FF]", "text-white");
  }
  filterIssues(tab);
}
