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
const loginPage = document.getElementById("loginPage");
const mainPage = document.getElementById("mainPage");
const loading = document.getElementById("loading");
const issuesContainer = document.getElementById("issuesContainer");
const issueCount = document.getElementById("issueCount");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDic");
const modalStatus = document.getElementById("modalStatus");
const modalOpenedBy = document.getElementById("modalOpenedBy");
const modalDate = document.getElementById("modalDate");
const priority = document.getElementById("Priority");
const searchInput = document.getElementById("searchInput");
const modal = document.getElementById("my_modal_5");
const modalBadges = document.getElementById("modalBadges");

let issues = []; 

function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  if (user === "admin" && pass === "admin123") {
    loginPage.classList.add("hidden");
    mainPage.classList.remove("hidden");
    loadIssues();
  } else {
    alert("Invalid Username or Password");
  }
}

async function loadIssues() {
  loading.classList.remove("hidden");
  const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");
  const data = await res.json();
  issues = data.data;
  renderCards(issues);
  issueCount.innerText = `${issues.length} Issues`;
  loading.classList.add("hidden");
}

function filterIssues(type) {
  let filter = issues;
  if (type === "open") {
    filter = issues.filter((issue) => issue.status === "open");
  }
  if (type === "closed") {
    filter = issues.filter((issue) => issue.status === "closed");
  }
  renderCards(filter);
  issueCount.innerText = `${filter.length} Issues`;
}

function renderCards(data) {
  issuesContainer.innerHTML = "";
  data.forEach((issue) => {
    const borderColor =
      issue.status === "open" ? "border-green-500" : "border-purple-500";
    let categoryBg = "bg-gray-100";
    let categoryText = "text-gray-600";
    let priorityLabel = issue.priority;

    if (issue.priority === "high") {
      categoryBg = "bg-[#FECACA]";
      categoryText = "text-[#DC2626]";
    } else if (issue.priority === "medium") {
      categoryBg = "bg-[#FFF6D1]";
      categoryText = "text-[#F59E0B]";
    } else if (issue.priority === "low") {
      categoryBg = "bg-[#F3E8FF]";
      categoryText = "text-[#8B5CF6]";
    }

    let badgesHtml = "";

    if (issue.labels && Array.isArray(issue.labels)) {
      issue.labels.forEach((label) => {
        let bgColor = "bg-gray-100";
        let textColor = "text-gray-600";
        let iconSrc = "";
        const lowerLabel = label.toLowerCase();

        if (lowerLabel === "bug") {
          bgColor = "bg-[#FECACA]";
          textColor = "text-red-600";
          iconSrc = "assets/Vector.png";
        }
        else if (lowerLabel === "help wanted") {
          bgColor = "bg-[#FDE68A]";
          textColor = "text-[#D97706]";
          iconSrc = "assets/Vector (1).png";
        }
        else if (lowerLabel === "enhancement") {
          bgColor = "bg-[#BBF7D0]";
          textColor = "text-[#00A96E]";
        }
        badgesHtml += `
      <div class="${bgColor} inline-block px-[8px] py-1 rounded-3xl">
        <div class="flex items-center gap-1 text-xs">
          ${iconSrc ? `<img src="${iconSrc}" alt="">` : ""}
          <p class="font-medium ${textColor}">
            ${label.toUpperCase()}
          </p>
        </div>
      </div>`;
      });
    }

    const card = `
      <div onclick="openModal(${issue.id})" class="bg-white border-t-4 ${borderColor} p-4 rounded-xl shadow">
        <div class="flex justify-between mb-2">
          <img src="assets/Status.png" alt=" ">
          <p class="px-6 py-2 text-xs font-medium rounded-2xl ${categoryBg} ${categoryText}">
            ${priorityLabel.toUpperCase()}
          </p>
        </div>
        <h3 class="text-[#1F2937] font-semibold text-[14px] mb-2 ">
          ${issue.title}
        </h3>
        <p class="mb-3 text-sm text-gray-500">
          ${issue.description.slice(0, 80)}...
        </p>
        <div class="flex flex-wrap gap-2 mb-3">
          ${badgesHtml}
        </div>
        <hr class="my-4 border-gray-200">
        <div class="flex flex-col text-xs text-gray-400">
          <span>#${issue.id} by ${issue.author}</span>
          <span class="mt-2">1/15/2024</span>
        </div>
      </div>`;

    issuesContainer.innerHTML += card;

  });
}

async function searchIssue() {

  const text = searchInput.value;
  const res = await fetch(
    `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${text}`
  );
  const data = await res.json();
  issues = data.data;
  renderCards(issues);
  issueCount.innerText = `${issues.length} Issues`;
}

async function openModal(issueId) {
  const res = await fetch(
    `https://phi-lab-server.vercel.app/api/v1/lab/issue/${issueId}`
  );
  const data = await res.json();
  const issue = data.data;
  modalTitle.textContent = issue.title;
  modalDesc.textContent = issue.description;
  modalStatus.textContent = issue.status;
  modalOpenedBy.textContent = "Opened by " + issue.created_by;
  modalDate.textContent = issue.created_at;
  
  let modalBadgesHtml = '';
  if (issue.labels && Array.isArray(issue.labels)) {
    issue.labels.forEach(label => {
      let bgColor = 'bg-gray-100';
      let textColor = 'text-gray-600';
      let iconSrc = '';
      const lowerLabel = label.toLowerCase();

      if (lowerLabel === 'bug') {
        bgColor = 'bg-[#FECACA]';
        textColor = 'text-red-600';
        iconSrc = 'assets/Vector.png';
      } else if (lowerLabel === 'help wanted') {
        bgColor = 'bg-[#FDE68A]';
        textColor = 'text-[#D97706]';
        iconSrc = 'assets/Vector (1).png';
      } else if (lowerLabel === 'enhancement') {
        bgColor = 'bg-[#BBF7D0]';
        textColor = 'text-[#00A96E]';
      }
      modalBadgesHtml += `
        <div class="${bgColor} inline-block px-[8px] py-1 rounded-3xl">
          <div class="flex items-center gap-1 text-xs">
            ${iconSrc ? `<img src="${iconSrc}" alt="">` : ''}
            <p class="font-medium ${textColor}">${label.toUpperCase()}</p>
          </div>
        </div>
      `;
    });
  }
  modalBadges.innerHTML = modalBadgesHtml;
  
  priority.textContent = issue.priority.toUpperCase();
  priority.classList.remove("bg-red-600", "bg-yellow-500", "bg-purple-500");
  if (issue.priority === "high") {
    priority.classList.add("bg-red-600");
  } else if (issue.priority === "medium") {
    priority.classList.add("bg-yellow-500");
  } else if (issue.priority === "low") {
    priority.classList.add("bg-purple-500");
  }
  if (modal.open) {
    modal.close();
  }
  modal.showModal();
}
function closeModal() {
  modal.close();
}