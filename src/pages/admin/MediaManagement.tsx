import React, { useEffect, useState, useRef } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  InputAdornment,
  LinearProgress
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Image as ImageIcon,
  VideoLibrary as VideoIcon,
  Description as FileIcon,
  Folder as FolderIcon
} from '@mui/icons-material';
import { useStore } from '../../store/useStore';
import { format } from 'date-fns';

interface MediaFile {
  _id: string;
  fileName: string;
  originalName: string;
  fileType: 'image' | 'video' | 'document' | 'other';
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  category: 'banner' | 'logo' | 'game' | 'user' | 'general';
  uploadedBy: string;
  uploadedAt: string;
  description?: string;
  tags?: string[];
  isPublic: boolean;
  usageCount: number;
}

const MediaManagement: React.FC = () => {
  const { notification, api } = useStore();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [fileTypeFilter, setFileTypeFilter] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Upload form
  const [uploadForm, setUploadForm] = useState({
    category: 'general',
    description: '',
    tags: '',
    isPublic: true
  });

  useEffect(() => {
    loadMediaFiles();
  }, [currentPage, categoryFilter, fileTypeFilter]);

  const loadMediaFiles = async () => {
    try {
      setLoading(true);
      const response = await api.getAllMedia();
      if (response.success) {
        setMediaFiles(response.data || []);
      } else {
        setError('Failed to load media files');
      }
    } catch (err) {
      setError('Failed to load media files');
      console.error('Error loading media files:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      setUploadProgress(0);

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 200);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', uploadForm.category);
        formData.append('description', uploadForm.description);
        formData.append('tags', uploadForm.tags);
        formData.append('isPublic', uploadForm.isPublic.toString());

        const response = await api.uploadMedia(file);
        
        clearInterval(progressInterval);
        setUploadProgress(100);

        if (response.success) {
          notification.show(`File ${file.name} uploaded successfully`, 'success');
        } else {
          notification.show(`Failed to upload ${file.name}`, 'error');
        }
      }

      setUploadDialogOpen(false);
      setUploadForm({
        category: 'general',
        description: '',
        tags: '',
        isPublic: true
      });
      loadMediaFiles();
    } catch (err) {
      notification.show('Upload failed', 'error');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;

    try {
      const response = await api.deleteMedia(fileId);
      if (response.success) {
        notification.show('File deleted successfully', 'success');
        loadMediaFiles();
      } else {
        notification.show('Failed to delete file', 'error');
      }
    } catch (err) {
      notification.show('Failed to delete file', 'error');
    }
  };

  const handlePreviewFile = (file: MediaFile) => {
    setSelectedFile(file);
    setPreviewDialogOpen(true);
  };

  const handleDownloadFile = (file: MediaFile) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.originalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFileTypeIcon = (fileType: string) => {
    switch (fileType) {
      case 'image': return <ImageIcon />;
      case 'video': return <VideoIcon />;
      case 'document': return <FileIcon />;
      default: return <FileIcon />;
    }
  };

  const getFileTypeColor = (fileType: string) => {
    switch (fileType) {
      case 'image': return 'success';
      case 'video': return 'warning';
      case 'document': return 'info';
      default: return 'default';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'banner': return 'primary';
      case 'logo': return 'secondary';
      case 'game': return 'success';
      case 'user': return 'info';
      case 'general': return 'default';
      default: return 'default';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
  };

  const filteredFiles = mediaFiles.filter(file => {
    const matchesSearch = file.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (file.description && file.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !categoryFilter || file.category === categoryFilter;
    const matchesFileType = !fileTypeFilter || file.fileType === fileTypeFilter;
    
    return matchesSearch && matchesCategory && matchesFileType;
  });

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          <FolderIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
          Media Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage media files, uploads, and content organization
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Controls */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Search Files"
                placeholder="Search by name, description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  label="Category"
                >
                  <MenuItem value="">All Categories</MenuItem>
                  <MenuItem value="banner">Banner</MenuItem>
                  <MenuItem value="logo">Logo</MenuItem>
                  <MenuItem value="game">Game</MenuItem>
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="general">General</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={2}>
              <FormControl fullWidth>
                <InputLabel>File Type</InputLabel>
                <Select
                  value={fileTypeFilter}
                  onChange={(e) => setFileTypeFilter(e.target.value)}
                  label="File Type"
                >
                  <MenuItem value="">All Types</MenuItem>
                  <MenuItem value="image">Image</MenuItem>
                  <MenuItem value="video">Video</MenuItem>
                  <MenuItem value="document">Document</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button
                variant="contained"
                startIcon={<UploadIcon />}
                onClick={() => setUploadDialogOpen(true)}
                fullWidth
              >
                Upload
              </Button>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={loadMediaFiles}
                fullWidth
              >
                Refresh
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Media Files */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">
              Media Files ({filteredFiles.length})
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant={viewMode === 'grid' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => setViewMode('grid')}
              >
                Grid
              </Button>
              <Button
                variant={viewMode === 'table' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => setViewMode('table')}
              >
                Table
              </Button>
            </Box>
          </Box>

          {viewMode === 'grid' ? (
            <ImageList cols={4} gap={16}>
              {filteredFiles.map((file) => (
                <ImageListItem key={file._id} sx={{ cursor: 'pointer' }}>
                  <img
                    src={file.thumbnailUrl || file.url}
                    alt={file.fileName}
                    loading="lazy"
                    style={{ height: 200, objectFit: 'cover' }}
                    onClick={() => handlePreviewFile(file)}
                  />
                  <ImageListItemBar
                    title={file.fileName}
                    subtitle={
                      <Box>
                        <Typography variant="caption" display="block">
                          {formatFileSize(file.size)}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                          <Chip
                            label={file.category}
                            color={getCategoryColor(file.category) as any}
                            size="small"
                          />
                          <Chip
                            label={file.fileType}
                            color={getFileTypeColor(file.fileType) as any}
                            size="small"
                          />
                        </Box>
                      </Box>
                    }
                    actionIcon={
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Download">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadFile(file);
                            }}
                          >
                            <DownloadIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteFile(file._id);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    }
                  />
                </ImageListItem>
              ))}
            </ImageList>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>File</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Size</TableCell>
                    <TableCell>Uploaded</TableCell>
                    <TableCell>Usage</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredFiles.map((file) => (
                    <TableRow key={file._id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <img
                            src={file.thumbnailUrl || file.url}
                            alt={file.fileName}
                            style={{ width: 40, height: 40, objectFit: 'cover', marginRight: 12 }}
                          />
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {file.fileName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {file.originalName}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getFileTypeIcon(file.fileType)}
                          label={file.fileType}
                          color={getFileTypeColor(file.fileType) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={file.category}
                          color={getCategoryColor(file.category) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{formatFileSize(file.size)}</TableCell>
                      <TableCell>{formatDate(file.uploadedAt)}</TableCell>
                      <TableCell>{file.usageCount}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Preview">
                            <IconButton
                              size="small"
                              onClick={() => handlePreviewFile(file)}
                            >
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Download">
                            <IconButton
                              size="small"
                              onClick={() => handleDownloadFile(file)}
                            >
                              <DownloadIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteFile(file._id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {filteredFiles.length === 0 && (
            <Box textAlign="center" py={4}>
              <Typography color="text.secondary">
                No media files found
              </Typography>
            </Box>
          )}

          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={3}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(e, page) => setCurrentPage(page)}
                color="primary"
              />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6">
            Upload Media Files
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*,.pdf,.doc,.docx"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
            <Button
              variant="outlined"
              startIcon={<UploadIcon />}
              onClick={() => fileInputRef.current?.click()}
              fullWidth
              sx={{ py: 3 }}
            >
              Choose Files to Upload
            </Button>
          </Box>

          {uploading && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" gutterBottom>
                Uploading... {uploadProgress}%
              </Typography>
              <LinearProgress variant="determinate" value={uploadProgress} />
            </Box>
          )}

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={uploadForm.category}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, category: e.target.value }))}
                  label="Category"
                >
                  <MenuItem value="banner">Banner</MenuItem>
                  <MenuItem value="logo">Logo</MenuItem>
                  <MenuItem value="game">Game</MenuItem>
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="general">General</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={uploadForm.description}
                onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tags (comma separated)"
                value={uploadForm.tags}
                onChange={(e) => setUploadForm(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="tag1, tag2, tag3"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog
        open={previewDialogOpen}
        onClose={() => setPreviewDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6">
            {selectedFile?.fileName}
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedFile && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                {selectedFile.fileType === 'image' ? (
                  <img
                    src={selectedFile.url}
                    alt={selectedFile.fileName}
                    style={{ width: '100%', height: 'auto', maxHeight: '500px', objectFit: 'contain' }}
                  />
                ) : selectedFile.fileType === 'video' ? (
                  <video
                    controls
                    style={{ width: '100%', maxHeight: '500px' }}
                  >
                    <source src={selectedFile.url} type={selectedFile.mimeType} />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <Box sx={{ p: 4, textAlign: 'center', bgcolor: 'grey.100' }}>
                    <FileIcon sx={{ fontSize: 64, color: 'text.secondary' }} />
                    <Typography variant="h6" color="text.secondary">
                      Preview not available for this file type
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<DownloadIcon />}
                      onClick={() => handleDownloadFile(selectedFile)}
                      sx={{ mt: 2 }}
                    >
                      Download File
                    </Button>
                  </Box>
                )}
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>
                  File Details
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Original Name
                  </Typography>
                  <Typography variant="body2">{selectedFile.originalName}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    File Type
                  </Typography>
                  <Chip
                    icon={getFileTypeIcon(selectedFile.fileType)}
                    label={selectedFile.fileType}
                    color={getFileTypeColor(selectedFile.fileType) as any}
                    size="small"
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Size
                  </Typography>
                  <Typography variant="body2">{formatFileSize(selectedFile.size)}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Category
                  </Typography>
                  <Chip
                    label={selectedFile.category}
                    color={getCategoryColor(selectedFile.category) as any}
                    size="small"
                  />
                </Box>
                {selectedFile.description && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Description
                    </Typography>
                    <Typography variant="body2">{selectedFile.description}</Typography>
                  </Box>
                )}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Uploaded
                  </Typography>
                  <Typography variant="body2">{formatDate(selectedFile.uploadedAt)}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Usage Count
                  </Typography>
                  <Typography variant="body2">{selectedFile.usageCount}</Typography>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialogOpen(false)}>
            Close
          </Button>
          {selectedFile && (
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={() => handleDownloadFile(selectedFile)}
            >
              Download
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MediaManagement; 