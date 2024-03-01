import bcrypt from 'bcryptjs';

export const genHashedPassword = async (password: string) => {
    const hashedPassword = await bcrypt.hash(password, 12);
    return hashedPassword;
}

// export const genHashedPassword = (password: string) => bcrypt.hash(password, 12);
