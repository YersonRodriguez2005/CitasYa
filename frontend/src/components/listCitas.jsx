import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button,
  IconButton,
  Tooltip,
  Chip,
  Fade,
  Alert,
  Skeleton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useTheme,
  useMediaQuery,
  TablePagination,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
// Iconos
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ViewListIcon from '@mui/icons-material/ViewList';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import WarningIcon from '@mui/icons-material/Warning';

export default function ListCitas() {
    const [citas, setCitas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteDialog, setDeleteDialog] = useState({ open: false, citaId: null });
    const [successMessage, setSuccessMessage] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Función para obtener las citas desde la API
    const fetchCitas = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('http://localhost:3000/api/citas', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (!res.ok) {
                throw new Error('Error al obtener las citas');
            }
            
            const data = await res.json();
            setCitas(data);
        } catch (error) {
            console.error('Error fetching citas:', error);
            setError('No se pudieron cargar las citas. Por favor, inténtelo de nuevo.');
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchCitas();
    }, []);

    // Función para abrir el diálogo de confirmación
    const openDeleteDialog = (id) => {
        setDeleteDialog({ open: true, citaId: id });
    };

    // Función para cerrar el diálogo de confirmación
    const closeDeleteDialog = () => {
        setDeleteDialog({ open: false, citaId: null });
    };

    // Función para eliminar una cita
    const deleteCita = async () => {
        try {
            const res = await fetch(`http://localhost:3000/api/citas/${deleteDialog.citaId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (res.ok) {
                setCitas(citas.filter((cita) => cita.id !== deleteDialog.citaId));
                setSuccessMessage('Cita eliminada correctamente');
                
                // Limpiar el mensaje después de 3 segundos
                setTimeout(() => {
                    setSuccessMessage('');
                }, 3000);
            } else {
                setError('Error al eliminar la cita');
                setTimeout(() => {
                    setError('');
                }, 3000);
            }
        } catch (error) {
            console.error('Error deleting cita:', error);
            setError('Error al eliminar la cita');
            setTimeout(() => {
                setError('');
            }, 3000);
        } finally {
            closeDeleteDialog();
        }
    };

    // Manejar cambio de página
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Manejar cambio de filas por página
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Formatear fecha para mostrar en formato local
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    // Obtener el color para el chip de especialidad
    const getSpecialtyColor = (specialty) => {
        const specialtyMap = {
            'cardiología': 'error',
            'pediatría': 'info',
            'dermatología': 'secondary',
            'oftalmología': 'success',
            'neurología': 'warning',
            'oncología': 'error',
        };
        
        const normalizedSpecialty = specialty.toLowerCase();
        return specialtyMap[normalizedSpecialty] || 'default';
    };

    // Componente de esqueleto para carga
    const LoadingSkeleton = () => (
        <>
            {[...Array(3)].map((_, index) => (
                <TableRow key={index}>
                    <TableCell><Skeleton animation="wave" height={30} /></TableCell>
                    <TableCell align="right"><Skeleton animation="wave" height={30} /></TableCell>
                    <TableCell align="right"><Skeleton animation="wave" height={30} /></TableCell>
                    <TableCell align="right"><Skeleton animation="wave" height={30} /></TableCell>
                    <TableCell align="right">
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Skeleton animation="wave" height={40} width={80} sx={{ mr: 1 }} />
                            <Skeleton animation="wave" height={40} width={80} />
                        </Box>
                    </TableCell>
                </TableRow>
            ))}
        </>
    );

    return (
        <Fade in={true} timeout={800}>
            <Box sx={{ padding: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto', mb: 5 }}>
                <Card elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                    <Box 
                        sx={{ 
                            bgcolor: 'primary.main', 
                            color: 'white', 
                            p: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <ViewListIcon sx={{ fontSize: 28, mr: 1 }} />
                            <Typography variant="h5" fontWeight="medium">
                                Listado de Citas Médicas
                            </Typography>
                        </Box>
                        <Box>
                            <Tooltip title="Crear nueva cita">
                                <IconButton 
                                    color="inherit" 
                                    onClick={() => navigate('/create')}
                                    size="large"
                                >
                                    <AddCircleIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Actualizar lista">
                                <IconButton 
                                    color="inherit"
                                    onClick={fetchCitas}
                                    size="large"
                                >
                                    <RefreshIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>

                    <CardContent sx={{ p: 0 }}>
                        {successMessage && (
                            <Alert severity="success" sx={{ borderRadius: 0 }}>
                                {successMessage}
                            </Alert>
                        )}
                        
                        {error && (
                            <Alert severity="error" sx={{ borderRadius: 0 }}>
                                {error}
                            </Alert>
                        )}

                        <TableContainer component={Paper} elevation={0}>
                            <Table sx={{ minWidth: 650 }} aria-label="tabla de citas">
                                <TableHead>
                                    <TableRow sx={{ bgcolor: 'grey.100' }}>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                                                <Typography fontWeight="bold">Paciente</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align={isMobile ? "left" : "right"}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: isMobile ? 'flex-start' : 'flex-end' }}>
                                                <CalendarTodayIcon sx={{ mr: 1, color: 'primary.main' }} />
                                                <Typography fontWeight="bold">Fecha</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align={isMobile ? "left" : "right"}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: isMobile ? 'flex-start' : 'flex-end' }}>
                                                <MedicalServicesIcon sx={{ mr: 1, color: 'primary.main' }} />
                                                <Typography fontWeight="bold">Especialidad</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align={isMobile ? "left" : "right"}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: isMobile ? 'flex-start' : 'flex-end' }}>
                                                <LocalHospitalIcon sx={{ mr: 1, color: 'primary.main' }} />
                                                <Typography fontWeight="bold">Médico</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography fontWeight="bold">Acciones</Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading ? (
                                        <LoadingSkeleton />
                                    ) : citas.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                                <Typography variant="subtitle1" color="text.secondary">
                                                    No hay citas registradas
                                                </Typography>
                                                <Button 
                                                    variant="contained" 
                                                    color="primary"
                                                    startIcon={<AddCircleIcon />}
                                                    onClick={() => navigate('/create')}
                                                    sx={{ mt: 2 }}
                                                >
                                                    Crear Nueva Cita
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        citas
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((cita) => (
                                            <TableRow
                                                key={cita.id}
                                                sx={{ 
                                                    '&:last-child td, &:last-child th': { border: 0 },
                                                    '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' },
                                                    transition: 'background-color 0.2s ease'
                                                }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    <Typography fontWeight="medium">{cita.nombre_paciente}</Typography>
                                                </TableCell>
                                                <TableCell align={isMobile ? "left" : "right"}>
                                                    {formatDate(cita.fecha)}
                                                </TableCell>
                                                <TableCell align={isMobile ? "left" : "right"}>
                                                    <Chip 
                                                        label={cita.especialidad} 
                                                        color={getSpecialtyColor(cita.especialidad)}
                                                        size="small"
                                                        sx={{ fontWeight: 'medium' }}
                                                    />
                                                </TableCell>
                                                <TableCell align={isMobile ? "left" : "right"}>
                                                    <Typography>{cita.medico}</Typography>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                        <Tooltip title="Modificar">
                                                            <IconButton 
                                                                color="secondary"
                                                                onClick={() => navigate(`/edit/${cita.id}`)}
                                                                size="small"
                                                                sx={{ mr: 1 }}
                                                            >
                                                                <EditIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Eliminar">
                                                            <IconButton 
                                                                color="error"
                                                                onClick={() => openDeleteDialog(cita.id)}
                                                                size="small"
                                                            >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        
                        {!loading && citas.length > 0 && (
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={citas.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                labelRowsPerPage="Filas por página:"
                                labelDisplayedRows={({ from, to, count }) => 
                                    `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
                                }
                            />
                        )}
                    </CardContent>
                </Card>

                {/* Diálogo de confirmación para eliminar */}
                <Dialog
                    open={deleteDialog.open}
                    onClose={closeDeleteDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title" sx={{ display: 'flex', alignItems: 'center' }}>
                        <WarningIcon color="error" sx={{ mr: 1 }} />
                        {"Confirmar eliminación"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            ¿Está seguro que desea eliminar esta cita? Esta acción no se puede deshacer.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions sx={{ pb: 2, px: 3 }}>
                        <Button 
                            onClick={closeDeleteDialog} 
                            color="primary"
                            variant="outlined"
                        >
                            Cancelar
                        </Button>
                        <Button 
                            onClick={deleteCita} 
                            color="error" 
                            variant="contained" 
                            autoFocus
                            startIcon={<DeleteIcon />}
                        >
                            Eliminar
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Fade>
    );
}