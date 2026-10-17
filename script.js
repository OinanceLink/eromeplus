"use strict";

/*
 * EromePlus V1
 * Frontend demonstration only.
 *
 * Real accounts, uploads, database storage, and regional
 * restrictions require a secure backend.
 */

const sampleAlbums = [
  {
    id: 1,
    title: "Featured Photography Collection",
    creator: "EromePlus Editorial",
    category: "photos",
    featured: true,
    trending: true,
    image: "photo-1534528741775-53994a69daeb",
    description: "A curated portrait photography preview."
  },
  {
    id: 2,
    title: "Modern Portraits",
    creator: "Studio Preview",
    category: "photos",
    featured: true,
    trending: true,
    image: "photo-1524504388940-b1c1722653e1",
    description: "A sample portrait collection."
  },
  {
    id: 3,
    title: "Creative Fashion Gallery",
    creator: "Gallery Preview",
    category: "photos",
    featured: false,
    trending: true,
    image: "photo-1529139574466-a303027c1d8b",
    description: "A sample fashion photography gallery."
  },
  {
    id: 4,
    title: "Lifestyle Photography",
    creator: "Creator Preview",
    category: "photos",
    featured: false,
    trending: false,
    image: "photo-1515886657613-9f3515b0c78f",
    description: "A sample lifestyle collection."
  },
  {
    id: 5,
    title: "Artistic Portraits",
    creator: "Studio Preview",
    category: "photos",
    featured: false,
    trending: true,
    image: "photo-1506794778202-cad84cf45f1d",
    description: "A sample portrait photography collection."
  },
  {
    id: 6,
    title: "The Photography Edit",
    creator: "EromePlus Editorial",
    category: "photos",
    featured: false,
    trending: false,
    image: "photo-1531123897727-8f129e1688ce",
    description: "An editorial-style gallery preview."
  },
  {
    id: 7,
    title: "Urban Style Collection",
    creator: "Gallery Preview",
    category: "photos",
    featured: false,
    trending: true,
    image: "photo-1529139574466-a303027c1d8b",
    description: "A sample urban-style collection."
  },
  {
    id: 8,
    title: "Portraits in Focus",
    creator: "Studio Preview",
    category: "photos",
    featured: false,
    trending: false,
    image: "photo-1534528741775-53994a69daeb",
    description: "A sample portrait gallery."
  }
];

const featuredGrid = document.getElementById("featuredGrid");
const albumGrid = document.getElementById("albumGrid");
const searchInput = document.getElementById("searchInput");
const albumHeading = document.getElementById("albumHeading");
const albumDescription = document.getElementById("albumDescription");

const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");
const modalPrimary = document.getElementById("modalPrimary");
const modalSecondary = document.getElementById("modalSecondary");

let currentFilter = "all";
let currentQuery = "";
let activeAlbum = null;

document.getElementById("year").textContent =
  new Date().getFullYear();

/* IMAGE URL */

function imageURL(imageId) {
  return (
    "https://images.unsplash.com/" +
    imageId +
    "?auto=format&fit=crop&w=700&q=80"
  );
}

/* CREATE ALBUM CARD */

function createAlbumCard(album) {
  const card = document.createElement("article");
  card.className = "album";
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", "Open " + album.title);

  const cover = document.createElement("div");
  cover.className = "cover";

  const image = document.createElement("img");
  image.src = imageURL(album.image);
  image.alt = album.title;
  image.loading = "lazy";

  image.onerror = function () {
    image.style.display = "none";
    cover.style.background = "#252530";
  };

  const label = document.createElement("span");
  label.className = "cover-label";
  label.textContent = "PHOTO GALLERY";

  cover.append(image, label);

  const info = document.createElement("div");
  info.className = "album-info";

  const title = document.createElement("h3");
  title.className = "album-title";
  title.textContent = album.title;

  const creator = document.createElement("p");
  creator.className = "creator";
  creator.textContent = "By " + album.creator;

  const stats = document.createElement("div");
  stats.className = "album-stats";

  const type = document.createElement("span");
  type.textContent = "Photo album";

  const status = document.createElement("span");
  status.textContent = album.trending ? "Trending" : "Gallery";

  stats.append(type, status);
  info.append(title, creator, stats);
  card.append(cover, info);

  function openAlbum() {
    activeAlbum = album;

    showModal(
      album.title,
      album.description +
        "\n\nThis is a demonstration album. Real album pages " +
        "and media will be connected in a later version.",
      "Share album",
      true
    );
  }

  card.addEventListener("click", openAlbum);

  card.addEventListener("keydown", function (event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openAlbum();
    }
  });

  return card;
}

/* RENDER GALLERY */

function renderGrid(element, albums) {
  element.replaceChildren();

  if (albums.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = "No collections match your search.";

    element.appendChild(empty);
    return;
  }

  albums.forEach(function (album) {
    element.appendChild(createAlbumCard(album));
  });
}

/* FILTER ALBUMS */

