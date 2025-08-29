# Metadata Integration Documentation

## Overview

The metadata integration feature connects your Weez AI application with a Python Flask service that processes files from connected platforms and generates AI-powered searchable metadata. This enables natural language search across all your documents.

## Architecture

### Frontend Components

1. **ConnectivityPanel** (`src/components/ConnectivityPanel.tsx`)
   - Handles platform connections (Google Drive, OneDrive, Dropbox, etc.)
   - Integrates metadata generation when platforms are connected
   - Shows real-time progress of metadata processing

2. **MetadataService** (`src/services/metadataService.ts`)
   - TypeScript service for communicating with the Python Flask API
   - Handles all metadata-related API calls
   - Provides progress tracking and error handling

3. **DemoShowcase** (`src/components/DemoShowcase.tsx`)
   - Updated to remove test components
   - Focuses on core demo functionality
   - Clean interface without metadata test panels

### Backend Service

The Python Flask service (`FileMetadataGenerator`) provides:

- **File Processing**: Extracts text from PDF, DOCX, XLSX, PPTX, and TXT files
- **AI Embeddings**: Generates embeddings using Azure OpenAI's text-embedding-3-large
- **Chunking**: Splits large documents into searchable chunks with overlap
- **RBAC Support**: Role-based access control with department and visibility settings
- **Progress Tracking**: Real-time progress updates during processing

## API Endpoints

### Health Check
```
GET /health
```

### Processing Statistics
```
GET /processing-stats?user_id={user_id}
```

### Process Metadata
```
POST /process-metadata
{
  "user_id": "user@example.com",
  "batch_size": 10
}
```

### Process Single File
```
POST /process-single-file
{
  "file_id": "file_id",
  "user_id": "user@example.com"
}
```

### Reprocess File
```
POST /reprocess-file
{
  "file_id": "file_id",
  "user_id": "user@example.com"
}
```

### Delete Chunks
```
DELETE /delete-chunks
{
  "file_id": "file_id",
  "user_id": "user@example.com"
}
```

## Integration Flow

1. **User connects a platform** (Google Drive, OneDrive, etc.)
2. **Platform sync occurs** - files are transferred to Azure Blob Storage
3. **Metadata generation starts** - automatically triggered after successful connection
4. **Progress tracking** - real-time updates shown in the UI
5. **Search capability** - processed files become searchable via natural language

## Features

### Supported File Types
- PDF (.pdf)
- Microsoft Word (.docx, .doc)
- Microsoft Excel (.xlsx, .xls)
- Microsoft PowerPoint (.pptx, .ppt)
- Text files (.txt)

### AI Capabilities
- **Text Extraction**: Preserves document structure and formatting
- **Embedding Generation**: Uses Azure OpenAI for high-quality embeddings
- **Chunking**: Intelligent text splitting with sentence boundary detection
- **Summarization**: AI-generated document summaries
- **RBAC**: Department-based access control and visibility settings

### Progress Tracking
- Real-time progress bars
- File count updates
- Processing statistics
- Error handling and recovery

## Usage

### For Users

1. **Connect Platforms**: Use the Connectivity Panel to connect your cloud storage platforms
2. **Automatic Processing**: Metadata generation starts automatically after connection
3. **Monitor Progress**: Watch the progress bar to see processing status
4. **Search Files**: Use natural language to search across all processed files

### For Developers

1. **Monitor Service**: Check the health endpoint for service status
2. **Debug Issues**: Use browser console for detailed logging
3. **Custom Integration**: Extend the MetadataService for additional functionality
4. **Manual Processing**: Use the manual processing button in ConnectivityPanel

## Configuration

### Environment Variables

The Python service requires these environment variables:

```bash
AZURE_STORAGE_CONNECTION_STRING_1=your_azure_storage_connection_string
COSMOS_ENDPOINT=your_cosmos_db_endpoint
COSMOS_KEY=your_cosmos_db_key
OPENAI_API_KEY=your_openai_api_key
```

### Service URLs

- **Platform Connection API**: `https://platform-connection-api-g0b5c3fve2dfb2ag.canadacentral-01.azurewebsites.net`
- **Metadata Service**: `https://generate-metadata-cffyg9hva0hugyb4.canadacentral-01.azurewebsites.net`

## Error Handling

The integration includes comprehensive error handling:

- **Network Errors**: Automatic retry with exponential backoff
- **Service Errors**: Graceful degradation with user notifications
- **File Processing Errors**: Individual file error tracking
- **Progress Recovery**: Resume processing from last successful state

## Security

- **Encrypted Transmission**: All API calls use HTTPS
- **RBAC**: Role-based access control for file access
- **SAS URLs**: Secure access to Azure Blob Storage
- **User Isolation**: Data is isolated per user

## Performance

- **Batch Processing**: Files are processed in configurable batches
- **Progress Polling**: Efficient polling with configurable intervals
- **Chunking**: Optimized text chunking for embedding generation
- **Caching**: Metadata is cached in Cosmos DB for fast retrieval

## Troubleshooting

### Common Issues

1. **Service Unavailable**: Check the health endpoint
2. **Processing Stuck**: Use manual processing button to restart
3. **File Not Found**: Verify platform connection and file sync
4. **Authentication Errors**: Check user authentication status

### Debug Steps

1. Check browser console for error messages
2. Verify service health endpoints
3. Use manual processing button in ConnectivityPanel
4. Check network connectivity to Azure services

## Future Enhancements

- **Real-time Processing**: WebSocket-based real-time updates
- **Advanced Search**: Semantic search with context awareness
- **File Versioning**: Support for file version history
- **Bulk Operations**: Batch file operations and management
- **Analytics**: Processing statistics and usage analytics
