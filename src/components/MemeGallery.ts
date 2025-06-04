import { Meme } from "../utils/types/MemeTypes";
import { getMemes } from "../services/Supabase/StorageS";
import "./MemeCard"; // Import the MemeCard custom element
import "./UploadForm"; // Import the UploadForm custom element

export class MemeGallery extends HTMLElement {
    private galleryContainer!: HTMLElement;
    private loadingIndicator!: HTMLElement;
    private errorMessage!: HTMLElement;
    private memes: Meme[] = [];

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.renderSkeleton();
        this.initializeElements();
        this.setupEventListeners();
        this.loadMemes();
    }

    private renderSkeleton(): void {
        this.shadowRoot!.innerHTML = `
            <style>
                .gallery-container {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 20px;
                    padding: 20px 0;
                }

                .loading-indicator {
                    text-align: center;
                    padding: 20px;
                    font-size: 18px;
                    color: #666;
                }

                .error-message {
                    text-align: center;
                    padding: 20px;
                    color: #ff0000;
                    background-color: #ffe6e6;
                    border-radius: 4px;
                    margin: 10px 0;
                }
            </style>
            <upload-form></upload-form>
            <div class="loading-indicator">Loading memes...</div>
            <div class="error-message"></div>
            <div class="gallery-container"></div>
        `;
    }

    private initializeElements(): void {
        this.galleryContainer = this.shadowRoot!.querySelector('.gallery-container')!;
        this.loadingIndicator = this.shadowRoot!.querySelector('.loading-indicator')!;
        this.errorMessage = this.shadowRoot!.querySelector('.error-message')!;
    }
    
    private setupEventListeners(): void {
      this.shadowRoot!.addEventListener('memeuploaded', (event: Event) => {
        const customEvent = event as CustomEvent;
        const newMeme: Meme = customEvent.detail;
        this.addMemeToGallery(newMeme);
      });
    }

    private async loadMemes(): Promise<void> {
        this.setLoading(true);
        this.setError(null);
        try {
            this.memes = await getMemes();
            this.renderGallery();
        } catch (error: any) {
            console.error('Failed to load memes:', error);
            this.setError(error.message || 'An error occurred while loading memes.');
        } finally {
            this.setLoading(false);
        }
    }

    private renderGallery(): void {
        this.galleryContainer.innerHTML = ''; // Clear previous content
        // Sort memes by name (you might want to sort by upload date if available)
        const sortedMemes = [...this.memes].sort((a, b) => a.name.localeCompare(b.name));

        sortedMemes.forEach(meme => {
            const memeCard = document.createElement('meme-card') as any; // Use 'any' for now due to custom element typing
            memeCard.setMeme(meme);
            this.galleryContainer.appendChild(memeCard);
        });
    }
    
    private addMemeToGallery(meme: Meme): void {
      this.memes.unshift(meme); // Add new meme to the beginning
      this.renderGallery();
    }

    private setLoading(isLoading: boolean): void {
        this.loadingIndicator.style.display = isLoading ? 'block' : 'none';
    }

    private setError(message: string | null): void {
        this.errorMessage.textContent = message || '';
        this.errorMessage.style.display = message ? 'block' : 'none';
    }
}

customElements.define('meme-gallery', MemeGallery);
