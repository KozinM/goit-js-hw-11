export { createGallery };
export { cleanGallery };

function createGallery(images, galleryElement) {
 //console.log(images);
  const markupString = images
    .map(image => {
      const {
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = image;
      return `<a class="gallery__item--link" href="${largeImageURL}"><div class="photo-card gallery__item">
        <img class="gallery__item--img" src="${webformatURL}" alt="${tags}" loading="lazy" />
        <div class="info">
          <p class="info-item">
            <b>Likes</b>${likes}
          </p>
          <p class="info-item">
            <b>Views</b>${views}
          </p>
          <p class="info-item">
            <b>Comments</b>${comments}
          </p>
          <p class="info-item">
            <b>Downloads</b>${downloads}
          </p>
        </div>
      </div></a>`;
    })
    .join('');
  galleryElement.insertAdjacentHTML('beforeend', markupString);
}
function cleanGallery(galleryElement) {
  galleryElement.innerHTML = '';
}
