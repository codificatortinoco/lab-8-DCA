import "../components/MemeGallery"; // Import the MemeGallery custom element

export class GalleryPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  private render(): void {
    this.shadowRoot!.innerHTML = `
      <style>
        .gallery-page {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }
     
      </style>
      <div class="gallery-page">
        <meme-gallery></meme-gallery>
      </div>
    `;
  }
}

customElements.define('gallery-page', GalleryPage);
