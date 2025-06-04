import { Meme } from "../utils/types/MemeTypes";

export class MemeCard extends HTMLElement {
  private memeData: Meme | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  // Define observed attributes for data changes
  static get observedAttributes() {
    return ['meme-data'];
  }

  // Handle attribute changes
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === 'meme-data') {
      try {
        this.memeData = JSON.parse(newValue);
        this.render();
      } catch (e) {
        console.error('Failed to parse meme-data attribute:', e);
        this.memeData = null;
        this.render(); // Render empty or error state
      }
    }
  }

  // Set meme data programmatically
  setMeme(meme: Meme) {
    this.memeData = meme;
    this.render();
  }

  private render(): void {
    if (!this.memeData) {
      this.shadowRoot!.innerHTML = ''; // Clear if no data
      return;
    }

    const { name, url, type } = this.memeData;

    this.shadowRoot!.innerHTML = `
            <style>
                .meme-item {
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    display: flex;
                    flex-direction: column;
                }

                .media-container {
                  flex-grow: 1;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  background-color: #eee;
                }

                .media-container img,
                .media-container video {
                    display: block;
                    max-width: 100%;
                    max-height: 300px; /* Limit height for consistent cards */
                    object-fit: contain; /* Ensure media is contained */
                }

                .meme-info {
                    padding: 10px;
                    background-color: #f8f8f8;
                    text-align: center;
                    word-break: break-word; /* Prevent long names from overflowing */
                }
            </style>
            <div class="meme-item">
                <div class="media-container">
                    ${type === 'video' 
                        ? `<video controls src="${url}"></video>`
                        : `<img src="${url}" alt="${name}">`}
                </div>
                <div class="meme-info">${name}</div>
            </div>
        `;
  }
}

customElements.define('meme-card', MemeCard);
