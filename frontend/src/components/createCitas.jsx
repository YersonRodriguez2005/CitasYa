import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Button, 
  Box, 
  TextField, 
  Paper, 
  Grid, 
  InputAdornment, 
  Divider,
  Card,
  CardContent,
  Fade,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';

export default function CreateCita() {
    const [citas, setCitas] = useState({
        nombre_paciente: '',
        fecha: '',
        especialidad: '',
        medico: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    // Función para manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('http://localhost:3000/api/citas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(citas),
            });

            if (!res.ok) {
                throw new Error('Error al crear la cita');
            }

            await res.json();
            setCitas({ nombre_paciente: '', fecha: '', especialidad: '', medico: '' });
            setSuccess(true);
            
            // Redireccionar después de un breve retraso para mostrar el mensaje de éxito
            setTimeout(() => {
                navigate('/');
            }, 1500);
            
        } catch (error) {
            console.error('Error:', error);
            setError(error.message || 'Ha ocurrido un error al crear la cita');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setCitas({
            ...citas,
            [e.target.name]: e.target.value,
        });
    };

    const handleCloseSnackbar = () => {
        setSuccess(false);
        setError(null);
    };

    return (
        <Fade in={true} timeout={800}>
            <Box sx={{ 
                padding: { xs: 2, md: 4 }, 
                maxWidth: 800, 
                mx: 'auto', 
                mt: 3,
                mb: 5
            }}>
                <Paper elevation={3} sx={{ 
                    borderRadius: 2, 
                    overflow: 'hidden',
                    border: '1px solid #e0e0e0'
                }}>
                    {/* Cabecera */}
                    <Box sx={{ 
                        bgcolor: 'primary.main', 
                        color: 'white', 
                        p: 2,
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <HealthAndSafetyIcon sx={{ fontSize: 28, mr: 1 }} />
                        <Typography variant="h5" fontWeight="medium">
                            Crear Nueva Cita Médica
                        </Typography>
                    </Box>
                    
                    <CardContent sx={{ p: 3 }}>
                        <form onSubmit={handleSubmit} noValidate autoComplete="off">
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Fecha de la Cita"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        onChange={handleChange}
                                        type="date"
                                        name="fecha"
                                        value={citas.fecha}
                                        required
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <CalendarTodayIcon color="primary" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        sx={{ mt: 0 }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Nombre del Paciente"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        onChange={handleChange}
                                        name="nombre_paciente"
                                        value={citas.nombre_paciente}
                                        required
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <PersonIcon color="primary" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ mt: 0 }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Especialidad"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        onChange={handleChange}
                                        name="especialidad"
                                        value={citas.especialidad}
                                        required
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <MedicalServicesIcon color="primary" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ mt: 0 }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Nombre del Médico"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        onChange={handleChange}
                                        name="medico"
                                        value={citas.medico}
                                        required
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LocalHospitalIcon color="primary" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ mt: 0 }}
                                    />
                                </Grid>
                            </Grid>

                            <Divider sx={{ my: 3 }} />

                            <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between',
                                flexDirection: { xs: 'column', sm: 'row' },
                                gap: 2
                            }}>
                                <Button 
                                    component={Link} 
                                    to="/" 
                                    variant="outlined" 
                                    color="secondary" 
                                    startIcon={<ArrowBackIcon />}
                                    sx={{ 
                                        borderRadius: 2,
                                        px: 3
                                    }}
                                >
                                    Volver a la lista
                                </Button>
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    type="submit" 
                                    disabled={loading}
                                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                    sx={{ 
                                        borderRadius: 2,
                                        px: 4,
                                        py: 1,
                                        boxShadow: 2,
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: 3,
                                            transition: 'all 0.3s'
                                        }
                                    }}
                                >
                                    {loading ? 'Guardando...' : 'Crear Cita'}
                                </Button>
                            </Box>
                        </form>
                    </CardContent>
                </Paper>

                {/* Notificaciones */}
                <Snackbar 
                    open={success} 
                    autoHideDuration={4000} 
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert severity="success" variant="filled" onClose={handleCloseSnackbar}>
                        ¡Cita creada con éxito! Redirigiendo...
                    </Alert>
                </Snackbar>
                
                <Snackbar 
                    open={Boolean(error)} 
                    autoHideDuration={6000} 
                    onClose={() => setError(null)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert severity="error" variant="filled" onClose={() => setError(null)}>
                        {error}
                    </Alert>
                </Snackbar>
            </Box>
        </Fade>
    );
}