// 3D Healthcare Survey Application - Traditional vs Modern Healthcare in India
class HealthcareSurvey3D {
    constructor() {
        this.surveyData = this.loadSurveyData();
        this.charts = {};
        this.chartInstances = {};
        this.colors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325', '#944454', '#13343B'];
        this.currentSlide = 0;
        this.slides = [];
        this.slideInterval = null;
        this.init();
    }

    init() {
        console.log('Initializing 3D Healthcare Survey App...');
        this.setupEventListeners();
        this.updateResponseCounter();
        this.initializeCharts();
        this.drawAllCharts();
        this.setup3DAnimations();
        this.addSampleData();
        // Setup slideshow after DOM is ready
        setTimeout(() => {
            this.setupTeamSlideshow();
        }, 500);
    }

    setupEventListeners() {
        // Survey form submission
        const form = document.getElementById('healthSurveyForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Navigation links with 3D smooth scrolling
        this.setupNavigation();

        // Window resize handler
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => {
                this.initializeCharts();
                this.drawAllCharts();
            }, 250);
        });

        // Intersection observer for entrance animations
        this.setupScrollAnimations();
    }

    setupNavigation() {
        document.querySelectorAll('.nav-link-3d').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href').substring(1);
                this.smoothScrollTo(targetId);
            });
        });

        // CTA button navigation
        document.querySelectorAll('a[href="#survey"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                this.smoothScrollTo('survey');
            });
        });
    }

    smoothScrollTo(targetId) {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 120; // Account for floating header
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    setup3DAnimations() {
        // Add entrance animations to cards with stagger effect
        const cards = document.querySelectorAll('.card-3d');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.2}s`;
        });

        // Add parallax effect to floating shapes
        window.addEventListener('scroll', () => {
            this.handleParallax();
        });

        // Add hover effects to 3D elements
        this.setup3DHoverEffects();
    }

    handleParallax() {
        const scrolled = window.pageYOffset;
        const shapes = document.querySelectorAll('.floating-shape');
        
        shapes.forEach((shape, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            shape.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.1}deg)`;
        });
    }

    setup3DHoverEffects() {
        // Enhanced hover effects for nav links
        document.querySelectorAll('.nav-link-3d').forEach(link => {
            link.addEventListener('mouseenter', () => {
                link.style.transform = 'translateZ(15px) rotateY(8deg) scale(1.05)';
            });
            
            link.addEventListener('mouseleave', () => {
                link.style.transform = 'translateZ(0) rotateY(0deg) scale(1)';
            });
        });

        // 3D tilt effect for stat cards
        document.querySelectorAll('.stat-card-3d').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const rotateX = (e.clientY - centerY) / 10;
                const rotateY = (centerX - e.clientX) / 10;
                
                card.style.transform = `translateZ(50px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateZ(20px) rotateX(0deg) rotateY(0deg) scale(1)';
            });
        });
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateZ(40px) rotateX(2deg) translateY(0)';
                }
            });
        }, observerOptions);

        document.querySelectorAll('.card-3d').forEach(card => {
            observer.observe(card);
        });
    }

    loadSurveyData() {
        const savedData = localStorage.getItem('healthcare3DSurveyData');
        if (savedData) {
            try {
                console.log('Loading survey data from localStorage:', savedData);
                return JSON.parse(savedData);
            } catch (e) {
                console.error('Error parsing saved data:', e);
            }
        }
        console.log('No survey data found in localStorage, initializing empty data.');
        return {
            age: {},
            preference: {},
            concerns: {},
            remedies: {},
            exercise: {},
            totalResponses: 0
        };
    }

    saveSurveyData() {
        try {
            localStorage.setItem('healthcare3DSurveyData', JSON.stringify(this.surveyData));
            console.log('Survey data saved to localStorage:', this.surveyData);
        } catch (e) {
            console.error('Error saving data:', e);
        }
    }

    updateResponseCounter() {
        const counter = document.getElementById('totalResponses');
        if (counter) {
            counter.textContent = this.surveyData.totalResponses;
        }
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitButton = form.querySelector('.btn-submit-3d');
        
        // Get form values
        const formData = {
            age: document.getElementById('age').value,
            preference: document.getElementById('preference').value,
            concerns: document.getElementById('concerns').value,
            remedies: document.getElementById('remedies').value,
            exercise: document.getElementById('exercise').value
        };

        // Validate form
        if (Object.values(formData).some(value => !value)) {
            this.showError('Please fill in all fields');
            return;
        }

        // Add 3D loading effect
        if (submitButton) {
            submitButton.textContent = 'Submitting...';
            submitButton.disabled = true;
            submitButton.style.transform = 'translateZ(10px) scale(0.95)';
            form.classList.add('loading');
        }
        
        // Simulate processing with 3D effects
        setTimeout(() => {
            // Update survey data
            this.updateSurveyData(formData);
            
            // Save to localStorage
            this.saveSurveyData();
            
            // Update UI with animations
            this.updateResponseCounter();
            this.updateChartsWithAnimation();
            
            // Show success message with 3D effect
            this.showSuccessMessage();
            
            // Reset form
            form.reset();
            
            // Reset button with 3D effect
            if (submitButton) {
                submitButton.textContent = 'Submit Survey';
                submitButton.disabled = false;
                submitButton.style.transform = 'translateZ(20px)';
                form.classList.remove('loading');
            }
        }, 1200);
    }

    updateSurveyData(formData) {
        Object.keys(formData).forEach(key => {
            const value = formData[key];
            this.surveyData[key][value] = (this.surveyData[key][value] || 0) + 1;
        });
        
        this.surveyData.totalResponses++;
        console.log('Survey data after update:', this.surveyData);
    }

    showSuccessMessage() {
        const successMessage = document.getElementById('successMessage');
        if (successMessage) {
            successMessage.classList.remove('hidden');
            successMessage.classList.add('show');
            
            setTimeout(() => {
                successMessage.classList.add('hidden');
                successMessage.classList.remove('show');
            }, 5000);
        }
    }

    showError(message) {
        alert(message); // Simple error handling - could be enhanced with 3D modal
    }

    initializeCharts() {
        // Destroy existing chart instances
        Object.values(this.chartInstances).forEach(chart => {
            if (chart) chart.destroy();
        });
        this.chartInstances = {};

        const chartIds = ['ageChart', 'preferenceChart', 'concernsChart', 'remediesChart', 'exerciseChart'];
        
        chartIds.forEach(id => {
            const canvas = document.getElementById(id);
            if (canvas) {
                const ctx = canvas.getContext('2d');
                this.charts[id] = { canvas, ctx };
            }
        });
    }

    updateChartsWithAnimation() {
        // Add stagger animation to chart updates
        const chartIds = Object.keys(this.charts);
        chartIds.forEach((chartId, index) => {
            setTimeout(() => {
                this.drawChart(chartId);
            }, index * 200);
        });
    }

    drawAllCharts() {
        if (this.charts.ageChart) this.drawChart('ageChart');
        if (this.charts.preferenceChart) this.drawChart('preferenceChart');
        if (this.charts.concernsChart) this.drawChart('concernsChart');
        if (this.charts.remediesChart) this.drawChart('remediesChart');
        if (this.charts.exerciseChart) this.drawChart('exerciseChart');
    }

    drawChart(chartId) {
        const canvas = document.getElementById(chartId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const dataKey = chartId.replace('Chart', '');
        const data = this.surveyData[dataKey];
        
        // Destroy existing Chart.js instance if it exists
        if (this.chartInstances[chartId]) {
            this.chartInstances[chartId].destroy();
        }

        if (Object.keys(data).length === 0) {
            this.drawNoDataMessage(ctx, canvas.width, canvas.height);
            return;
        }

        const chartData = this.prepareChartData(data);
        console.log(`Drawing chart ${chartId} with data:`, chartData); // Log chart data
        const chartConfig = this.getChartConfig(chartId, chartData);
        
        this.chartInstances[chartId] = new Chart(ctx, chartConfig);
    }

    prepareChartData(data) {
        const entries = Object.entries(data);
        return {
            labels: entries.map(([key]) => key),
            values: entries.map(([, value]) => value),
            colors: entries.map((_, index) => this.colors[index % this.colors.length])
        };
    }

    getChartConfig(chartId, chartData) {
        const isPieChart = chartId === 'ageChart' || chartId === 'remediesChart';
        
        const baseConfig = {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        font: {
                            family: 'Open Sans',
                            size: 12
                        },
                        padding: 15,
                        usePointStyle: true,
                        color: '#626871'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: {
                        family: 'Open Sans',
                        weight: '600'
                    },
                    bodyFont: {
                        family: 'Open Sans'
                    },
                    cornerRadius: 8,
                    displayColors: true
                }
            }
        };

        if (isPieChart) {
            return {
                type: 'doughnut',
                data: {
                    labels: chartData.labels,
                    datasets: [{
                        data: chartData.values,
                        backgroundColor: chartData.colors,
                        borderWidth: 2,
                        borderColor: '#ffffff',
                        hoverBorderWidth: 3,
                        hoverBorderColor: '#ffffff'
                    }]
                },
                options: {
                    ...baseConfig,
                    cutout: '50%',
                    radius: '80%'
                }
            };
        } else {
            return {
                type: 'bar',
                data: {
                    labels: chartData.labels,
                    datasets: [{
                        data: chartData.values,
                        backgroundColor: chartData.colors,
                        borderColor: chartData.colors,
                        borderWidth: 2,
                        borderRadius: 6,
                        borderSkipped: false,
                    }]
                },
                options: {
                    ...baseConfig,
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            ticks: {
                                font: {
                                    family: 'Open Sans'
                                },
                                color: '#626871'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            },
                            ticks: {
                                font: {
                                    family: 'Open Sans'
                                },
                                color: '#626871',
                                maxRotation: 45
                            }
                        }
                    }
                }
            };
        }
    }

    drawNoDataMessage(ctx, width, height) {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#999';
        ctx.font = '16px Open Sans';
        ctx.textAlign = 'center';
        ctx.fillText('No data available yet', width / 2, height / 2 - 10);
        ctx.font = '14px Open Sans';
        ctx.fillText('Submit the survey to see results!', width / 2, height / 2 + 15);
    }

    // 3D Team Slideshow - Fixed Implementation
    setupTeamSlideshow() {
        console.log('Setting up team slideshow...');
        this.slides = document.querySelectorAll('.slide-3d');
        const dots = document.querySelectorAll('.dot-3d');
        
        if (this.slides.length === 0) {
            console.log('No slides found');
            return;
        }

        console.log(`Found ${this.slides.length} slides`);

        // Initialize slideshow - show first slide
        this.currentSlide = 0;
        this.showSlide(0);

        // Setup dot click handlers
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                console.log(`Dot clicked: ${index}`);
                this.goToSlide(index);
            });
        });

        // Setup hover handlers to pause/resume slideshow
        const slideshowContainer = document.querySelector('.team-slideshow-3d');
        if (slideshowContainer) {
            slideshowContainer.addEventListener('mouseenter', () => {
                this.stopSlideshow();
            });
            
            slideshowContainer.addEventListener('mouseleave', () => {
                this.startSlideshow();
            });
        }

        // Start automatic slideshow
        this.startSlideshow();
    }

    showSlide(slideIndex) {
        // Hide all slides
        this.slides.forEach((slide, index) => {
            slide.classList.remove('active');
            slide.style.display = 'none';
        });

        // Remove active class from all dots
        document.querySelectorAll('.dot-3d').forEach(dot => {
            dot.classList.remove('active');
        });

        // Show current slide
        if (this.slides[slideIndex]) {
            this.slides[slideIndex].style.display = 'block';
            this.slides[slideIndex].classList.add('active');
            
            // Activate corresponding dot
            const correspondingDot = document.querySelectorAll('.dot-3d')[slideIndex];
            if (correspondingDot) {
                correspondingDot.classList.add('active');
            }
            
            this.currentSlide = slideIndex;
            console.log(`Showing slide ${slideIndex}`);
        }
    }

    goToSlide(slideIndex) {
        if (slideIndex >= 0 && slideIndex < this.slides.length) {
            this.showSlide(slideIndex);
        }
    }

    nextSlide() {
        const nextSlide = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextSlide);
    }

    prevSlide() {
        const prevSlide = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
        this.goToSlide(prevSlide);
    }

    startSlideshow() {
        this.stopSlideshow(); // Clear any existing interval
        this.slideInterval = setInterval(() => {
            this.nextSlide();
        }, 4000); // Change slide every 4 seconds
        console.log('Slideshow started');
    }

    stopSlideshow() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
            this.slideInterval = null;
            console.log('Slideshow stopped');
        }
    }

    addSampleData() {
        // Add sample data if no data exists (for demonstration)
        if (this.surveyData.totalResponses === 0) {
            console.log('Adding sample data for demonstration...');
            const sampleResponses = [
                { age: '26-35', preference: 'Modern Medicine', concerns: 'Chronic Diseases', remedies: 'Sometimes', exercise: '3-4 times/week' },
                { age: '18-25', preference: 'Mixed Approach', concerns: 'Preventive Care', remedies: 'Often', exercise: 'Daily' },
                { age: '36-45', preference: 'Traditional Methods', concerns: 'Digestive Issues', remedies: 'Always', exercise: '1-2 times/week' },
                { age: '26-35', preference: 'Ayurveda', concerns: 'Mental Health', remedies: 'Often', exercise: '5-6 times/week' },
                { age: '46-55', preference: 'Modern Medicine', concerns: 'Lifestyle Disorders', remedies: 'Rarely', exercise: '3-4 times/week' },
                { age: '18-25', preference: 'Mixed Approach', concerns: 'Mental Health', remedies: 'Sometimes', exercise: 'Daily' },
                { age: '56+', preference: 'Traditional Methods', concerns: 'Chronic Diseases', remedies: 'Always', exercise: '1-2 times/week' },
                { age: '36-45', preference: 'Homeopathy', concerns: 'Preventive Care', remedies: 'Often', exercise: '3-4 times/week' }
            ];
            
            sampleResponses.forEach(response => {
                this.updateSurveyData(response);
            });
            
            this.saveSurveyData();
            this.updateResponseCounter();
            
            setTimeout(() => {
                this.drawAllCharts();
            }, 1000);
        }
    }
}

// Enhanced form validation and user experience
class FormEnhancer {
    static enhance() {
        const formInputs = document.querySelectorAll('.form-control-3d');
        
        formInputs.forEach(input => {
            // Add change listener with 3D effects
            input.addEventListener('change', function() {
                this.classList.remove('error');
                if (this.value) {
                    this.classList.add('filled');
                    this.style.transform = 'translateZ(8px)';
                } else {
                    this.classList.remove('filled');
                    this.style.transform = 'translateZ(5px)';
                }
            });
            
            // Add focus/blur listeners for 3D effects
            input.addEventListener('focus', function() {
                this.classList.add('focused');
                this.style.transform = 'translateZ(12px)';
                this.style.boxShadow = '0 8px 25px rgba(31, 184, 205, 0.2)';
            });
            
            input.addEventListener('blur', function() {
                this.classList.remove('focused');
                this.style.transform = this.value ? 'translateZ(8px)' : 'translateZ(5px)';
                this.style.boxShadow = '';
            });
            
            // Initialize filled state
            if (input.value) {
                input.classList.add('filled');
            }
        });
    }
}

// 3D Navigation Enhancement
class Navigation3D {
    static enhance() {
        // Add active state tracking
        const navLinks = document.querySelectorAll('.nav-link-3d');
        const sections = document.querySelectorAll('.section-3d, .hero-3d');
        
        // Intersection observer for active nav states
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '-120px 0px -60% 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const targetId = entry.target.id;
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${targetId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            if (section.id) {
                observer.observe(section);
            }
        });
    }
}

// Performance monitoring and error handling
class PerformanceMonitor {
    static init() {
        // Log performance metrics
        window.addEventListener('load', () => {
            if (performance.getEntriesByType) {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page load time:', Math.round(perfData.loadEventEnd - perfData.fetchStart), 'ms');
            }
        });

        // Error handling
        window.addEventListener('error', (e) => {
            console.error('Application error:', {
                message: e.error?.message || 'Unknown error',
                filename: e.filename,
                lineno: e.lineno,
                colno: e.colno
            });
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
        });
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing 3D Healthcare Survey App...');
    
    // Initialize main application
    const surveyApp = new HealthcareSurvey3D();
    
    // Enhance form interactions
    FormEnhancer.enhance();
    
    // Enhance navigation
    Navigation3D.enhance();
    
    // Initialize performance monitoring
    PerformanceMonitor.init();
    
    // Keyboard navigation enhancements
    document.addEventListener('keydown', (e) => {
        // ESC key to close modals/messages
        if (e.key === 'Escape') {
            const successMessage = document.getElementById('successMessage');
            if (successMessage && !successMessage.classList.contains('hidden')) {
                successMessage.classList.add('hidden');
            }
        }
        
        // Arrow keys for slideshow navigation
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            const activeSlide = document.querySelector('.slide-3d.active');
            if (activeSlide && document.activeElement.closest('.team-slideshow-3d')) {
                e.preventDefault();
                if (e.key === 'ArrowRight') {
                    surveyApp.nextSlide();
                } else {
                    surveyApp.prevSlide();
                }
            }
        }
    });
    
    // Make survey app globally accessible for debugging
    window.healthcareSurvey3D = surveyApp;
    
    console.log('3D Healthcare Survey App initialized successfully!');
});

// Utility functions
const Utils = {
    // Debounce function for performance
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Format numbers with commas
    formatNumber: (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    
    // Generate random ID
    generateId: () => {
        return Math.random().toString(36).substr(2, 9);
    }
};