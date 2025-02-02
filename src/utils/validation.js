export const validatePassword = (password) => {
    const requirements = {
        minLength: 8,
        maxLength: 100,
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]+$/
    };

    if (!password) {
        throw new Error('Password is required');
    }

    if (password.length < requirements.minLength) {
        throw new Error(`Password must be at least ${requirements.minLength} characters long`);
    }

    if (password.length > requirements.maxLength) {
        throw new Error('Password is too long');
    }

    if (!requirements.pattern.test(password)) {
        throw new Error('Password must contain at least one uppercase letter, one lowercase letter, and one number');
    }

    return true;
};

export const validateUsername = (username) => {
    const requirements = {
        minLength: 4,
        maxLength: 30,
        pattern: /^[a-zA-Z0-9_]+$/
    };

    if (!username) {
        throw new Error('Username is required');
    }

    if (username.length < requirements.minLength) {
        throw new Error(`Username must be at least ${requirements.minLength} characters long`);
    }

    if (username.length > requirements.maxLength) {
        throw new Error(`Username cannot exceed ${requirements.maxLength} characters`);
    }

    if (!requirements.pattern.test(username)) {
        throw new Error('Username can only contain letters, numbers, and underscores');
    }

    return true;
};

export const validateExpense = (expenseData) => {
    const requirements = {
        title: {
            minLength: 1,
            maxLength: 100,
        },
        amount: {
            min: 0,
            isFinite: true
        },
        date: {
            maxDate: new Date()
        },
        category: {
            validCategories: ['Food', 'Transport', 'Housing', 'Entertainment', 'Other']
        },
        notes: {
            maxLength: 500
        }
    };

    if (!expenseData.title) {
        throw new Error('Title is required');
    }
    if (expenseData.title.length < requirements.title.minLength) {
        throw new Error('Title must be at least 1 character long');
    }
    if (expenseData.title.length > requirements.title.maxLength) {
        throw new Error('Title cannot exceed 100 characters');
    }

    if (expenseData.amount === undefined || expenseData.amount === null) {
        throw new Error('Amount is required');
    }
    if (expenseData.amount < requirements.amount.min) {
        throw new Error('Amount must be a positive number');
    }
    if (!Number.isFinite(expenseData.amount)) {
        throw new Error('Amount must be a finite number');
    }

    if (!expenseData.date) {
        throw new Error('Date is required');
    }
    const date = new Date(expenseData.date);
    if (isNaN(date.getTime())) {
        throw new Error('Invalid date format');
    }
    if (date > requirements.date.maxDate) {
        throw new Error('Date cannot be in the future');
    }

    if (!expenseData.category) {
        throw new Error('Category is required');
    }
    if (!requirements.category.validCategories.includes(expenseData.category)) {
        throw new Error('Invalid category');
    }

    if (expenseData.notes && expenseData.notes.length > requirements.notes.maxLength) {
        throw new Error('Notes cannot exceed 500 characters');
    }

    return true;
};