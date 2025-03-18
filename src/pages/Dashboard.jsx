import { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Button, 
  AppBar, 
  Toolbar, 
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Chip,
  Tooltip,
  Snackbar,
  Alert,
  Grid,
  TextField,
  MenuItem,
  InputAdornment,
  Collapse,
  FormControl,
  InputLabel,
  Select,
  Divider
} from '@mui/material';
import { 
  Delete as DeleteIcon, 
  Download as DownloadIcon,
  CloudUpload as CloudUploadIcon,
  Refresh as RefreshIcon,
  FolderOpen as FolderIcon,
  FilterList as FilterListIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  SortByAlpha as SortIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import authService from '../services/authService';
import { fileService } from '../services/fileService';
import { API_BASE_URL } from '../services/api.config';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fileLoading, setFileLoading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, fileId: null, fileName: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const fileInputRef = useRef(null);
  
  // Filter states
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    fileName: '',
    username: '',
    company: '',
    fileType: '',
    dateFrom: '',
    dateTo: '',
    minSize: '',
    maxSize: '',
    sortBy: 'date',
    order: 'desc'
  });
  const [contentTypes, setContentTypes] = useState([]);

  const [versionsDialog, setVersionsDialog] = useState({ open: false, fileId: null, fileName: '' });
  const [fileVersions, setFileVersions] = useState([]);
  const [versionLoading, setVersionLoading] = useState(false);

  useEffect(() => {
    fetchUserData();
    fetchFiles();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const userData = await authService.getMe(token);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error fetching user data:', error);
      showSnackbar('Failed to load user information', 'error');
    }
  };

  const fetchFiles = async () => {
    try {
      setFileLoading(true);
      const token = localStorage.getItem('token');
      
      // Build query string from filters
      const queryParams = new URLSearchParams();
      
      if (filters.fileName) queryParams.append('fileName', filters.fileName);
      if (filters.username) queryParams.append('username', filters.username);
      if (filters.company) queryParams.append('company', filters.company);
      if (filters.fileType) queryParams.append('fileType', filters.fileType);
      if (filters.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) queryParams.append('dateTo', filters.dateTo);
      if (filters.minSize) queryParams.append('minSize', filters.minSize);
      if (filters.maxSize) queryParams.append('maxSize', filters.maxSize);
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
      if (filters.order) queryParams.append('order', filters.order);
      
      const queryString = queryParams.toString();
      const url = `${API_BASE_URL}/files${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch files');
      }

      const filesData = await response.json();
      setFiles(filesData.data || []);
      
      // Extract unique content types for filter dropdown
      if (filesData.data && filesData.data.length > 0) {
        const types = [...new Set(filesData.data.map(file => file.contentType))];
        setContentTypes(types);
      }
      
      setLoading(false);
      setFileLoading(false);
    } catch (error) {
      console.error('Error fetching files:', error);
      showSnackbar('Failed to load files', 'error');
      setLoading(false);
      setFileLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = () => {
    fetchFiles();
  };

  const resetFilters = () => {
    setFilters({
      fileName: '',
      username: '',
      company: '',
      fileType: '',
      dateFrom: '',
      dateTo: '',
      minSize: '',
      maxSize: '',
      sortBy: 'date',
      order: 'desc'
    });
    // Fetch files with reset filters
    setTimeout(fetchFiles, 0);
  };

  const handleDeleteFile = async (fileId) => {
    try {
      await fileService.deleteFile(fileId);
      setFiles(files.filter(file => file.id !== fileId));
      showSnackbar('File deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting file:', error);
      showSnackbar('Failed to delete file', 'error');
    } finally {
      setDeleteDialog({ open: false, fileId: null, fileName: '' });
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setFileLoading(true);
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/files/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      fetchFiles();
      showSnackbar('File uploaded successfully', 'success');
    } catch (error) {
      console.error('Error uploading file:', error);
      showSnackbar('Failed to upload file', 'error');
      setFileLoading(false);
    }
  };

  const handleDownload = (fileId) => {
    const downloadUrl = `${API_BASE_URL}/files/download/${fileId}`;
    window.open(downloadUrl, '_blank');
  };

  const showDeleteDialog = (fileId, fileName) => {
    setDeleteDialog({ open: true, fileId, fileName });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, fileId: null, fileName: '' });
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileTypeIcon = (contentType) => {
    if (contentType.startsWith('image/')) {
      return '🖼️';
    } else if (contentType.includes('pdf')) {
      return '📄';
    } else if (contentType.includes('word')) {
      return '📝';
    } else if (contentType.includes('spreadsheet') || contentType.includes('excel')) {
      return '📊';
    } else if (contentType.includes('presentation') || contentType.includes('powerpoint')) {
      return '📽️';
    } else {
      return '📁';
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM dd, yyyy h:mm a');
    } catch (_) {
      return dateString;
    }
  };

  const getFileTypeLabel = (contentType) => {
    if (contentType.startsWith('image/')) {
      return 'Image';
    } else if (contentType.includes('pdf')) {
      return 'PDF Document';
    } else if (contentType.includes('word')) {
      return 'Word Document';
    } else if (contentType.includes('spreadsheet') || contentType.includes('excel')) {
      return 'Spreadsheet';
    } else if (contentType.includes('presentation') || contentType.includes('powerpoint')) {
      return 'Presentation';
    } else {
      return contentType;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const handleVersionUpload = async (event, fileId) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setVersionLoading(true);
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/files/upload/version/${fileId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload version');
      }

      await fetchFileVersions(fileId);
      showSnackbar('Nueva versión subida exitosamente', 'success');
    } catch (error) {
      console.error('Error uploading version:', error);
      showSnackbar('Error al subir la nueva versión', 'error');
    } finally {
      setVersionLoading(false);
    }
  };

  const fetchFileVersions = async (fileId) => {
    try {
      setVersionLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/files/versions/${fileId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch versions');
      }

      const data = await response.json();
      setFileVersions(data.data || []);
    } catch (error) {
      console.error('Error fetching versions:', error);
      showSnackbar('Error al obtener las versiones del archivo', 'error');
    } finally {
      setVersionLoading(false);
    }
  };

  const showVersionsDialog = async (fileId, fileName) => {
    setVersionsDialog({ open: true, fileId, fileName });
    await fetchFileVersions(fileId);
  };

  const closeVersionsDialog = () => {
    setVersionsDialog({ open: false, fileId: null, fileName: '' });
    setFileVersions([]);
  };

  const isImage = (contentType) => {
    return contentType.startsWith('image/');
  };

  const getPreviewUrl = (fileId) => {
    return `${API_BASE_URL}/files/download/${fileId}`;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f5f7fa' }}>
      <AppBar position="static" sx={{ bgcolor: '#0073bb' }}>
        <Toolbar>
          <FolderIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Cloud File System
          </Typography>
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Chip 
                label={`${user.username} | ${user.company}`}
                color="primary"
                variant="outlined"
                sx={{ 
                  mr: 2, 
                  color: 'white', 
                  borderColor: 'rgba(255,255,255,0.5)',
                  '& .MuiChip-label': { fontWeight: 500 }
                }}
              />
              <Button 
                color="inherit" 
                onClick={logout}
                sx={{ 
                  borderRadius: '4px',
                  borderColor: 'white',
                  border: '1px solid',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                }}
              >
                Logout
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Container component="main" maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Paper elevation={0} sx={{ p: 3, borderRadius: '10px', mb: 4, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h4" gutterBottom sx={{ color: '#0073bb', fontWeight: '600' }}>
                Welcome to Your Cloud Storage
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Manage all your files securely in one place. Upload, download, and organize your documents with ease.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
              <Button
                variant="contained"
                startIcon={<CloudUploadIcon />}
                onClick={() => fileInputRef.current.click()}
                sx={{ 
                  bgcolor: '#0073bb', 
                  fontWeight: 500,
                  mr: 1,
                  '&:hover': { bgcolor: '#005b94' }
                }}
                disabled={fileLoading}
              >
                Upload File
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={fetchFiles}
                disabled={fileLoading}
                sx={{ 
                  borderColor: '#0073bb', 
                  color: '#0073bb',
                  '&:hover': { borderColor: '#005b94', bgcolor: 'rgba(0,115,187,0.05)' }
                }}
              >
                Refresh
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Filters Panel */}
        <Paper elevation={0} sx={{ borderRadius: '10px', mb: 3, overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <Box 
            sx={{ 
              p: 2, 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              bgcolor: '#f0f4f8', 
              borderBottom: filtersOpen ? '1px solid #e0e0e0' : 'none',
              cursor: 'pointer'
            }}
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <FilterListIcon sx={{ mr: 1, color: '#0073bb' }} />
              <Typography variant="h6">
                Filter Files
              </Typography>
            </Box>
            {filtersOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </Box>
          
          <Collapse in={filtersOpen}>
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <TextField
                    fullWidth
                    label="File Name"
                    name="fileName"
                    value={filters.fileName}
                    onChange={handleFilterChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                    size="small"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <TextField
                    fullWidth
                    label="Uploader Username"
                    name="username"
                    value={filters.username}
                    onChange={handleFilterChange}
                    size="small"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <TextField
                    fullWidth
                    label="Company"
                    name="company"
                    value={filters.company}
                    onChange={handleFilterChange}
                    size="small"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>File Type</InputLabel>
                    <Select
                      name="fileType"
                      value={filters.fileType}
                      onChange={handleFilterChange}
                      label="File Type"
                    >
                      <MenuItem value="">All Types</MenuItem>
                      {contentTypes.map((type, index) => (
                        <MenuItem key={index} value={type}>
                          {getFileTypeIcon(type)} {getFileTypeLabel(type)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="From Date"
                    name="dateFrom"
                    type="date"
                    value={filters.dateFrom}
                    onChange={handleFilterChange}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="To Date"
                    name="dateTo"
                    type="date"
                    value={filters.dateTo}
                    onChange={handleFilterChange}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Min Size (bytes)"
                    name="minSize"
                    type="number"
                    value={filters.minSize}
                    onChange={handleFilterChange}
                    size="small"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Max Size (bytes)"
                    name="maxSize"
                    type="number"
                    value={filters.maxSize}
                    onChange={handleFilterChange}
                    size="small"
                  />
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 3, mb: 1 }}>
                <Divider />
              </Box>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Sort By</InputLabel>
                    <Select
                      name="sortBy"
                      value={filters.sortBy}
                      onChange={handleFilterChange}
                      label="Sort By"
                      startAdornment={
                        <InputAdornment position="start">
                          <SortIcon fontSize="small" />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="date">Upload Date</MenuItem>
                      <MenuItem value="size">File Size</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Order</InputLabel>
                    <Select
                      name="order"
                      value={filters.order}
                      onChange={handleFilterChange}
                      label="Order"
                    >
                      <MenuItem value="asc">Ascending</MenuItem>
                      <MenuItem value="desc">Descending</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  variant="outlined" 
                  onClick={resetFilters}
                  startIcon={<ClearIcon />}
                  sx={{ mr: 2 }}
                >
                  Reset Filters
                </Button>
                <Button 
                  variant="contained" 
                  onClick={applyFilters}
                  startIcon={<FilterListIcon />}
                  sx={{ bgcolor: '#0073bb', '&:hover': { bgcolor: '#005b94' } }}
                >
                  Apply Filters
                </Button>
              </Box>
            </Box>
          </Collapse>
        </Paper>

        <Paper elevation={0} sx={{ borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <Typography variant="h6" sx={{ p: 2, bgcolor: '#f0f4f8', borderBottom: '1px solid #e0e0e0' }}>
            Your Files
          </Typography>
          
          {fileLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress size={40} />
            </Box>
          ) : files.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body1" color="textSecondary">
                No files found matching your criteria. Try adjusting your filters or upload a new file.
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: '#f9f9f9' }}>
                  <TableRow>
                    <TableCell width="40%">File Name</TableCell>
                    <TableCell width="15%">Size</TableCell>
                    <TableCell width="20%">Uploaded By</TableCell>
                    <TableCell width="15%">Upload Date</TableCell>
                    <TableCell width="10%" align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {files.map((file) => (
                    <TableRow key={file.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          {isImage(file.contentType) ? (
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                borderRadius: 1,
                                overflow: 'hidden',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: '#f5f5f5',
                                border: '1px solid #e0e0e0'
                              }}
                            >
                              <img
                                src={getPreviewUrl(file.id)}
                                alt={file.fileName}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover'
                                }}
                              />
                            </Box>
                          ) : (
                            <Typography sx={{ fontSize: '20px' }}>
                              {getFileTypeIcon(file.contentType)}
                            </Typography>
                          )}
                          <Tooltip title={file.fileName} arrow>
                            <Typography sx={{ 
                              maxWidth: '240px', 
                              overflow: 'hidden', 
                              textOverflow: 'ellipsis', 
                              whiteSpace: 'nowrap' 
                            }}>
                              {file.fileName}
                            </Typography>
                          </Tooltip>
                        </Box>
                      </TableCell>
                      <TableCell>{formatFileSize(file.fileSize)}</TableCell>
                      <TableCell>{file.uploaderUsername}</TableCell>
                      <TableCell>{formatDate(file.uploadDate)}</TableCell>
                      <TableCell align="center">
                        <Tooltip title="Versiones">
                          <IconButton 
                            size="small" 
                            onClick={() => showVersionsDialog(file.fileId, file.fileName)}
                            sx={{ color: '#0073bb' }}
                          >
                            <HistoryIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Descargar">
                          <IconButton 
                            size="small" 
                            onClick={() => handleDownload(file.id)}
                            sx={{ color: '#0073bb' }}
                          >
                            <DownloadIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton 
                            size="small" 
                            onClick={() => showDeleteDialog(file.id, file.fileName)}
                            sx={{ color: '#d32f2f' }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Container>

      <Box 
        component="footer" 
        sx={{ 
          py: 2, 
          px: 2, 
          mt: 'auto', 
          bgcolor: 'white',
          borderTop: '1px solid #e0e0e0'
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Cloud File System. All rights reserved.
          </Typography>
        </Container>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={closeDeleteDialog}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{deleteDialog.fileName}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={() => handleDeleteFile(deleteDialog.fileId)} 
            color="error" 
            variant="contained"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Versions Dialog */}
      <Dialog
        open={versionsDialog.open}
        onClose={closeVersionsDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <HistoryIcon />
            Versiones de {versionsDialog.fileName}
          </Box>
        </DialogTitle>
        <DialogContent>
          {versionLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : fileVersions.length === 0 ? (
            <Typography color="textSecondary" align="center" sx={{ py: 4 }}>
              No hay versiones disponibles para este archivo
            </Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Vista Previa</TableCell>
                  <TableCell>Versión</TableCell>
                  <TableCell>Tamaño</TableCell>
                  <TableCell>Fecha de subida</TableCell>
                  <TableCell>Subido por</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fileVersions.map((version) => (
                  <TableRow key={version.id}>
                    <TableCell>
                      {isImage(version.contentType) ? (
                        <Box
                          sx={{
                            width: 50,
                            height: 50,
                            borderRadius: 1,
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: '#f5f5f5',
                            border: '1px solid #e0e0e0'
                          }}
                        >
                          <img
                            src={getPreviewUrl(version.id)}
                            alt={`${version.fileName} v${version.version}`}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                        </Box>
                      ) : (
                        <Typography sx={{ fontSize: '24px' }}>
                          {getFileTypeIcon(version.contentType)}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>{`v${version.version}`}</TableCell>
                    <TableCell>{formatFileSize(version.fileSize)}</TableCell>
                    <TableCell>{formatDate(version.uploadDate)}</TableCell>
                    <TableCell>{version.uploaderUsername}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Descargar versión">
                        <IconButton 
                          size="small"
                          onClick={() => handleDownload(version.id)}
                          sx={{ color: '#0073bb' }}
                        >
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', px: 3, py: 2 }}>
          <Button
            variant="contained"
            component="label"
            startIcon={<CloudUploadIcon />}
            disabled={versionLoading}
          >
            Subir Nueva Versión
            <input
              type="file"
              hidden
              onChange={(e) => handleVersionUpload(e, versionsDialog.fileId)}
            />
          </Button>
          <Button onClick={closeVersionsDialog}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={closeSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard; 