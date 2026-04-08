const cron = require('node-cron');
const DailyDonor = require('../models/DailyDonor');
const { autoExpireStale, createFromDailyDonor } = require('./donationService');

/**
 * Initialize all cron jobs
 */
const startCronJobs = () => {
  // ─── 1. Auto-expire stale donations every 10 minutes ──────────────────
  cron.schedule('*/10 * * * *', async () => {
    try {
      const count = await autoExpireStale();
      if (count > 0) console.log(`⏰ Cron: Expired ${count} stale donations`);
    } catch (err) {
      console.error('❌ Cron expire error:', err.message);
    }
  });

  // ─── 2. Daily donor auto-create — check every minute ──────────────────
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(
        now.getMinutes()
      ).padStart(2, '0')}`;

      // Find all active daily donors scheduled for this minute
      const donors = await DailyDonor.find({
        scheduleTime: currentTime,
        autoCreate: true,
        isActive: true,
      });

      for (const donor of donors) {
        const result = await createFromDailyDonor(donor);
        if (result.success) {
          console.log(`📅 Cron: Created scheduled donation for ${donor.name}`);
        } else if (result.skipped) {
          console.log(`⏭️ Cron: Skipped ${donor.name} — ${result.reason}`);
        }
      }
    } catch (err) {
      console.error('❌ Cron daily donor error:', err.message);
    }
  });

  console.log('⏱️  Cron jobs started (expire: every 10min | daily-donors: every minute)');
};

module.exports = { startCronJobs };
