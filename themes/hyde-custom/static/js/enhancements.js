var filterType = "";

function setEnabled(id, enabled) {
  if (enabled) {
    $(id).removeClass("grid-filter-disabled").addClass("grid-filter-enabled");
  } else {
    $(id).removeClass("grid-filter-enabled").addClass("grid-filter-disabled");
  }
}

function updateGridFilter(newFilter) {
  filterType = newFilter;

  // enable/disable buttons
  setEnabled("#software-experience-filter", filterType === "" || filterType === "software");
  setEnabled("#ml-experience-filter",       filterType === "" || filterType === "ml");
  setEnabled("#hardware-experience-filter", filterType === "" || filterType === "hardware");
  setEnabled("#educational-experience-filter", filterType === "" || filterType === "educational");
  setEnabled("#professional-experience-filter", filterType === "" || filterType === "professional");

  // grid classes
  $("#filterable-grid")
    .removeClass("grid-show-all grid-show-software grid-show-ml grid-show-hardware grid-show-educational grid-show-professional");

  if (filterType === "") {
    $("#filterable-grid").addClass("grid-show-all");
    $("#clear-experience-filter").hide();
  } else {
    $("#filterable-grid").addClass("grid-show-" + filterType);
    $("#clear-experience-filter").show();
  }
}

$(function () {
  updateGridFilter("");

  $("#clear-experience-filter").click(function () {
    updateGridFilter("");
  });

  $("#software-experience-filter").click(function () {
    updateGridFilter(filterType === "software" ? "" : "software");
  });

  $("#ml-experience-filter").click(function () {
    updateGridFilter(filterType === "ml" ? "" : "ml");
  });

  $("#hardware-experience-filter").click(function () {
    updateGridFilter(filterType === "hardware" ? "" : "hardware");
  });

  $("#educational-experience-filter").click(function () {
    updateGridFilter(filterType === "educational" ? "" : "educational");
  });

  $("#professional-experience-filter").click(function () {
    updateGridFilter(filterType === "professional" ? "" : "professional");
  });
});