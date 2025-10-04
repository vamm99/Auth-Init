interface Config {
    port: number;
    mongoUrl: string;
}

export default (): Config => {
  const { PORT, MONGO_URL } = process.env;
  if (!PORT || !MONGO_URL) {
    throw new Error('Missing environment variables');
  }

  return {
    port: Number(PORT),
    mongoUrl: MONGO_URL,
  };
};
