import { uploadMeme } from "../services/Supabase/StorageS";

export class UploadForm extends HTMLElement {
    private fileInput: HTMLInputElement;
    private uploadButton: HTMLButtonElement;
    private loadingIndicator: HTMLElement;
    private errorMessage: HTMLElement;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
        this.fileInput = this.shadowRoot!.querySelector('input[type="file"]')!;
        this.uploadButton = this.shadowRoot!.querySelector('button')!;
        this.loadingIndicator = this.shadowRoot!.querySelector('.loading-indicator')!;
        this.errorMessage = this.shadowRoot!.querySelector('.error-message')!;
        this.setupEventListeners();
    }

    private render(): void {
        this.shadowRoot!.innerHTML = `
            <style>
                .upload-section {
                    margin-bottom: 20px;
                    text-align: center;
                }
                h3 {
                color: #ff7e5f}

                button {
                    padding: 14px 28px;
                    background: linear-gradient(to right, #ff7e5f, #feb47b);
                    color: white;
                    border: none;
                    border-radius: 25px;
                    cursor: pointer;
                    font-size: 18px;
                    font-weight: bold;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                    transition: all 0.3s ease;
                }

                button:hover {
                    background: linear-gradient(to right, #2575fc, #6a11cb);
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
                }

                .loading-indicator {
                    display: none;
                    margin-top: 10px;
                    font-size: 14px;
                    color: #666;
                }

                .error-message {
                    display: none;
                    margin-top: 10px;
                    font-size: 14px;
                    color: #ff0000;
                }
            </style>
            <div class="upload-section">
            <h3> Choose as many documents to upload even in one go!!!</h3>
                <button>Upload Meme</button>
                <input type="file" accept="image/*,video/*" style="display: none;" multiple>
                <div class="loading-indicator">Uploading...</div>
                <div class="error-message"></div>
            </div>
        `;
    }

    private setupEventListeners(): void {
        this.uploadButton.addEventListener('click', () => {
            this.fileInput.click();
        });

        this.fileInput.addEventListener('change', async (event) => {
            const files = (event.target as HTMLInputElement).files;
            if (files && files.length > 0) {
                await this.handleFileUpload(files);
            }
        });
    }

    private async handleFileUpload(files: FileList): Promise<void> {
        this.setLoading(true);
        this.setError(null);
        try {
            // Convert FileList to array for easier iteration
            const fileArray = Array.from(files);

            // Process each file
            const uploadPromises = fileArray.map(async (file) => {
                try {
                    const uploadedMeme = await uploadMeme(file);
                    this.dispatchEvent(new CustomEvent('memeuploaded', {
                        detail: uploadedMeme,
                        bubbles: true,
                        composed: true,
                    }));
                } catch (error: any) {
                    console.error('Upload failed for file ' + file.name + ':', error);
                    // Optionally set a specific error message per file or collect errors
                    this.setError('Failed to upload ' + file.name + ': ' + (error.message || 'Unknown error'));
                }
            });

            // Wait for all uploads to complete
            await Promise.all(uploadPromises);

        } catch (error: any) {
            console.error('Overall upload process failed:', error);
            this.setError(error.message || 'An error occurred during upload.');
        } finally {
            this.setLoading(false);
            this.fileInput.value = ''; // Clear the input
        }
    }

    private setLoading(isLoading: boolean): void {
        this.loadingIndicator.style.display = isLoading ? 'block' : 'none';
        this.uploadButton.disabled = isLoading;
    }

    private setError(message: string | null): void {
        this.errorMessage.textContent = message || '';
        this.errorMessage.style.display = message ? 'block' : 'none';
    }
}

customElements.define('upload-form', UploadForm);
