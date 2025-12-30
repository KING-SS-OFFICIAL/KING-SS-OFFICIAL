import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';

const BACKGROUND_TASK_NAME = 'AI_FRIEND_BACKGROUND_TASK';

/**
 * Define the background task.
 * Note: Actual background processing on iOS/Android is strictly limited.
 * This example shows how to register a periodic background fetch task.
 * For "always listening", you would need native modules and foreground service permissions (Android).
 */
TaskManager.defineTask(BACKGROUND_TASK_NAME, async () => {
  try {
    const now = new Date();
    console.log(`Got background fetch call at date: ${now.toISOString()}`);

    // In a real app, you might check for new messages, or sync data here.
    // Since we can't easily keep the microphone open in background with just Expo Go,
    // this serves as a placeholder for background logic.

    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

class BackgroundService {
  async registerBackgroundTask() {
    try {
      const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_TASK_NAME);
      if (isRegistered) {
        console.log('Task already registered');
        return;
      }

      await BackgroundFetch.registerTaskAsync(BACKGROUND_TASK_NAME, {
        minimumInterval: 15 * 60, // 15 minutes
        stopOnTerminate: false, // android only,
        startOnBoot: true, // android only
      });
      console.log('Background task registered');
    } catch (err) {
      console.log('Task Register failed:', err);
    }
  }

  async unregisterBackgroundTask() {
    try {
      const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_TASK_NAME);
      if (!isRegistered) return;

      await BackgroundFetch.unregisterTaskAsync(BACKGROUND_TASK_NAME);
    } catch (err) {
      console.log('Task Unregister failed:', err);
    }
  }
}

export default new BackgroundService();
