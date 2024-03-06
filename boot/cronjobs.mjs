import cron from 'node-cron';

const initializeCronJobs = () => {
  // eslint-disable-next-line no-console
  console.log('Crontab is running...');

  // run moi phut
  cron.schedule('* * * * *', () => {
    //
  });
};

export default initializeCronJobs;
