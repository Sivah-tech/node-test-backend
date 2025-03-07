// services/cronService.js
import cron from 'node-cron';
import { loginFunction } from './webhook';

// Set up the scheduled task to trigger the login function every 12 seconds (5 times in 1 minute)
export function setupCronJob() {

  cron.schedule('*/8 * * * * *', async () => {
    // This cron expression means: Every 12th second of every minute
    // '*/8' means it will run every 8 seconds

    try {
      console.log('Triggering login function...');
      await loginFunction();  // Call the login function every 12 seconds
    } catch (error) {
      console.error('Error triggering login function:', error);
    }
    
  });

}
