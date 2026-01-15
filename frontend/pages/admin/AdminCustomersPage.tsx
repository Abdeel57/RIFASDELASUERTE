import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    Search,
    Eye,
    FileText,
    Clock,
    RefreshCw,
    XCircle,
    X,
    AlertTriangle,
    CheckCircle,
} from 'lucide-react';
import { Order, Raffle } from '../../types';
import { getOrders, updateOrder, releaseOrder, editOrder, markOrderAsPending, getRaffles, createOrderManual, getOccupiedTickets } from '../../services/api';
import EditOrderForm from '../../components/admin/EditOrderForm';

const AdminCustomersPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [editingOrder, setEditingOrder] = useState<Order | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isLoadingAction, setIsLoadingAction] = useState(false);
    const [isReleaseModalOpen, setIsReleaseModalOpen] = useState(false);
    const [orderToRelease, setOrderToRelease] = useState<Order | null>(null);
    const [releaseStep, setReleaseStep] = useState<1 | 2>(1);
    const [isCreateOrderModalOpen, setIsCreateOrderModalOpen] = useState(false);
    const [raffles, setRaffles] = useState<Raffle[]>([]);
    const [selectedRaffleId, setSelectedRaffleId] = useState<string>('');
    const [occupiedTickets, setOccupiedTickets] = useState<number[]>([]);
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [customerDistrict, setCustomerDistrict] = useState('');
    const [manualTicketsInput, setManualTicketsInput] = useState('');
    const [giftTicketsInput, setGiftTicketsInput] = useState('');
    const [orderStatus, setOrderStatus] = useState<'PENDING' | 'PAID' | 'COMPLETED'>('PENDING');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [notes, setNotes] = useState('');
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [isCreatingOrder, setIsCreatingOrder] = useState(false);

    useEffect(() => {
        loadData();
        loadRaffles();
    }, []);

    const loadRaffles = async () => {
        try {
            const data = await getRaffles();
            setRaffles(data);
        } catch (e) {
            console.error('Error cargando rifas:', e);
        }
    };

    // Cargar boletos ocupados cuando se selecciona una rifa
    useEffect(() => {
        if (selectedRaffleId) {
            loadOccupiedTickets();
        } else {
            setOccupiedTickets([]);
        }
    }, [selectedRaffleId]);

    const loadOccupiedTickets = async () => {
        try {
            const data = await getOccupiedTickets(selectedRaffleId);
            setOccupiedTickets(data.tickets || []);
        } catch (e) {
            console.error('Error cargando boletos ocupados:', e);
            setOccupiedTickets([]);
        }
    };

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await getOrders(1, 200);
            setOrders(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error('Error cargando órdenes:', e);
            alert('Error al cargar datos. Verifica el servidor.');
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const refreshData = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    // Considerar variaciones: 'PAID' | 'COMPLETED' (robusto ante backends distintos)
    const isPaid = (status?: string) => {
        if (!status) return false;
        const s = String(status).toUpperCase();
        return s === 'PAID' || s === 'COMPLETED';
    };

    const paidCustomers = useMemo(() => {
        const base = orders.filter(o => isPaid(String(o.status)));
        if (!searchTerm) return base;
        const term = searchTerm.toLowerCase();
        return base.filter(o => {
            const name = o.customer?.name?.toLowerCase?.() || '';
            const phone = o.customer?.phone || '';
            const district = o.customer?.district?.toLowerCase?.() || '';
            const folio = o.folio?.toLowerCase() || '';
            // Buscar en los números de boleto
            const ticketsMatch = o.tickets?.some(ticket => 
                ticket.toString().includes(searchTerm)
            ) || false;
            return (
                name.includes(term) ||
                phone.includes(searchTerm) ||
                district.includes(term) ||
                folio.includes(term) ||
                ticketsMatch
            );
        });
    }, [orders, searchTerm]);

    const handleView = (order: Order) => {
        setSelectedOrder(order);
        setIsDetailsOpen(true);
    };

    const handleEdit = (order: Order) => {
        setEditingOrder(order);
        setIsEditOpen(true);
    };

    const closeDetails = () => {
        setSelectedOrder(null);
        setIsDetailsOpen(false);
    };

    const closeEdit = () => {
        setEditingOrder(null);
        setIsEditOpen(false);
    };

    const handleSaveEdit = async (updated: Order) => {
        try {
            setIsLoadingAction(true);
            // Usar editOrder que llama al endpoint correcto
            const editData = {
                customer: updated.customer ? {
                    name: updated.customer.name,
                    phone: updated.customer.phone,
                    email: updated.customer.email,
                    district: updated.customer.district,
                } : undefined,
                notes: updated.notes,
            };
            
            await editOrder(updated.id!, editData);
            await refreshData();
            closeEdit();
            console.log('✅ Orden actualizada');
            alert('✅ Orden actualizada correctamente');
        } catch (e: any) {
            console.error('❌ Error al actualizar orden:', e);
            alert(`❌ Error: ${e.message || 'Error al actualizar la orden'}`);
        } finally {
            setIsLoadingAction(false);
        }
    };

    // Marcar como pendiente de nuevo (sin liberar boletos)
    const handleMarkPending = async (orderId: string) => {
        if (!window.confirm('¿Estás seguro de marcar esta orden como pendiente? Los boletos NO se liberarán al inventario.')) return;
        try {
            setIsLoadingAction(true);
            await markOrderAsPending(orderId);
            await refreshData();
            closeDetails();
            closeEdit();
            console.log('✅ Orden marcada como pendiente');
            alert('✅ Orden marcada como pendiente correctamente');
        } catch (e: any) {
            console.error('❌ Error al marcar como pendiente:', e);
            alert(`❌ Error: ${e.message || 'Error al marcar la orden como pendiente'}`);
        } finally {
            setIsLoadingAction(false);
        }
    };

    // Abrir modal de confirmación para liberar boletos
    const handleOpenReleaseModal = (orderId: string) => {
        const order = orders.find(o => o.id === orderId);
        if (order) {
            setOrderToRelease(order);
            setReleaseStep(1);
            setIsReleaseModalOpen(true);
        }
    };

    // Cerrar modal de liberación
    const handleCloseReleaseModal = () => {
        setIsReleaseModalOpen(false);
        setOrderToRelease(null);
        setReleaseStep(1);
    };

    // Continuar a la segunda confirmación
    const handleContinueToSecondStep = () => {
        setReleaseStep(2);
    };

    // Volver a la primera confirmación
    const handleBackToFirstStep = () => {
        setReleaseStep(1);
    };

    // Liberar boletos usando releaseOrder con doble confirmación
    const handleRelease = async () => {
        if (!orderToRelease?.id) return;
        
        try {
            setIsLoadingAction(true);
            await releaseOrder(orderToRelease.id);
            await refreshData();
            closeDetails();
            closeEdit();
            handleCloseReleaseModal();
            console.log('✅ Boletos liberados');
            alert('✅ Boletos liberados correctamente. Los boletos han sido devueltos al inventario.');
        } catch (e: any) {
            console.error('❌ Error al liberar orden:', e);
            alert(`❌ Error: ${e.message || 'Error al liberar la orden'}`);
        } finally {
            setIsLoadingAction(false);
        }
    };

    // Parsear boletos desde string (separados por comas, espacios, etc.)
    const parseTickets = (input: string): number[] => {
        if (!input.trim()) return [];
        return input
            .split(/[,\s]+/)
            .map(t => parseInt(t.trim(), 10))
            .filter(t => !isNaN(t) && t > 0);
    };

    // Validar y crear orden manual
    const validateAndCreateOrder = async () => {
        const errors: string[] = [];

        // Validar rifa seleccionada
        if (!selectedRaffleId) {
            errors.push('Debes seleccionar una rifa');
        }

        // Validar datos del cliente
        if (!customerName.trim()) {
            errors.push('El nombre del cliente es requerido');
        }
        if (!customerPhone.trim()) {
            errors.push('El teléfono del cliente es requerido');
        }

        // Validar boletos manuales
        const manualTickets = parseTickets(manualTicketsInput);
        if (manualTickets.length === 0) {
            errors.push('Debes ingresar al menos un boleto manual');
        }

        // Validar rifa y rango de boletos
        const selectedRaffle = raffles.find(r => r.id === selectedRaffleId);
        if (selectedRaffle) {
            // Validar rango de boletos manuales
            const invalidManualTickets = manualTickets.filter(t => t < 1 || t > selectedRaffle.tickets);
            if (invalidManualTickets.length > 0) {
                errors.push(`Boletos manuales fuera de rango (1-${selectedRaffle.tickets}): ${invalidManualTickets.join(', ')}`);
            }

            // Validar boletos ocupados
            const occupiedManualTickets = manualTickets.filter(t => occupiedTickets.includes(t));
            if (occupiedManualTickets.length > 0) {
                errors.push(`Boletos manuales ya ocupados: ${occupiedManualTickets.join(', ')}`);
            }

            // Validar boletos de regalo si la rifa tiene oportunidades
            if (selectedRaffle.boletosConOportunidades && selectedRaffle.numeroOportunidades && selectedRaffle.numeroOportunidades > 1) {
                const giftTickets = parseTickets(giftTicketsInput);
                if (giftTickets.length > 0) {
                    const totalEmisiones = selectedRaffle.tickets * selectedRaffle.numeroOportunidades;
                    const invalidGiftTickets = giftTickets.filter(t => t < selectedRaffle.tickets + 1 || t > totalEmisiones);
                    if (invalidGiftTickets.length > 0) {
                        errors.push(`Boletos de regalo fuera de rango (${selectedRaffle.tickets + 1}-${totalEmisiones}): ${invalidGiftTickets.join(', ')}`);
                    }

                    const occupiedGiftTickets = giftTickets.filter(t => occupiedTickets.includes(t));
                    if (occupiedGiftTickets.length > 0) {
                        errors.push(`Boletos de regalo ya ocupados: ${occupiedGiftTickets.join(', ')}`);
                    }

                    // Validar solapamiento
                    const overlap = manualTickets.filter(t => giftTickets.includes(t));
                    if (overlap.length > 0) {
                        errors.push(`Boletos duplicados entre manuales y de regalo: ${overlap.join(', ')}`);
                    }
                }
            } else if (giftTicketsInput.trim()) {
                errors.push('Esta rifa no tiene boletos con oportunidades. No puedes asignar boletos de regalo.');
            }
        }

        setValidationErrors(errors);
        if (errors.length > 0) {
            return;
        }

        // Crear la orden
        try {
            setIsCreatingOrder(true);
            const selectedRaffle = raffles.find(r => r.id === selectedRaffleId)!;
            const manualTickets = parseTickets(manualTicketsInput);
            const giftTickets = parseTickets(giftTicketsInput);
            
            // Calcular total (solo boletos manuales cuentan para el precio)
            const total = manualTickets.length * selectedRaffle.price;

            const newOrder = await createOrderManual({
                raffleId: selectedRaffleId,
                customer: {
                    name: customerName.trim(),
                    phone: customerPhone.trim(),
                    email: customerEmail.trim() || undefined,
                    district: customerDistrict.trim() || undefined,
                },
                tickets: manualTickets,
                giftTickets: giftTickets.length > 0 ? giftTickets : undefined,
                total,
                status: orderStatus,
                paymentMethod: paymentMethod.trim() || undefined,
                notes: notes.trim() || undefined,
            });

            // Limpiar formulario
            handleCloseCreateOrderModal();

            // Refrescar datos
            await refreshData();
            if (selectedRaffleId) {
                await loadOccupiedTickets();
            }

            alert(`✅ Orden creada exitosamente\nFolio: ${newOrder.folio}\nBoletos: ${newOrder.tickets.length}`);
        } catch (e: any) {
            console.error('❌ Error creando orden:', e);
            alert(`❌ Error: ${e.message || 'Error al crear la orden'}`);
        } finally {
            setIsCreatingOrder(false);
        }
    };

    const handleCloseCreateOrderModal = () => {
        setIsCreateOrderModalOpen(false);
        setValidationErrors([]);
        setSelectedRaffleId('');
        setCustomerName('');
        setCustomerPhone('');
        setCustomerEmail('');
        setCustomerDistrict('');
        setManualTicketsInput('');
        setGiftTicketsInput('');
        setOrderStatus('PENDING');
        setPaymentMethod('');
        setNotes('');
    };

    /**
     * Formatea una fecha a formato hondureño con fecha y hora
     * Formato: "DD/MM/YYYY HH:MM:SS"
     */
    const formatDateTime = (date: Date | string | undefined): string => {
        if (!date) return 'No disponible';
        try {
            const dateObj = typeof date === 'string' ? new Date(date) : date;
            if (isNaN(dateObj.getTime())) return 'Fecha inválida';
            
            const day = String(dateObj.getDate()).padStart(2, '0');
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const year = dateObj.getFullYear();
            const hours = String(dateObj.getHours()).padStart(2, '0');
            const minutes = String(dateObj.getMinutes()).padStart(2, '0');
            const seconds = String(dateObj.getSeconds()).padStart(2, '0');
            
            return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
        } catch (error) {
            console.error('Error formateando fecha:', error);
            return 'Fecha inválida';
        }
    };

    /**
     * Obtiene la fecha de pago de una orden
     * Para órdenes pagadas, usa updatedAt (fecha de última actualización)
     * Si no está pagada, retorna null
     */
    const getPaymentDate = (order: Order): Date | string | undefined => {
        if (isPaid(order.status)) {
            return order.updatedAt;
        }
        return undefined;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Cargando clientes...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center space-x-3">
                            <div className="p-3 bg-blue-100 rounded-xl">
                                <User className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Clientes Pagados</h1>
                                <p className="text-gray-600">Órdenes con pago confirmado</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => setIsCreateOrderModalOpen(true)}
                                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                            >
                                <FileText className="w-4 h-4" />
                                <span>Crear Orden Manual</span>
                            </button>
                            <button
                                onClick={refreshData}
                                disabled={refreshing}
                                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                                <span>Actualizar</span>
                            </button>
                        </div>
                    </div>
                </div>


                {/* Búsqueda */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Buscar por nombre, teléfono, distrito, folio o número de boleto..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lista */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <AnimatePresence>
                        {paidCustomers.map((order) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow"
                            >
                                {/* Información esencial */}
                                <div className="mb-4">
                                    {order.raffleTitle && (
                                        <div className="mb-3 pb-3 border-b border-gray-200">
                                            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                                                🎰 {order.raffleTitle}
                                            </span>
                                        </div>
                                    )}
                                    {order.customer && <h3 className="text-lg font-bold text-gray-900 mb-2">{order.customer.name || 'Sin nombre'}</h3>}
                                    <div className="space-y-1 text-sm text-gray-600">
                                        {order.customer && <p>📞 {order.customer.phone || 'Sin teléfono'}</p>}
                                        {order.folio && (
                                            <p className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-700 inline-block">
                                                🏷️ Folio: <span className="font-bold">{order.folio}</span>
                                            </p>
                                        )}
                                        <p>🎫 Boletos: {order.tickets?.join(', ') || 'N/A'}</p>
                                        <p className="font-bold text-green-600">💰 ${(order.totalAmount || order.total || 0).toLocaleString()}</p>
                                    </div>
                                </div>

                                {/* Botones de acción */}
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => handleView(order)}
                                        disabled={isLoadingAction}
                                        className="flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm disabled:opacity-50"
                                    >
                                        <Eye className="w-4 h-4" />
                                        <span>Ver</span>
                                    </button>
                                    <button
                                        onClick={() => handleEdit(order)}
                                        disabled={isLoadingAction}
                                        className="flex items-center justify-center space-x-2 px-3 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors text-sm disabled:opacity-50"
                                    >
                                        <FileText className="w-4 h-4" />
                                        <span>Editar</span>
                                    </button>
                                    <button
                                        onClick={() => handleMarkPending(order.id!)}
                                        disabled={isLoadingAction}
                                        className="flex items-center justify-center space-x-2 px-3 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors text-sm disabled:opacity-50"
                                    >
                                        <XCircle className="w-4 h-4" />
                                        <span>Marcar Pendiente</span>
                                    </button>
                                    <button
                                        onClick={() => handleOpenReleaseModal(order.id!)}
                                        disabled={isLoadingAction}
                                        className="flex items-center justify-center space-x-2 px-3 py-2 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 transition-colors text-sm disabled:opacity-50"
                                    >
                                        <Clock className="w-4 h-4" />
                                        <span>Liberar</span>
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {paidCustomers.length === 0 && (
                        <div className="text-center py-12">
                            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay clientes</h3>
                            <p className="text-gray-600">
                                {searchTerm ? 'No se encontraron clientes con los filtros aplicados' : 'Aún no hay clientes pagados'}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Detalles */}
            <AnimatePresence>
                {isDetailsOpen && selectedOrder && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                        onClick={closeDetails}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">Detalles del Cliente</h2>
                                    <button onClick={closeDetails} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                                        ✕
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <h3 className="font-semibold text-gray-900 mb-3">Información del Cliente</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            {selectedOrder.customer && (
                                                <>
                                                    <div>
                                                        <span className="text-sm text-gray-600">Nombre:</span>
                                                        <p className="font-medium">{selectedOrder.customer.name || 'Sin nombre'}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-sm text-gray-600">Teléfono:</span>
                                                        <p className="font-medium">{selectedOrder.customer.phone || 'Sin teléfono'}</p>
                                                    </div>
                                                </>
                                            )}
                                            {selectedOrder.customer?.district && (
                                                <div>
                                                    <span className="text-sm text-gray-600">Distrito:</span>
                                                    <p className="font-medium">{selectedOrder.customer.district}</p>
                                                </div>
                                            )}
                                            <div>
                                                <span className="text-sm text-gray-600">Monto:</span>
                                                <p className="font-bold text-green-600">${(selectedOrder.totalAmount || selectedOrder.total || 0).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                                            <Clock className="w-4 h-4 mr-2 text-blue-600" />
                                            Fechas Importantes
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="bg-white rounded-lg p-3 border border-blue-100">
                                                <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">📅 Fecha y Hora de Apartado</span>
                                                <p className="font-medium text-gray-900 mt-1">
                                                    {formatDateTime(selectedOrder.createdAt)}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Momento en que el cliente apartó los boletos
                                                </p>
                                            </div>
                                            {isPaid(selectedOrder.status) && (
                                                <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                                                    <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">✅ Fecha y Hora de Pago</span>
                                                    <p className="font-medium text-gray-900 mt-1">
                                                        {formatDateTime(getPaymentDate(selectedOrder))}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Momento en que se confirmó el pago
                                                    </p>
                                                </div>
                                            )}
                                            {!isPaid(selectedOrder.status) && (
                                                <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                                                    <span className="text-xs font-semibold text-yellow-700 uppercase tracking-wide">⏳ Estado de Pago</span>
                                                    <p className="font-medium text-gray-900 mt-1">
                                                        Pendiente
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        El pago aún no ha sido confirmado
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <h3 className="font-semibold text-gray-900 mb-3">Boletos</h3>
                                        <div className="space-y-2">
                                            <div>
                                                <span className="text-sm text-gray-600">Cantidad:</span>
                                                <p className="font-medium">{selectedOrder.tickets.length}</p>
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-600">Números:</span>
                                                <p className="font-medium">{selectedOrder.tickets.join(', ')}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-3">
                                        <button
                                            onClick={() => {
                                                closeDetails();
                                                handleEdit(selectedOrder);
                                            }}
                                            disabled={isLoadingAction}
                                            className="flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50"
                                        >
                                            <FileText className="w-4 h-4" />
                                            <span>Editar</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                closeDetails();
                                                handleMarkPending(selectedOrder.id!);
                                            }}
                                            disabled={isLoadingAction}
                                            className="flex items-center justify-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors disabled:opacity-50"
                                        >
                                            <XCircle className="w-4 h-4" />
                                            <span>Marcar Pendiente</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                closeDetails();
                                                handleOpenReleaseModal(selectedOrder.id!);
                                            }}
                                            disabled={isLoadingAction}
                                            className="flex items-center justify-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 transition-colors disabled:opacity-50"
                                        >
                                            <Clock className="w-4 h-4" />
                                            <span>Liberar</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal Edición */}
            <AnimatePresence>
                {isEditOpen && editingOrder && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                        onClick={closeEdit}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">Editar Orden</h2>
                                    <button onClick={closeEdit} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">✕</button>
                                </div>

                                <EditOrderForm
                                    order={editingOrder}
                                    onSave={handleSaveEdit}
                                    onCancel={closeEdit}
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal de Confirmación para Liberar Boletos */}
            <AnimatePresence>
                {isReleaseModalOpen && orderToRelease && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4"
                        onClick={handleCloseReleaseModal}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: -20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className={`p-6 text-white rounded-t-2xl ${orderToRelease && isPaid(orderToRelease.status) ? 'bg-gradient-to-r from-red-600 to-orange-600' : 'bg-gradient-to-r from-yellow-600 to-yellow-700'}`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <AlertTriangle className="w-6 h-6" />
                                        <div>
                                            <h2 className="text-2xl font-bold">
                                                {releaseStep === 1 ? 'Confirmar Liberación' : 'Confirmación Final'}
                                            </h2>
                                            <p className="text-white/90 mt-1 text-sm">
                                                {releaseStep === 1 
                                                    ? 'Revisa la información antes de continuar' 
                                                    : 'Última confirmación para liberar boletos'}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleCloseReleaseModal}
                                        className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200 p-2 rounded-xl"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-4">
                                {releaseStep === 1 ? (
                                    <>
                                        {/* Primera confirmación - Información detallada */}
                                        <div className="space-y-3">
                                            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
                                                <div className="flex items-start">
                                                    <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                                                    <div>
                                                        <p className="font-semibold text-yellow-800 mb-2">
                                                            Advertencia: Estás a punto de liberar boletos de una orden
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                                <h3 className="font-bold text-gray-900 text-lg mb-3">📋 Información de la Orden</h3>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Folio:</span>
                                                        <span className="font-mono font-bold text-gray-900">{orderToRelease.folio || 'N/A'}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Cliente:</span>
                                                        <span className="font-semibold text-gray-900">{orderToRelease.customer?.name || 'Sin nombre'}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Boletos:</span>
                                                        <span className="font-semibold text-gray-900">{orderToRelease.tickets?.length || 0} boleto(s)</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Estado:</span>
                                                        <span className={`font-bold ${isPaid(orderToRelease.status) ? 'text-red-600' : 'text-gray-900'}`}>
                                                            {isPaid(orderToRelease.status) ? '✅ PAGADO' : orderToRelease.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {isPaid(orderToRelease.status) && (
                                                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                                                    <div className="flex items-start">
                                                        <AlertTriangle className="w-5 h-5 text-red-600 mr-2 mt-0.5" />
                                                        <div>
                                                            <p className="font-bold text-red-800 mb-1">⚠️ IMPORTANTE</p>
                                                            <p className="text-red-700 text-sm">
                                                                Esta orden ya está <strong>PAGADA</strong>. Al liberar estos boletos, se devolverán al inventario y el cliente <strong>perderá su compra</strong>.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Botones - Primera confirmación */}
                                        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                                            <button
                                                type="button"
                                                onClick={handleCloseReleaseModal}
                                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleContinueToSecondStep}
                                                className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition-all font-semibold flex items-center space-x-2"
                                            >
                                                <span>Continuar</span>
                                                <Clock className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {/* Segunda confirmación - Confirmación final */}
                                        <div className="space-y-3">
                                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                                                <div className="flex items-start">
                                                    <AlertTriangle className="w-5 h-5 text-red-600 mr-2 mt-0.5" />
                                                    <div>
                                                        <p className="font-bold text-red-800 mb-2">🔴 Confirmación Final</p>
                                                        <p className="text-red-700 text-sm">
                                                            Vas a liberar <strong>{orderToRelease.tickets?.length || 0} boleto(s)</strong> de la orden <strong>{orderToRelease.folio || 'N/A'}</strong>.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {isPaid(orderToRelease.status) ? (
                                                <div className="bg-red-100 border-2 border-red-500 p-4 rounded-lg">
                                                    <p className="text-red-800 font-bold text-center">
                                                        ⚠️ Esta orden está <strong>PAGADA</strong>. Los boletos se devolverán al inventario y el cliente <strong>perderá su compra</strong>.
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                                                    <p className="text-blue-800 text-sm">
                                                        Los boletos volverán al inventario y estarán disponibles para otros clientes.
                                                    </p>
                                                </div>
                                            )}

                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <p className="text-center font-semibold text-gray-900">
                                                    ¿Confirmas que deseas <span className="text-red-600">LIBERAR</span> estos boletos?
                                                </p>
                                            </div>
                                        </div>

                                        {/* Botones - Segunda confirmación */}
                                        <div className="flex items-center justify-between space-x-3 pt-4 border-t border-gray-200">
                                            <button
                                                type="button"
                                                onClick={handleBackToFirstStep}
                                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium"
                                            >
                                                ← Volver
                                            </button>
                                            <div className="flex space-x-3">
                                                <button
                                                    type="button"
                                                    onClick={handleCloseReleaseModal}
                                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium"
                                                >
                                                    Cancelar
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleRelease}
                                                    disabled={isLoadingAction}
                                                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all font-bold flex items-center space-x-2 disabled:opacity-50"
                                                >
                                                    {isLoadingAction ? (
                                                        <>
                                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                                            <span>Liberando...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <CheckCircle className="w-4 h-4" />
                                                            <span>Confirmar Liberación</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal de Crear Orden Manual */}
            <AnimatePresence>
                {isCreateOrderModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4 overflow-y-auto"
                        onClick={handleCloseCreateOrderModal}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: -20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white rounded-t-2xl sticky top-0 z-10">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold">Crear Orden Manual</h2>
                                        <p className="text-green-100 mt-1">Agrega una orden manualmente con todos los datos</p>
                                    </div>
                                    <button
                                        onClick={handleCloseCreateOrderModal}
                                        className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200 p-2 rounded-xl"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-6">
                                {/* Errores de validación */}
                                {validationErrors.length > 0 && (
                                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                                        <div className="flex items-start">
                                            <AlertTriangle className="w-5 h-5 text-red-600 mr-2 mt-0.5" />
                                            <div className="flex-1">
                                                <p className="font-semibold text-red-800 mb-2">Errores de validación:</p>
                                                <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                                                    {validationErrors.map((error, idx) => (
                                                        <li key={idx}>{error}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Seleccionar Rifa */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Rifa <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={selectedRaffleId}
                                        onChange={(e) => {
                                            setSelectedRaffleId(e.target.value);
                                            setManualTicketsInput('');
                                            setGiftTicketsInput('');
                                        }}
                                        className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-800 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                        required
                                    >
                                        <option value="">Selecciona una rifa</option>
                                        {raffles.map(raffle => (
                                            <option key={raffle.id} value={raffle.id}>
                                                {raffle.title} (${raffle.price} MXN - {raffle.tickets} boletos)
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Información de la rifa seleccionada */}
                                {selectedRaffleId && (() => {
                                    const selectedRaffle = raffles.find(r => r.id === selectedRaffleId);
                                    if (!selectedRaffle) return null;
                                    return (
                                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                                            <p className="text-sm text-blue-800">
                                                <strong>Rango de boletos:</strong> 1 - {selectedRaffle.tickets}
                                                {selectedRaffle.boletosConOportunidades && selectedRaffle.numeroOportunidades && selectedRaffle.numeroOportunidades > 1 && (
                                                    <span className="ml-2">
                                                        | <strong>Boletos de regalo:</strong> {selectedRaffle.tickets + 1} - {selectedRaffle.tickets * selectedRaffle.numeroOportunidades}
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    );
                                })()}

                                {/* Datos del Cliente */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Nombre del Cliente <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={customerName}
                                            onChange={(e) => setCustomerName(e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-800 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                            placeholder="Nombre completo"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Teléfono <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            value={customerPhone}
                                            onChange={(e) => setCustomerPhone(e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-800 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                            placeholder="1234567890"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Email (Opcional)
                                        </label>
                                        <input
                                            type="email"
                                            value={customerEmail}
                                            onChange={(e) => setCustomerEmail(e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-800 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                            placeholder="cliente@ejemplo.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Distrito (Opcional)
                                        </label>
                                        <input
                                            type="text"
                                            value={customerDistrict}
                                            onChange={(e) => setCustomerDistrict(e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-800 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                            placeholder="Distrito o ciudad"
                                        />
                                    </div>
                                </div>

                                {/* Boletos Manuales */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Boletos Manuales <span className="text-red-500">*</span>
                                        <span className="text-xs text-gray-500 ml-2">(Separados por comas o espacios, ej: 1, 2, 3 o 1 2 3)</span>
                                    </label>
                                    <textarea
                                        value={manualTicketsInput}
                                        onChange={(e) => setManualTicketsInput(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-800 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all resize-none"
                                        rows={3}
                                        placeholder="1, 2, 3, 4, 5"
                                        required
                                    />
                                    {manualTicketsInput && (
                                        <p className="text-xs text-gray-600 mt-1">
                                            Boletos ingresados: {parseTickets(manualTicketsInput).join(', ') || 'Ninguno válido'}
                                        </p>
                                    )}
                                </div>

                                {/* Boletos de Regalo (solo si la rifa tiene oportunidades) */}
                                {selectedRaffleId && (() => {
                                    const selectedRaffle = raffles.find(r => r.id === selectedRaffleId);
                                    if (!selectedRaffle || !selectedRaffle.boletosConOportunidades || !selectedRaffle.numeroOportunidades || selectedRaffle.numeroOportunidades <= 1) {
                                        return null;
                                    }
                                    return (
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Boletos de Regalo (Opcional)
                                                <span className="text-xs text-gray-500 ml-2">(Rango: {selectedRaffle.tickets + 1} - {selectedRaffle.tickets * selectedRaffle.numeroOportunidades})</span>
                                            </label>
                                            <textarea
                                                value={giftTicketsInput}
                                                onChange={(e) => setGiftTicketsInput(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-800 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all resize-none"
                                                rows={3}
                                                placeholder={`${selectedRaffle.tickets + 1}, ${selectedRaffle.tickets + 2}, ${selectedRaffle.tickets + 3}`}
                                            />
                                            {giftTicketsInput && (
                                                <p className="text-xs text-gray-600 mt-1">
                                                    Boletos de regalo ingresados: {parseTickets(giftTicketsInput).join(', ') || 'Ninguno válido'}
                                                </p>
                                            )}
                                        </div>
                                    );
                                })()}

                                {/* Estado y Método de Pago */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Estado Inicial
                                        </label>
                                        <select
                                            value={orderStatus}
                                            onChange={(e) => setOrderStatus(e.target.value as 'PENDING' | 'PAID' | 'COMPLETED')}
                                            className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-800 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                        >
                                            <option value="PENDING">Pendiente</option>
                                            <option value="PAID">Pagado</option>
                                            <option value="COMPLETED">Completado</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Método de Pago (Opcional)
                                        </label>
                                        <select
                                            value={paymentMethod}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-800 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                        >
                                            <option value="">Selecciona método</option>
                                            <option value="Transferencia">Transferencia</option>
                                            <option value="Depósito en Efectivo">Depósito en Efectivo</option>
                                            <option value="Punto de Venta">Punto de Venta</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Notas */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Notas (Opcional)
                                    </label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-800 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all resize-none"
                                        rows={3}
                                        placeholder="Notas adicionales sobre esta orden..."
                                    />
                                </div>

                                {/* Resumen */}
                                {selectedRaffleId && manualTicketsInput && (() => {
                                    const selectedRaffle = raffles.find(r => r.id === selectedRaffleId);
                                    if (!selectedRaffle) return null;
                                    const manualTickets = parseTickets(manualTicketsInput);
                                    const total = manualTickets.length * selectedRaffle.price;
                                    return (
                                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                                            <h3 className="font-semibold text-gray-900 mb-2">Resumen de la Orden</h3>
                                            <div className="space-y-1 text-sm text-gray-700">
                                                <p>Boletos manuales: {manualTickets.length}</p>
                                                {parseTickets(giftTicketsInput).length > 0 && (
                                                    <p>Boletos de regalo: {parseTickets(giftTicketsInput).length}</p>
                                                )}
                                                <p className="font-bold text-lg text-green-600">Total: ${total.toFixed(2)} MXN</p>
                                            </div>
                                        </div>
                                    );
                                })()}

                                {/* Botones */}
                                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                                    <button
                                        type="button"
                                        onClick={handleCloseCreateOrderModal}
                                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={validateAndCreateOrder}
                                        disabled={isCreatingOrder}
                                        className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all font-semibold flex items-center space-x-2 disabled:opacity-50"
                                    >
                                        {isCreatingOrder ? (
                                            <>
                                                <RefreshCw className="w-4 h-4 animate-spin" />
                                                <span>Creando...</span>
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="w-4 h-4" />
                                                <span>Crear Orden</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminCustomersPage;