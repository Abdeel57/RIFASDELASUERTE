import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Raffle } from '../types';
import CountdownTimer from './CountdownTimer';
// Removed ShoppingBag import - no longer needed
import ResponsiveImage from './ResponsiveImage';
import { getSettings } from '../services/api';

interface HeroRaffleProps {
    raffle: Raffle;
}

const HeroRaffle: React.FC<HeroRaffleProps> = ({ raffle }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const [showCountdown, setShowCountdown] = useState<boolean>(true);
    const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

    // Preparar imágenes: incluir imagen principal + galería (evitando duplicados)
    const allImages = (() => {
        const images: string[] = [];
        
        // Agregar imageUrl si existe
        if (raffle.imageUrl) {
            images.push(raffle.imageUrl);
        }
        
        // Agregar heroImage si existe y no está duplicado
        if (raffle.heroImage && !images.includes(raffle.heroImage)) {
            images.push(raffle.heroImage);
        }
        
        // Agregar galería si existe (evitando duplicados)
        if (raffle.gallery && raffle.gallery.length > 0) {
            raffle.gallery.forEach(img => {
                if (!images.includes(img)) {
                    images.push(img);
                }
            });
        }
        
        // Si no hay ninguna imagen, usar default
        if (images.length === 0) {
            return ['https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=1200&h=600&fit=crop'];
        }
        
        return images;
    })();

    // Función para iniciar el cambio automático
    const startAutoChange = React.useCallback(() => {
        if (allImages.length > 1) {
            // Limpiar intervalo anterior si existe
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            
            // Crear nuevo intervalo de 7 segundos
            intervalRef.current = setInterval(() => {
                setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
            }, 7000);
        }
    }, [allImages.length]);

    // Función para cambiar de imagen y reiniciar el contador
    const changeImage = React.useCallback((newIndex: number, isManual: boolean = false) => {
        setCurrentImageIndex(newIndex);
        
        // Si es un cambio manual, reiniciar el intervalo
        if (isManual) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            // Reiniciar el intervalo después de un breve delay
            setTimeout(() => {
                if (allImages.length > 1) {
                    intervalRef.current = setInterval(() => {
                        setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
                    }, 7000);
                }
            }, 100);
        }
    }, [allImages.length]);

    // Cambio automático - activo en desktop y móvil
    useEffect(() => {
        if (allImages.length > 1) {
            startAutoChange();
            return () => {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                }
            };
        }
    }, [allImages.length, startAutoChange]);

    // Cargar configuración de mostrar contador
    useEffect(() => {
        getSettings().then(settings => {
            const prefs = (settings as any)?.displayPreferences;
            if (prefs?.showCountdown !== undefined) {
                setShowCountdown(prefs.showCountdown);
            }
        }).catch(() => {
            // En caso de error, mantener el valor por defecto (true)
        });
    }, []);

    // Detectar móvil para desactivar animaciones
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    // Funciones para manejar swipe en móviles
    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe && allImages.length > 1) {
            // Deslizar izquierda - siguiente imagen
            const nextIndex = (currentImageIndex + 1) % allImages.length;
            changeImage(nextIndex, true);
        } else if (isRightSwipe && allImages.length > 1) {
            // Deslizar derecha - imagen anterior
            const prevIndex = (currentImageIndex - 1 + allImages.length) % allImages.length;
            changeImage(prevIndex, true);
        }
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-secondary to-tertiary">
            {/* Imagen principal como fondo de pantalla completa */}
            <div 
                className="absolute inset-0 w-full h-full"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                {isMobile ? (
                    // Móvil: Con animaciones y soporte para swipe
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentImageIndex}
                            className="w-full h-full"
                            initial={{ opacity: 0, x: 0 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <ResponsiveImage
                                src={allImages[currentImageIndex]}
                                alt={raffle.title}
                                widths={[1200, 1920]}
                                sizesHint="100vw"
                                preferFormat="auto"
                                loading="eager"
                                decoding="async"
                                fetchPriority="high"
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                    </AnimatePresence>
                ) : (
                    // Desktop: Con animaciones
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentImageIndex}
                            className="w-full h-full"
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.5 }}
                        >
                            <ResponsiveImage
                                src={allImages[currentImageIndex]}
                                alt={raffle.title}
                                widths={[1920, 2560]}
                                sizesHint="100vw"
                                preferFormat="auto"
                                loading="eager"
                                decoding="async"
                                fetchPriority="high"
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                    </AnimatePresence>
                )}
                
                {/* Overlay oscuro para legibilidad - Más oscuro en móvil para mejor contraste */}
                <div className="absolute inset-0 bg-black/40 sm:bg-black/35"></div>
                
                {/* Patrón de textura deshabilitado (se removió la marca de agua) */}
                
                {/* Flechas de navegación */}
                {allImages.length > 1 && (
                    <>
                        {/* Flecha izquierda - Imagen anterior */}
                        <button
                            onClick={() => {
                                const prevIndex = (currentImageIndex - 1 + allImages.length) % allImages.length;
                                changeImage(prevIndex, true);
                            }}
                            className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center transition-all duration-300 opacity-60 hover:opacity-100 cursor-pointer"
                            aria-label="Imagen anterior"
                        >
                            <svg 
                                className="w-6 h-6 md:w-8 md:h-8 text-white drop-shadow-lg" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        
                        {/* Flecha derecha - Siguiente imagen */}
                        <button
                            onClick={() => {
                                const nextIndex = (currentImageIndex + 1) % allImages.length;
                                changeImage(nextIndex, true);
                            }}
                            className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center transition-all duration-300 opacity-60 hover:opacity-100 cursor-pointer"
                            aria-label="Siguiente imagen"
                        >
                            <svg 
                                className="w-6 h-6 md:w-8 md:h-8 text-white drop-shadow-lg" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </>
                )}
            </div>

            {/* Contenido centrado sobre la imagen */}
            <div className="container mx-auto px-4 relative z-10 min-h-screen flex flex-col justify-between py-4 sm:py-8">
                {/* Título y descripción en la parte superior */}
                <motion.div
                    initial={isMobile ? { opacity: 0 } : { opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={isMobile ? { duration: 0.4 } : { duration: 0.8 }}
                    className="flex flex-col items-center text-center space-y-2 sm:space-y-3 md:space-y-4 pt-8 sm:pt-12 md:pt-16 lg:pt-20"
                >
                    {/* Título - Mejorado para móvil */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-tight sm:leading-none max-w-[95%] sm:max-w-4xl px-2 sm:px-0 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                        {raffle.title}
                    </h1>

                    {/* Descripción (solo si existe) - Mejorada para móvil */}
                    {raffle.description && (
                        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white font-bold sm:font-black tracking-wide max-w-[95%] sm:max-w-2xl leading-relaxed sm:leading-tight px-2 sm:px-0 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
                            {raffle.description}
                        </p>
                    )}
                </motion.div>

                {/* Sección de compra y contador - En la parte inferior como pie de página - Mejorada para móvil */}
                <motion.div
                    initial={isMobile ? { opacity: 0 } : { opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={isMobile ? { duration: 0.4, delay: 0.1 } : { duration: 0.8, delay: 0.2 }}
                    className="flex flex-col items-center pb-4 sm:pb-8 md:pb-12 w-full"
                >
                    <div className="w-full max-w-[95%] sm:max-w-[90%] md:max-w-[85%] lg:max-w-[80%] bg-white/15 backdrop-blur-md rounded-2xl sm:rounded-3xl px-4 sm:px-5 md:px-6 lg:px-7 py-4 sm:py-4 md:py-5 border border-white/30 shadow-2xl"
                    >
                        {/* Botón principal - Comprar Boletos - Optimizado para móvil */}
                        <Link
                            to={`/sorteo/${raffle.slug}`}
                            className="inline-flex items-center justify-center gap-0 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-black text-sm sm:text-base md:text-lg lg:text-xl px-6 sm:px-8 md:px-10 lg:px-12 py-3 sm:py-3 md:py-3.5 rounded-xl sm:rounded-2xl shadow-2xl hover:shadow-green-500/50 active:scale-95 transition-all duration-300 w-full mb-3 sm:mb-4"
                        >
                            <span className="uppercase tracking-wide">COMPRAR BOLETOS</span>
                        </Link>

                        {/* Contador de tiempo - Mejorado para móvil */}
                        {showCountdown && (
                            <>
                                <div className="mb-2 sm:mb-3 md:mb-4 text-center">
                                    <p className="text-white/90 text-xs sm:text-sm md:text-base font-semibold sm:font-medium drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">El sorteo termina en:</p>
                                </div>
                                <div className="flex justify-center">
                                    <CountdownTimer targetDate={raffle.drawDate} />
                                </div>
                            </>
                        )}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default HeroRaffle;

