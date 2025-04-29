import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Grid, 
  CircularProgress, 
  Alert, 
  InputAdornment, 
  Divider, 
  Fade,
  CardContent,
  Snackbar,
  Backdrop
} from '@mui/material';
import { useNavigate, useParams, Link } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';

export default function EditCitas() {
    const [citas, setCitas] = useState({
        nombre_paciente: '',
        fecha: '',
        especialidad: '',
        medico: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const { id } = useParams();
    const navigate = useNavigate();

    // Función para obtener una cita por ID
    useEffect(() => {
        const fetchCita = async () => {
            setLoading(true);
            try {
                const res = await fetch(`http://localhost:3000/api/citas/${id}`);
                if (!res.ok) {
                    throw new Error('Error al cargar la cita');
                }
                const data = await res.json();
                setCitas(data);
            } catch (error) {
                console.error('Error al cargar la cita:', error);
                setError('No se pudo cargar la información de la cita');
            } finally {
                setLoading(false);
            }
        };

        fetchCita();
    }, [id]);

    // Validar formulario
    const validateForm = () => {
        const errors = {};
        
        if (!citas.nombre_paciente.trim()) {
            errors.nombre_paciente = 'El nombre del paciente es obligatorio';
        }
        
        if (!citas.fecha) {
            errors.fecha = 'La fecha es obligatoria';
        }
        
        if (!citas.especialidad.trim()) {
            errors.especialidad = 'La especialidad es obligatoria';
        }
        
        if (!citas.medico.trim()) {
            errors.medico = 'El nombre del médico es obligatorio';
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Función para editar una cita
    const handleEdit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setSaving(true);
        setError(null);

        try {
            const res = await fetch(`http://localhost:3000/api/citas/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(citas),
            });

            if (!res.ok) {
                throw new Error('Error al editar la cita');
            }

            await res.json();
            setSuccess(true);
            
            // Redireccionar después de un breve retraso
            setTimeout(() => {
                navigate('/');
            }, 1500);
        } catch (error) {
            console.error('Error:', error);
            setError('No se pudo actualizar la cita. Por favor, inténtelo de nuevo.');
        } finally {
            setSaving(false);
        }
    };

    // Función para manejar los cambios en el formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCitas({
            ...citas,
            [name]: value,
        });
        
        // Limpiar error del campo cuando el usuario comienza a escribir
        if (formErrors[name]) {
            setFormErrors({
                ...formErrors,
                [name]: ''
            });
        }
    };

    if (loading) {
        return (
            <Backdrop open={true} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <CircularProgress color="inherit" />
            </Backdrop>
        );
    }

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
                        bgcolor: 'secondary.main', 
                        color: 'white', 
                        p: 2,
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <EditIcon sx={{ fontSize: 28, mr: 1 }} />
                        <Typography variant="h5" fontWeight="medium">
                            Modificar Cita Médica
                        </Typography>
                    </Box>
                    
                    {error && (
                        <Alert severity="error" sx={{ borderRadius: 0 }}>
                            {error}
                        </Alert>
                    )}
                    
                    <CardContent sx={{ p: 3 }}>
                        <form onSubmit={handleEdit} noValidate autoComplete="off">
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Fecha de la Cita"
                                        variant="outlined"
                                        fullWidth
                                        type="date"
                                        onChange={handleChange}
                                        value={citas.fecha || ''}
                                        name="fecha"
                                        required
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <CalendarTodayIcon color="secondary" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        error={!!formErrors.fecha}
                                        helperText={formErrors.fecha}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Nombre del Paciente"
                                        variant="outlined"
                                        fullWidth
                                        onChange={handleChange}
                                        value={citas.nombre_paciente || ''}
                                        name="nombre_paciente"
                                        required
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <PersonIcon color="secondary" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        error={!!formErrors.nombre_paciente}
                                        helperText={formErrors.nombre_paciente}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Especialidad"
                                        variant="outlined"
                                        fullWidth
                                        onChange={handleChange}
                                        value={citas.especialidad || ''}
                                        name="especialidad"
                                        required
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <MedicalServicesIcon color="secondary" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        error={!!formErrors.especialidad}
                                        helperText={formErrors.especialidad}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Médico"
                                        variant="outlined"
                                        fullWidth
                                        onChange={handleChange}
                                        value={citas.medico || ''}
                                        name="medico"
                                        required
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LocalHospitalIcon color="secondary" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        error={!!formErrors.medico}
                                        helperText={formErrors.medico}
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
                                    color="error" 
                                    startIcon={<CancelIcon />}
                                    sx={{ 
                                        borderRadius: 2,
                                        px: 3
                                    }}
                                >
                                    Cancelar
                                </Button>
                                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                                    <Button 
                                        component={Link} 
                                        to="/" 
                                        variant="outlined" 
                                        color="primary" 
                                        startIcon={<ArrowBackIcon />}
                                        sx={{ 
                                            borderRadius: 2,
                                            px: 3
                                        }}
                                    >
                                        Volver
                                    </Button>
                                    <Button 
                                        type="submit" 
                                        variant="contained" 
                                        color="secondary" 
                                        disabled={saving}
                                        startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
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
                                        {saving ? 'Guardando...' : 'Guardar Cambios'}
                                    </Button>
                                </Box>
                            </Box>
                        </form>
                    </CardContent>
                </Paper>
                
                {/* Notificación de éxito */}
                <Snackbar 
                    open={success} 
                    autoHideDuration={3000} 
                    onClose={() => setSuccess(false)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert severity="success" variant="filled">
                        ¡Cita actualizada con éxito! Redirigiendo...
                    </Alert>
                </Snackbar>
            </Box>
        </Fade>
    );
}