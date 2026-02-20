import { DocumentUpload } from "./components/document-upload";

export function DocumentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Document Analysis</h2>
        <p className="text-muted-foreground">
          Upload documents to get AI-powered summaries and study materials
        </p>
      </div>

      <DocumentUpload />
    </div>
  );
}