function filteredAlbums() {
  return sampleAlbums.filter(function (album) {
    const searchableText =
      album.title + " " +
      album.creator + " " +
      album.category;

    const matchesSearch = searchableText
      .toLowerCase()
      .includes(currentQuery.toLowerCase());

    let matchesFilter = true;

    if (currentFilter === "trending") {
      matchesFilter = album.trending;
    } else if (currentFilter === "photos") {
      matchesFilter = album.category === "photos";
    } else if (currentFilter === "videos") {
      matchesFilter = album.category === "videos";
    }

    return matchesSearch && matchesFilter;
  });
}

/* UPDATE PAGE */

function render() {
  const featured = sampleAlbums.filter(function (album) {
    return album.featured;
  });

  renderGrid(featuredGrid, featured);
  renderGrid(albumGrid, filteredAlbums());

  if (currentQuery) {
    albumHeading.textContent = "Search results";
    albumDescription.textContent = "Results for: " + currentQuery;
  } else if (currentFilter === "trending") {
    albumHeading.textContent = "Trending collections";
    albumDescription.textContent = "Explore trending previews.";
  } else if (currentFilter === "recent") {
    albumHeading.textContent = "Recent collections";
    albumDescription.textContent =
      "Sample collections for the homepage demonstration.";
  } else if (currentFilter === "photos") {
    albumHeading.textContent = "Photo galleries";
    albumDescription.textContent = "Browse photo gallery previews.";
  } else if (currentFilter === "videos") {
    albumHeading.textContent = "Video collections";
    albumDescription.textContent =
      "Video collections will appear when the video feature is implemented.";
  } else {
    albumHeading.textContent = "Explore albums";
    albumDescription.textContent =
      "Browse the latest public collections.";
  }
}

/* MODAL */

function showModal(title, message, primaryText, shareMode) {
  modalTitle.textContent = title;
  modalText.textContent = message;
  modalPrimary.textContent = primaryText || "Continue";
  modal.classList.remove("hidden");

  modalPrimary.onclick = async function () {
    if (shareMode && activeAlbum) {
      if (navigator.share) {
        try {
          await navigator.share({
            title: activeAlbum.title,
            text: activeAlbum.description,
            url: window.location.href
          });
        } catch (error) {
          // The visitor cancelled sharing.
        }
      } else if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(
            window.location.href
          );

          modalText.textContent =
            "Page link copied. Individual album links " +
            "will be added in a later version.";
        } catch (error) {
          modalText.textContent =
            "Copying is unavailable. Copy the browser address manually.";
        }
      } else {
        modalText.textContent =
          "Copy the browser address to share this demonstration.";
      }
    } else {
      closeModal();
    }
  };
}

function closeModal() {
  modal.classList.add("hidden");
}

document.getElementById("closeModal").addEventListener(
  "click",
  closeModal
);

modalSecondary.addEventListener("click", closeModal);

modal.addEventListener("click", function (event) {
  if (event.target === modal) {
    closeModal();
  }
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeModal();
  }
});

/* SEARCH */

searchInput.addEventListener("input", function () {
  currentQuery = searchInput.value.trim();
  render();
});

/* NAVIGATION */

document.querySelectorAll("nav a").forEach(function (link) {
  link.addEventListener("click", function (event) {
    event.preventDefault();

    document.querySelectorAll("nav a").forEach(function (item) {
      item.classList.remove("active");
    });

    link.classList.add("active");
    currentFilter = link.dataset.filter;

    render();

    document.getElementById("albums").scrollIntoView({
      behavior: "smooth"
    });
  });
});

/* EXPLORE BUTTON */

document.getElementById("exploreBtn").addEventListener(
  "click",
  function () {
    document.getElementById("albums").scrollIntoView({
      behavior: "smooth"
    });
  }
);

/* LOGIN AND REGISTRATION DEMOS */

document.getElementById("signupBtn").addEventListener(
  "click",
  function () {
    showModal(
      "EromePlus registration",
      "Registration is not active in this prototype. The production " +
        "version will check regional eligibility on the server and " +
        "require appropriate age verification and acceptance of the rules.",
      "Understood",
      false
    );
  }
);

document.getElementById("loginBtn").addEventListener(
  "click",
  function () {
    showModal(
      "Log in to EromePlus",
      "Secure login will be connected after the authentication " +
        "backend is configured.",
      "Understood",
      false
    );
  }
);

/* FOOTER INFORMATION */

const footerMessages = {
  about:
    "EromePlus is an independent media-sharing platform concept.",

  rules:
    "The platform will prohibit illegal content, sexual content " +
    "involving minors, non-consensual intimate imagery, and content " +
    "uploaded without the necessary rights or consent.",

  privacy:
    "The production platform will publish a privacy policy explaining " +
    "account information, media storage, retention, and user rights.",

  report:
    "A reporting form and a process for reviewing and removing " +
    "prohibited content will be implemented before launch."
};

const footerLinks = [
  ["aboutLink", "About EromePlus", "about"],
  ["rulesLink", "Community rules", "rules"],
  ["privacyLink", "Privacy", "privacy"],
  ["reportLink", "Report content", "report"]
];

footerLinks.forEach(function (item) {
  document.getElementById(item[0]).addEventListener(
    "click",
    function (event) {
      event.preventDefault();

      showModal(
        item[1],
        footerMessages[item[2]],
        "Close",
        false
      );
    }
  );
});

/* INITIALIZE */

render();
