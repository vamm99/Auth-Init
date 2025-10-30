interface Config {
    port: number;
    mongoUrl: string;
    jwtSecret: string;
    nodemailerService: string;
    nodemailerUser: string;
    nodemailerPass: string;
}

export default (): Config => {
  const { PORT, MONGO_URL, JWT_SECRET, NODEMAILER_SERVICE, NODEMAILER_USER, NODEMAILER_PASS } = process.env;
  if (!PORT || !MONGO_URL || !JWT_SECRET || !NODEMAILER_SERVICE || !NODEMAILER_USER || !NODEMAILER_PASS) {
    throw new Error('Missing environment variables');
  }

  return {
    port: Number(PORT),
    mongoUrl: MONGO_URL,
    jwtSecret: JWT_SECRET,
    nodemailerService: NODEMAILER_SERVICE,
    nodemailerUser: NODEMAILER_USER,
    nodemailerPass: NODEMAILER_PASS,
    };
};
