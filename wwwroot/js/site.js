// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.


document.addEventListener('DOMContentLoaded', function () {
    // Get form elements

    //Register button timing logic
    const registerBtn = document.querySelector('.register-button-container');
    const showSequence = [6000, 11000, 6000, 6000, 50000, 11000]; // Initial sequence
    const finalInterval = 15000; // Repeating interval after sequence completes
    let currentIndex = 0;
    let sequenceComplete = false;

    //Other Question Field
    const questionType = document.getElementById('questionType');
    const otherContainer = document.getElementById('otherQuestionContainer');
    const otherInput = document.getElementById('otherQuestion');
    const otherLabel = document.querySelector('#otherQuestionContainer label');
    const helpForm = document.getElementById('helpForm');

    // Initialize - hide the field if not "Other"
    if (questionType && otherContainer && otherInput) {
        // Set initial state
        if (questionType.value !== 'other') {
            hideOtherField();
        }

        // Add change event listener
        questionType.addEventListener('change', function () {
            if (this.value === 'other') {
                showOtherField();
            } else {
                hideOtherField();
            }
        });
    }

    // Form submission handling
    if (helpForm) {
        helpForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            if (this.dataset.submitting) return; // Prevent double submission
            this.dataset.submitting = 'true';

            // Validate form
            if (!this.checkValidity()) {
                this.reportValidity();
                return;
            }

            await submitFormData(this);
        });
    }

    // Helper functions

    // RegisterButton function
    function showRegisterButton() {
        registerBtn.style.display = 'flex';
        registerBtn.style.animation = 'fadeIn 0.5s forwards';

        setTimeout(() => {
            registerBtn.style.animation = 'fadeOut 0.5s forwards';
            setTimeout(() => {
                registerBtn.style.display = 'none';
                scheduleNextAppearance();
            }, 500);
        }, 9500); // Visible for 9.5s
    }

    function scheduleNextAppearance() {
        if (!sequenceComplete) {
            if (currentIndex < showSequence.length - 1) {
                currentIndex++;
                setTimeout(showRegisterButton, showSequence[currentIndex]);
            } else {
                sequenceComplete = true;
                setTimeout(showRegisterButton, finalInterval);
            }
        } else {
            setTimeout(showRegisterButton, finalInterval);
        }
    }

    // Initial delay
    setTimeout(showRegisterButton, showSequence[0]);

    function showOtherField() {
        otherContainer.style.display = 'block';
        otherInput.required = true;

        // Trigger animations
        setTimeout(() => {
            otherContainer.style.opacity = '1';
            otherContainer.style.maxHeight = '200px';
            otherLabel.style.opacity = '1';
            otherLabel.style.maxHeight = '50px';
            otherInput.focus();
        }, 10);
    }

    function hideOtherField() {
        otherContainer.style.opacity = '0';
        otherContainer.style.maxHeight = '0';
        otherLabel.style.opacity = '0';
        otherLabel.style.maxHeight = '0';
        otherInput.required = false;
        otherInput.value = '';

        setTimeout(() => {
            otherContainer.style.display = 'none';
        }, 300);
    }

    async function submitFormData(form) {
        try {
            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';

            // Prepare form data
            const formData = {
                firstName: form.querySelector('#firstName').value,
                lastName: form.querySelector('#lastName').value,
                email: form.querySelector('#email').value,
                questionType: questionType.value,
                otherQuestion: questionType.value === 'other' ? otherInput.value : null
            };

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Show success message
            showSuccessMessage(form);

            // Reset form
            form.reset();
            hideOtherField();
        } catch (error) {
            console.error('Error:', error);
            alert('Submission failed. Please try again.');
        } finally {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane me-2"></i> Submit Question';
            }
        }
    }
    function showSuccessMessage(form) {
        // First remove any existing alerts
        const existingAlerts = form.parentNode.querySelectorAll('.alert-success');
        existingAlerts.forEach(alert => alert.remove());

        const successAlert = document.createElement('div');
        successAlert.className = 'alert alert-success mt-3 fade-in';
        successAlert.innerHTML = `
        <i class="fas fa-check-circle me-2"></i>
        <strong>Received!</strong> We'll contact you at ${form.email.value} within 24 hours.
    `;

        form.parentNode.insertBefore(successAlert, form.nextSibling);

        // Remove success message after 5 seconds
        setTimeout(() => {
            successAlert.classList.add('fade-out');
            setTimeout(() => successAlert.remove(), 300);
        }, 5000);
    }

});