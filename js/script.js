// Main app functionality
const App = {
    init() {
        this.mobileMenu();
        this.scrollEffects();
        this.pricingToggle();
        this.formHandling();
        this.initAnimations();
        this.mentorFilters();
        this.bookingSystem();
        this.initServices();
    },

    // Mobile menu toggle
    mobileMenu() {
        const menuBtn = document.querySelector('.menu-toggle');
        const nav = document.querySelector('.nav-links');
        const navbar = document.querySelector('.navbar');
        
        if (!menuBtn || !nav || !navbar) return;

        // Add scroll direction detection
        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            // Add background and shadow when scrolled
            if (currentScroll > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            // Hide/show navbar based on scroll direction
            if (currentScroll > lastScroll && currentScroll > 500) {
                navbar.classList.add('nav-hidden');
            } else {
                navbar.classList.remove('nav-hidden');
            }
            
            lastScroll = currentScroll;
        });

        // Toggle menu
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            menuBtn.classList.toggle('open');
            nav.classList.toggle('active');
            navbar.classList.toggle('menu-active');
        });

        // Handle dropdown menus
        const dropdowns = document.querySelectorAll('.nav-dropdown');
        dropdowns.forEach(dropdown => {
            const trigger = dropdown.querySelector('.dropdown-trigger');
            const content = dropdown.querySelector('.dropdown-content');
            
            if (trigger && content) {
                trigger.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Close other dropdowns
                    dropdowns.forEach(d => {
                        if (d !== dropdown) {
                            d.classList.remove('active');
                        }
                    });
                    
                    dropdown.classList.toggle('active');
                });
            }
        });

        // Close menu and dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-links')) {
                dropdowns.forEach(d => d.classList.remove('active'));
            }
            
            if (!e.target.closest('.nav-links') && !e.target.closest('.menu-toggle')) {
                nav.classList.remove('active');
                menuBtn.classList.remove('open');
                navbar.classList.remove('menu-active');
            }
        });

        // Handle keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                dropdowns.forEach(d => d.classList.remove('active'));
                nav.classList.remove('active');
                menuBtn.classList.remove('open');
                navbar.classList.remove('menu-active');
            }
        });
    },

    // Pricing toggle functionality
    pricingToggle() {
        const toggle = document.getElementById('billing-toggle');
        if (!toggle) return;

        const prices = {
            starter: { monthly: 199, yearly: 1908 },
            pro: { monthly: 399, yearly: 3828 },
            expert: { monthly: 699, yearly: 6708 }
        };

        toggle.addEventListener('change', function() {
            const isYearly = this.checked;
            
            document.querySelectorAll('.price-card').forEach(card => {
                const plan = card.classList.contains('starter') ? 'starter' : 
                            card.classList.contains('pro') ? 'pro' : 'expert';
                
                const amount = card.querySelector('.amount');
                const period = card.querySelector('.period');
                
                if (amount && period) {
                    amount.textContent = isYearly ? prices[plan].yearly : prices[plan].monthly;
                    period.textContent = isYearly ? '/year' : '/month';
                }
            });
        });
    },

    // Scroll effects
    scrollEffects() {
        const nav = document.querySelector('nav');
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                nav?.classList.add('scrolled');
            } else {
                nav?.classList.remove('scrolled');
            }
        });

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    },

    // Form handling
    formHandling() {
        const form = document.querySelector('.contact-form');
        if (!form) return;

        const submitBtn = form.querySelector('.submit-btn');
        const submitBtnText = submitBtn.innerHTML;

        const updateButtonState = (state, message) => {
            submitBtn.className = 'submit-btn ' + state;
            submitBtn.innerHTML = message;
        };

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!this.validateForm(form)) {
                updateButtonState('error', '<i class="fas fa-exclamation-circle"></i> Please check fields');
                this.showNotification('Please fill in all fields correctly', 'error');
                
                setTimeout(() => {
                    updateButtonState('', submitBtnText);
                }, 2000);
                return;
            }

            try {
                // Loading state
                updateButtonState('loading', '<i class="fas fa-spinner"></i> Sending...');
                submitBtn.disabled = true;

                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 2000));

                // Success state
                updateButtonState('success', '<i class="fas fa-check-circle"></i> Sent Successfully!');
                this.showNotification('Message sent successfully!', 'success');
                form.reset();

                // Reset button after delay
                setTimeout(() => {
                    submitBtn.disabled = false;
                    updateButtonState('', submitBtnText);
                }, 2000);

            } catch (error) {
                // Error state
                updateButtonState('error', '<i class="fas fa-times-circle"></i> Failed to Send');
                this.showNotification('Failed to send message. Please try again.', 'error');

                setTimeout(() => {
                    submitBtn.disabled = false;
                    updateButtonState('', submitBtnText);
                }, 2000);
            }
        });

        // Add ripple effect on button click
        submitBtn.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.left = `${e.clientX - rect.left}px`;
            ripple.style.top = `${e.clientY - rect.top}px`;
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 1000);
        });

        // Add real-time validation
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.validateInput(input);
                this.updateSubmitButton(form, submitBtn);
            });
        });
    },

    validateInput(input) {
        const formGroup = input.closest('.form-group');
        const value = input.value.trim();
        let isValid = true;

        if (!value) {
            this.setError(formGroup, 'This field is required');
            isValid = false;
        } else if (input.type === 'email' && !this.isValidEmail(value)) {
            this.setError(formGroup, 'Please enter a valid email');
            isValid = false;
        } else {
            this.setSuccess(formGroup);
        }

        return isValid;
    },

    validateForm(form) {
        const inputs = form.querySelectorAll('input, select, textarea');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateInput(input)) {
                isValid = false;
            }
        });

        return isValid;
    },

    updateSubmitButton(form, submitBtn) {
        const isValid = Array.from(form.querySelectorAll('.form-group'))
            .every(group => !group.classList.contains('error'));

        submitBtn.disabled = !isValid;
        submitBtn.style.opacity = isValid ? '1' : '0.7';
    },

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    setError(formGroup, message) {
        formGroup.classList.remove('success');
        formGroup.classList.add('error');
        const errorDisplay = formGroup.querySelector('.error-message');
        if (errorDisplay) {
            errorDisplay.textContent = message;
        }
    },

    setSuccess(formGroup) {
        formGroup.classList.remove('error');
        formGroup.classList.add('success');
    },

    // Initialize animations
    initAnimations() {
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '50px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.mentor-card, .animate').forEach(el => {
            observer.observe(el);
        });
    },

    // Notification system
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 10);

        // Remove notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    },

    // Add new methods for mentor page
    mentorFilters() {
        const filterBtns = document.querySelectorAll('.expertise-tags .tag');
        const mentorCards = document.querySelectorAll('.mentor-card');

        if (!filterBtns.length || !mentorCards.length) return;

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.dataset.filter;

                // Filter mentor cards
                mentorCards.forEach(card => {
                    if (filter === 'all' || card.dataset.category === filter) {
                        card.style.display = 'block';
                        // Add animation
                        card.style.opacity = '0';
                        setTimeout(() => {
                            card.style.opacity = '1';
                        }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    },

    bookingSystem() {
        const modal = document.getElementById('bookingModal');
        const bookBtns = document.querySelectorAll('.book-session-btn');
        
        if (!modal || !bookBtns.length) return;

        // Set minimum date to today
        const dateInput = modal.querySelector('#date');
        if (dateInput) {
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            dateInput.min = tomorrow.toISOString().split('T')[0];
        }

        // Handle booking button clicks
        bookBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const mentorCard = btn.closest('.mentor-card');
                const mentorName = mentorCard.querySelector('h3').textContent;
                const modalTitle = modal.querySelector('.modal-header h2');
                if (modalTitle) {
                    modalTitle.textContent = `Book a Session with ${mentorName}`;
                }
                modal.classList.add('active');
            });
        });

        // Close modal
        const closeBtn = modal.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('active');
            });
        }

        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });

        // Handle form submission
        const bookingForm = modal.querySelector('.booking-form');
        if (bookingForm) {
            bookingForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const submitBtn = bookingForm.querySelector('button[type="submit"]');
                
                try {
                    submitBtn.disabled = true;
                    submitBtn.textContent = 'Booking...';

                    // Collect form data
                    const formData = new FormData(bookingForm);
                    const data = Object.fromEntries(formData.entries());

                    // Validate form data
                    if (!this.validateBooking(data)) {
                        throw new Error('Please fill in all required fields');
                    }

                    // Simulate API call
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                    this.showNotification('Session booked successfully!', 'success');
                    modal.classList.remove('active');
                    bookingForm.reset();

                } catch (error) {
                    this.showNotification(error.message, 'error');
                } finally {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Confirm Booking';
                }
            });
        }
    },

    validateBooking(data) {
        return (
            data.date?.trim() &&
            data.time?.trim() &&
            data.topic?.trim()
        );
    },

    // Initialize services page features
    initServices() {
        this.techBubbles();
        this.cardFlip();
        this.roadmapProgress();
        this.aiChat();
    },

    // Tech bubbles animation
    techBubbles() {
        const techStack = [
            { name: 'React', color: '#61dafb' },
            { name: 'Vue', color: '#42b883' },
            { name: 'Angular', color: '#dd1b16' },
            { name: 'Node.js', color: '#68a063' },
            { name: 'Python', color: '#ffd43b' },
            { name: 'JavaScript', color: '#f7df1e' },
            { name: 'TypeScript', color: '#007acc' },
            { name: 'Docker', color: '#2496ed' },
            { name: 'AWS', color: '#ff9900' },
            { name: 'MongoDB', color: '#47a248' },
            { name: 'GraphQL', color: '#e535ab' },
            { name: 'Git', color: '#f05032' }
        ];

        const container = document.querySelector('.tech-bubbles');
        if (!container) return;

        function createBubble() {
            const tech = techStack[Math.floor(Math.random() * techStack.length)];
            const bubble = document.createElement('div');
            bubble.className = 'tech-bubble';
            bubble.textContent = tech.name;
            
            // Start from random positions along the bottom
            const startX = Math.random() * window.innerWidth;
            bubble.style.left = `${startX}px`;
            bubble.style.bottom = '-50px';
            
            // Set random float speed and distance
            const duration = 15 + Math.random() * 10;
            const horizontalMovement = Math.random() * 100 - 50; // -50px to 50px

            bubble.style.setProperty('--duration', `${duration}s`);
            bubble.style.setProperty('--move-x', `${horizontalMovement}px`);
            
            // Interactive effects
            bubble.addEventListener('mouseenter', () => {
                bubble.style.background = `rgba(${hexToRgb(tech.color)}, 0.3)`;
                bubble.style.borderColor = tech.color;
                bubble.style.color = tech.color;
                bubble.style.transform = 'scale(1.2)';
            });

            bubble.addEventListener('mouseleave', () => {
                bubble.style.background = '';
                bubble.style.borderColor = '';
                bubble.style.color = '';
                bubble.style.transform = '';
            });

            container.appendChild(bubble);

            // Remove bubble when animation ends
            bubble.addEventListener('animationend', () => {
                bubble.remove();
                createBubble();
            });
        }

        // Create initial bubbles
        for (let i = 0; i < 15; i++) {
            setTimeout(createBubble, i * 200);
        }

        // Helper function for color conversion
        function hexToRgb(hex) {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? 
                `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` 
                : '255, 255, 255';
        }
    },

    // 3D Card flip
    cardFlip() {
        const cards = document.querySelectorAll('.path-card');
        
        cards.forEach(card => {
            const flipBtns = card.querySelectorAll('.flip-btn');
            flipBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    card.classList.toggle('flipped');
                });
            });

            // Enroll button handler
            const enrollBtn = card.querySelector('.enroll-btn');
            if (enrollBtn) {
                enrollBtn.addEventListener('click', () => {
                    this.showNotification('Redirecting to enrollment...', 'success');
                });
            }
        });
    },

    // Interactive roadmap
    roadmapProgress() {
        const navBtns = document.querySelectorAll('.roadmap-nav .nav-btn');
        const timelinePoints = document.querySelectorAll('.timeline-point');
        
        if (!navBtns.length) return;

        navBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                navBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Show corresponding timeline point
                const week = btn.dataset.week;
                timelinePoints.forEach(point => {
                    point.classList.remove('active');
                    if (point.dataset.week === week) {
                        point.classList.add('active');
                        // Animate progress bars
                        const progressBars = point.querySelectorAll('.progress');
                        progressBars.forEach(bar => {
                            const target = Math.random() * 100;
                            bar.style.width = '0%';
                            setTimeout(() => {
                                bar.style.width = `${target}%`;
                            }, 100);
                        });
                    }
                });
            });
        });
    },

    // AI Chat interface
    aiChat() {
        const chatInterface = document.querySelector('.chat-interface');
        if (!chatInterface) return;

        const messagesContainer = chatInterface.querySelector('.chat-messages');
        const input = chatInterface.querySelector('input');
        const sendBtn = chatInterface.querySelector('.send-btn');

        const addMessage = (content, isUser = false) => {
            const message = document.createElement('div');
            message.className = `chat-message ${isUser ? 'user' : 'ai'}`;
            message.innerHTML = `
                <div class="message-content">
                    <span class="avatar">
                        ${isUser ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>'}
                    </span>
                    <p>${content}</p>
                </div>
            `;
            messagesContainer.appendChild(message);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        };

        const handleMessage = async (content) => {
            if (!content.trim()) return;
            
            addMessage(content, true);
            input.value = '';

            // Simulate AI response
            const thinking = document.createElement('div');
            thinking.className = 'ai-thinking';
            thinking.innerHTML = '<span>AI is thinking...</span>';
            messagesContainer.appendChild(thinking);

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            thinking.remove();

            // Sample responses
            const responses = [
                "I can help you with that! Let's break it down step by step.",
                "That's a great question about coding. Here's what you need to know...",
                "I understand what you're trying to achieve. Have you considered..."
            ];
            
            addMessage(responses[Math.floor(Math.random() * responses.length)]);
        };

        sendBtn.addEventListener('click', () => handleMessage(input.value));
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleMessage(input.value);
        });

        // Initial greeting
        setTimeout(() => {
            addMessage("Hi! I'm your AI coding assistant. How can I help you today?");
        }, 500);
    }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => App.init()); 