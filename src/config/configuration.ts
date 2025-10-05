interface Config {
    port: number;
    mongoUrl: string;
    jwtSecret: string;
}

export default (): Config => {
  const { PORT, MONGO_URL, JWT_SECRET } = process.env;
  if (!PORT || !MONGO_URL || !JWT_SECRET) {
    throw new Error('Missing environment variables');
  }

  return {
    port: Number(PORT),
    mongoUrl: MONGO_URL,
    jwtSecret: JWT_SECRET,
    };
};
