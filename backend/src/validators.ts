export interface UserInput {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role?: 'admin' | 'aluno' | 'professor';

}

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
}

/**
 * Valida o formato do email.
 * @param email 
 * @returns 
 */
export function isValidEmail(email: string): boolean {
    if (!email || typeof email !== 'string') return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
/**
 * Valida os requisitos de seguraça da senha.
 * -Minimo de 8 caracteres
 * -Pelo menos uma letra maiuscula
 * -Pelo menos uma letra minuscula
 * -Pelo menos um numero
 * -Pelo menos um caracter especial (@$!%*?&)
 * 
 * @param password 
 * @returns 
 */
export function isStrongPassword(password: string): boolean {
    if (!password || password.length < 8 ) return false;
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[@$!%*?&]/.test(password);
    return hasLowerCase && hasUpperCase && hasNumber && hasSpecialChar;
}

export function validateUserInput(userInput: UserInput): ValidationResult {
    const errors: string[] = [];

    if (!userInput.name || userInput.name.trim().length < 3 ) {
        errors.push('Name is required and must be at least 3 characters long.');
    }

    if (!userInput.email || userInput.email.trim() === '') {
        errors.push('Email is required.');
    } else if (!isValidEmail(userInput.email)) {
        errors.push('Invalid email format.');
    }

    if (!userInput.password || userInput.password.trim() === '') {
        errors.push('Password is required.');
    } else if (!isStrongPassword(userInput.password)) {
        errors.push('Password does not meet the required criteria.');
    }

    if (userInput.password !== undefined && !isStrongPassword(userInput.password)) {
        errors.push('Password does not meet the required criteria.');
    }

    if (userInput.confirmPassword !== undefined && userInput.password !== userInput.confirmPassword) {
        errors.push('Passwords do not match.');
    }

    const validRoles = ['admin', 'aluno', 'professor'];
    if (userInput.role !== undefined && !validRoles.includes(userInput.role)) {
        errors.push('Invalid role.');
    }
    return {
        isValid: errors.length === 0,
        errors,
    };
}