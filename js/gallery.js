import { updateMapMarkers } from "./map.js";

//download images append images into gallery
export function initGallery() {
  const galleryElement = document.querySelector(".gallery");
  fetch("https://api.github.com/repos/cebreus/herman-homework/contents/content") //github repository provided be herman
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    if (!Array.isArray(data)) {
      throw new Error("Unexpected response format");
    }
      data
        .filter((file) => file.name.endsWith(".jpg"))
        .forEach((image) => {
          const img = document.createElement("img");
          img.dataset.src = image.download_url;
          img.alt = image.name;
          img.src = img.dataset.src;
          img.loading = "lazy";
          galleryElement.appendChild(img);
          galleryElement.appendChild(createSeparator());
        });
      updateMapMarkers; //first load of markers on map
      if (window.innerWidth < 600) {
        galleryElement.addEventListener("scroll", updateMapMarkers); //update markers on scrolling in gallery mobile version
      } else {
        document.addEventListener("scroll", updateMapMarkers); //update markers on scrolling in gallery
      }
    }) .catch((error) => {
      console.error("Error loading gallery content:", error);
    });;
}

//separator for clearer gallery(i didn't spend time to make it look 'pretty')
function createSeparator() {
  const hr = document.createElement("hr");
  hr.className = "separator";
  return hr;
}
