import "../pages/GalleryPage"; // Import the GalleryPage custom element

export class Root extends HTMLElement {
  constructor() {
    super();
    console.log('Root component constructor called');
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  private render(): void {
    this.shadowRoot!.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: Arial, sans-serif;
          background-color: #f0f2f5;
        }

        .header {
            background-color: #ffffff;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-bottom: 30px;
            text-align: center;
        }

        .header h1 {
            margin: 0;
            color: #ff7e5f;
        }
      </style>
      <header class="header">
          <h1>MemeWall</h1>
      </header>
      <main>
          <gallery-page></gallery-page>
      </main>
    `;
  }
}

customElements.define('app-root', Root);
