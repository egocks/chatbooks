import { supabase } from '../lib/supabase';
import { storageService, StorageBucket } from './storage.service';

export interface ManuscriptUploadResult {
  id: string;
  originalUrl: string;
  epubUrl?: string;
  metadata: ManuscriptMetadata;
}

export interface ManuscriptMetadata {
  title: string;
  author: string;
  description: string;
  wordCount: number;
  chapters: ChapterMetadata[];
  format: 'epub' | 'docx' | 'markdown';
}

export interface ChapterMetadata {
  title: string;
  content: string;
  wordCount: number;
  order: number;
}

class ManuscriptService {
  /**
   * Upload and process a manuscript file
   */
  async uploadManuscript(
    file: File,
    authorId: string,
    metadata?: Partial<ManuscriptMetadata>
  ): Promise<ManuscriptUploadResult> {
    try {
      // Validate file type
      const allowedTypes = [
        'application/epub+zip',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/markdown',
        'text/plain'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Unsupported file type. Please upload EPUB, DOCX, or Markdown files.');
      }

      // Upload original file to storage
      const originalPath = `${authorId}/${Date.now()}-${file.name}`;
      const originalUrl = await storageService.uploadFile(StorageBucket.Manuscripts, originalPath, file);

      // Process the file based on type
      let processedMetadata: ManuscriptMetadata;
      let epubUrl: string | undefined;

      if (file.type === 'application/epub+zip') {
        processedMetadata = await this.processEpubFile(file);
        epubUrl = originalUrl; // EPUB is already in the right format
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        processedMetadata = await this.processDocxFile(file);
        // In a real implementation, you would convert DOCX to EPUB here
        // For now, we'll use the original file
        epubUrl = originalUrl;
      } else {
        processedMetadata = await this.processMarkdownFile(file);
        // In a real implementation, you would convert Markdown to EPUB here
        epubUrl = originalUrl;
      }

      // Merge with provided metadata
      const finalMetadata = {
        ...processedMetadata,
        ...metadata,
      };

      return {
        id: `manuscript-${Date.now()}`,
        originalUrl,
        epubUrl,
        metadata: finalMetadata,
      };
    } catch (error) {
      console.error('Error uploading manuscript:', error);
      throw error;
    }
  }

  /**
   * Process EPUB file and extract metadata
   */
  private async processEpubFile(file: File): Promise<ManuscriptMetadata> {
    // In a real implementation, you would use a library like epub.js to parse the EPUB
    // For now, we'll return mock data based on the file
    return {
      title: file.name.replace('.epub', ''),
      author: 'Unknown Author',
      description: 'Imported from EPUB file',
      wordCount: 50000, // Estimated
      format: 'epub',
      chapters: [
        {
          title: 'Chapter 1',
          content: 'Content extracted from EPUB...',
          wordCount: 2500,
          order: 1,
        },
        {
          title: 'Chapter 2',
          content: 'Content extracted from EPUB...',
          wordCount: 2500,
          order: 2,
        },
      ],
    };
  }

  /**
   * Process DOCX file and extract metadata
   */
  private async processDocxFile(file: File): Promise<ManuscriptMetadata> {
    // In a real implementation, you would use a library like mammoth.js to parse DOCX
    // For now, we'll return mock data based on the file
    return {
      title: file.name.replace('.docx', ''),
      author: 'Unknown Author',
      description: 'Imported from Word document',
      wordCount: 45000, // Estimated
      format: 'docx',
      chapters: [
        {
          title: 'Chapter 1',
          content: 'Content extracted from DOCX...',
          wordCount: 2250,
          order: 1,
        },
        {
          title: 'Chapter 2',
          content: 'Content extracted from DOCX...',
          wordCount: 2250,
          order: 2,
        },
      ],
    };
  }

  /**
   * Process Markdown file and extract metadata
   */
  private async processMarkdownFile(file: File): Promise<ManuscriptMetadata> {
    try {
      const text = await file.text();
      const lines = text.split('\n');
      
      // Extract title from first heading
      const titleLine = lines.find(line => line.startsWith('# '));
      const title = titleLine ? titleLine.replace('# ', '') : file.name.replace('.md', '');
      
      // Extract chapters based on headings
      const chapters: ChapterMetadata[] = [];
      let currentChapter: Partial<ChapterMetadata> | null = null;
      let chapterContent: string[] = [];
      let order = 1;

      for (const line of lines) {
        if (line.startsWith('## ')) {
          // Save previous chapter
          if (currentChapter) {
            chapters.push({
              ...currentChapter,
              content: chapterContent.join('\n'),
              wordCount: chapterContent.join(' ').split(' ').length,
            } as ChapterMetadata);
          }
          
          // Start new chapter
          currentChapter = {
            title: line.replace('## ', ''),
            order: order++,
          };
          chapterContent = [];
        } else if (currentChapter) {
          chapterContent.push(line);
        }
      }

      // Save last chapter
      if (currentChapter) {
        chapters.push({
          ...currentChapter,
          content: chapterContent.join('\n'),
          wordCount: chapterContent.join(' ').split(' ').length,
        } as ChapterMetadata);
      }

      const wordCount = text.split(' ').length;

      return {
        title,
        author: 'Unknown Author',
        description: 'Imported from Markdown file',
        wordCount,
        format: 'markdown',
        chapters: chapters.length > 0 ? chapters : [
          {
            title: 'Chapter 1',
            content: text,
            wordCount,
            order: 1,
          },
        ],
      };
    } catch (error) {
      console.error('Error processing Markdown file:', error);
      throw error;
    }
  }

  /**
   * Convert manuscript to book and chapters in database
   */
  async createBookFromManuscript(
    manuscriptResult: ManuscriptUploadResult,
    authorId: string,
    additionalData?: {
      hasAudio?: boolean;
      hasChatEnabled?: boolean;
      tags?: string[];
    }
  ): Promise<string> {
    try {
      // Create book record
      const { data: book, error: bookError } = await supabase
        .from('books')
        .insert({
          title: manuscriptResult.metadata.title,
          author_id: authorId,
          description: manuscriptResult.metadata.description,
          has_audio: additionalData?.hasAudio || false,
          has_chat_enabled: additionalData?.hasChatEnabled || false,
          cover_url: null, // Will be set separately
        })
        .select()
        .single();

      if (bookError) throw bookError;

      // Create chapter records
      const chapterInserts = manuscriptResult.metadata.chapters.map(chapter => ({
        book_id: book.id,
        title: chapter.title,
        content: chapter.content,
        order_index: chapter.order,
        chat_enabled: additionalData?.hasChatEnabled || false,
        exclusive_chat: false,
      }));

      const { error: chaptersError } = await supabase
        .from('chapters')
        .insert(chapterInserts);

      if (chaptersError) throw chaptersError;

      // Create tags if provided
      if (additionalData?.tags && additionalData.tags.length > 0) {
        const tagInserts = additionalData.tags.map(tag => ({
          book_id: book.id,
          tag: tag.toLowerCase(),
        }));

        const { error: tagsError } = await supabase
          .from('book_tags')
          .insert(tagInserts);

        if (tagsError) console.error('Error creating tags:', tagsError);
      }

      return book.id;
    } catch (error) {
      console.error('Error creating book from manuscript:', error);
      throw error;
    }
  }
}

export const manuscriptService = new ManuscriptService();