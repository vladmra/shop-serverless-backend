export const eventLogger = () => {
  const before = async (request) => {
    const { event } = request;
    console.log(event);
  };

  return {
    before,
  };
};
